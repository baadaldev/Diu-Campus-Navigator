/**
 * DIU Smart Campus Navigator - Built-in Intelligent Campus Assistant (DIU AI)
 * Answers student questions about buildings, classes, labs, bus timings, fares, messes & emergency contacts.
 */

const DIU_AI_KNOWLEDGE = [
  {
    keywords: ["cse", "computer", "lab", "software", "swe", "প্রোগ্রামিং", "ল্যাব", "এবি১", "ab1", "ab-1"],
    title: "Academic Building 1 (AB-1)",
    answer: "কম্পিউটার সায়েন্স (CSE) এবং সফটওয়্যার ইঞ্জিনিয়ারিং (SWE) ডিপার্টমেন্ট ও ল্যাবসমূহ **Academic Building 1 (AB-1)**-এ অবস্থিত। এখানে অ্যাডভান্সড প্রোগ্রামিং ল্যাব, নেটওয়ার্কিং ল্যাব এবং ফ্যাকাল্টি রুম রয়েছে।",
    action: { type: "navigate", targetId: "ab1_building", label: "AB-1 ম্যাপে দেখুন" }
  },
  {
    keywords: ["admin", "vc", "admission", "ভর্তি", "অ্যাকাউন্টস", "টাকা", "ফি", "রেজিস্ট্রার", "নলেজ টাওয়ার", "knowledge tower", "exam", "পরীক্ষা"],
    title: "Knowledge Tower (Admin Building)",
    answer: "ভর্তি কার্যক্রম (Admission), টিউশন ফি/অ্যাকাউন্টস, ভিসি অফিস, রেজিস্ট্রার এবং পরীক্ষা নিয়ন্ত্রক অফিস **Knowledge Tower**-এ অবস্থিত। এটি মেইন গেট দিয়ে ঢুকে একটু সামনেই পাবেন।",
    action: { type: "navigate", targetId: "knowledge_tower", label: "নলেজ টাওয়ার ম্যাপে দেখুন" }
  },
  {
    keywords: ["eee", "textile", "civil", "টেক্সটাইল", "সিভিল", "ট্রিপল ই", "ab2", "ab-2", "এবি২"],
    title: "Academic Building 2 (AB-2)",
    answer: "Electrical (EEE), Civil এবং Textile Engineering ডিপার্টমেন্ট ও ড্রয়িং/ওয়ার্কশপ ল্যাবগুলো **Academic Building 2 (AB-2)**-এ অবস্থিত।",
    action: { type: "navigate", targetId: "ab2_building", label: "AB-2 ম্যাপে দেখুন" }
  },
  {
    keywords: ["bba", "business", "law", "english", "আইন", "ব্যবসা", "ইংলিশ", "ইংরেজি", "ab3", "ab-3", "এবি৩"],
    title: "Academic Building 3 (AB-3)",
    answer: "Business Administration (BBA), Law এবং English ডিপার্টমেন্ট **Academic Building 3 (AB-3)**-এ অবস্থিত। এখানে বড় লেকচার অডিটোরিয়ামও রয়েছে।",
    action: { type: "navigate", targetId: "ab3_building", label: "AB-3 ম্যাপে দেখুন" }
  },
  {
    keywords: ["library", "বই", "লাইব্রেরি", "পড়াশোনা", "innovation"],
    title: "DIU Central Library",
    answer: "ডিআইইউ সেন্ট্রাল লাইব্রেরি ও ইনোভেশন ল্যাব সেন্ট্রাল ক্যাফেটেরিয়ার পাশেই অবস্থিত। এটি সম্পূর্ণ শীতাতপ নিয়ন্ত্রিত এবং ডিজিটাল স্টাডি জোন সমৃদ্ধ।",
    action: { type: "navigate", targetId: "central_library", label: "লাইব্রেরি ম্যাপে দেখুন" }
  },
  {
    keywords: ["খাবার", "ফুড", "ক্যান্টিন", "ক্যাফেটেরিয়া", "canteen", "food", "charulata", "চারুলতা", "লাঞ্চ"],
    title: "Charulata Food Court",
    answer: "ক্যাম্পাসের প্রধান খাবার জায়গা **চারুলতা ফুড কোর্ট (Central Cafeteria)**। এখানে সকালের নাস্তা, দুপুরের লাঞ্চ মিল (৳৫০ - ৳৮০), স্ন্যাকস ও জুস পাওয়া যায়। এছাড়া দত্তপাড়া মোড়ে ভাই ভাই ও গ্রীন গার্ডেন হোটেল আছে।",
    action: { type: "navigate", targetId: "central_cafeteria", label: "চারুলতা ফুড কোর্ট দেখুন" }
  },
  {
    keywords: ["dattapara", "দত্তপাড়া", "দত্তপাড়া", "মেস", "ভাড়া", "ভাড়া", "auto", "রিকশা", "অটো"],
    title: "দত্তপাড়া ও যাতায়াত ভাড়া",
    answer: "ক্যাম্পাস মেইন গেট থেকে **দত্তপাড়া মোড়ে** শেয়ার্ড অটো (ইজিবাইক) ভাড়া **৳১০** (প্রতি সিট) এবং একক রিকশা ভাড়া **৳২০ - ৳৩০**। হাঁটার দূরত্ব মাত্র ৬-৮ মিনিট (৪৫০ মিটার)। দত্তপাড়ায় ৫০+ ছাত্র মেস রয়েছে (সিট ভাড়া ৳২,৫০০ - ৳৪,৫০০)।",
    action: { type: "tab", targetTab: "fares", label: "ভাড়ার তালিকা দেখুন" }
  },
  {
    keywords: ["chandgaon", "changaon", "চান্দগাঁও", "চানগাঁও", "মেস"],
    title: "চান্দগাঁও আবাসিক এলাকা ও ভাড়া",
    answer: "ক্যাম্পাস বাস টার্মিনালের পাশ দিয়ে **চান্দগাঁও মোড়ে** যাওয়া যায়। শেয়ার্ড অটো ভাড়া **৳১০**, রিকশা **৳২০ - ৳২৫**, হাঁটার দূরত্ব ৭-৯ মিনিট। চান্দগাঁও শান্ত নিরিবিলি মেস এলাকার জন্য পরিচিত।",
    action: { type: "navigate", targetId: "chandgaon_mor", label: "চান্দগাঁও ম্যাপে দেখুন" }
  },
  {
    keywords: ["khagan", "খাগান", "কাঁচাবাজার", "বাজার"],
    title: "খাগান বাজার ও মেস পল্লী",
    answer: "ক্যাম্পাস থেকে **খাগান বাজারে** অটো ভাড়া **৳১৫**, রিকশা **৳৩৫ - ৳৪০**। এখানে বড় বাজার, সুপারশপ, এটিএম বুথ এবং শাপলা/পদ্মা ছাত্র মেস রয়েছে।",
    action: { type: "navigate", targetId: "khagan_bazar", label: "খাগান বাজার ম্যাপে দেখুন" }
  },
  {
    keywords: ["bus", "বাস", "মিরপুর", "mirpur", "উত্তরা", "uttara", "ধানমন্ডি", "dhanmondi", "সাভার", "savar", "শিডিউল", "schedule"],
    title: "DIU বাস শিডিউল",
    answer: "ডিআইইউ নিজস্ব ৪৫+ বাস প্রতিদিন ঢাকা ও আশেপাশের ৮টি রুটে চলাচল করে (উত্তরা, মিরপুর, ধানমন্ডি, গাজীপুর, সাভার, ইসিবি ইত্যাদি)। ক্যাম্পাস থেকে দুপুরে ছাড়ার প্রধান সময়: **১:৩০ PM, ৩:৩০ PM, ৪:৩০ PM এবং ৫:৪৫ PM**। স্টুডেন্ট আইডি কার্ড আবশ্যক।",
    action: { type: "tab", targetTab: "buses", label: "সম্পূর্ণ বাস শিডিউল দেখুন" }
  },
  {
    keywords: ["medical", "ডাক্তার", "মেডিকেল", "অ্যাম্বুলেন্স", "জরুরি", "emergency", "অসুস্থ", "security", "নিরাপত্তা", "প্রক্টর", "proctor"],
    title: "ইমার্জেন্সি হটলাইন ও মেডিকেল",
    answer: "ক্যাম্পাসে ২৪/৭ মেডিকেল সেন্টার ও ফ্রি অ্যাম্বুলেন্স সেবা চালু আছে।\n🚑 **মেডিকেল সেন্টার:** 01847-140120\n👮 **সিকিউরিটি রুম:** 01811-458850\n⚖️ **প্রক্টর অফিস:** 01847-140011\n🚌 **পরিবহন সেকশন:** 01847-140066",
    action: { type: "modal", modalId: "emergency-modal", label: "হটলাইন তালিকা খুলুন" }
  },
  {
    keywords: ["lake", "লেক", "ব্রিজ", "আড্ডা", "ঘোরাঘুরি"],
    title: "DIU Lake & Eco Walkway",
    answer: "ক্যাম্পাসের মনোরম **ডিআইইউ লেক ও কাঠের ব্রিজ** ক্যাফেটেরিয়ার পূর্ব পাশে অবস্থিত। ছাত্রছাত্রীদের প্রিয় আড্ডা ও প্রাকৃতিক পরিবেশের স্থান।",
    action: { type: "navigate", targetId: "diu_lake", label: "লেক ও ব্রিজ ম্যাপে দেখুন" }
  }
];

