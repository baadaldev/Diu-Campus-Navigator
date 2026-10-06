/**
 * DIU Smart Campus & Surrounding Area Navigator - All-in-One Controller
 * Coordinates:
 * 1. Multi-Module Tab Navigation (Navigator, Bus Fleet, Fare Matrix, Directory)
 * 2. Leaflet 2D GPS Map with Satellite View Toggle
 * 3. Three.js 3D Interactive World with Area Focus Teleports
 * 4. Dijkstra Shortest-Path Navigation Engine
 * 5. DIU Student Bus Fleet Timetable & Stoppage Search
 * 6. Transport Fare Matrix & Interactive Auto/Rickshaw Calculator
 * 7. Surrounding Area & Student Mess Directory (Dattapara, Chandgaon, Khagan)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global Application State
  const state = {
    activeTab: 'navigator', // 'navigator' | 'buses' | 'fares' | 'directory'
    activeView: '2d',       // '2d' | '3d'
    travelMode: 'walking',  // 'walking' | 'rickshaw'
    isSatellite: false,
    selectedCategory: 'all',
    currentRoute: null,
    originId: 'khagan_student_mess',
    destinationId: 'ab1_building',
    busShift: 'morning',    // 'morning' | 'return'
    busSearchQuery: '',
    dirFilter: 'all'
  };

  // 1. Initialize Dijkstra Graph Engine
  const graph = new window.CampusGraph(CAMPUS_NODES, CAMPUS_EDGES);

  // 2. Initialize Leaflet 2D Map
  const map = L.map('map-2d', {
    zoomControl: false,
    minZoom: 14,
    maxZoom: 19
  }).setView([23.8778, 90.3206], 16);

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  // Base Map Layers (Dark Matter vs High-Res Satellite)
  const darkTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 20
  });

  const satelliteTileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 19
  });

  // Start with Dark Matter
  darkTileLayer.addTo(map);

  const markersLayer = L.layerGroup().addTo(map);
  const routePolylineGroup = L.layerGroup().addTo(map);

  // 3. Initialize Three.js 3D Campus World
  let campus3D = null;
  const canvas3DContainer = document.getElementById('canvas-3d-container');
  if (window.Campus3DViewer) {
    campus3D = new window.Campus3DViewer('canvas-3d-container', (selectedNodeId) => {
      handle3DNodeSelection(selectedNodeId);
    });
  }

  // 4. UI Elements
  const navTabBtns = document.querySelectorAll('.nav-tab-btn');
  const moduleViews = document.querySelectorAll('.module-view');
  const originSelect = document.getElementById('origin-select');
  const destSelect = document.getElementById('destination-select');
  const swapBtn = document.getElementById('swap-route-btn');
  const findRouteBtn = document.getElementById('find-route-btn');
  const modeCards = document.querySelectorAll('.mode-card');
  const viewBtns = document.querySelectorAll('.view-btn');
  const toggleSatBtn = document.getElementById('toggle-satellite-btn');
  const routeSummaryCard = document.getElementById('route-summary-card');
  const stepsToggleBtn = document.getElementById('steps-toggle-btn');
  const stepsContainer = document.getElementById('steps-container');
  const emergencyModal = document.getElementById('emergency-modal');
  const openEmergencyBtn = document.getElementById('open-emergency-btn');
  const closeEmergencyBtn = document.getElementById('close-emergency-btn');

  // Bus Fleet Elements
  const busRoutesGrid = document.getElementById('bus-routes-grid');
  const busSearchInput = document.getElementById('bus-search-input');
  const shiftBtns = document.querySelectorAll('.shift-btn');

  // Fare Guide Elements
  const fareOriginSelect = document.getElementById('fare-origin-select');
  const fareDestSelect = document.getElementById('fare-dest-select');
  const fareCalcResult = document.getElementById('fare-calc-result');
  const fareTableBody = document.getElementById('fare-table-body');

  // Directory Elements
  const dirFilterBtns = document.querySelectorAll('.dir-filter-btn');
  const directoryGrid = document.getElementById('directory-grid');

  // ================= INITIAL LOAD =================
  populateLocationSelectors();
  renderMarkers();
  calculateAndDisplayRoute();
  renderBusFleet();
  initFareModule();
  renderDirectory();
  setupEventListeners();

  // ================= 1. TAB NAVIGATION CONTROLLER =================
  navTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;
      state.activeTab = targetTab;

      navTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      moduleViews.forEach(v => {
        v.classList.remove('active');
        if (v.id === `view-${targetTab}`) {
          v.classList.add('active');
        }
      });

      if (targetTab === 'navigator') {
        setTimeout(() => {
          map.invalidateSize();
          if (state.activeView === '3d' && campus3D) {
            campus3D.onWindowResize();
          }
        }, 100);
      }
    });
  });

  // ================= 2. POPULATE LOCATION SELECTORS =================
  function populateLocationSelectors() {
    if (!originSelect || !destSelect) return;

    const coreLandmarks = CAMPUS_NODES.filter(n => ['building', 'facility', 'food', 'entrance', 'medical', 'transport'].includes(n.category));
    const surroundingHubs = CAMPUS_NODES.filter(n => ['area', 'mess'].includes(n.category));

    const generateOptions = (nodes) => {
      return nodes.map(n => `<option value="${n.id}">${n.name} (${n.bengaliName})</option>`).join('');
    };

    const optHTML = `
      <optgroup label="── DIU Core Campus Buildings ──">
        ${generateOptions(coreLandmarks)}
      </optgroup>
      <optgroup label="── Student Mess & Surrounding Hubs ──">
        ${generateOptions(surroundingHubs)}
      </optgroup>
    `;

    originSelect.innerHTML = optHTML;
    destSelect.innerHTML = optHTML;

    originSelect.value = state.originId;
    destSelect.value = state.destinationId;
  }

  // ================= 3. RENDER 2D MAP MARKERS =================
  function renderMarkers(categoryFilter = 'all') {
    markersLayer.clearLayers();

    CAMPUS_NODES.forEach(node => {
      if (categoryFilter !== 'all' && node.category !== categoryFilter) {
        return;
      }

      const iconHtml = `
        <div class="custom-pulsing-marker marker-${node.category}">
          <div class="marker-pulse"></div>
          <div class="marker-inner">
            <i class="${node.icon}"></i>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-leaflet-pin',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18]
      });

      const marker = L.marker([node.lat, node.lng], { icon: customIcon });

      const popupHtml = `
        <div class="map-popup-card">
          <h3>${node.name}</h3>
          <div class="popup-bn">${node.bengaliName}</div>
          <p>${node.desc}</p>
          <div class="popup-actions">
            <button class="popup-btn set-origin-btn" data-id="${node.id}">
              <i class="fa-solid fa-play"></i> Start Here
            </button>
            <button class="popup-btn set-dest-btn" data-id="${node.id}">
              <i class="fa-solid fa-location-dot"></i> Go Here
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        setTimeout(() => {
          const startBtn = document.querySelector(`.set-origin-btn[data-id="${node.id}"]`);
          const endBtn = document.querySelector(`.set-dest-btn[data-id="${node.id}"]`);

          if (startBtn) {
            startBtn.addEventListener('click', () => {
              originSelect.value = node.id;
              map.closePopup();
              calculateAndDisplayRoute();
            });
          }
          if (endBtn) {
            endBtn.addEventListener('click', () => {
              destSelect.value = node.id;
              map.closePopup();
              calculateAndDisplayRoute();
            });
          }
        }, 50);
      });

      markersLayer.addLayer(marker);
    });
  }

  // ================= 4. ROUTE CALCULATION & DISPLAY =================
  function calculateAndDisplayRoute() {
    const fromId = originSelect.value;
    const toId = destSelect.value;

    if (!fromId || !toId || fromId === toId) {
      clearRouteDisplay();
      return;
    }

    const result = graph.findShortestPath(fromId, toId, state.travelMode);
    state.currentRoute = result;

    if (!result) {
      alert("No navigable path found between these two locations.");
      clearRouteDisplay();
      return;
    }

    // Update HUD Stats
    document.getElementById('hud-distance').textContent = `${result.totalDistance} m`;
    document.getElementById('hud-walk-time').textContent = `${result.walkTimeMin} min`;

    const rickshawItem = document.getElementById('hud-rickshaw-time');
    const farePill = document.getElementById('hud-fare-badge');

    if (result.rickshawPossible) {
      rickshawItem.textContent = `${result.rickshawTimeMin} min`;
      farePill.style.display = 'inline-flex';
      farePill.innerHTML = `<i class="fa-solid fa-ticket"></i> Rickshaw Fare: ৳${result.estimatedFareBDT} BDT`;
    } else {
      rickshawItem.textContent = 'Walk Only';
      farePill.style.display = 'none';
    }

    renderTurnByTurnDirections(result.directions);

    // Draw Route Polyline on 2D Map
    routePolylineGroup.clearLayers();

    const latlngs = result.path.map(n => [n.lat, n.lng]);
    const routeGlow = L.polyline(latlngs, {
      color: '#00f59b',
      weight: 8,
      opacity: 0.35,
      lineCap: 'round',
      lineJoin: 'round'
    });
    const routeLine = L.polyline(latlngs, {
      color: '#00f59b',
      weight: 4,
      opacity: 1,
      dashArray: state.travelMode === 'walking' ? '8, 8' : null,
      lineCap: 'round',
      lineJoin: 'round'
    });

    routePolylineGroup.addLayer(routeGlow);
    routePolylineGroup.addLayer(routeLine);

    map.fitBounds(routeLine.getBounds(), { padding: [50, 50], maxZoom: 18 });

    // Sync 3D Route
    if (campus3D) {
      campus3D.highlightRoute(result.path);
    }
  }

  function renderTurnByTurnDirections(directions) {
    const list = document.getElementById('steps-list');
    if (!list) return;

    list.innerHTML = directions.map(d => `
      <div class="step-card">
        <div class="step-num">${d.step}</div>
        <div class="step-text">
          <strong>${d.instruction}</strong>
          ${d.detail ? `<span>${d.detail}</span>` : ''}
        </div>
      </div>
    `).join('');
  }

  function clearRouteDisplay() {
    routePolylineGroup.clearLayers();
    if (campus3D) campus3D.highlightRoute(null);
    document.getElementById('hud-distance').textContent = '0 m';
    document.getElementById('hud-walk-time').textContent = '0 min';
    document.getElementById('hud-rickshaw-time').textContent = '0 min';
    document.getElementById('hud-fare-badge').style.display = 'none';
    document.getElementById('steps-list').innerHTML = '';
  }

  function handle3DNodeSelection(nodeId) {
    if (!originSelect.value || originSelect.value === nodeId) {
      originSelect.value = nodeId;
    } else {
      destSelect.value = nodeId;
    }
    calculateAndDisplayRoute();
  }

  // ================= 5. MODULE: BUS FLEET & SCHEDULES =================
  function renderBusFleet() {
    if (!busRoutesGrid || !window.DIU_BUS_DATA) return;

    const data = window.DIU_BUS_DATA;
    const query = state.busSearchQuery.toLowerCase();
    const isMorning = state.busShift === 'morning';

    const filteredRoutes = data.routes.filter(r => {
      if (!query) return true;
      const matchName = r.name.toLowerCase().includes(query) || r.bengaliName.toLowerCase().includes(query);
      const matchStop = r.stoppages.some(s => s.toLowerCase().includes(query));
      return matchName || matchStop;
    });

    if (filteredRoutes.length === 0) {
      busRoutesGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
          <i class="fa-solid fa-bus-simple" style="font-size: 36px; margin-bottom: 12px; display: block;"></i>
          No bus routes found matching "${state.busSearchQuery}". Try searching for "Uttara", "Mirpur", or "Savar".
        </div>
      `;
      return;
    }

    busRoutesGrid.innerHTML = filteredRoutes.map(r => {
      const schedule = isMorning ? r.morningSchedule : r.returnSchedule;
      const badgeText = isMorning ? "Morning Trips" : "Afternoon / Return";

      return `
        <div class="bus-route-card" style="border-top: 3px solid ${r.color};">
          <div class="route-card-header">
            <div class="route-name-box">
              <h3><i class="${r.icon}" style="color: ${r.color}; margin-right: 8px;"></i>${r.name}</h3>
              <div class="bengali-title">${r.bengaliName}</div>
            </div>
            <div class="route-badge-code" style="color: ${r.color}; border-color: ${r.color}50;">
              ${r.code}
            </div>
          </div>

          <div class="route-meta-row">
            <span><i class="fa-solid fa-clock"></i> ${r.avgDuration}</span>
            <span><i class="fa-solid fa-van-shuttle"></i> ${r.busesAssigned} Buses</span>
            <span style="color: var(--emerald-neon);"><i class="fa-solid fa-circle-dot"></i> ${badgeText}</span>
          </div>

          <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); margin-bottom: 6px; text-transform: uppercase;">
            Key Stoppages:
          </div>
          <div class="route-stops-tags">
            ${r.stoppages.map(s => `<span class="stop-tag">${s}</span>`).join('')}
          </div>

          <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); margin-bottom: 6px; text-transform: uppercase;">
            ${isMorning ? "Departure Times (To Campus)" : "Departure Times (From Campus)"}:
          </div>
          <div class="timetable-list">
            ${schedule.map(t => `
              <div class="timetable-item">
                <span class="time-str">${t.time}</span>
                <span class="trip-notes">${t.startFrom} &bull; ${t.notes}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  // ================= 6. MODULE: FARE MATRIX & CALCULATOR =================
  function initFareModule() {
    if (!fareOriginSelect || !fareDestSelect || !window.DIU_FARE_DATA) return;

    const data = window.DIU_FARE_DATA;

    // Unique origins & destinations
    const origins = [...new Set(data.matrix.map(m => m.fromName))];
    const destinations = [...new Set(data.matrix.map(m => m.toName))];

    fareOriginSelect.innerHTML = origins.map(o => `<option value="${o}">${o}</option>`).join('');
    fareDestSelect.innerHTML = destinations.map(d => `<option value="${d}">${d}</option>`).join('');

    // Pre-select popular route
    fareOriginSelect.value = "DIU Main Gate / Campus";
    fareDestSelect.value = "Dattapara Main Mor (দত্তপাড়া মোড়)";

    updateFareCalculation();

    // Render Full Reference Table
    if (fareTableBody) {
      fareTableBody.innerHTML = data.matrix.map(row => `
        <tr>
          <td><strong>${row.fromName}</strong></td>
          <td><strong>${row.toName}</strong></td>
          <td>${row.distanceMeters} m</td>
          <td><span class="fare-tag">৳${row.sharedAutoFare}</span></td>
          <td><span class="fare-tag">৳${row.reservedRickshawFare}</span></td>
          <td>${row.walkTimeMin}</td>
          <td style="color: var(--text-muted); font-size: 12px;">${row.notes}</td>
        </tr>
      `).join('');
    }

    fareOriginSelect.addEventListener('change', updateFareCalculation);
    fareDestSelect.addEventListener('change', updateFareCalculation);
  }

  function updateFareCalculation() {
    if (!fareCalcResult || !window.DIU_FARE_DATA) return;

    const data = window.DIU_FARE_DATA;
    const fromVal = fareOriginSelect.value;
    const toVal = fareDestSelect.value;

    const match = data.matrix.find(m => 
      (m.fromName === fromVal && m.toName === toVal) ||
      (m.fromName === toVal && m.toName === fromVal)
    );

    if (match) {
      fareCalcResult.innerHTML = `
        <div class="fare-metric-item">
          <div class="f-val">৳${match.sharedAutoFare}</div>
          <div class="f-lbl">Shared Auto (ইজিবাইক প্রতি সিট)</div>
        </div>
        <div class="fare-metric-item">
          <div class="f-val">৳${match.reservedRickshawFare}</div>
          <div class="f-lbl">Reserved Rickshaw (একক রিকশা)</div>
        </div>
        <div class="fare-metric-item">
          <div class="f-val" style="color: var(--cyan-accent);">${match.walkTimeMin}</div>
          <div class="f-lbl">Walking Duration (${match.distanceMeters} m)</div>
        </div>
        <div class="fare-metric-item">
          <div class="f-val" style="font-size: 14px; font-weight: 600; color: var(--emerald-neon);">Travel Tip</div>
          <div class="f-lbl">${match.notes}</div>
        </div>
      `;
    } else {
      fareCalcResult.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 10px;">
          Standard student fare between these points is approx <strong>৳১০ - ৳১৫</strong> (Auto) or <strong>৳২৫ - ৳৩৫</strong> (Rickshaw).
        </div>
      `;
    }
  }

  // ================= 7. MODULE: AREA & STUDENT DIRECTORY =================
  const DIRECTORY_ITEMS = [
    {
      name: "Dattapara Student Hub & Market",
      area: "dattapara",
      areaName: "দত্তপাড়া",
      category: "Market & Services",
      desc: "Major student junction with 15+ photocopy stores, restaurants, pharmacy and grocery shops.",
      highlights: "Photocopy: ৳১.৫/page, Bhai Bhai Hotel, Easybike Stand",
      nodeId: "dattapara_junction"
    },
    {
      name: "Dattapara Student Mess Cluster (50+ Messes)",
      area: "dattapara",
      areaName: "দত্তপাড়া",
      category: "Student Housing",
      desc: "Top student bachelor residential zone. Average seat rent ৳২,৫00 - ৳৪,৫00 per month including meal options.",
      highlights: "Wi-Fi, 24/7 Water, Generator Backup, Meal System",
      nodeId: "dattapara_mess_lane"
    },
    {
      name: "Chandgaon Residential Hub (চান্দগাঁও মোড়)",
      area: "chandgaon",
      areaName: "চান্দগাঁও",
      category: "Housing & Dining",
      desc: "Quiet residential neighborhood 5 minutes from campus. Ideal for senior students preferring peaceful study environments.",
      highlights: "Seat rent: ৳২,২০০ - ৳৩,৮০০, Evening tea & snack stalls",
      nodeId: "chandgaon_mor"
    },
    {
      name: "Chandgaon Student Hostels & Bachelor Flats",
      area: "chandgaon",
      areaName: "চান্দগাঁও",
      category: "Student Housing",
      desc: "Modern multi-storied apartment buildings rented exclusively to DIU students.",
      highlights: "Quiet locality, safe neighborhood, affordable rates",
      nodeId: "chandgaon_mess_lane"
    },
    {
      name: "Khagan Central Bazar & Bus Terminal",
      area: "khagan",
      areaName: "খাগান",
      category: "Market & Transport",
      desc: "Largest commercial market center near campus. Fresh vegetable market, super shops, banks, ATMs & Savar bus connection.",
      highlights: "Dutch-Bangla ATM, Bkash agents, Supermarkets, Fruit stalls",
      nodeId: "khagan_bazar"
    },
    {
      name: "Khagan Student Mess Lane (Shapla / Padma)",
      area: "khagan",
      areaName: "খাগান",
      category: "Student Housing",
      desc: "Extensive student hostel corridor with high-capacity hostels for both male and female university students.",
      highlights: "High-speed broadband, attached bath, dining halls",
      nodeId: "khagan_student_mess"
    },
    {
      name: "Charulata Food Court & Student Canteen",
      area: "campus",
      areaName: "অন-ক্যাম্পাস",
      category: "Campus Dining",
      desc: "Central university cafeteria with breakfast, lunch dining halls, snacks, fresh juice & coffee bar.",
      highlights: "Subsidized lunch plates: ৳৫০ - ৳৮০, Air-conditioned seating",
      nodeId: "central_cafeteria"
    },
    {
      name: "DIU 24/7 Medical Center & Pharmacy",
      area: "campus",
      areaName: "অন-ক্যাম্পাস",
      category: "Emergency & Health",
      desc: "On-campus health center offering free doctor consultations, first aid, medicines and 24/7 emergency ambulance.",
      highlights: "Emergency Hotline: 01847-140120, Free checkup for students",
      nodeId: "diu_medical"
    }
  ];

  function renderDirectory() {
    if (!directoryGrid) return;

    const filter = state.dirFilter;
    const items = DIRECTORY_ITEMS.filter(item => {
      if (filter === 'all') return true;
      return item.area === filter;
    });

    directoryGrid.innerHTML = items.map(item => `
      <div class="dir-card">
        <div class="dir-card-header">
          <h4>${item.name}</h4>
          <span class="dir-area-badge">${item.areaName}</span>
        </div>
        <p>${item.desc}</p>
        <div style="font-size: 11px; color: var(--emerald-neon); margin-bottom: 12px; font-weight: 600;">
          <i class="fa-solid fa-star" style="margin-right: 4px;"></i> ${item.highlights}
        </div>
        <div class="dir-card-footer">
          <span><i class="fa-solid fa-tag"></i> ${item.category}</span>
          <button class="dir-nav-btn" data-node="${item.nodeId}">
            <i class="fa-solid fa-diamond-turn-right"></i> Navigate Here
          </button>
        </div>
      </div>
    `).join('');

    // Attach navigation trigger to buttons
    directoryGrid.querySelectorAll('.dir-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const nodeId = btn.dataset.node;
        // Switch to navigator tab and calculate route
        const navTab = document.querySelector('.nav-tab-btn[data-tab="navigator"]');
        if (navTab) navTab.click();
        destSelect.value = nodeId;
        calculateAndDisplayRoute();
      });
    });
  }

  // ================= 8. EVENT LISTENERS SETUP =================
  function setupEventListeners() {
    // Origin & Destination Select Changes
    if (originSelect) originSelect.addEventListener('change', () => calculateAndDisplayRoute());
    if (destSelect) destSelect.addEventListener('change', () => calculateAndDisplayRoute());

    // Swap Button
    if (swapBtn) {
      swapBtn.addEventListener('click', () => {
        const temp = originSelect.value;
        originSelect.value = destSelect.value;
        destSelect.value = temp;
        calculateAndDisplayRoute();
      });
    }

    // Find Route Button
    if (findRouteBtn) {
      findRouteBtn.addEventListener('click', () => calculateAndDisplayRoute());
    }

    // Travel Mode (Walking vs Rickshaw)
    modeCards.forEach(card => {
      card.addEventListener('click', () => {
        modeCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        state.travelMode = card.dataset.mode;
        calculateAndDisplayRoute();
      });
    });

    // 2D Map vs 3D Scene Viewport Switcher
    viewBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        viewBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const view = btn.dataset.view;
        state.activeView = view;

        const threeBar = document.getElementById('three-controls-bar');

        if (view === '3d') {
          canvas3DContainer.classList.add('active');
          if (threeBar) threeBar.style.display = 'flex';
          if (campus3D) {
            campus3D.onWindowResize();
            if (state.currentRoute) {
              campus3D.highlightRoute(state.currentRoute.path);
            }
          }
        } else {
          canvas3DContainer.classList.remove('active');
          if (threeBar) threeBar.style.display = 'none';
          map.invalidateSize();
        }
      });
    });

    // Toggle Real Satellite Imagery on 2D Map
    if (toggleSatBtn) {
      toggleSatBtn.addEventListener('click', () => {
        state.isSatellite = !state.isSatellite;
        if (state.isSatellite) {
          map.removeLayer(darkTileLayer);
          satelliteTileLayer.addTo(map);
          toggleSatBtn.classList.add('active');
          toggleSatBtn.innerHTML = `<i class="fa-solid fa-map"></i> <span>Dark Map</span>`;
        } else {
          map.removeLayer(satelliteTileLayer);
          darkTileLayer.addTo(map);
          toggleSatBtn.classList.remove('active');
          toggleSatBtn.innerHTML = `<i class="fa-solid fa-satellite"></i> <span>Satellite View</span>`;
        }
      });
    }

    // 3D Camera Focus Controls
    document.querySelectorAll('.cam-btn:not(#toggle-light-mode-btn)').forEach(btn => {
      btn.addEventListener('click', () => {
        const camMode = btn.dataset.cam;
        if (!campus3D || !camMode) return;

        if (camMode === 'auto') {
          const isRotating = campus3D.toggleAutoRotate();
          btn.classList.toggle('active', isRotating);
        } else {
          campus3D.resetCamera(camMode);
        }
      });
    });

    // 3D Day/Night Toggle
    const lightModeBtn = document.getElementById('toggle-light-mode-btn');
    if (lightModeBtn) {
      let isNight = false;
      lightModeBtn.addEventListener('click', () => {
        if (!campus3D) return;
        isNight = !isNight;
        campus3D.setLightingMode(isNight ? 'night' : 'day');
        lightModeBtn.innerHTML = isNight 
          ? `<i class="fa-solid fa-sun" style="color: #f59e0b;"></i><span>Day</span>` 
          : `<i class="fa-solid fa-moon"></i><span>Night</span>`;
        lightModeBtn.classList.toggle('active', isNight);
      });
    }

    // Category Filter Pills
    document.querySelectorAll('.cat-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.selectedCategory = pill.dataset.cat;
        renderMarkers(state.selectedCategory);
      });
    });

    // Preset Chips
    document.querySelectorAll('.preset-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        originSelect.value = chip.dataset.from;
        destSelect.value = chip.dataset.to;
        calculateAndDisplayRoute();
      });
    });

    // Turn-by-Turn Collapsible
    if (stepsToggleBtn && stepsContainer) {
      stepsToggleBtn.addEventListener('click', () => {
        const isOpen = stepsContainer.classList.toggle('open');
        stepsToggleBtn.querySelector('i.fa-chevron-down').style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
      });
    }

    // Bus Search & Shifts
    if (busSearchInput) {
      busSearchInput.addEventListener('input', (e) => {
        state.busSearchQuery = e.target.value.trim();
        renderBusFleet();
      });
    }

    shiftBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        shiftBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.busShift = btn.dataset.shift;
        renderBusFleet();
      });
    });

    // Directory Area Filters
    dirFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        dirFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.dirFilter = btn.dataset.filter;
        renderDirectory();
      });
    });

    // Emergency Modal
    if (openEmergencyBtn && emergencyModal) {
      openEmergencyBtn.addEventListener('click', () => emergencyModal.classList.add('active'));
    }
    if (closeEmergencyBtn && emergencyModal) {
      closeEmergencyBtn.addEventListener('click', () => emergencyModal.classList.remove('active'));
    }
    if (emergencyModal) {
      emergencyModal.addEventListener('click', (e) => {
        if (e.target === emergencyModal) emergencyModal.classList.remove('active');
      });
    }
  }
});
