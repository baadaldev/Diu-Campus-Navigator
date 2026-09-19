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