class DiuAiAssistant {
  constructor() {
    this.history = [];
  }

  ask(question) {
    const q = question.toLowerCase().trim();
    if (!q) return null;

    // Search best matching answer
    let bestMatch = null;
    let maxScore = 0;

    for (const item of DIU_AI_KNOWLEDGE) {
      let score = 0;
      for (const kw of item.keywords) {
        if (q.includes(kw)) {
          score += kw.length;
        }
      }
      if (score > maxScore) {
        maxScore = score;
        bestMatch = item;
      }
    }

    if (bestMatch && maxScore > 0) {
      return {
        found: true,
        title: bestMatch.title,
        answer: bestMatch.answer,
        action: bestMatch.action
      };
    }

    // Default intelligent fallback
    return {
      found: false,
      title: "DIU Smart Assistant",
      answer: "আপনার প্রশ্নটি ঠিকমতো বুঝতে পারিনি। আপনি ক্যাম্পাসের যেকোনো বিল্ডিং (যেমন: 'CSE ল্যাব কোথায়?'), বাস শিডিউল ('মিরপুরের বাস কখন?'), ভাড়া ('দত্তপাড়া যেতে কত টাকা?') বা ইমার্জেন্সি বিষয়ে জানতে চাইতে পারেন।",
      action: { type: "tab", targetTab: "navigator", label: "ক্যাম্পাস ম্যাপে খুঁজুন" }
    };
  }
}

window.DiuAiAssistant = DiuAiAssistant;
