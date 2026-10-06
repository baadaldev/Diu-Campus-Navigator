/**
 * DIU Smart Campus & Surrounding Area Navigator - Geographic Node Graph Data
 * Location: Daffodil International University (DIU), Ashulia Permanent Campus, Dhaka
 * Covered Areas: DIU Core Campus, Dattapara (দত্তপাড়া), Chandgaon (চান্দগাঁও), Khagan (খাগান),
 * Birulia (বিরুলিয়া), Sadhupara (সাধুপাড়া), Daffodil Model Town, Kumkumari (কুমকুমারী)
 */

const CAMPUS_NODES = [
  // ================= DIU CORE CAMPUS BUILDINGS =================
  {
    id: "diu_main_gate",
    name: "DIU Main Entrance Gate",
    bengaliName: "ডিআইইউ মেইন গেট ও সিকিউরিটি চেকপোস্ট",
    category: "entrance",
    lat: 23.8766,
    lng: 90.3201,
    floor: 0,
    desc: "Primary security entrance on Ashulia-Birulia road with checkpost, transport drop-off & rickshaw stand.",
    icon: "fa-solid fa-torii-gate",
    popular: true
  },
  {
    id: "knowledge_tower",
    name: "Knowledge Tower (Admin Building)",
    bengaliName: "নলেজ টাওয়ার (অ্যাডমিন ও রেজিস্টার ভবন)",
    category: "building",
    lat: 23.8778,
    lng: 90.3206,
    floor: 1,
    desc: "VC Office, Registrar, Admission Office, Student Accounts, Controller of Exams & Executive suites.",
    icon: "fa-solid fa-building-columns",
    popular: true
  },
  {
    id: "ab1_building",
    name: "Academic Building 1 (AB-1)",
    bengaliName: "একাডেমিক ভবন ১ (সিএসই / সফটওয়্যার ইঞ্জিনিয়ারিং)",
    category: "building",
    lat: 23.8787,
    lng: 90.3213,
    floor: 1,
    desc: "Computer Science & Engineering (CSE), Software Engineering (SWE) modern programming labs & faculty suites.",
    icon: "fa-solid fa-laptop-code",
    popular: true
  },
  {
    id: "ab2_building",
    name: "Academic Building 2 (AB-2)",
    bengaliName: "একাডেমিক ভবন ২ (ট্রিপল ই / টেক্সটাইল / সিভিল)",
    category: "building",
    lat: 23.8794,
    lng: 90.3221,
    floor: 1,
    desc: "Electrical & Electronic Engineering (EEE), Civil & Textile Engineering laboratories & design studios.",
    icon: "fa-solid fa-microchip",
    popular: true
  },
  {
    id: "ab3_building",
    name: "Academic Building 3 (AB-3)",
    bengaliName: "একাডেমিক ভবন ৩ (বিজনেস / আইন / ইংলিশ)",
    category: "building",
    lat: 23.8802,
    lng: 90.3229,
    floor: 1,
    desc: "Faculty of Business Studies (BBA), Law, English Department, and multi-tier lecture auditoriums.",
    icon: "fa-solid fa-briefcase",
    popular: true
  },
  {
    id: "ab4_building",
    name: "Academic Building 4 (AB-4)",
    bengaliName: "একাডেমিক ভবন ৪ (ইনোভেশন ও মাল্টিপারপাস ল্যাব)",
    category: "building",
    lat: 23.8810,
    lng: 90.3235,
    floor: 1,
    desc: "Research labs, innovation incubators, robotics workshop and specialized department classrooms.",
    icon: "fa-solid fa-flask-vial",
    popular: false
  },
  {
    id: "central_library",
    name: "DIU Central Library & Innovation Lab",
    bengaliName: "সেন্ট্রাল লাইব্রেরি ও ইনোভেশন ল্যাব",
    category: "building",
    lat: 23.8781,
    lng: 90.3219,
    floor: 2,
    desc: "Multi-floor air-conditioned digital resource center, reading cubes, study pods & thesis archives.",
    icon: "fa-solid fa-book-bookmark",
    popular: true
  },
  {
    id: "central_cafeteria",
    name: "Central Cafeteria (Charulata Food Court)",
    bengaliName: "সেন্ট্রাল ক্যাফেটেরিয়া (চারুলতা ফুড কোর্ট)",
    category: "food",
    lat: 23.8773,
    lng: 90.3224,
    floor: 1,
    desc: "Main student food court, snacks, lunch dining halls, juice bars & iconic campus coffee corner.",
    icon: "fa-solid fa-utensils",
    popular: true
  },
  {
    id: "central_mosque",
    name: "DIU Central Mosque",
    bengaliName: "ডিআইইউ কেন্দ্রীয় মসজিদ",
    category: "facility",
    lat: 23.8761,
    lng: 90.3217,
    floor: 0,
    desc: "Spacious campus mosque with dedicated ablution and prayer halls for male and female worshippers.",
    icon: "fa-solid fa-mosque",
    popular: false
  },
  {
    id: "sports_ground",
    name: "DIU Sports Arena & Stadium",
    bengaliName: "সেন্ট্রাল প্লে-গ্রাউন্ড ও স্পোর্টস এরিনা",
    category: "facility",
    lat: 23.8752,
    lng: 90.3225,
    floor: 0,
    desc: "Full-size turf cricket/football stadium, 400m running track, floodlights & athletics arena.",
    icon: "fa-solid fa-volleyball",
    popular: true
  },
  {
    id: "diu_lake",
    name: "DIU Lake & Eco Walkway (Wooden Bridge)",
    bengaliName: "ডিআইইউ লেক ও কাঠের ব্রিজ ওয়াকওয়ে",
    category: "facility",
    lat: 23.8765,
    lng: 90.3236,
    floor: 0,
    desc: "Scenic lakeside walkway, wooden arch footbridge, green tree canopies & student hangout zones.",
    icon: "fa-solid fa-water",
    popular: true
  },
  {
    id: "diu_medical",
    name: "DIU Medical Center & Pharmacy (24/7)",
    bengaliName: "ডিআইইউ মেডিকেল সেন্টার ও ইমার্জেন্সি ফার্মেসি",
    category: "medical",
    lat: 23.8770,
    lng: 90.3204,
    floor: 1,
    desc: "24/7 on-campus first-aid clinic, doctor consultations, oxygen supply & dedicated emergency ambulance.",
    icon: "fa-solid fa-kit-medical",
    popular: true
  },
  {
    id: "transport_terminal",
    name: "DIU Campus Bus Terminal",
    bengaliName: "বিশ্ববিদ্যালয় বাস টার্মিনাল ও শাটল ডিপো",
    category: "transport",
    lat: 23.8758,
    lng: 90.3192,
    floor: 0,
    desc: "Official DIU student bus fleet departure depot for Dhanmondi, Uttara, Mirpur, Gazipur & Savar routes.",
    icon: "fa-solid fa-bus",
    popular: true
  },
  {
    id: "bangabandhu_hall",
    name: "Bangabandhu Student Hall (Boys)",
    bengaliName: "বঙ্গবন্ধু ছাত্রাবাস (ছেলেদের আবাসিক হল)",
    category: "mess",
    lat: 23.8745,
    lng: 90.3242,
    floor: 1,
    desc: "Official on-campus male residential hall with dining, Wi-Fi and indoor sports room.",
    icon: "fa-solid fa-building-user",
    popular: false
  },
  {
    id: "fazilatunnesa_hall",
    name: "Sheikh Fazilatunnesa Hall (Girls)",
    bengaliName: "শেখ ফজিলাতুন্নেছা হল (মেয়েদের আবাসিক হল)",
    category: "mess",
    lat: 23.8785,
    lng: 90.3248,
    floor: 1,
    desc: "Secure on-campus female residential hall with 24/7 security, dining & common study rooms.",
    icon: "fa-solid fa-person-shelter",
    popular: false
  },

  // ================= DATTAPARA (দত্তপাড়া) STUDENT HUB =================
  {
    id: "dattapara_junction",
    name: "Dattapara Main Mor (দত্তপাড়া মোড়)",
    bengaliName: "দত্তপাড়া প্রধান মোড় ও রিকশা স্ট্যান্ড",
    category: "area",
    lat: 23.8795,
    lng: 90.3162,
    floor: 0,
    desc: "Major student junction right beside campus. Photocopy stores, student dining, tea stalls & auto stands.",
    icon: "fa-solid fa-store",
    popular: true
  },
  {
    id: "dattapara_mess_lane",
    name: "Dattapara Student Mess Cluster",
    bengaliName: "দত্তপাড়া মেস এলাকা (ছাত্রাবাস জোন)",
    category: "mess",
    lat: 23.8808,
    lng: 90.3155,
    floor: 0,
    desc: "Dense residential cluster of 50+ student messes, bachelor flats & shared apartments.",
    icon: "fa-solid fa-bed",
    popular: true
  },
  {
    id: "dattapara_market",
    name: "Dattapara Student Market & Pharmacy",
    bengaliName: "দত্তপাড়া ছাত্র বাজার ও খাবার হোটেল",
    category: "food",
    lat: 23.8800,
    lng: 90.3158,
    floor: 0,
    desc: "Bhai Bhai Hotel, Green Garden Dining, printing shops, stationery & emergency pharmacy.",
    icon: "fa-solid fa-shop",
    popular: false
  },

  // ================= CHANDGAON (চান্দগাঁও) STUDENT HUB =================
  {
    id: "chandgaon_mor",
    name: "Chandgaon Main Mor (চান্দগাঁও মোড়)",
    bengaliName: "চান্দগাঁও প্রধান মোড় ও স্ট্যান্ড",
    category: "area",
    lat: 23.8742,
    lng: 90.3175,
    floor: 0,
    desc: "South-west student residential junction connecting to Birulia road. Quiet hostels & grocery stores.",
    icon: "fa-solid fa-location-crosshairs",
    popular: true
  },
  {
    id: "chandgaon_mess_lane",
    name: "Chandgaon Student Hostels & Messes",
    bengaliName: "চান্দগাঁও মেস ও ছাত্রাবাস জোন",
    category: "mess",
    lat: 23.8732,
    lng: 90.3168,
    floor: 0,
    desc: "Popular budget student bachelor messes, peaceful study environments & student dining points.",
    icon: "fa-solid fa-house-user",
    popular: true
  },
  {
    id: "chandgaon_bazar",
    name: "Chandgaon Local Market & Dining",
    bengaliName: "চান্দগাঁও লোকাল বাজার ও টি-স্টল",
    category: "food",
    lat: 23.8738,
    lng: 90.3172,
    floor: 0,
    desc: "Evening student adda point, tea stalls, local grocery shops and fresh snacks.",
    icon: "fa-solid fa-mug-hot",
    popular: false
  },

  // ================= KHAGAN (খাগান) HUB =================
  {
    id: "khagan_bazar",
    name: "Khagan Bazar & Bus Stand",
    bengaliName: "খাগান বাজার ও বাসস্ট্যান্ড",
    category: "area",
    lat: 23.8828,
    lng: 90.3138,
    floor: 0,
    desc: "Major market center on Savar road. Supermarkets, fruit market, pharmacies, bus stoppages & ATMs.",
    icon: "fa-solid fa-cart-shopping",
    popular: true
  },
  {
    id: "khagan_student_mess",
    name: "Khagan Student Mess Lane (Shapla & Padma)",
    bengaliName: "খাগান মেস পল্লী (ছাত্র ও ছাত্রী মেস)",
    category: "mess",
    lat: 23.8839,
    lng: 90.3129,
    floor: 0,
    desc: "High-rise student mess buildings, private hostels, dedicated dining & high-speed Wi-Fi homes.",
    icon: "fa-solid fa-house-chimney-user",
    popular: true
  },

  // ================= SURROUNDING HIGHWAYS & CONNECTIVITY =================
  {
    id: "birulia_bridge",
    name: "Birulia Bridge & Stand (বিরুলিয়া ব্রিজ)",
    bengaliName: "বিরুলিয়া ব্রিজ ও ঘাট",
    category: "area",
    lat: 23.8640,
    lng: 90.3260,
    floor: 0,
    desc: "Major gateway bridge connecting Ashulia/DIU to Mirpur Beribadh, Gabtoli & Uttara routes.",
    icon: "fa-solid fa-bridge",
    popular: true
  },
  {
    id: "sadhupara_shortcut",
    name: "Sadhupara Shortcut Entry Point",
    bengaliName: "সাধুপাড়া শর্টকাট গলি",
    category: "area",
    lat: 23.8722,
    lng: 90.3195,
    floor: 0,
    desc: "Scenic walking shortcut connecting southern hostels directly to DIU Sports Ground & Mosque.",
    icon: "fa-solid fa-person-walking",
    popular: false
  },
  {
    id: "model_town_gate",
    name: "Daffodil Model Town Main Gate",
    bengaliName: "ড্যাফোডিল মডেল টাউন মেইন গেট",
    category: "area",
    lat: 23.8850,
    lng: 90.3225,
    floor: 0,
    desc: "Northern residential area for faculty members, administrative staff and senior university students.",
    icon: "fa-solid fa-shield-halved",
    popular: true
  },
  {
    id: "kumkumari_junction",
    name: "Kumkumari Highway Junction",
    bengaliName: "কুমকুমারী হাইওয়ে মোড় ও বাস স্ট্যান্ড",
    category: "area",
    lat: 23.8872,
    lng: 90.3115,
    floor: 0,
    desc: "Northern highway connection point toward Baipayl, Nabinagar, Chandra and Savar connections.",
    icon: "fa-solid fa-signs-post",
    popular: false
  }
];

