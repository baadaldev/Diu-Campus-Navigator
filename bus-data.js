/**
 * DIU Smart Campus Navigator - Official DIU Transport & Shuttle Bus Schedule
 * Daffodil International University (DIU), Ashulia Permanent Campus (DSC)
 * Fleet Information, Routes, Stoppages, Departure Times & Estimated Durations
 */

const DIU_BUS_DATA = {
  fleetSummary: {
    totalBuses: 45,
    fleetNames: [
      "Falguni (ফাল্গুনী)", "Torongo (তরঙ্গ)", "Shrabon (শ্রাবণ)", "Bijoy (বিজয়)", 
      "Protik (প্রতীক)", "Boishakhi (বৈশাখী)", "Meghla (মেঘলা)", "Podmo (পদ্ম)", 
      "Jamuna (যমুনা)", "Karnaphuli (কর্ণফুলী)", "Surma (সুরমা)", "Titas (তিতাস)"
    ],
    transportOffice: {
      location: "DIU Transport Terminal (Near Main Gate)",
      officer: "Transport Officer (In-Charge)",
      phone: "01847-140066",
      altPhone: "01847-140067",
      email: "transport@daffodilvarsity.edu.bd"
    },
    rules: [
      "Student ID Card or DIU Smart Transport Card is strictly required before boarding.",
      "Please arrive at stoppage at least 5-10 minutes prior to departure.",
      "Friday and Saturday operate on special weekend schedule.",
      "Buses depart sharp at scheduled times from DSC Bus Terminal."
    ]
  },

  routes: [
    {
      id: "route_uttara",
      name: "Uttara Route",
      bengaliName: "উত্তরা রুট",
      code: "UTR-01",
      color: "#3b82f6",
      icon: "fa-solid fa-plane-departure",
      avgDuration: "45 - 60 min",
      busesAssigned: 10,
      stoppages: [
        "House Building", "Azampur", "Rajlakshmi", "Jashimuddin", 
        "Airport", "Kawla", "Khilkhet", "Dour (Ashulia)", "Birulia", "DIU Campus"
      ],
      morningSchedule: [
        { trip: 1, time: "07:00 AM", startFrom: "House Building", notes: "Express Service" },
        { trip: 2, time: "07:15 AM", startFrom: "House Building", notes: "All Stoppages" },
        { trip: 3, time: "07:30 AM", startFrom: "House Building", notes: "Peak Student Hour" },
        { trip: 4, time: "07:45 AM", startFrom: "House Building", notes: "Via Airport & Birulia" },
        { trip: 5, time: "08:15 AM", startFrom: "House Building", notes: "Regular" },
        { trip: 6, time: "09:30 AM", startFrom: "House Building", notes: "Late Morning Shift" }
      ],
      returnSchedule: [
        { trip: 1, time: "01:30 PM", startFrom: "DSC Terminal", notes: "Mid-day return" },
        { trip: 2, time: "03:30 PM", startFrom: "DSC Terminal", notes: "Class end rush" },
        { trip: 3, time: "04:30 PM", startFrom: "DSC Terminal", notes: "Peak departure" },
        { trip: 4, time: "05:45 PM", startFrom: "DSC Terminal", notes: "Evening shift" },
        { trip: 5, time: "07:00 PM", startFrom: "DSC Terminal", notes: "Final night bus" }
      ]
    },

    {
      id: "route_mirpur",
      name: "Mirpur Route (Mirpur-10 & 1)",
      bengaliName: "মিরপুর রুট (১০ ও ১)",
      code: "MIR-02",
      color: "#10b981",
      icon: "fa-solid fa-city",
      avgDuration: "35 - 50 min",
      busesAssigned: 12,
      stoppages: [
        "Mirpur-10", "Mirpur-1", "Sony Cinema Hall", "Rainkhola", 
        "Mirpur Beribadh", "Birulia Bridge", "Dattapara", "DIU Campus"
      ],
      morningSchedule: [
        { trip: 1, time: "07:00 AM", startFrom: "Mirpur-10 (Golchokkor)", notes: "Express" },
        { trip: 2, time: "07:20 AM", startFrom: "Mirpur-10", notes: "Via Sony Hall & Beribadh" },
        { trip: 3, time: "07:35 AM", startFrom: "Mirpur-10", notes: "Double Decker Available" },
        { trip: 4, time: "07:50 AM", startFrom: "Mirpur-1", notes: "Direct from Mirpur-1" },
        { trip: 5, time: "08:15 AM", startFrom: "Mirpur-10", notes: "Peak student shift" },
        { trip: 6, time: "09:30 AM", startFrom: "Mirpur-10", notes: "Late shift" }
      ],
      returnSchedule: [
        { trip: 1, time: "01:30 PM", startFrom: "DSC Terminal", notes: "Regular" },
        { trip: 2, time: "03:30 PM", startFrom: "DSC Terminal", notes: "Popular slot" },
        { trip: 3, time: "04:30 PM", startFrom: "DSC Terminal", notes: "Double Decker Service" },
        { trip: 4, time: "05:45 PM", startFrom: "DSC Terminal", notes: "Full rush" },
        { trip: 5, time: "07:00 PM", startFrom: "DSC Terminal", notes: "Night bus" }
      ]
    },

    {
      id: "route_dhanmondi",
      name: "Dhanmondi / Sobhanbag Route",
      bengaliName: "ধানমন্ডি / সোবহানবাগ রুট",
      code: "DND-03",
      color: "#8b5cf6",
      icon: "fa-solid fa-graduation-cap",
      avgDuration: "60 - 75 min",
      busesAssigned: 8,
      stoppages: [
        "Dhanmondi 32", "Sobhanbag (Old Campus)", "Asad Gate", "Shyamoli", 
        "Kalyanpur", "Technical", "Gabtoli", "Beribadh", "DIU Campus"
      ],
      morningSchedule: [
        { trip: 1, time: "06:45 AM", startFrom: "Sobhanbag Old Campus", notes: "Early Bird Express" },
        { trip: 2, time: "07:15 AM", startFrom: "Dhanmondi 32", notes: "Via Shyamoli & Gabtoli" },
        { trip: 3, time: "07:45 AM", startFrom: "Sobhanbag", notes: "Regular route" },
        { trip: 4, time: "08:30 AM", startFrom: "Gabtoli", notes: "Short route from Gabtoli" }
      ],
      returnSchedule: [
        { trip: 1, time: "01:30 PM", startFrom: "DSC Terminal", notes: "Mid-day" },
        { trip: 2, time: "03:30 PM", startFrom: "DSC Terminal", notes: "Via Gabtoli-Shyamoli" },
        { trip: 3, time: "04:30 PM", startFrom: "DSC Terminal", notes: "Full route to Sobhanbag" },
        { trip: 4, time: "05:45 PM", startFrom: "DSC Terminal", notes: "Evening final" }
      ]
    },

    {
      id: "route_gazipur",
      name: "Gazipur & Tongi Route",
      bengaliName: "গাজীপুর ও টঙ্গী রুট",
      code: "GZP-04",
      color: "#f59e0b",
      icon: "fa-solid fa-industry",
      avgDuration: "50 - 65 min",
      busesAssigned: 6,
      stoppages: [
        "Gazipur Chourasta", "Board Bazar", "Gazipur Shibbari", "Tongi Station Road", 
        "Tongi College Gate", "Kamarpara", "Dour", "DIU Campus"
      ],
      morningSchedule: [
        { trip: 1, time: "06:45 AM", startFrom: "Gazipur Chourasta", notes: "Early start" },
        { trip: 2, time: "07:15 AM", startFrom: "Tongi College Gate", notes: "Via Kamarpara" },
        { trip: 3, time: "07:45 AM", startFrom: "Board Bazar", notes: "Direct to DSC" }
      ],
      returnSchedule: [
        { trip: 1, time: "01:30 PM", startFrom: "DSC Terminal", notes: "To Tongi & Gazipur" },
        { trip: 2, time: "04:30 PM", startFrom: "DSC Terminal", notes: "Main afternoon return" },
        { trip: 3, time: "05:45 PM", startFrom: "DSC Terminal", notes: "Final trip" }
      ]
    },

    {
      id: "route_savar",
      name: "Savar & Baipayl Route",
      bengaliName: "সাভার ও বাইপাইল রুট",
      code: "SVR-05",
      color: "#ec4899",
      icon: "fa-solid fa-tree",
      avgDuration: "25 - 40 min",
      busesAssigned: 5,
      stoppages: [
        "Baipayl", "Nabinagar", "C&B", "Radio Colony", 
        "Savar Thana Stand", "Gakulnagar", "Khagan", "DIU Campus"
      ],
      morningSchedule: [
        { trip: 1, time: "07:15 AM", startFrom: "Baipayl", notes: "Via Nabinagar & Savar" },
        { trip: 2, time: "07:45 AM", startFrom: "Savar Thana Stand", notes: "Express to Khagan/DSC" },
        { trip: 3, time: "08:30 AM", startFrom: "Savar Radio Colony", notes: "Short campus shuttle" }
      ],
      returnSchedule: [
        { trip: 1, time: "01:30 PM", startFrom: "DSC Terminal", notes: "Direct to Savar" },
        { trip: 2, time: "03:30 PM", startFrom: "DSC Terminal", notes: "To Baipayl" },
        { trip: 3, time: "04:30 PM", startFrom: "DSC Terminal", notes: "Via Radio Colony" },
        { trip: 4, time: "05:45 PM", startFrom: "DSC Terminal", notes: "Night return" }
      ]
    },

    {
      id: "route_ecbl",
      name: "ECBL / Mohakhali Route",
      bengaliName: "ইসিবি চত্বর ও মহাখালী রুট",
      code: "ECB-06",
      color: "#06b6d4",
      icon: "fa-solid fa-road",
      avgDuration: "50 - 60 min",
      busesAssigned: 4,
      stoppages: [
        "Mohakhali", "Kakoli", "Staff Quarter", "ECB Chattar", 
        "Mirpur DOHS", "Kalshi", "Beribadh", "DIU Campus"
      ],
      morningSchedule: [
        { trip: 1, time: "07:00 AM", startFrom: "Mohakhali", notes: "Via Kakoli & ECB" },
        { trip: 2, time: "07:30 AM", startFrom: "ECB Chattar", notes: "Direct via DOHS" }
      ],
      returnSchedule: [
        { trip: 1, time: "01:30 PM", startFrom: "DSC Terminal", notes: "To ECB & Mohakhali" },
        { trip: 2, time: "04:30 PM", startFrom: "DSC Terminal", notes: "Peak hour" },
        { trip: 3, time: "05:45 PM", startFrom: "DSC Terminal", notes: "Final return" }
      ]
    }
  ]
};

// Export to window
if (typeof window !== 'undefined') {
  window.DIU_BUS_DATA = DIU_BUS_DATA;
}
