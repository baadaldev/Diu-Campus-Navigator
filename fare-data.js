/**
 * DIU Smart Campus Navigator - Complete Transport Fare Matrix & Rates Guide
 * Real-world student fares for Auto-rickshaw (Easybike), Manual Rickshaw, Leguna, and Shared Shuttles
 * Covered: DIU Campus, Dattapara, Chandgaon, Khagan, Birulia, Sadhupara, Kumkumari, Model Town, Savar
 */

const DIU_FARE_DATA = {
  generalRules: [
    "শেয়ার্ড অটো (ইজিবাইক) ভাড়া প্রতি সিট হিসেবে নির্ধারিত।",
    "ম্যানুয়াল রিকশা রিজার্ভ করার আগে ভাড়া দরদাম করে নেওয়া ভালো।",
    "রাত ৮:৩০ টার পর অথবা বৃষ্টির দিনে রিকশা ভাড়ায় ৳৫ - ৳১০ অতিরিক্ত হতে পারে।",
    "ক্যাম্পাসের ভেতর ও গেটে নির্ধারিত রিকশা স্ট্যান্ড রয়েছে।"
  ],

  // Specific Point-to-Point Fare Matrix
  matrix: [
    {
      fromId: "diu_main_gate",
      fromName: "DIU Main Gate / Campus",
      toId: "dattapara_junction",
      toName: "Dattapara Main Mor (দত্তপাড়া মোড়)",
      distanceMeters: 450,
      walkTimeMin: "6 - 8 min",
      sharedAutoFare: 10,
      reservedRickshawFare: "20 - 25",
      notes: "সবচেয়ে বেশি ব্যবহৃত ছাত্র রুট। সারাদিন ইজিবাইক পাওয়া যায়।"
    },
    {
      fromId: "diu_main_gate",
      fromName: "DIU Main Gate / Campus",
      toId: "dattapara_mess_lane",
      toName: "Dattapara Mess Cluster (দত্তপাড়া মেস পল্লী)",
      distanceMeters: 650,
      walkTimeMin: "8 - 10 min",
      sharedAutoFare: 10,
      reservedRickshawFare: "25 - 30",
      notes: "মেস গলির ভেতরের বাসার গেট পর্যন্ত রিকশা ভাড়া ৳৩০।"
    },
    {
      fromId: "diu_main_gate",
      fromName: "DIU Main Gate / Campus",
      toId: "chandgaon_mor",
      toName: "Chandgaon Main Mor (চান্দগাঁও মোড়)",
      distanceMeters: 550,
      walkTimeMin: "7 - 9 min",
      sharedAutoFare: 10,
      reservedRickshawFare: "20 - 25",
      notes: "চান্দগাঁও বাজার ও আবাসিক ছাত্র হোস্টেল জোন।"
    },
    {
      fromId: "diu_main_gate",
      fromName: "DIU Main Gate / Campus",
      toId: "chandgaon_mess_lane",
      toName: "Chandgaon Mess Lane (চান্দগাঁও মেস এলাকা)",
      distanceMeters: 750,
      walkTimeMin: "10 - 12 min",
      sharedAutoFare: 10,
      reservedRickshawFare: "25 - 30",
      notes: "চান্দগাঁও ভেতরের হোস্টেলগুলোতে যাতায়াত।"
    },
    {
      fromId: "diu_main_gate",
      fromName: "DIU Main Gate / Campus",
      toId: "khagan_bazar",
      toName: "Khagan Bazar (খাগান বাজার)",
      distanceMeters: 1100,
      walkTimeMin: "14 - 17 min",
      sharedAutoFare: 15,
      reservedRickshawFare: "35 - 40",
      notes: "খাগান কাঁচাবাজার ও বাসস্ট্যান্ড। অটোতে ভাড়া ৳১৫।"
    },
    {
      fromId: "diu_main_gate",
      fromName: "DIU Main Gate / Campus",
      toId: "khagan_student_mess",
      toName: "Khagan Mess Lane (খাগান মেস পল্লী)",
      distanceMeters: 1300,
      walkTimeMin: "16 - 19 min",
      sharedAutoFare: 15,
      reservedRickshawFare: "40 - 50",
      notes: "শাপলা ও পদ্মা মেস ক্লাস্টার।"
    },
    {
      fromId: "diu_main_gate",
      fromName: "DIU Main Gate / Campus",
      toId: "birulia_bridge",
      toName: "Birulia Bridge / Ghat (বিরুলিয়া ব্রিজ)",
      distanceMeters: 2400,
      walkTimeMin: "30 - 35 min",
      sharedAutoFare: 20,
      reservedRickshawFare: "50 - 60",
      notes: "মিরপুর বেরিবাঁধের সংযোগস্থল।"
    },
    {
      fromId: "diu_main_gate",
      fromName: "DIU Main Gate / Campus",
      toId: "sadhupara_shortcut",
      toName: "Sadhupara Shortcut (সাধুপাড়া গলি)",
      distanceMeters: 500,
      walkTimeMin: "6 - 8 min",
      sharedAutoFare: "N/A (ওয়াকিং)",
      reservedRickshawFare: "20",
      notes: "মাঠ ও লেকের পেছনের ছাত্র হোস্টেলগুলোতে যাওয়ার শর্টকাট।"
    },
    {
      fromId: "diu_main_gate",
      fromName: "DIU Main Gate / Campus",
      toId: "model_town_gate",
      toName: "Daffodil Model Town (মডেল টাউন গেট)",
      distanceMeters: 950,
      walkTimeMin: "12 - 14 min",
      sharedAutoFare: 10,
      reservedRickshawFare: "30 - 35",
      notes: "ক্যাম্পাসের উত্তর দিকের আবাসিক এলাকা।"
    },
    {
      fromId: "diu_main_gate",
      fromName: "DIU Main Gate / Campus",
      toId: "kumkumari_junction",
      toName: "Kumkumari Highway (কুমকুমারী হাইওয়ে মোড়)",
      distanceMeters: 1600,
      walkTimeMin: "20 - 24 min",
      sharedAutoFare: 20,
      reservedRickshawFare: "40 - 50",
      notes: "সাভার ও নবীনগর রুটের বাস ধরার পয়েন্ট।"
    },
    {
      fromId: "dattapara_junction",
      fromName: "Dattapara (দত্তপাড়া)",
      toId: "khagan_bazar",
      toName: "Khagan Bazar (খাগান বাজার)",
      distanceMeters: 700,
      walkTimeMin: "9 - 11 min",
      sharedAutoFare: 10,
      reservedRickshawFare: "25 - 30",
      notes: "দত্তপাড়া থেকে সরাসরি খাগান বাজার।"
    },
    {
      fromId: "chandgaon_mor",
      fromName: "Chandgaon (চান্দগাঁও)",
      toId: "dattapara_junction",
      toName: "Dattapara (দত্তপাড়া)",
      distanceMeters: 650,
      walkTimeMin: "8 - 10 min",
      sharedAutoFare: 10,
      reservedRickshawFare: "20 - 25",
      notes: "চান্দগাঁও থেকে দত্তপাড়া সংযোগ সড়ক।"
    },
    {
      fromId: "diu_main_gate",
      fromName: "DIU Main Gate",
      toId: "savar_bus_stand",
      toName: "Savar Bus Stand (সাভার বাসস্ট্যান্ড)",
      distanceMeters: 6500,
      walkTimeMin: "N/A",
      sharedAutoFare: "30 - 35 (লেগুনা/অটো)",
      reservedRickshawFare: "N/A (দূরপাল্লা)",
      notes: "খাগান হয়ে সাভার বাসস্ট্যান্ডে লোকাল লেগুনা/অটো।"
    }
  ]
};

// Export to window
if (typeof window !== 'undefined') {
  window.DIU_FARE_DATA = DIU_FARE_DATA;
}
