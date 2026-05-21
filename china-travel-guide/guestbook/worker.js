/**
 * China Travel Guide — Guestbook API Worker
 *
 * Endpoints:
 *   POST /api/message   — submit message + send email notification
 *   GET  /api/messages  — list all messages
 *   GET  /api/settings  — read public email config
 *   POST /api/settings  — update config (requires admin password)
 *   POST /api/reply     — admin reply to a message (requires password)
 *
 * Email:  MailChannels (free, no API key, no 3rd-party registration)
 *          Requires SPF record on sender domain: include:mailchannels.net
 */

// ============================================================================
// You only need to change these two values
// ============================================================================
const DEFAULT_RECEIVER = 'your@email.com';       // FALLBACK: set on first admin login
const SITE_NAME        = 'China Travel Guide';
const SITE_URL         = 'https://china-travel-guide.pages.dev';

// Allowed CORS origins
const ALLOWED_ORIGINS = [
    SITE_URL,
    'http://localhost:8080',
    'http://127.0.0.1:8080',
];

// ============================================================================
// Helpers
// ============================================================================

function sanitize(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .trim();
}

function corsHeaders(origin) {
    const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
    return {
        'Access-Control-Allow-Origin': allowOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
        'Access-Control-Max-Age': '86400',
    };
}

function json(data, status, extraHeaders) {
    const headers = { 'Content-Type': 'application/json; charset=utf-8', ...extraHeaders };
    return new Response(JSON.stringify(data), { status, headers });
}

/** Read all settings as a flat object */
async function getSettings(db) {
    const { results } = await db.prepare('SELECT key, value FROM settings').all();
    const obj = {};
    (results || []).forEach(r => { obj[r.key] = r.value; });
    return obj;
}

/** Update a single setting */
async function updateSetting(db, key, value) {
    await db.prepare(
        'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?'
    ).bind(key, value, value).run();
}

// ============================================================================
// Admin Auth — reads password from D1. Empty password = first-run mode.
// ============================================================================
let _cachedPassword = undefined; // undefined = not loaded yet, '' = empty, 'xxx' = set
async function getAdminPassword(db) {
    if (_cachedPassword !== undefined) return _cachedPassword;
    const settings = await getSettings(db);
    _cachedPassword = settings.admin_password || '';
    return _cachedPassword;
}

async function isAdmin(request, db) {
    const token = request.headers.get('X-Admin-Token') || '';
    const password = await getAdminPassword(db);
    // First-run: no password set → allow any access
    if (password === '') return true;
    return token === password;
}

function bustPasswordCache() { _cachedPassword = undefined; }

// ============================================================================
// Rate Limiting
// ============================================================================
async function checkRateLimit(db, ip) {
    const now = new Date().toISOString();
    const cutoff = new Date(Date.now() - 30000).toISOString();
    await db.prepare('DELETE FROM rate_limits WHERE last_submit < ?').bind(cutoff).run();
    const row = await db.prepare(
        'SELECT count FROM rate_limits WHERE ip = ? AND last_submit > ?'
    ).bind(ip, cutoff).first();
    if (row && row.count >= 1) return false;
    await db.prepare(
        'INSERT INTO rate_limits (ip, last_submit, count) VALUES (?, ?, 1) ' +
        'ON CONFLICT(ip) DO UPDATE SET last_submit = ?, count = count + 1'
    ).bind(ip, now, now).run();
    return true;
}