/**
 * Weighted Road & Walkway Graph Connections (Edges)
 */
const CAMPUS_EDGES = [
  // --- DIU Core Campus Internal Roads & Walkways ---
  { from: "diu_main_gate", to: "knowledge_tower", distance: 140, type: "paved_road", accessible: true },
  { from: "diu_main_gate", to: "diu_medical", distance: 65, type: "paved_road", accessible: true },
  { from: "diu_main_gate", to: "transport_terminal", distance: 120, type: "paved_road", accessible: true },
  { from: "knowledge_tower", to: "ab1_building", distance: 130, type: "paved_road", accessible: true },
  { from: "knowledge_tower", to: "central_cafeteria", distance: 170, type: "walkway", accessible: true },
  { from: "knowledge_tower", to: "diu_medical", distance: 95, type: "walkway", accessible: true },
  
  { from: "ab1_building", to: "ab2_building", distance: 110, type: "paved_road", accessible: true },
  { from: "ab1_building", to: "central_library", distance: 90, type: "walkway", accessible: true },
  { from: "ab1_building", to: "central_cafeteria", distance: 155, type: "walkway", accessible: true },

  { from: "ab2_building", to: "ab3_building", distance: 125, type: "paved_road", accessible: true },
  { from: "ab2_building", to: "central_library", distance: 100, type: "walkway", accessible: true },
  { from: "ab3_building", to: "ab4_building", distance: 115, type: "paved_road", accessible: true },
  { from: "ab3_building", to: "fazilatunnesa_hall", distance: 240, type: "walkway", accessible: true },
  { from: "ab3_building", to: "model_town_gate", distance: 480, type: "paved_road", accessible: true },
  { from: "ab4_building", to: "model_town_gate", distance: 410, type: "paved_road", accessible: true },

  { from: "central_library", to: "central_cafeteria", distance: 110, type: "walkway", accessible: true },
  { from: "central_cafeteria", to: "central_mosque", distance: 145, type: "walkway", accessible: true },
  { from: "central_cafeteria", to: "diu_lake", distance: 130, type: "walkway", accessible: true },
  
  { from: "central_mosque", to: "sports_ground", distance: 120, type: "walkway", accessible: true },
  { from: "sports_ground", to: "diu_lake", distance: 160, type: "walkway", accessible: false },
  { from: "sports_ground", to: "bangabandhu_hall", distance: 210, type: "walkway", accessible: true },
  { from: "sports_ground", to: "sadhupara_shortcut", distance: 380, type: "shortcut_alley", accessible: false },
  { from: "diu_lake", to: "fazilatunnesa_hall", distance: 260, type: "walkway", accessible: true },

  // --- Core Campus to Transport & Birulia Highway ---
  { from: "transport_terminal", to: "chandgaon_mor", distance: 290, type: "paved_road", accessible: true },
  { from: "transport_terminal", to: "birulia_bridge", distance: 2200, type: "paved_road", accessible: true },
  { from: "diu_main_gate", to: "birulia_bridge", distance: 2350, type: "paved_road", accessible: true },

  // --- Dattapara (দত্তপাড়া) Connectivity ---
  { from: "diu_main_gate", to: "dattapara_junction", distance: 410, type: "paved_road", accessible: true },
  { from: "knowledge_tower", to: "dattapara_junction", distance: 460, type: "shortcut_alley", accessible: false },
  { from: "dattapara_junction", to: "dattapara_market", distance: 90, type: "paved_road", accessible: true },
  { from: "dattapara_market", to: "dattapara_mess_lane", distance: 120, type: "paved_road", accessible: true },
  { from: "dattapara_junction", to: "dattapara_mess_lane", distance: 180, type: "paved_road", accessible: true },
  { from: "dattapara_mess_lane", to: "ab1_building", distance: 360, type: "shortcut_alley", accessible: false },

  // --- Chandgaon (চান্দগাঁও) Connectivity ---
  { from: "chandgaon_mor", to: "chandgaon_bazar", distance: 80, type: "paved_road", accessible: true },
  { from: "chandgaon_bazar", to: "chandgaon_mess_lane", distance: 90, type: "paved_road", accessible: true },
  { from: "chandgaon_mor", to: "chandgaon_mess_lane", distance: 130, type: "paved_road", accessible: true },
  { from: "chandgaon_mor", to: "sadhupara_shortcut", distance: 310, type: "paved_road", accessible: false },
  { from: "chandgaon_mor", to: "dattapara_junction", distance: 650, type: "paved_road", accessible: true },
  { from: "chandgaon_mess_lane", to: "dattapara_mess_lane", distance: 750, type: "paved_road", accessible: true },

  // --- Khagan (খাগান) Connectivity ---
  { from: "dattapara_junction", to: "khagan_bazar", distance: 450, type: "paved_road", accessible: true },
  { from: "dattapara_mess_lane", to: "khagan_student_mess", distance: 390, type: "shortcut_alley", accessible: false },
  { from: "khagan_bazar", to: "khagan_student_mess", distance: 160, type: "paved_road", accessible: true },
  { from: "khagan_bazar", to: "kumkumari_junction", distance: 520, type: "paved_road", accessible: true },

  // --- Northern Perimeter & Model Town ---
  { from: "model_town_gate", to: "ab2_building", distance: 540, type: "paved_road", accessible: true },
  { from: "model_town_gate", to: "khagan_bazar", distance: 980, type: "paved_road", accessible: true }
];

// Helper to auto-calculate metrics
CAMPUS_EDGES.forEach(edge => {
  edge.walkTimeSec = Math.round(edge.distance / 1.3);
  if (edge.type === 'paved_road') {
    edge.rickshawTimeSec = Math.round((edge.distance / 3.5) + 15);
    edge.rickshawFareBDT = Math.max(15, Math.round(15 + (edge.distance / 500) * 10));
  } else {
    edge.rickshawTimeSec = null;
    edge.rickshawFareBDT = null;
  }
});

// Export to window
if (typeof window !== 'undefined') {
  window.CAMPUS_NODES = CAMPUS_NODES;
  window.CAMPUS_EDGES = CAMPUS_EDGES;
}
