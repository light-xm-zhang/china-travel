/**
 * Ultimate China Travel Guide — City Data
 * Contains: 8 featured cities (full detail) + 28 regional cities (at-a-glance)
 * Each featured city: attractions, food, Leaflet map markers, transport info
 */

const CITY_DATA = {

  // ===========================================================================
  // 8 FEATURED CITIES — Full tabbed detail with map & transport
  // ===========================================================================

  beijing: {
    id: 'beijing',
    name: 'Beijing',
    nameCN: '北京',
    badge: 'Imperial Capital',
    heroBg: 'from-red-800 via-red-700 to-amber-800',
    heroSub: 'from-red-800 via-red-700 to-amber-800',
    emoji: '🏯',
    region: 'North China',
    regionColor: 'red',
    best: 'Sep–Oct & Apr–May',
    days: '3–5',
    desc: 'The beating heart of China — where 3,000 years of imperial history meets cutting-edge modernity. Home to six UNESCO World Heritage sites.',
    attractions: [
      { name: 'Forbidden City', desc: 'The world\'s largest imperial palace complex with 980 buildings. Book 7–10 days ahead via official WeChat mini-program. <strong>Closed Mondays.</strong> Peak season ¥60.', color: 'red' },
      { name: 'Great Wall — Mutianyu', desc: 'The best section for first-timers. Cable car up + toboggan down (~¥140). Leave by 7:00 AM to beat crowds. Ticket ~¥40–45.', color: 'amber' },
      { name: 'Temple of Heaven', desc: 'Ming dynasty masterpiece where emperors prayed for harvests. Visit early morning to see locals practice tai chi in the park.', color: 'blue' },
      { name: 'Summer Palace', desc: 'Sprawling imperial garden with Kunming Lake. The lakeside Long Corridor is the world\'s longest painted corridor. Allow half a day.', color: 'green' },
      { name: 'Hutongs', desc: 'Wander Nanluoguxiang and the alleys near the Drum & Bell Towers. Rent a rickshaw for an authentic slice of old Beijing life.', color: 'purple' }
    ],
    food: [
      { name: 'Peking Roast Duck', emoji: '🦆', desc: 'Crispy skin, thin pancakes, hoisin sauce. Try Quanjude or Dadong for the classic experience.' },
      { name: 'Zhajiang Noodles', emoji: '🍜', desc: 'Thick wheat noodles with savory fermented soybean paste and fresh seasonal vegetables.' },
      { name: 'Imperial Hot Pot', emoji: '🍲', desc: 'Beijing-style mutton hot pot in traditional copper pots. Donglaishun has been serving since 1903.' },
      { name: 'Beijing Dumplings', emoji: '🥟', desc: 'Handmade boiled dumplings with pork and chive fillings. Found in every neighborhood dumpling house.' }
    ],
    map: {
      center: [39.9163, 116.3972],
      zoom: 11,
      markers: [
        { name: 'Forbidden City', lat: 39.9163, lng: 116.3972 },
        { name: 'Temple of Heaven', lat: 39.8822, lng: 116.4066 },
        { name: 'Summer Palace', lat: 39.9999, lng: 116.2755 },
        { name: 'Nanluoguxiang', lat: 39.9375, lng: 116.4033 },
        { name: '798 Art District', lat: 39.9842, lng: 116.4951 }
      ]
    },
    transport: {
      gettingThere: 'Beijing Capital (PEK) and Beijing Daxing (PKX) serve international flights. PEK Airport Express to Dongzhimen (25 min, ¥25). High-speed rail connects to Shanghai (~4.5h), Xi\'an (~5h), and all major cities.',
      local: '27 metro lines cover the entire city (¥3–9). Alipay transport QR works on all metro and buses. DiDi is widely available. The Yikatong transportation card works on all public transit. Flat-rate airport taxi: ~¥100–150 to city center.',
      tips: ['Avoid rush hour metro (7:30–9:00 AM, 5:30–7:00 PM) — extremely crowded.', 'Beijing is huge — cluster your sightseeing by geographic area to minimize transit time.', 'The 300-series express buses use dedicated lanes and can be faster than taxis on major arteries.']
    }
  },

  shanghai: {
    id: 'shanghai',
    name: 'Shanghai',
    nameCN: '上海',
    badge: 'Pearl of the Orient',
    heroBg: 'from-blue-800 via-blue-700 to-cyan-800',
    emoji: '🌃',
    region: 'East China',
    regionColor: 'blue',
    best: 'Mar–May & Oct–Nov',
    days: '2–4',
    desc: 'China\'s largest city and global financial hub — a dazzling skyline, tree-lined French Concession streets, and the world\'s busiest container port.',
    attractions: [
      { name: 'The Bund (Waitan)', desc: 'Iconic waterfront promenade with colonial-era buildings on one side and Pudong\'s futuristic skyline on the other. Best at dusk when lights come on (before 10 PM).', color: 'blue' },
      { name: 'French Concession', desc: 'Wander under plane trees along Wukang Road and Anfu Road. Charming lane houses, boutique cafes, and independent shops. Best explored by bicycle.', color: 'amber' },
      { name: 'Yu Garden (Yuyuan)', desc: 'Classical Ming dynasty garden in the old city. Visit the adjacent bazaar for xiaolongbao at Nanxiang. Beautifully lit at night.', color: 'green' },
      { name: 'Nanjing Road', desc: 'China\'s premier shopping street — 5.5 km of retail from the Bund to People\'s Square. Great for people-watching and neon-lit night views.', color: 'purple' },
      { name: 'Shanghai Tower', desc: 'The world\'s second-tallest building (632m). The 118th-floor observation deck offers jaw-dropping 360° views. ~¥180. Go on a clear day.', color: 'red' }
    ],
    food: [
      { name: 'Xiaolongbao', emoji: '🥟', desc: 'The city\'s signature soup dumplings. Jia Jia Tang Bao on Huanghe Road is legendary. Din Tai Fung for a polished experience.' },
      { name: 'Hairy Crab', emoji: '🦀', desc: 'Seasonal delicacy (Nov–Dec) from Yangcheng Lake. The roe is the prize. Book restaurants in advance during crab season.' },
      { name: 'Benbang Cuisine', emoji: '🥘', desc: 'Shanghai-style braised pork belly, squirrel-shaped mandarin fish, and oil-braised spring bamboo shoots. Sweet and savory.' },
      { name: 'Shengjian Mantou', emoji: '🥞', desc: 'Pan-fried pork buns — crispy bottom, fluffy top, bursting with hot broth. Yang\'s Fried Dumplings is the go-to chain.' }
    ],
    map: {
      center: [31.2304, 121.4737],
      zoom: 12,
      markers: [
        { name: 'The Bund', lat: 31.2400, lng: 121.4900 },
        { name: 'Yu Garden', lat: 31.2272, lng: 121.4923 },
        { name: 'French Concession', lat: 31.2100, lng: 121.4550 },
        { name: 'Shanghai Tower', lat: 31.2355, lng: 121.5016 },
        { name: 'Nanjing Road', lat: 31.2350, lng: 121.4750 }
      ]
    },
    transport: {
      gettingThere: 'Shanghai Pudong (PVG) has the most international routes in China (99+ cities). Maglev train to Longyang Road (8 min, 430 km/h, ¥50). Hongqiao (SHA) handles domestic + some regional flights. High-speed rail to Hangzhou (~1h), Suzhou (~30min), Nanjing (~1.5h).',
      local: '19 metro lines with full English signage (¥3–9). Alipay transport QR works everywhere. DiDi is the easiest way to get around. The Maglev from Pudong Airport is a fun experience even if your hotel isn\'t on the line.',
      tips: ['Metro Line 2 connects both airports and runs through the city center.', 'Shanghai has an excellent public bike system — use Alipay to unlock blue bikes.', 'Ferry across the Huangpu River (¥2) gives you the best Bund skyline view for the price of a bus ticket.']
    }
  },

  xian: {
    id: 'xian',
    name: 'Xi\'an',
    nameCN: '西安',
    badge: 'Ancient Silk Road Gateway',
    heroBg: 'from-amber-800 via-orange-700 to-yellow-800',
    emoji: '🗿',
    region: 'Northwest China',
    regionColor: 'amber',
    best: 'Mar–May & Sep–Nov',
    days: '3–4',
    desc: 'The starting point of the Silk Road and capital of 13 Chinese dynasties. Home to the world-famous Terracotta Warriors and one of China\'s greatest food scenes.',
    attractions: [
      { name: 'Terracotta Warriors', desc: '8,000 life-sized warriors buried with China\'s first emperor. Book 7 days ahead. ~¥120. Arrive by 9 AM. Allow 3+ hours. Don\'t miss the bronze chariots.', color: 'amber' },
      { name: 'Ancient City Wall', desc: 'China\'s best-preserved city wall (14 km circuit). Rent a bike at Yongning Gate and cycle the full loop at sunset — about 2 hours.', color: 'red' },
      { name: 'Muslim Quarter', desc: 'A neighborhood, not just one street. Skip the main tourist strip — head to Sajinqiao backstreets where locals eat. The Great Mosque is a stunning blend of Chinese and Islamic architecture.', color: 'green' },
      { name: 'Big Wild Goose Pagoda', desc: 'Tang Dynasty pagoda (652 AD). Climb for city views. The nearby Joy City 4th-floor viewing platform is the perfect photo spot.', color: 'blue' },
      { name: 'Shaanxi History Museum', desc: 'World-class collection from prehistoric to Tang Dynasty. Free but book 7 days ahead (tickets at 10:00 & 18:00). The Tang Dynasty gallery is unmissable.', color: 'purple' }
    ],
    food: [
      { name: 'Roujiamo', emoji: '🥙', desc: 'The "Chinese hamburger" — spiced braised meat in crispy flatbread. Fanji on Zhubashi Street is the institution. 5–15 RMB.' },
      { name: 'Yangrou Paomo', emoji: '🍲', desc: 'Break bread yourself into pea-sized pieces, then they cook it in rich lamb broth. At Tongshengxiang near the Bell Tower.' },
      { name: 'Biangbiang Noodles', emoji: '🍝', desc: 'Wide hand-pulled noodles with chili oil, garlic, and vinegar. The character "biang" has 58 strokes — the most complex Chinese character.' },
      { name: 'Lamb Skewers', emoji: '🍢', desc: 'Charcoal-grilled cumin-dusted lamb skewers in the Muslim Quarter. ~1–2 RMB per skewer. Follow the smoke.' }
    ],
    map: {
      center: [34.2658, 108.9541],
      zoom: 12,
      markers: [
        { name: 'Terracotta Warriors', lat: 34.3850, lng: 109.2730 },
        { name: 'City Wall (Yongning Gate)', lat: 34.2540, lng: 108.9480 },
        { name: 'Muslim Quarter', lat: 34.2640, lng: 108.9400 },
        { name: 'Big Wild Goose Pagoda', lat: 34.2196, lng: 108.9630 },
        { name: 'Shaanxi History Museum', lat: 34.2156, lng: 108.9513 }
      ]
    },
    transport: {
      gettingThere: 'Xi\'an Xianyang International (XIY) serves international flights from major Asian hubs and some European routes. High-speed rail from Beijing (~5h), Chengdu (~3.5h), and Shanghai (~7h). Metro Line 14 connects the airport to downtown (~30 min).',
      local: '9 metro lines covering all major attractions (¥2–8). Metro Line 9 + Bus 613 gets you to the Terracotta Warriors for ~¥10 total. DiDi works well. The City Wall and Muslim Quarter areas are best explored on foot or by bike.',
      tips: ['The Terracotta Warriors are ~40 km east of the city — plan at least a half-day.', 'Hanfu (traditional clothing) rental is popular: ¥60–100/day for photos on the City Wall.', 'The Muslim Quarter is best visited in the evening when lanterns light up and night stalls open.']
    }
  },

  chengdu: {
    id: 'chengdu',
    name: 'Chengdu',
    nameCN: '成都',
    badge: 'Panda & Spice City',
    heroBg: 'from-green-800 via-emerald-700 to-teal-800',
    emoji: '🐼',
    region: 'Southwest China',
    regionColor: 'green',
    best: 'Apr & mid-Oct',
    days: '3–4',
    desc: 'The land of abundance — giant pandas, fiery Sichuan cuisine, ancient teahouses, and a famously relaxed lifestyle. UNESCO City of Gastronomy.',
    attractions: [
      { name: 'Giant Panda Base', desc: 'The highlight of any Chengdu visit. <strong>Arrive by 7:15 AM</strong> — pandas are most active 8:00–10:00 AM. By 11 AM most are napping. ~¥55–60. Book online.', color: 'green' },
      { name: 'Jinli Ancient Street', desc: 'Lantern-lit pedestrian street next to Wuhou Shrine. Best in late afternoon/evening when red lanterns glow. Try Sichuan peppercorn ice cream.', color: 'red' },
      { name: 'People\'s Park & Heming Teahouse', desc: 'The soul of Chengdu\'s "slow life." Sip jasmine tea in a bamboo chair and watch locals play mahjong. Pure Chengdu.', color: 'amber' },
      { name: 'Wenshu Monastery', desc: 'Tang Dynasty Buddhist temple — the most peaceful spot in the city. Free entry. The vegetarian restaurant inside is excellent.', color: 'blue' },
      { name: 'Leshan Giant Buddha', desc: '71-meter Buddha carved into a cliff (713 AD) — world\'s largest. ~2h from Chengdu. Take a boat for the best frontal view.', color: 'purple' }
    ],
    food: [
      { name: 'Sichuan Hotpot', emoji: '🫕', desc: 'Numbing-spicy mala broth. Order yuanyang guo (split pot) if you\'re spice-sensitive. Dip in sesame oil + garlic to cool the burn.' },
      { name: 'Mapo Tofu', emoji: '🌶️', desc: 'The original tastes nothing like Western versions — complex, aromatic, with Sichuan peppercorns creating a tingling sensation.' },
      { name: 'Dan Dan Noodles', emoji: '🍜', desc: 'Spicy, nutty, sesame-laced noodles. A street food icon. Any hole-in-the-wall noodle shop serves a good version for ~¥10.' },
      { name: 'Chuan Chuan', emoji: '🍢', desc: 'Skewer hotpot — choose from a wall of skewered ingredients, cook in communal spicy broth. Casual, cheap, beloved by locals.' }
    ],
    map: {
      center: [30.6598, 104.0634],
      zoom: 12,
      markers: [
        { name: 'Giant Panda Base', lat: 30.7330, lng: 104.1420 },
        { name: 'Jinli Ancient Street', lat: 30.6440, lng: 104.0470 },
        { name: 'People\'s Park', lat: 30.6586, lng: 104.0591 },
        { name: 'Wenshu Monastery', lat: 30.6768, lng: 104.0736 },
        { name: 'Kuanzhai Alleys', lat: 30.6667, lng: 104.0560 }
      ]
    },
    transport: {
      gettingThere: 'Chengdu Tianfu International (TFU) is the newest mega-hub for western China, with international routes to Europe, Asia, and the Middle East. High-speed rail to Xi\'an (~3.5h), Chongqing (~1.5h), and Kunming (~6h). Metro Line 18 connects TFU to downtown.',
      local: '14 metro lines (¥2–10). Alipay QR for all transit. DiDi is cheap and reliable. The city center is compact and walkable. Bike sharing is everywhere — great for exploring the Jinli and Kuanzhai areas.',
      tips: ['Panda base tickets sell out during holidays — book 3+ days ahead.', 'Avoid Golden Week (Oct 1–7) — Chengdu is a top domestic destination.', 'Sichuan opera face-changing shows at Shufeng Yayun Teahouse are a must-see evening activity.']
    }
  },

  guilin: {
    id: 'guilin',
    name: 'Guilin',
    nameCN: '桂林',
    badge: 'Karst Wonderland',
    heroBg: 'from-teal-800 via-emerald-700 to-green-800',
    emoji: '⛰️',
    region: 'South China',
    regionColor: 'teal',
    best: 'Apr–May & Sep–Oct',
    days: '3–5',
    desc: '"The landscape is the best under heaven." Iconic limestone karst peaks reflected in the Li River — the scenery on every Chinese 20 RMB banknote.',
    attractions: [
      { name: 'Li River Bamboo Rafting', desc: 'Float through the karst landscape on the 20 RMB note. Xingping section: ~¥90–150. Best at 7–8 AM for misty "ink painting" views and zero crowds.', color: 'teal' },
      { name: 'Yangshuo Countryside', desc: 'Rent an e-bike (~¥30/day) and cycle the Ten-Mile Gallery through karst peaks and rice paddies. The Yulong River rafts are quieter with fun dam drops.', color: 'green' },
      { name: 'Xianggong Mountain', desc: 'The single best panoramic viewpoint over the Li River\'s first bend. 15-minute climb. Arrive before dawn — worth every early minute.', color: 'amber' },
      { name: 'Longji Rice Terraces', desc: '650-year-old "Dragon\'s Backbone" terraces. Best May–Oct when paddies are water-filled or golden. ~2.5h from Guilin city.', color: 'purple' },
      { name: 'Xingping Ancient Town', desc: '1,700-year-old riverside town. Stand at the exact 20 RMB note photo spot. Climb Laozhai Mountain for sunset views.', color: 'blue' }
    ],
    food: [
      { name: 'Guilin Rice Noodles', emoji: '🍜', desc: 'The city\'s soul food — thin rice noodles with braised beef, pickled beans, peanuts, and chili. ~¥5–10. Try Lao Dongjiang.' },
      { name: 'Beer Fish', emoji: '🐟', desc: 'Yangshuo\'s signature — river fish cooked with local beer, tomatoes, and peppers. ~¥60 per person. Best by the river.' },
      { name: 'Bamboo Tube Rice', emoji: '🎋', desc: 'Rice and chicken stuffed into bamboo tubes, roasted until fragrant. Infused with subtle bamboo aroma.' }
    ],
    map: {
      center: [25.2345, 110.1800],
      zoom: 10,
      markers: [
        { name: 'Li River (Xingping)', lat: 24.9200, lng: 110.5300 },
        { name: 'Yangshuo West Street', lat: 24.7785, lng: 110.4965 },
        { name: 'Xianggong Mountain', lat: 24.9173, lng: 110.4956 },
        { name: 'Longji Rice Terraces', lat: 25.7560, lng: 110.1380 },
        { name: 'Guilin City (Reed Flute Cave)', lat: 25.3040, lng: 110.2760 }
      ]
    },
    transport: {
      gettingThere: 'Guilin Liangjiang International (KWL) has flights from major Chinese cities and some Asian hubs. High-speed rail from Guangzhou (~2.5h) and Shenzhen (~3h) is the most scenic way to arrive. From Guilin North Station, the city center is 30 min by taxi.',
      local: 'Guilin city has public buses (¥1–2) and DiDi. Most visitors base in Yangshuo (1.5h from Guilin by bus/taxi). In Yangshuo, <strong>e-bikes are the best way to explore</strong> (~¥30/day). Bamboo rafts connect key scenic spots. No metro in Guilin/Yangshuo.',
      tips: ['Stay in Yangshuo, not Guilin city — you\'ll wake up surrounded by karst peaks.', 'Book bamboo rafts through official channels only — roadside "low-price" touts are scams.', 'Rain may suspend raft operations. Check the forecast and have a backup plan.']
    }
  },

  xiamen: {
    id: 'xiamen',
    name: 'Xiamen',
    nameCN: '厦门',
    badge: 'Island Escape',
    heroBg: 'from-cyan-800 via-sky-700 to-blue-800',
    emoji: '🏝️',
    region: 'Southeast China',
    regionColor: 'cyan',
    best: 'Oct–Apr',
    days: '2–3',
    desc: 'A relaxed coastal city with a UNESCO World Heritage island, colonial architecture, and some of China\'s best seafood. The antidote to big-city intensity.',
    attractions: [
      { name: 'Gulangyu Island', desc: 'Car-free UNESCO island of colonial villas, piano museums, and bougainvillea lanes. Ferry ~¥35 round trip. Book 7 days ahead. Take the 7:30 AM ferry for near-empty streets.', color: 'cyan' },
      { name: 'Sunlight Rock', desc: 'Highest point on Gulangyu (92.7m) with 360° views. Go before 8 AM or at sunset. ~¥50. Combo ticket (5 attractions): ¥90.', color: 'sky' },
      { name: 'Shuzhuang Garden & Piano Museum', desc: 'Elegant 1913 seaside garden. The Piano Museum inside houses 100+ antique pianos — Gulangyu is known as Piano Island.', color: 'pink' },
      { name: 'Zhongshan Road', desc: 'Historic pedestrian street lined with arcade buildings. The nearby Eighth Market (八市) is the real deal for fresh seafood and street eats.', color: 'blue' },
      { name: 'Nanputuo Temple', desc: '1,000-year-old Buddhist temple at the foot of Wulao Mountain. Free entry. Climb the trail behind for panoramic coastline views.', color: 'green' }
    ],
    food: [
      { name: 'Shacha Noodles', emoji: '🍜', desc: 'Gulangyu\'s signature — noodles in a savory, nutty broth unique to Xiamen. Wu Tang Sha Cha Mian on Longtou Road.' },
      { name: 'Oyster Omelet', emoji: '🦪', desc: 'Crispy, savory, with fresh local oysters. Find in the alleys off Longtou Road (~¥10). A Fujian classic.' },
      { name: 'Lin Ji Fish Balls', emoji: '🐟', desc: '80+ year tradition — springy, juicy, handmade fish balls. No. 67-2 Quanzhou Road on Gulangyu. Open 8:00–20:00.' },
      { name: 'Ye\'s Mochi', emoji: '🍡', desc: 'Soft, hand-made glutinous rice balls from a famous street stall on Longtou Road. A beloved local institution.' }
    ],
    map: {
      center: [24.4540, 118.0820],
      zoom: 12,
      markers: [
        { name: 'Gulangyu Island', lat: 24.4480, lng: 118.0680 },
        { name: 'Sunlight Rock', lat: 24.4476, lng: 118.0673 },
        { name: 'Nanputuo Temple', lat: 24.4431, lng: 118.0901 },
        { name: 'Zhongshan Road', lat: 24.4535, lng: 118.0859 },
        { name: 'Xiamen University', lat: 24.4380, lng: 118.0920 }
      ]
    },
    transport: {
      gettingThere: 'Xiamen Gaoqi International (XMN) has direct flights from major Asian cities and some European routes. High-speed rail from Shenzhen (~3.5h) and Fuzhou (~1.5h). The ferry to Gulangyu departs from Xiagu Pier — book via "Xiamen Ferry+" WeChat mini-program 7 days ahead.',
      local: 'BRT (Bus Rapid Transit) is the fastest way around Xiamen on dedicated elevated lanes. Metro Line 1 connects the railway station to the ferry pier area. DiDi is readily available. <strong>On Gulangyu: walking only</strong> — no cars or bikes allowed. Electric carts available for ¥50.',
      tips: ['Visit Gulangyu on weekdays — weekends are packed with domestic tourists.', 'Gulangyu Poetry Festival: April 25 – May 1, 2026 — special cultural performances.', 'Eat seafood in downtown Xiamen (Eighth Market area), not on Gulangyu — better value and quality.']
    }
  },

  hangzhou: {
    id: 'hangzhou',
    name: 'Hangzhou',
    nameCN: '杭州',
    badge: 'Paradise on Earth',
    heroBg: 'from-emerald-800 via-green-700 to-lime-800',
    emoji: '🌊',
    region: 'East China',
    regionColor: 'emerald',
    best: 'Mar–May & Sep–Oct',
    days: '2–3',
    desc: 'Marco Polo called it "the finest city in the world." West Lake, tea plantations, and ancient temples make Hangzhou a serene escape just an hour from Shanghai.',
    attractions: [
      { name: 'West Lake', desc: 'UNESCO World Heritage and the city\'s soul. Rent a bike and cycle the 15 km loop. Su Causeway at sunrise is unforgettable. Free entry.', color: 'emerald' },
      { name: 'Lingyin Temple', desc: 'One of China\'s most important Buddhist temples (1,700 years old). The Feilai Feng grottoes with 300+ stone carvings are adjacent. ~¥75.', color: 'green' },
      { name: 'Longjing Tea Plantations', desc: 'Visit during spring harvest (late Mar–Apr). Walk from Longjing Village to Nine Creeks — the most scenic hike near the city.', color: 'amber' },
      { name: 'Xixi Wetland Park', desc: 'Vast wetland with traditional boats navigating reed-lined waterways. Beautiful in autumn when persimmons turn orange. ~¥80.', color: 'purple' }
    ],
    food: [
      { name: 'West Lake Vinegar Fish', emoji: '🐟', desc: 'Grass carp in sweet vinegar sauce — the city\'s most iconic dish. At Louwailou near West Lake since 1848.' },
      { name: 'Dongpo Pork', emoji: '🍖', desc: 'Slow-braised pork belly named after poet Su Dongpo. Meltingly tender, rich, and aromatic.' },
      { name: 'Longjing Shrimp', emoji: '🍵', desc: 'River shrimp stir-fried with Dragon Well tea leaves — delicate, fragrant, and uniquely Hangzhou.' }
    ],
    map: {
      center: [30.2430, 120.1530],
      zoom: 12,
      markers: [
        { name: 'West Lake (Su Causeway)', lat: 30.2430, lng: 120.1430 },
        { name: 'Lingyin Temple', lat: 30.2440, lng: 120.1000 },
        { name: 'Longjing Tea Village', lat: 30.2230, lng: 120.1230 },
        { name: 'Xixi Wetland', lat: 30.2690, lng: 120.0650 },
        { name: 'Leifeng Pagoda', lat: 30.2350, lng: 120.1500 }
      ]
    },
    transport: {
      gettingThere: 'Hangzhou Xiaoshan International (HGH) has flights from major Asian hubs. High-speed rail from Shanghai (~1h, frequent departures) — this is the preferred way to arrive. Also direct trains from Nanjing (~1.5h) and Beijing (~4.5h).',
      local: 'Metro system (8+ lines, ¥2–8) connects the railway station, West Lake, and major areas. Hangzhou\'s public bike system is among China\'s best — unlock with Alipay. DiDi is available. The West Lake area is best explored by bike or on foot.',
      tips: ['September is magical — Mid-Autumn Festival with moonlit West Lake and osmanthus fragrance.', 'Buy Longjing tea directly from tea villages, not tourist shops — and only in spring.', 'Day trip from Shanghai is feasible: 1h each way by high-speed rail, but staying overnight lets you experience West Lake at sunrise.']
    }
  },

  zhangjiajie: {
    id: 'zhangjiajie',
    name: 'Zhangjiajie',
    nameCN: '张家界',
    badge: 'Avatar Mountains',
    heroBg: 'from-purple-800 via-indigo-700 to-violet-800',
    emoji: '🏔️',
    region: 'Central China',
    regionColor: 'purple',
    best: 'Apr–May & Sep–Oct',
    days: '3–4',
    desc: 'The real-world inspiration for Avatar\'s floating Hallelujah Mountains. Over 3,000 quartz-sandstone pillars rise from misty forests — one of the most surreal landscapes on Earth.',
    attractions: [
      { name: 'National Forest Park', desc: 'Over 3,000 sandstone pillars towering above misty forests. The Yuanjiajie (Avatar) area is the highlight. ~¥228 (valid 4 days). Allow 2 full days minimum.', color: 'purple' },
      { name: 'Tianmen Mountain', desc: 'Natural arch reached by the world\'s longest cable car (7.5 km from city). Walk the glass skywalk on vertical cliffs. ~¥258. Book ahead.', color: 'indigo' },
      { name: 'Grand Canyon Glass Bridge', desc: 'World\'s highest and longest glass-bottom bridge (430m long, 300m high). Walk on transparent panels above the canyon. ~¥128.', color: 'pink' },
      { name: 'Bailong Elevator', desc: 'World\'s tallest outdoor elevator built into a cliff face (326m). Ascends through quartz pillars in 88 seconds. ~¥72 one-way.', color: 'blue' }
    ],
    food: [
      { name: 'Tujia Three-In-One Pot', emoji: '🥘', desc: 'The regional specialty — hearty clay pot stew with pork, tofu, and seasonal vegetables. Every local restaurant serves it.' },
      { name: 'Smoked Bacon', emoji: '🥩', desc: 'Tujia minority-style smoked pork — intensely savory, stir-fried with garlic shoots or mountain peppers.' },
      { name: 'Wild Mushroom Hotpot', emoji: '🍄', desc: 'The forests around Zhangjiajie yield incredible seasonal mushrooms. Local hotpot restaurants feature rotating varieties.' }
    ],
    map: {
      center: [29.3280, 110.4780],
      zoom: 12,
      markers: [
        { name: 'Zhangjiajie National Forest Park', lat: 29.3280, lng: 110.4170 },
        { name: 'Tianmen Mountain', lat: 29.0516, lng: 110.4830 },
        { name: 'Grand Canyon Glass Bridge', lat: 29.3960, lng: 110.7020 },
        { name: 'Bailong Elevator', lat: 29.3500, lng: 110.4530 },
        { name: 'Yuanjiajie (Avatar Area)', lat: 29.3450, lng: 110.4380 }
      ]
    },
    transport: {
      gettingThere: 'Zhangjiajie Hehua International (DYG) has domestic flights from major cities. The nearest high-speed rail station is Zhangjiajie West, with trains from Changsha (~3h), Guangzhou (~6h), and Chongqing (~6h). From the airport, the city center is 15 min by taxi.',
      local: 'Zhangjiajie city has buses and DiDi. To reach the National Forest Park, take a bus or taxi from the city center (~40 min). Within the park, <strong>free shuttle buses</strong> connect major areas. Cable cars and the Bailong Elevator help navigate the steep terrain. Comfortable hiking shoes are essential.',
      tips: ['Book Tianmen Mountain cable car time slots in advance — morning slots sell out first.', 'The park is enormous (48 sq km). Consider a local guide if you want to maximize 2–3 days.', 'Pack layers — mountain weather changes rapidly. The summit can be 10°C cooler than the base.', 'Bring rain gear year-round. The mist that makes it magical also makes it wet.']
    }
  },

  // ===========================================================================
  // 28 REGIONAL CITIES — At-a-glance cards
  // ===========================================================================

  regionalGrids: [
    {
      title: 'North & Northeast China',
      emoji: '🏔️',
      emojiBg: 'bg-red-100',
      cities: [
        { name: 'Tianjin', cn: '天津', desc: 'Colonial architecture, Haihe River, 30 min from Beijing.', food: 'Jianbing Guozi, Goubuli Baozi', days: '1–2', color: 'orange' },
        { name: 'Harbin', cn: '哈尔滨', desc: 'Ice & Snow World (Dec–Feb), Russian architecture.', food: 'Guo Bao Rou, Iron Pot Stew', days: '2–3', color: 'blue' },
        { name: 'Dalian', cn: '大连', desc: 'Coastal gem, beaches, Russian heritage, seafood.', food: 'Sea Urchin Dumplings', days: '2–3', color: 'cyan' },
        { name: 'Yanbian', cn: '延边', desc: 'Korean autonomous prefecture, K-pop, fusion food.', food: 'Cold Noodles, Korean BBQ', days: '2–3', color: 'indigo' }
      ]
    },
    {
      title: 'Central Plains & Yellow River',
      emoji: '🏛️',
      emojiBg: 'bg-amber-100',
      cities: [
        { name: 'Luoyang', cn: '洛阳', desc: 'Longmen Grottoes, Shaolin Temple, peony season (Apr).', food: 'Water Banquet, Hulatang', days: '2–3', color: 'red' },
        { name: 'Datong', cn: '大同', desc: 'Yungang Grottoes (UNESCO), Hanging Temple.', food: 'Daoxiao Noodles', days: '2–3', color: 'amber' },
        { name: 'Wuhan', cn: '武汉', desc: 'Yellow Crane Tower, cherry blossoms (Mar–Apr).', food: 'Hot Dry Noodles', days: '2–3', color: 'green' },
        { name: 'Kaifeng', cn: '开封', desc: 'Song Dynasty capital, Qingming Riverside Park.', food: 'Soup Dumplings', days: '1–2', color: 'purple' }
      ]
    },
    {
      title: 'East & Southeast China',
      emoji: '🌊',
      emojiBg: 'bg-blue-100',
      cities: [
        { name: 'Suzhou', cn: '苏州', desc: 'UNESCO gardens, silk, canals. 30 min from Shanghai.', food: 'Squirrel Fish, Hairy Crab', days: '2–3', color: 'emerald' },
        { name: 'Nanjing', cn: '南京', desc: 'Six Dynasties capital, Ming walls, poignant WWII history.', food: 'Duck Blood Soup', days: '2–3', color: 'slate' },
        { name: 'Qingdao', cn: '青岛', desc: 'Tsingtao beer, German architecture, beaches.', food: 'Mackerel Dumplings', days: '2–3', color: 'sky' },
        { name: 'Quanzhou', cn: '泉州', desc: 'UNESCO Maritime Silk Road port, Minnan street food.', food: 'Mian Xian Hu, Runbing', days: '2', color: 'cyan' }
      ]
    },
    {
      title: 'Southwest China',
      emoji: '🌿',
      emojiBg: 'bg-green-100',
      cities: [
        { name: 'Chongqing', cn: '重庆', desc: '8D mountain megacity, Hongyadong neon nights.', food: 'Chongqing Hotpot, Xiaomian', days: '2–3', color: 'orange' },
        { name: 'Lijiang', cn: '丽江', desc: 'UNESCO old town, Jade Dragon Snow Mountain.', food: 'Naxi Grilled Fish, Baba', days: '2–3', color: 'rose' },
        { name: 'Dali', cn: '大理', desc: 'Erhai Lake cycling, Bai minority culture.', food: 'Grilled Fish, Rushan Cheese', days: '2–3', color: 'teal' },
        { name: 'Guiyang', cn: '贵阳', desc: 'Forest City, gateway to Miao villages & waterfalls.', food: 'Sour Fish Soup', days: '1–2', color: 'lime' }
      ]
    },
    {
      title: 'Northwest & Silk Road',
      emoji: '🐫',
      emojiBg: 'bg-yellow-100',
      cities: [
        { name: 'Dunhuang', cn: '敦煌', desc: 'Mogao Caves, Singing Sand Dunes, Silk Road oasis.', food: 'Beef Noodles', days: '2–3', color: 'yellow' },
        { name: 'Lhasa', cn: '拉萨', desc: 'Potala Palace, Jokhang Temple, 3,650m altitude.', food: 'Yak Butter Tea, Tsampa', days: '3–4', color: 'red' },
        { name: 'Urumqi', cn: '乌鲁木齐', desc: 'Central Asian crossroads, Grand Bazaar, Tianchi.', food: 'Lamb Skewers, Big Plate Chicken', days: '2', color: 'emerald' },
        { name: 'Xining', cn: '西宁', desc: 'Qinghai Lake, Chaka Salt Lake, plateau gateway.', food: 'Niangpi, Hand-grabbed Mutton', days: '2–3', color: 'cyan' }
      ]
    },
    {
      title: 'South China & Special Regions',
      emoji: '🏖️',
      emojiBg: 'bg-rose-100',
      cities: [
        { name: 'Guangzhou', cn: '广州', desc: 'Canton Tower, dim sum capital, 2,200 years of history.', food: 'Dim Sum, Roast Goose', days: '2–3', color: 'red' },
        { name: 'Sanya', cn: '三亚', desc: 'China\'s Hawaii — white sand, luxury resorts.', food: 'Wenchang Chicken', days: '2–4', color: 'amber' },
        { name: 'Hong Kong', cn: '香港', desc: 'Victoria Harbour, hiking, East-meets-West energy.', food: 'Roast Goose, Egg Waffles', days: '3–4', color: 'red' },
        { name: 'Taipei', cn: '台北', desc: 'Night markets, Taipei 101, National Palace Museum.', food: 'Beef Noodles, Bubble Tea', days: '3–4', color: 'blue' }
      ]
    }
  ]
};

// Make data available globally
if (typeof window !== 'undefined') {
  window.CITY_DATA = CITY_DATA;
}