// ============================================================================
// Email — MailChannels (free, no registration, no API key)
// Docs: https://blog.cloudflare.com/sending-email-from-workers-with-mailchannels/
// ============================================================================
async function sendEmail(settings, name, content) {
    if (settings.email_enabled !== 'true') {
        console.log('Email disabled in settings');
        return;
    }

    const receiver = settings.receiver_email || DEFAULT_RECEIVER;
    if (!receiver || !receiver.includes('@')) {
        console.log('No valid receiver email configured');
        return;
    }

    const senderName = settings.sender_name || SITE_NAME;
    const senderEmail = settings.sender_email || 'guestbook@mailchannels.net';

    const htmlBody = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#f9fafb;border-radius:12px">
      <h2 style="color:#dc2626;margin:0 0 4px;font-size:20px">🏯 ${senderName}</h2>
      <p style="color:#6b7280;margin:0 0 20px;font-size:14px">New guestbook message</p>
      <div style="background:#fff;padding:20px;border-radius:8px;border:1px solid #e5e7eb">
        <p style="margin:0 0 8px"><strong>From:</strong> ${sanitize(name)}</p>
        <p style="margin:0 0 12px;color:#6b7280;font-size:13px">${new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC</p>
        <div style="border-top:1px solid #e5e7eb;padding-top:12px;color:#374151;line-height:1.6;white-space:pre-wrap">${sanitize(content)}</div>
      </div>
      <p style="color:#9ca3af;font-size:12px;margin:16px 0 0">
        <a href="${SITE_URL}/guestbook/admin.html" style="color:#6366f1">Admin Panel</a> &nbsp;·&nbsp;
        <a href="${SITE_URL}/guestbook.html" style="color:#6366f1">View Guestbook</a>
      </p>
    </div>`;

    const mailPayload = {
        personalizations: [{ to: [{ email: receiver }] }],
        from: { email: senderEmail, name: senderName },
        subject: `[Guestbook] New message from ${sanitize(name)}`,
        content: [{ type: 'text/html', value: htmlBody }],
    };

    try {
        const res = await fetch('https://api.mailchannels.net/tx/v1/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mailPayload),
        });

        if (!res.ok) {
            const text = await res.text();
            console.error('MailChannels error:', res.status, text);
        } else {
            console.log('Email sent to', receiver);
        }
    } catch (e) {
        console.error('MailChannels exception:', e.message);
    }
}

// ============================================================================
// Handlers
// ============================================================================

/** POST /api/message */
async function handlePostMessage(request, env, origin) {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const headers = corsHeaders(origin);
    const db = env.DB;

    const allowed = await checkRateLimit(db, ip);
    if (!allowed) return json({ error: 'Please wait 30 seconds between messages.' }, 429, headers);

    let body;
    try { body = await request.json(); } catch {
        return json({ error: 'Invalid JSON.' }, 400, headers);
    }

    const name = sanitize(body.name || '');
    const content = sanitize(body.content || '');

    if (name.length < 1 || name.length > 60)
        return json({ error: 'Name must be 1–60 characters.' }, 400, headers);
    if (content.length < 2 || content.length > 2000)
        return json({ error: 'Message must be 2–2000 characters.' }, 400, headers);

    try {
        const result = await db.prepare(
            'INSERT INTO messages (name, content) VALUES (?, ?)'
        ).bind(name, content).run();

        const settings = await getSettings(db);
        ctx?.waitUntil
            ? request.ctx.waitUntil(sendEmail(settings, name, content))
            : sendEmail(settings, name, content);

        return json({
            ok: true,
            id: result.meta.last_row_id,
            name,
            content,
            created_at: new Date().toISOString()
        }, 201, headers);

    } catch (e) {
        console.error('DB insert:', e.message);
        return json({ error: 'Server error. Please try again.' }, 500, headers);
    }
}

/** GET /api/messages */
async function handleGetMessages(env, origin) {
    const headers = corsHeaders(origin);
    try {
        const { results } = await env.DB.prepare(
            'SELECT id, name, content, created_at, admin_reply, replied_at FROM messages ORDER BY created_at DESC LIMIT 200'
        ).all();
        return json({ messages: results }, 200, headers);
    } catch (e) {
        return json({ error: 'Failed to load messages.' }, 500, headers);
    }
}

/** GET /api/settings — public: only return display-safe fields */
async function handleGetSettings(env, origin) {
    const headers = corsHeaders(origin);
    try {
        const s = await getSettings(env.DB);
        return json({
            email_enabled: s.email_enabled,
            sender_name: s.sender_name,
            // Do NOT expose receiver_email or sender_email publicly
        }, 200, headers);
    } catch (e) {
        return json({ error: 'Failed to load settings.' }, 500, headers);
    }
}

/** POST /api/settings — admin only */
async function handlePostSettings(request, env, origin) {
    const headers = corsHeaders(origin);
    if (!isAdmin(request, env.DB)) {
        return json({ error: 'Unauthorized. Admin password required.' }, 401, headers);
    }
    try {
        const body = await request.json();
        if (body.receiver_email !== undefined) await updateSetting(env.DB, 'receiver_email', String(body.receiver_email).trim());
        if (body.sender_email !== undefined) await updateSetting(env.DB, 'sender_email', String(body.sender_email).trim());
        if (body.sender_name !== undefined) await updateSetting(env.DB, 'sender_name', String(body.sender_name).trim());
        if (body.email_enabled !== undefined) await updateSetting(env.DB, 'email_enabled', body.email_enabled ? 'true' : 'false');
        const s = await getSettings(env.DB);
        return json({ ok: true, settings: s }, 200, headers);
    } catch (e) {
        return json({ error: 'Failed to update settings.' }, 500, headers);
    }
}

/** POST /api/reply — admin reply to a message */
async function handlePostReply(request, env, origin) {
    const headers = corsHeaders(origin);
    if (!isAdmin(request, env.DB)) {
        return json({ error: 'Unauthorized.' }, 401, headers);
    }
    try {
        const body = await request.json();
        const id = parseInt(body.id, 10);
        const reply = sanitize(body.reply || '');
        if (!id || reply.length < 1 || reply.length > 2000) {
            return json({ error: 'Invalid id or reply (1–2000 chars).' }, 400, headers);
        }
        const now = new Date().toISOString();
        await env.DB.prepare(
            'UPDATE messages SET admin_reply = ?, replied_at = ? WHERE id = ?'
        ).bind(reply, now, id).run();
        return json({ ok: true, id, admin_reply: reply, replied_at: now }, 200, headers);
    } catch (e) {
        return json({ error: 'Failed to save reply.' }, 500, headers);
    }
}

/** GET /api/auth-status — public: tells frontend if password is set */
async function handleAuthStatus(env, origin) {
    const headers = corsHeaders(origin);
    try {
        const pw = await getAdminPassword(env.DB);
        return json({ needsSetup: (pw === ''), hasPassword: (pw !== '') }, 200, headers);
    } catch (e) {
        return json({ needsSetup: true, error: 'DB unavailable' }, 200, headers);
    }
}

/** POST /api/change-password — admin only */
async function handleChangePassword(request, env, origin) {
    const headers = corsHeaders(origin);
    const db = env.DB;
    if (!(await isAdmin(request, db))) {
        return json({ error: 'Current password is incorrect.' }, 401, headers);
    }
    try {
        const body = await request.json();
        const newPassword = String(body.new_password || '').trim();
        if (newPassword.length < 3 || newPassword.length > 64) {
            return json({ error: 'Password must be 3–64 characters.' }, 400, headers);
        }
        await updateSetting(db, 'admin_password', newPassword);
        bustPasswordCache();
        return json({ ok: true, needsRelogin: true }, 200, headers);
    } catch (e) {
        return json({ error: 'Failed to update password.' }, 500, headers);
    }
}

// ============================================================================
// Router
// ============================================================================
export default {
    async fetch(request, env, ctx) {
        request.ctx = ctx;
        const url = new URL(request.url);
        const path = url.pathname;
        const origin = request.headers.get('Origin') || '';

        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: corsHeaders(origin) });
        }

        if (path === '/api/message' && request.method === 'POST')
            return handlePostMessage(request, env, origin);
        if (path === '/api/messages' && request.method === 'GET')
            return handleGetMessages(env, origin);
        if (path === '/api/settings' && request.method === 'GET')
            return handleGetSettings(env, origin);
        if (path === '/api/settings' && request.method === 'POST')
            return handlePostSettings(request, env, origin);
        if (path === '/api/reply' && request.method === 'POST')
            return handlePostReply(request, env, origin);
        if (path === '/api/auth-status' && request.method === 'GET')
            return handleAuthStatus(env, origin);
        if (path === '/api/change-password' && request.method === 'POST')
            return handleChangePassword(request, env, origin);

        return json({ error: 'Not found' }, 404, corsHeaders(origin));
    },
};
