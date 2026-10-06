# 🧭 DIU Smart Campus & Surrounding Area Navigator

<div align="center">

![DIU Smart Campus Navigator Banner](https://img.shields.io/badge/DIU-Smart%20Campus%20Navigator-00f59b?style=for-the-badge&logo=google-maps&logoColor=black)

**An Interactive 2D Live GPS & Realistic 3D Architectural Navigator for Daffodil Smart City & Student Residential Hubs**

[![Three.js](https://img.shields.io/badge/Three.js-r128-black?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org/)
[![Leaflet.js](https://img.shields.io/badge/Leaflet-1.9.4-199900?style=flat-square&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Algorithm](https://img.shields.io/badge/Pathfinding-Dijkstra%20Graph-blue?style=flat-square&logo=diagram-next)](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm)
[![Design](https://img.shields.io/badge/Theme-Obsidian%20%26%20Cyber%20Emerald-00f59b?style=flat-square)](https://github.com)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20PWA%20Ready-orange?style=flat-square&logo=google-chrome&logoColor=white)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

<p align="center">
  <a href="https://github.com/topics/campus-navigator"><img src="https://img.shields.io/badge/topic-campus--navigator-00f59b?style=flat-square" alt="campus-navigator" /></a>
  <a href="https://github.com/topics/threejs"><img src="https://img.shields.io/badge/topic-three.js-000000?style=flat-square&logo=three.js&logoColor=white" alt="threejs" /></a>
  <a href="https://github.com/topics/leaflet"><img src="https://img.shields.io/badge/topic-leaflet-199900?style=flat-square&logo=leaflet&logoColor=white" alt="leaflet" /></a>
  <a href="https://github.com/topics/dijkstra-algorithm"><img src="https://img.shields.io/badge/topic-dijkstra--algorithm-0284c7?style=flat-square" alt="dijkstra-algorithm" /></a>
  <a href="https://github.com/topics/smart-city"><img src="https://img.shields.io/badge/topic-smart--city-8b5cf6?style=flat-square" alt="smart-city" /></a>
  <a href="https://github.com/topics/pathfinding"><img src="https://img.shields.io/badge/topic-pathfinding-f59e0b?style=flat-square" alt="pathfinding" /></a>
</p>

[Features](#-key-features) • [Architectural 3D Model](#-realistic-3d-campus-architecture) • [Algorithms](#-dijkstra-dual-mode-engine) • [Roadmap](#-1-month-release-roadmap) • [Quickstart](#-quickstart--usage) • [Author](#-author)

</div>

---

## 📌 Problem Statement & Overview

**Daffodil International University (DIU)** at **Daffodil Smart City (DSC), Ashulia, Savar** spans across 150+ lush green acres with multi-story academic buildings, sprawling sports grounds, an eco-lake, and numerous surrounding student residential mess settlements (**Khagan, Dattapara, Changaon, Sadhupara, Kumkumari, and Model Town**).

New students (freshers), visitors, and day-scholars frequently face several challenges:
1. **Finding Buildings & Laboratories:** Navigating between Administrative wings, CSE labs in AB-1, engineering workshops in AB-2, or the Central Library.
2. **Surrounding Student Mess Areas:** Locating student hostels and bachelor accommodations scattered through Khagan and Dattapara alleyways.
3. **Transport & Rickshaw Fare Transparency:** Knowing whether a destination is walkable via shortcuts or requires a rickshaw on paved roads, and avoiding overpaying fares.
4. **Emergency Campus Response:** Instant access to DIU 24/7 Medical Ambulance, Security, and Proctor hotlines.

**DIU Smart Campus Navigator** solves this with a **zero-dependency, dual-engine web application** combining a high-fidelity **Three.js 3D isometric architectural campus hologram** with an interactive **Leaflet.js 2D live GPS routing map**.

---

## 🌟 Key Features

### 1. 🪐 Realistic 3D Campus Architecture (Three.js)
* **Procedural Landmarks:** Modeled accurately using real Google Maps satellite imagery and campus photographs.
* **Knowledge Tower (AB-4):** 14-story flagship glass skyscraper with individual floor plates, structural green accent ribbons, cantilevered entrance canopy, rooftop communications dish, and an animated rotating laser sky-beacon.
* **Academic Building 1 (AB-1, CSE & Software):** Realistic red-brick and concrete facade with ribbon windows and a landscaped **inner central courtyard**.
* **Academic Building 2 & 3 (AB-2 & AB-3):** Multi-wing engineering complexes connected by an **elevated glass skybridge**.
* **DIU Central Mosque:** Raised marble plinth, arched Iwan entrance, ribbed golden dome, and an authentic **40-meter multi-stage minaret** with emerald conical spire.
* **DIU Lake & Wooden Footbridge:** Shimmering reflective water surface with wave motion, weeping willows, and the iconic **arched timber pedestrian bridge** spanning across the water with lantern posts.
* **DIU Sports Arena:** Lush green cricket/football pitch, **400-meter terracotta red athletics running track**, spectator grandstand, and 4 floodlight towers.
* **☀️ Day / 🌙 Night Dynamic Lighting:** Switch between bright sunny daytime atmosphere and glowing cyber-emerald night mode with illuminated windows, streetlights, and bridge lanterns.

### 2. 🗺️ 2D Interactive GPS Routing (Leaflet.js)
* **CartoDB Dark Matter Obsidian Theme:** High-contrast, eye-friendly cyber-green dark UI.
* **Animated Marching Dash Polylines:** Real-time visual route guidance with glowing trace effects.
* **Custom Pulsing SVG Markers:** Categorized by Academic, Messes, Food Courts, Gates, and Medical facilities.
* **Rich Info Popups:** Bilingual descriptions (English & Bengali) with one-click **"Start Here"** and **"Go Here"** navigation triggers.

### 3. 🧠 Dual-Mode Dijkstra Shortest Path Engine (`dijkstra.js`)
* **🚶 Walking Mode:** Prioritizes speed and accessibility, allowing passage through pedestrian walkways, lake footpaths, and student mess shortcut alleys (*e.g., Khagan Mess Alley to AB-1*).
* **🛺 Rickshaw Mode:** Restricts navigation strictly to paved vehicular roads and calculates realistic **Rickshaw Fare in BDT (৳)** and estimated travel duration.
* **Turn-by-Turn Bilingual Guidance:** Complete step-by-step directions with distances, landmark cues, and Bengali explanations.

### 4. ⚡ Student Quick Trips & Emergency Hotline
* **1-Click Popular Routes:** Instant routing between frequent student hubs (e.g., *Khagan Mess ➔ CSE Lab*, *Dattapara ➔ Central Cafeteria*).
* **Campus Emergency Modal:** Click-to-call direct hotlines for DIU Medical Center (24/7 Ambulance), Security Control Room, Proctor Office, and Transport Bus Fleet.

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    User Interface Layer                      │
│   [ 🗺️ 2D Live GPS Map ]      [ 🪐 3D Cyber Campus Hologram ] │
│   [ Bilingual HUD Card ]      [ Day/Night Lighting Switcher ] │
└───────────────────────┬──────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────────┐
│                  Application Controller (app.js)             │
│  - Leaflet.js Map Controller        - Mode Switcher (Walk/🛺)│
│  - Category Filter Pipeline         - Camera Angle Presets   │
└───────────────┬───────────────────────────────┬──────────────┘
                │                               │
                ▼                               ▼
┌───────────────────────────────┐ ┌────────────────────────────┐
│   Dijkstra Graph Engine       │ │   3D Architectural Engine  │
│       (dijkstra.js)           │ │     (three-campus.js)      │
│ - Bidirectional Adjacency     │ │ - Knowledge Tower & AB1-3  │
│ - Dual-Mode Edge Weighting    │ │ - Lake Arched Wooden Bridge│
│ - Fare Formula (BDT)          │ │ - Sports Track & Mosque    │
│ - Step-by-Step Instructions   │ │ - Animated 3D Laser Ribbon │
└───────────────┬───────────────┘ └────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────────────────────────┐
│                   Campus Geographic Dataset                  │
│                      (nodes-data.js)                         │
│  - 21 Calibrated GPS Nodes (DIU Core + Surrounding Hubs)     │
│  - 30+ Weighted Edges (Walkway, Paved Road, Shortcut)       │
└──────────────────────────────────────────────────────────────┘
```

---

## 🧮 Dijkstra Dual-Mode Engine

The campus pathfinding graph is represented as $G = (V, E)$, where $V$ denotes the set of geographic landmarks and $E$ represents connecting pathways.

### Rickshaw Fare Estimation Formula

$$\text{Fare (BDT)} = \begin{cases} 
15 & \text{if } d \le 500\text{ m} \\
\max\left(15, 15 + \left\lceil \frac{d - 400}{500} \right\rceil \times 10\right) & \text{if } d > 500\text{ m}
\end{cases}$$

Where:
* $d$ is total traversal distance in meters along paved vehicular roads.
* Shortcuts and interior walkways are strictly flagged as non-passable for rickshaws (`paved_road: false`).

---

## 📍 Geographic Nodes Covered

| Node ID | Landmark Name | Bengali Name | Category |
| :--- | :--- | :--- | :--- |
| `knowledge_tower` | Knowledge Tower (Admin / AB-4) | নলেজ টাওয়ার (অ্যাডমিন ভবন) | 🏛️ Academic |
| `ab1_building` | Academic Building 1 (CSE/SWE) | একাডেমিক ভবন ১ (সিএসই / সফটওয়্যার) | 🏛️ Academic |
| `ab2_building` | Academic Building 2 (EEE/Civil) | একাডেমিক ভবন ২ (ট্রিপল ই / টেক্সটাইল) | 🏛️ Academic |
| `ab3_building` | Academic Building 3 (BBA/Law) | একাডেমিক ভবন ৩ (বিজনেস / আইন) | 🏛️ Academic |
| `central_library` | DIU Central Library & Innovation Lab | সেন্ট্রাল লাইব্রেরি ও ইনোভেশন ল্যাব | 🏛️ Academic |
| `central_cafeteria` | Central Cafeteria (Charulata) | সেন্ট্রাল ক্যাফেটেরিয়া (চারুলতা) | 🍔 Food |
| `central_mosque` | DIU Central Mosque | ডিআইইউ কেন্দ্রীয় মসজিদ | 🕌 Facility |
| `diu_lake` | DIU Lake & Eco Walkway | ডিআইইউ লেক ও গ্রিন ওয়াকওয়ে | 🌊 Facility |
| `sports_ground` | DIU Sports Arena & Stadium | সেন্ট্রাল প্লে-গ্রাউন্ড ও স্পোর্টস এরিনা | 🏃 Facility |
| `diu_main_gate` | DIU Main Entrance Gate | ডিআইইউ মেইন গেট | 🚪 Entrance |
| `transport_terminal`| Campus Bus Terminal | বিশ্ববিদ্যালয় বাস টার্মিনাল | 🚌 Transport |
| `diu_medical` | DIU Medical Center & Pharmacy | ডিআইইউ মেডিকেল সেন্টার | 🏥 Medical |
| `dattapara_junction`| Dattapara Student Hub & Market | দত্তপাড়া স্টুডেন্ট হাব ও বাজার | 🏘️ Area |
| `dattapara_mess_lane`| Dattapara Student Mess Cluster | দত্তপাড়া মেস এলাকা (ছাত্রাবাস) | 🏠 Mess |
| `khagan_bazar` | Khagan Bazar & Bus Stand | খাগান বাজার ও বাস স্ট্যান্ড | 🏘️ Area |
| `khagan_student_mess`| Khagan Mess Lane (Shapla & Padma)| খাগান মেস পল্লী (ছাত্রাবাস জোন) | 🏠 Mess |
| `changaon_hub` | Changaon Residential Intersection | চানগাঁও আবাসিক মোড় | 🏘️ Area |
| `changaon_mess_lane`| Changaon Student Hostels | চানগাঁও মেস ও হোস্টেল | 🏠 Mess |
| `sadhupara_shortcut`| Sadhupara Shortcut Entry Point | সাধুপাড়া শর্টকাট গলি | 🚶 Shortcut |
| `model_town_gate` | Daffodil Model Town Main Gate | ড্যাফোডিল মডেল টাউন গেট | 🏘️ Area |
| `kumkumari_junction`| Kumkumari Highway Junction | কুমকুমারী বাস স্ট্যান্ড ও হাইওয়ে মোড় | 🛣️ Area |

---

## 🚀 1-Month Release Roadmap

```
Week 1: Architecture Polish & PWA Integration
 ├── Refine 3D textures, tree foliage, and procedural building details
 └── Add manifest.json & service-worker.js for instant mobile app installation

Week 2: Real-time Geolocation ("Locate Me")
 ├── Add HTML5 Geolocation API integration
 └── Render animated user position beacon with heading arrow

Week 3: Indoor Building & Floor-Level Routing
 ├── Implement floor switcher (Floor 1 to Floor 10)
 └── Map laboratory room numbers (CSE Labs 601-615, VC Office, Auditoriums)

Week 4: Mobile Android Packaging & DIU Campus Launch
 ├── Bundle into Android APK using Capacitor
 └── Present to DIU Innovation Lab & publish open-source release
```

---

## 💻 Quickstart & Usage

This project is built with **zero external compilation dependencies** (no Node.js or build steps required). It runs directly in any modern web browser.

### Option 1: Direct Run (Local Machine)
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/diu-campus-navigator.git
   ```
2. Navigate into the directory:
   ```bash
   cd diu-campus-navigator
   ```
3. Open `index.html` in Google Chrome, Microsoft Edge, or Mozilla Firefox:
   * **Windows:** Double-click `index.html` or run:
     ```powershell
     Start-Process index.html
     ```

### Option 2: Run with Local HTTP Server
```bash
# Using Python 3 (Optional)
python -m http.server 8080

# Using Node http-server (Optional)
npx http-server -p 8080
```
Then visit `http://localhost:8080` in your browser.

---

## 📁 File Structure

```
diu-campus-navigator/
├── index.html        # Main HTML5 shell, dual-viewport structure, and HUD UI
├── styles.css        # Cyber-emerald obsidian design system + Day/Night styling
├── nodes-data.js     # 21 geographic nodes + 30+ weighted road graph edges
├── dijkstra.js       # Shortest path graph algorithm (Walking vs Rickshaw + Fare)
├── three-campus.js   # Realistic 3D architectural campus model (Three.js)
├── app.js            # Leaflet map controller, routing synchronization & events
└── README.md         # Comprehensive project documentation & roadmap
```

---

## 👨‍💻 Author

**Md Rakibul Islam (Baadal)**  
*Department of Computer Science & Engineering (CSE)*  
*Daffodil International University (DIU), Dhaka, Bangladesh*  

* Portfolio: [Portfolio Live Link](https://baadal-portfolio.pages.dev)
* GitHub: [@your-github-username](https://github.com)
* LinkedIn: [Md Rakibul Islam](https://linkedin.com)

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and contribute to the growth of Daffodil Smart City open-source initiatives!
