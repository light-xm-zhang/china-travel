-- ============================================================================
-- China Travel Guide — Guestbook D1 Database Schema
-- ============================================================================

-- Core messages table
DROP TABLE IF EXISTS messages;
CREATE TABLE messages (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL CHECK(length(name) >= 1 AND length(name) <= 60),
    content     TEXT    NOT NULL CHECK(length(content) >= 2 AND length(content) <= 2000),
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    admin_reply TEXT    DEFAULT NULL,
    replied_at  TEXT    DEFAULT NULL
);
CREATE INDEX idx_messages_created ON messages(created_at DESC);

-- Rate-limit: track submissions per IP
DROP TABLE IF EXISTS rate_limits;
CREATE TABLE rate_limits (
    ip          TEXT    NOT NULL,
    last_submit TEXT    NOT NULL DEFAULT (datetime('now')),
    count       INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX idx_ratelimit_ip ON rate_limits(ip);

-- Admin settings (email config etc.)
DROP TABLE IF EXISTS settings;
CREATE TABLE settings (
    key         TEXT PRIMARY KEY,
    value       TEXT NOT NULL DEFAULT ''
);

-- Seed default settings
INSERT OR IGNORE INTO settings (key, value) VALUES ('email_enabled', 'true');
INSERT OR IGNORE INTO settings (key, value) VALUES ('receiver_email', '');
INSERT OR IGNORE INTO settings (key, value) VALUES ('sender_name', 'China Travel Guide');
INSERT OR IGNORE INTO settings (key, value) VALUES ('sender_email', 'guestbook@yourdomain.com');
INSERT OR IGNORE INTO settings (key, value) VALUES ('admin_password', '');
