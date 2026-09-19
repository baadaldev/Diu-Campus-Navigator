/**
 * DIU Smart Campus & Surrounding Area Navigator - Main Application Controller
 * Coordinates Leaflet 2D Map, Dijkstra Routing Engine, and Three.js 3D Campus Hologram.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    activeView: '2d', // '2d' | '3d'
    travelMode: 'walking', // 'walking' | 'rickshaw'
    selectedCategory: 'all',
    currentRoute: null,
    originId: 'khagan_student_mess',
    destinationId: 'ab1_building'
  };

  // 1. Initialize Dijkstra Graph Engine
  const graph = new window.CampusGraph(CAMPUS_NODES, CAMPUS_EDGES);

  // 2. Initialize Leaflet 2D Map
  const map = L.map('map-2d', {
    zoomControl: false,
    minZoom: 14,
    maxZoom: 19
  }).setView([23.8778, 90.3206], 16);

  // Add zoom control at bottom-right
  L.control.zoom({ position: 'bottomright' }).addTo(map);

  // Dark Matter tiles for cyber-obsidian aesthetic
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map);

  // Marker layer group
  const markersLayer = L.layerGroup().addTo(map);
  let routePolylineGroup = L.layerGroup().addTo(map);

  // 3. Initialize Three.js 3D Campus
  let campus3D = null;
  const canvas3DContainer = document.getElementById('canvas-3d-container');
  if (window.Campus3DViewer) {
    campus3D = new window.Campus3DViewer('canvas-3d-container', (selectedNodeId) => {
      handle3DNodeSelection(selectedNodeId);
    });
  }

  // 4. UI Elements
  const originSelect = document.getElementById('origin-select');
  const destSelect = document.getElementById('destination-select');
  const swapBtn = document.getElementById('swap-route-btn');
  const findRouteBtn = document.getElementById('find-route-btn');
  const modeCards = document.querySelectorAll('.mode-card');
  const viewBtns = document.querySelectorAll('.view-btn');
  const routeSummaryCard = document.getElementById('route-summary-card');
  const stepsToggleBtn = document.getElementById('steps-toggle-btn');
  const stepsContainer = document.getElementById('steps-container');
  const emergencyModal = document.getElementById('emergency-modal');
  const openEmergencyBtn = document.getElementById('open-emergency-btn');
  const closeEmergencyBtn = document.getElementById('close-emergency-btn');

  // Populate Origin & Destination Selectors
  populateLocationSelectors();

  // Render Leaflet Markers
  renderMarkers();

  // Setup Event Listeners
  setupEventListeners();

  // Run initial route calculation (Khagan to AB1)
  calculateAndDisplayRoute();

  // ================= POPULATE SELECTORS =================
  function populateLocationSelectors() {
    if (!originSelect || !destSelect) return;

    // Group nodes by category
    const campusLandmarks = CAMPUS_NODES.filter(n => ['building', 'facility', 'food', 'entrance', 'medical', 'transport'].includes(n.category));
    const surroundingHubs = CAMPUS_NODES.filter(n => ['mess', 'area'].includes(n.category));

    const generateOptions = (nodes) => {
      return nodes.map(n => `<option value="${n.id}">${n.name} (${n.bengaliName})</option>`).join('');
    };

    const optHTML = `
      <optgroup label="── DIU Campus Landmarks ──">
        ${generateOptions(campusLandmarks)}
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

  // ================= RENDER MAP MARKERS =================
  function renderMarkers(categoryFilter = 'all') {
    markersLayer.clearLayers();

    CAMPUS_NODES.forEach(node => {
      if (categoryFilter !== 'all' && node.category !== categoryFilter) {
        return;
      }

      // Create Custom Animated SVG / FontAwesome Icon Pin
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

      // Rich glassmorphic popup
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
        document.querySelectorAll('.set-origin-btn').forEach(b => {
          b.onclick = () => {
            originSelect.value = b.dataset.id;
            state.originId = b.dataset.id;
            calculateAndDisplayRoute();
            map.closePopup();
          };
        });
        document.querySelectorAll('.set-dest-btn').forEach(b => {
          b.onclick = () => {
            destSelect.value = b.dataset.id;
            state.destinationId = b.dataset.id;
            calculateAndDisplayRoute();
            map.closePopup();
          };
        });
      });

      markersLayer.addLayer(marker);
    });
  }

  // ================= ROUTE CALCULATION & DISPLAY =================
  function calculateAndDisplayRoute() {
    const originId = originSelect.value;
    const destId = destSelect.value;
    const mode = state.travelMode;

    if (!originId || !destId) return;

    const result = graph.findShortestPath(originId, destId, mode);
    if (!result) {
      alert("No paved rickshaw path found between these locations! Switched to walking mode.");
      state.travelMode = 'walking';
      updateModeButtons();
      calculateAndDisplayRoute();
      return;
    }

    state.currentRoute = result;

    // 1. Draw 2D Route Polyline on Leaflet
    routePolylineGroup.clearLayers();

    // Subtle dark outer glow
    const outerGlow = L.polyline(result.coordinates, {
      color: '#00f59b',
      weight: 8,
      opacity: 0.35,
      lineCap: 'round',
      lineJoin: 'round'
    });

    // Sharp animated inner neon line
    const innerLine = L.polyline(result.coordinates, {
      color: mode === 'rickshaw' ? '#38bdf8' : '#00f59b',
      weight: 4,
      opacity: 0.95,
      dashArray: mode === 'rickshaw' ? '8, 8' : null,
      lineCap: 'round',
      lineJoin: 'round'
    });

    routePolylineGroup.addLayer(outerGlow);
    routePolylineGroup.addLayer(innerLine);

    // Zoom map smoothly to encompass route
    if (result.coordinates.length > 1) {
      map.fitBounds(L.latLngBounds(result.coordinates), {
        padding: [60, 60],
        maxZoom: 18,
        animate: true,
        duration: 0.8
      });
    }

    // 2. Synchronize Route in 3D
    if (campus3D) {
      campus3D.highlightRoute(result.path);
    }

    // 3. Update Route Summary Card HUD
    displayRouteSummary(result);
  }

  function displayRouteSummary(result) {
    if (!routeSummaryCard) return;

    routeSummaryCard.classList.add('active');

    const distText = result.totalDistance >= 1000 
      ? `${(result.totalDistance / 1000).toFixed(2)} km` 
      : `${result.totalDistance} m`;

    document.getElementById('hud-distance').textContent = distText;
    document.getElementById('hud-walk-time').textContent = `~${result.walkTimeMin} min`;
    document.getElementById('hud-rickshaw-time').textContent = `~${result.rickshawTimeMin} min`;

    const fareBadge = document.getElementById('hud-fare-badge');
    if (fareBadge) {
      if (result.estimatedFareBDT > 0) {
        fareBadge.style.display = 'inline-flex';
        fareBadge.innerHTML = `<i class="fa-solid fa-ticket"></i> Rickshaw Fare: ৳${result.estimatedFareBDT} BDT`;
      } else {
        fareBadge.style.display = 'none';
      }
    }

    // Render Step-by-Step directions
    const stepsList = document.getElementById('steps-list');
    if (stepsList) {
      stepsList.innerHTML = result.steps.map(step => `
        <div class="step-card">
          <i class="${step.icon}"></i>
          <div class="step-text">
            <div class="bn-text">${step.bengaliInstruction}</div>
            <div class="en-text">${step.instruction}</div>
          </div>
        </div>
      `).join('');
    }
  }

  // ================= 3D NODE CLICK HANDLER =================
  function handle3DNodeSelection(nodeId) {
    const node = CAMPUS_NODES.find(n => n.id === nodeId);
    if (!node) return;

    // Toggle: if destination is different from node, set destination, else set origin
    if (destSelect.value !== nodeId) {
      destSelect.value = nodeId;
    } else {
      originSelect.value = nodeId;
    }
    calculateAndDisplayRoute();
  }

  // ================= EVENT LISTENERS =================
  function setupEventListeners() {
    // Calculate Route Button
    if (findRouteBtn) {
      findRouteBtn.addEventListener('click', () => {
        calculateAndDisplayRoute();
      });
    }

    // Select Changes
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

    // Travel Mode Switcher (Walking vs Rickshaw)
    modeCards.forEach(card => {
      card.addEventListener('click', () => {
        modeCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        state.travelMode = card.dataset.mode;
        calculateAndDisplayRoute();
      });
    });

    // 2D Map vs 3D Hologram Switcher
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

    // 3D Camera Controls
    document.querySelectorAll('.cam-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const camMode = btn.dataset.cam;
        if (!campus3D) return;

        if (camMode === 'auto') {
          const isRotating = campus3D.toggleAutoRotate();
          btn.classList.toggle('active', isRotating);
        } else {
          campus3D.resetCamera(camMode);
        }
      });
    });

    // Category Filter Pills
    document.querySelectorAll('.cat-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const cat = pill.dataset.cat;
        renderMarkers(cat);
      });
    });

    // Quick Preset Chips
    document.querySelectorAll('.preset-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        originSelect.value = chip.dataset.from;
        destSelect.value = chip.dataset.to;
        calculateAndDisplayRoute();
      });
    });

    // Step-by-Step Directions Toggle
    if (stepsToggleBtn && stepsContainer) {
      stepsToggleBtn.addEventListener('click', () => {
        const isOpen = stepsContainer.classList.toggle('open');
        stepsToggleBtn.querySelector('i.fa-chevron-down').style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
      });
    }

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

  function updateModeButtons() {
    modeCards.forEach(c => {
      c.classList.toggle('active', c.dataset.mode === state.travelMode);
    });
  }
});
