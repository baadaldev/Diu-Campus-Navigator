/**
 * DIU Smart Campus & Surrounding Area Navigator - Geographic Node Graph Data
 * Location: Daffodil International University (DIU), Ashulia Permanent Campus, Dhaka
 * Covered Areas: DIU Campus, Dattapara, Khagan, Changaon, Sadhupara, Model Town, Kumkumari
 */

const CAMPUS_NODES = [
  // ================= DIU CAMPUS LANDMARKS =================
  {
    id: "diu_main_gate",
    name: "DIU Main Entrance Gate",
    bengaliName: "ডিআইইউ মেইন গেট",
    category: "entrance",
    lat: 23.8766,
    lng: 90.3201,
    floor: 0,
    desc: "Primary security entrance on Ashulia-Birulia road with checkpost & shuttle drop-off.",
    icon: "fa-solid fa-torii-gate",
    popular: true
  },
  {
    id: "knowledge_tower",
    name: "Knowledge Tower (Admin Building)",
    bengaliName: "নলেজ টাওয়ার (অ্যাডমিন ভবন)",
    category: "building",
    lat: 23.8778,
    lng: 90.3206,
    floor: 1,
    desc: "VC Office, Registrar, Admission Office, Accounts, Exam Controller & Executive Desks.",
    icon: "fa-solid fa-building-columns",
    popular: true
  },
  {
    id: "ab1_building",
    name: "Academic Building 1 (AB-1)",
    bengaliName: "একাডেমিক ভবন ১ (সিএসই / সফটওয়্যার)",
    category: "building",
    lat: 23.8787,
    lng: 90.3213,
    floor: 1,
    desc: "Computer Science & Engineering (CSE), Software Engineering labs, classrooms & faculty suites.",
    icon: "fa-solid fa-laptop-code",
    popular: true
  },
  {
    id: "ab2_building",
    name: "Academic Building 2 (AB-2)",
    bengaliName: "একাডেমিক ভবন ২ (ট্রিপল ই / টেক্সটাইল)",
    category: "building",
    lat: 23.8794,
    lng: 90.3221,
    floor: 1,
    desc: "Electrical (EEE), Civil & Textile Engineering laboratories, design studios & classrooms.",
    icon: "fa-solid fa-microchip",
    popular: true
  },
  {
    id: "ab3_building",
    name: "Academic Building 3 (AB-3)",
    bengaliName: "একাডেমিক ভবন ৩ (বিজনেস / আইন)",
    category: "building",
    lat: 23.8802,
    lng: 90.3229,
    floor: 1,
    desc: "Business Administration (BBA), Law, English, and large multi-tier lecture auditoriums.",
    icon: "fa-solid fa-briefcase",
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
    desc: "Multi-floor air-conditioned library, digital resource center, reading cubes & thesis archives.",
    icon: "fa-solid fa-book-bookmark",
    popular: true
  },
  {
    id: "central_cafeteria",
    name: "Central Cafeteria (Charulata Food Court)",
    bengaliName: "সেন্ট্রাল ক্যাফেটেরিয়া (চারুলতা)",
    category: "food",
    lat: 23.8773,
    lng: 90.3224,
    floor: 1,
    desc: "Main student food court, snacks, lunch dining halls, juice bars & tea stalls.",
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
    desc: "Spacious campus mosque with dedicated wudu areas for male and female worshippers.",
    icon: "fa-solid fa-mosque",
    popular: false
  },
  {
    id: "sports_ground",
    name: "DIU Sports Arena & Cricket Field",
    bengaliName: "সেন্ট্রাল প্লে-গ্রাউন্ড ও স্পোর্টস এরিনা",
    category: "facility",
    lat: 23.8752,
    lng: 90.3225,
    floor: 0,
    desc: "Full-size turf cricket/football stadium, basketball court & athletics track.",
    icon: "fa-solid fa-volleyball",
    popular: false
  },
  {
    id: "diu_lake",
    name: "DIU Lake & Eco Walkway",
    bengaliName: "ডিআইইউ লেক ও গ্রিন ওয়াকওয়ে",
    category: "facility",
    lat: 23.8765,
    lng: 90.3236,
    floor: 0,
    desc: "Scenic lakeside walkway, green tree canopies, wooden bridges & student chill zones.",
    icon: "fa-solid fa-water",
    popular: true
  },
  {
    id: "diu_medical",
    name: "DIU Medical Center & Pharmacy",
    bengaliName: "ডিআইইউ মেডিকেল সেন্টার",
    category: "medical",
    lat: 23.8770,
    lng: 90.3204,
    floor: 1,
    desc: "24/7 on-campus first-aid clinic, doctor consultation, pharmacy & emergency ambulance station.",
    icon: "fa-solid fa-kit-medical",
    popular: true
  },
  {
    id: "transport_terminal",
    name: "DIU Campus Bus Terminal",
    bengaliName: "বিশ্ববিদ্যালয় বাস টার্মিনাল",
    category: "transport",
    lat: 23.8758,
    lng: 90.3192,
    floor: 0,
    desc: "Official DIU student bus fleet departure depot for Dhanmondi, Uttara, Mirpur, and Savar routes.",
    icon: "fa-solid fa-bus",
    popular: true
  },

  // ================= SURROUNDING STUDENT HUBS & MESS ZONES =================
  {
    id: "dattapara_junction",
    name: "Dattapara Student Hub & Market",
    bengaliName: "দত্তপাড়া স্টুডেন্ট হাব ও বাজার",
    category: "area",
    lat: 23.8795,
    lng: 90.3162,
    floor: 0,
    desc: "Prime student residential zone right beside campus: photocopy shops, restaurants & pharmacies.",
    icon: "fa-solid fa-store",
    popular: true
  },
  {
    id: "dattapara_mess_lane",
    name: "Dattapara Student Mess Cluster",
    bengaliName: "দত্তপাড়া মেস এলাকা (ছাত্রাবাস)",
    category: "mess",
    lat: 23.8808,
    lng: 90.3155,
    floor: 0,
    desc: "Dense residential cluster of 40+ male and female student messes and bachelor flats.",
    icon: "fa-solid fa-bed",
    popular: true
  },
  {
    id: "khagan_bazar",
    name: "Khagan Bazar & Bus Stand",
    bengaliName: "খাগান বাজার ও বাস স্ট্যান্ড",
    category: "area",
    lat: 23.8828,
    lng: 90.3138,
    floor: 0,
    desc: "Major local grocery market, street food stalls, rickshaw stands & local bus stops.",
    icon: "fa-solid fa-cart-shopping",
    popular: true
  },
  {
    id: "khagan_student_mess",
    name: "Khagan Mess Lane (Shapla & Padma Hub)",
    bengaliName: "খাগান মেস পল্লী (ছাত্রাবাস জোন)",
    category: "mess",
    lat: 23.8839,
    lng: 90.3129,
    floor: 0,
    desc: "Large multi-storied student housing buildings, bachelor apartments & private hostels.",
    icon: "fa-solid fa-house-chimney-user",
    popular: true
  },
  {
    id: "changaon_hub",
    name: "Changaon Residential Intersection",
    bengaliName: "চানগাঁও আবাসিক মোড়",
    category: "area",
    lat: 23.8742,
    lng: 90.3175,
    floor: 0,
    desc: "Quiet residential hub south-west of campus with student hostels and laundry facilities.",
    icon: "fa-solid fa-map-pin",
    popular: false
  },
  {
    id: "changaon_mess_lane",
    name: "Changaon Student Hostels",
    bengaliName: "চানগাঁও মেস ও হোস্টেল",
    category: "mess",
    lat: 23.8732,
    lng: 90.3168,
    floor: 0,
    desc: "Budget student bachelor accommodation and quiet study environments.",
    icon: "fa-solid fa-hotel",
    popular: false
  },
  {
    id: "sadhupara_shortcut",
    name: "Sadhupara Shortcut Entry Point",
    bengaliName: "সাধুপাড়া শর্টকাট গলি",
    category: "area",
    lat: 23.8722,
    lng: 90.3195,
    floor: 0,
    desc: "Scenic dirt track and pedestrian shortcut connecting southern hostels to DIU Sports Ground.",
    icon: "fa-solid fa-person-walking",
    popular: false
  },
  {
    id: "model_town_gate",
    name: "Daffodil Model Town Main Gate",
    bengaliName: "ড্যাফোডিল মডেল টাউন গেট",
    category: "area",
    lat: 23.8850,
    lng: 90.3225,
    floor: 0,
    desc: "North entrance residential township for DIU faculty members, staff, and senior students.",
    icon: "fa-solid fa-shield-halved",
    popular: true
  },
  {
    id: "kumkumari_junction",
    name: "Kumkumari Highway Junction",
    bengaliName: "কুমকুমারী বাস স্ট্যান্ড ও হাইওয়ে মোড়",
    category: "area",
    lat: 23.8872,
    lng: 90.3115,
    floor: 0,
    desc: "Northern highway connection toward Nabinagar, Chandra, and Savar bus connections.",
    icon: "fa-solid fa-signs-post",
    popular: false
  }
];

/**
 * Weighted Road & Walkway Graph Connections (Edges)
 * Each edge supports:
 * - distance: in meters (geodesic & road measured)
 * - walkTime: in seconds (average 1.3 m/s walking speed)
 * - rickshawTime: in seconds (traffic & speed accounted)
 * - rickshawFare: estimated fare in BDT (Taka)
 * - type: 'walkway', 'paved_road', 'shortcut_alley'
 * - accessible: wheelchair friendly (true/false)
 */
const CAMPUS_EDGES = [
  // --- Inside DIU Campus Core Connections ---
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
  { from: "ab3_building", to: "model_town_gate", distance: 480, type: "paved_road", accessible: true },

  { from: "central_library", to: "central_cafeteria", distance: 110, type: "walkway", accessible: true },
  { from: "central_cafeteria", to: "central_mosque", distance: 145, type: "walkway", accessible: true },
  { from: "central_cafeteria", to: "diu_lake", distance: 130, type: "walkway", accessible: true },
  
  { from: "central_mosque", to: "sports_ground", distance: 120, type: "walkway", accessible: true },
  { from: "sports_ground", to: "diu_lake", distance: 160, type: "walkway", accessible: false },
  { from: "sports_ground", to: "sadhupara_shortcut", distance: 380, type: "shortcut_alley", accessible: false },
  { from: "transport_terminal", to: "changaon_hub", distance: 290, type: "paved_road", accessible: true },

  // --- Campus to Dattapara Student Mess Area ---
  { from: "diu_main_gate", to: "dattapara_junction", distance: 410, type: "paved_road", accessible: true },
  { from: "knowledge_tower", to: "dattapara_junction", distance: 460, type: "shortcut_alley", accessible: false },
  { from: "dattapara_junction", to: "dattapara_mess_lane", distance: 180, type: "paved_road", accessible: true },
  { from: "dattapara_mess_lane", to: "ab1_building", distance: 360, type: "shortcut_alley", accessible: false },

  // --- Dattapara to Khagan Bazar & Messes ---
  { from: "dattapara_junction", to: "khagan_bazar", distance: 450, type: "paved_road", accessible: true },
  { from: "dattapara_mess_lane", to: "khagan_student_mess", distance: 390, type: "shortcut_alley", accessible: false },
  { from: "khagan_bazar", to: "khagan_student_mess", distance: 160, type: "paved_road", accessible: true },
  { from: "khagan_bazar", to: "kumkumari_junction", distance: 520, type: "paved_road", accessible: true },

  // --- Changaon & Sadhupara Connections ---
  { from: "changaon_hub", to: "changaon_mess_lane", distance: 130, type: "paved_road", accessible: true },
  { from: "changaon_hub", to: "sadhupara_shortcut", distance: 310, type: "paved_road", accessible: false },
  { from: "changaon_mess_lane", to: "dattapara_junction", distance: 680, type: "paved_road", accessible: true },

  // --- Model Town & Northern Perimeter ---
  { from: "model_town_gate", to: "ab2_building", distance: 540, type: "paved_road", accessible: true },
  { from: "model_town_gate", to: "khagan_bazar", distance: 980, type: "paved_road", accessible: true }
];

// Helper to calculate walking time, rickshaw time & estimated fare
CAMPUS_EDGES.forEach(edge => {
  // Walking speed approx 1.3 meters per second (78 meters per minute)
  edge.walkTimeSec = Math.round(edge.distance / 1.3);
  
  // Rickshaw speed approx 3.5 m/s + 20s boarding buffer (for paved roads only)
  if (edge.type === 'paved_road') {
    edge.rickshawTimeSec = Math.round((edge.distance / 3.5) + 15);
    // Base BDT 15 + approx BDT 8 per 500 meters
    edge.rickshawFareBDT = Math.max(15, Math.round(15 + (edge.distance / 500) * 10));
  } else {
    // Shortcuts and interior walkways are walk-only
    edge.rickshawTimeSec = null;
    edge.rickshawFareBDT = null;
  }
});
