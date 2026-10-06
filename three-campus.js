/**
 * DIU Smart Campus Navigator - Realistic 3D Campus Architectural Engine (Three.js)
 * High-fidelity architectural representation of Daffodil International University (Ashulia Campus - DSC)
 * Based on Google Maps satellite layout, campus photography, and architectural blueprints.
 * Features: Day/Night lighting, realistic glass facades, wooden lake footbridge, running track,
 * skybridge, detailed mess hubs (Khagan, Dattapara, Changaon, Model Town), and laser route animation.
 */

class Campus3DViewer {
  constructor(containerId, onNodeSelect) {
    this.container = document.getElementById(containerId);
    this.onNodeSelect = onNodeSelect;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.buildingMeshes = new Map();
    this.interactiveObjects = [];
    this.activeRouteLine = null;
    this.hoveredObject = null;
    this.isAutoRotating = false;
    this.lightingMode = 'day'; // 'day' | 'night'
    this.clock = new THREE.Clock();

    // Reusable Materials & Geometries Library
    this.materials = {};
    this.nightLights = []; // dynamic lights for night mode

    // Campus Geo Anchor (Knowledge Tower center: 23.8778 N, 90.3206 E)
    this.centerLat = 23.8778;
    this.centerLng = 90.3206;
    this.coordScale = 45000;

    this.init();
  }

  geoTo3D(lat, lng) {
    const x = (lng - this.centerLng) * this.coordScale;
    const z = -(lat - this.centerLat) * this.coordScale;
    return { x, z };
  }

  init() {
    if (!this.container) return;

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || (window.innerHeight - 64);

    // 1. Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xd6eaf8); // daytime soft sky
    this.scene.fog = new THREE.FogExp2(0xd6eaf8, 0.0012);

    // 2. Camera (Realistic Angled Aerial View)
    this.camera = new THREE.PerspectiveCamera(42, width / height, 1, 3500);
    this.camera.position.set(0, 360, 490);

    // 3. Renderer with high visual fidelity
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.container.appendChild(this.renderer.domElement);

    // 4. Orbit Controls
    if (window.THREE && THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.06;
      this.controls.maxPolarAngle = Math.PI / 2.05;
      this.controls.minDistance = 70;
      this.controls.maxDistance = 1400;
      this.controls.target.set(0, 0, 0);
    }

    // 5. Materials Cache
    this.buildMaterialsLibrary();

    // 6. Lighting System
    this.setupLighting();

    // 7. Realistic Terrain & Landscaping
    this.createRealisticTerrain();

    // 8. Road Network & Markings
    this.createRoadNetwork();

    // 9. DIU Campus Architectural Landmarks
    this.buildCampusLandmarks();

    // 10. Surrounding Student Mess Hubs
    this.buildSurroundingHubs();

    // 11. Streetlights & Campus Vegetation
    this.populateCampusEnvironment();

    // 12. Floating Atmospheric Particles
    this.createAtmosphereParticles();

    // 13. Event Listeners
    window.addEventListener('resize', () => this.onWindowResize());
    this.container.addEventListener('mousemove', (e) => this.onPointerMove(e));
    this.container.addEventListener('click', (e) => this.onClick(e));

    // 14. Start Animation Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  // ================= MATERIAL DEFINITIONS =================
  buildMaterialsLibrary() {
    this.materials = {
      // Concrete & Foundations
      whiteConcrete: new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.35, metalness: 0.1 }),
      warmStone: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.45 }),
      darkSlate: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.3 }),
      redBrick: new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.75, metalness: 0.05 }),
      diuGreenTrim: new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.3, metalness: 0.2 }),
      diuEmeraldGlow: new THREE.MeshStandardMaterial({
        color: 0x00f59b,
        emissive: 0x00f59b,
        emissiveIntensity: 0.4
      }),

      // Realistic Glass Windows
      tintedGlass: new THREE.MeshPhysicalMaterial({
        color: 0x0284c7,
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.6,
        transparent: true,
        opacity: 0.75,
        ior: 1.52
      }),
      emissiveWindowNight: new THREE.MeshBasicMaterial({ color: 0xfef08a }),

      // Roof & Metals
      roofGrey: new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6, metalness: 0.4 }),
      goldenDome: new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85, roughness: 0.18 }),
      timberWood: new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 }),

      // Roads & Ground
      asphaltRoad: new THREE.MeshStandardMaterial({ color: 0x1e2422, roughness: 0.85 }),
      runningTrack: new THREE.MeshStandardMaterial({ color: 0xbe123c, roughness: 0.8 }),
      grassLawn: new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.9 }),
      waterSurface: new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        roughness: 0.08,
        metalness: 0.8,
        transparent: true,
        opacity: 0.88
      })
    };
  }

  // ================= LIGHTING & DAY/NIGHT CONTROLLER =================
  setupLighting() {
    this.ambientLight = new THREE.AmbientLight(0xdbeafe, 1.4);
    this.scene.add(this.ambientLight);

    // Warm Sun Light
    this.sunLight = new THREE.DirectionalLight(0xfffbeb, 1.8);
    this.sunLight.position.set(300, 480, 240);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 1400;
    const d = 420;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.scene.add(this.sunLight);

    // Secondary Soft Sky Fill Light
    this.fillLight = new THREE.DirectionalLight(0x93c5fd, 0.7);
    this.fillLight.position.set(-250, 300, -200);
    this.scene.add(this.fillLight);

    // Knowledge Tower Core Beacon Light
    this.towerLight = new THREE.PointLight(0x00f59b, 2.5, 250);
    this.towerLight.position.set(0, 110, 0);
    this.scene.add(this.towerLight);
  }

  setLightingMode(mode) {
    this.lightingMode = mode;
    if (mode === 'day') {
      this.scene.background = new THREE.Color(0xd6eaf8);
      this.scene.fog.color = new THREE.Color(0xd6eaf8);
      this.ambientLight.color.setHex(0xdbeafe);
      this.ambientLight.intensity = 1.4;
      this.sunLight.intensity = 1.8;
      this.sunLight.color.setHex(0xfffbeb);
      this.fillLight.intensity = 0.7;
      this.towerLight.intensity = 1.2;
      this.nightLights.forEach(l => l.intensity = 0);
    } else {
      // Night Cyber Mode
      this.scene.background = new THREE.Color(0x060b08);
      this.scene.fog.color = new THREE.Color(0x060b08);
      this.ambientLight.color.setHex(0x0f241a);
      this.ambientLight.intensity = 0.6;
      this.sunLight.intensity = 0.15;
      this.sunLight.color.setHex(0x1e3a8a);
      this.fillLight.intensity = 0.2;
      this.towerLight.intensity = 4.0;
      this.nightLights.forEach(l => l.intensity = 1.8);
    }
  }

  // ================= TERRAIN & NATURAL LANDSCAPING =================
  createRealisticTerrain() {
    // Master Ground Base
    const groundGeo = new THREE.PlaneGeometry(1800, 1800);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x16231d, roughness: 0.95 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // DIU Lush Central Green Turf Plane
    const campusPlazaGeo = new THREE.PlaneGeometry(480, 420);
    const campusPlaza = new THREE.Mesh(campusPlazaGeo, this.materials.grassLawn);
    campusPlaza.rotation.x = -Math.PI / 2;
    campusPlaza.position.set(40, 0.2, 40);
    campusPlaza.receiveShadow = true;
    this.scene.add(campusPlaza);

    // Perimeter boundary curb stone ring around Daffodil Smart City core
    const curbGeo = new THREE.RingGeometry(240, 244, 64);
    const curbMat = new THREE.MeshStandardMaterial({ color: 0x334155, side: THREE.DoubleSide });
    const curb = new THREE.Mesh(curbGeo, curbMat);
    curb.rotation.x = -Math.PI / 2;
    curb.position.set(40, 0.3, 40);
    this.scene.add(curb);
  }

  // ================= ROADS WITH REALISTIC LANE MARKINGS =================
  createRoadNetwork() {
    CAMPUS_EDGES.forEach(edge => {
      const fromNode = CAMPUS_NODES.find(n => n.id === edge.from);
      const toNode = CAMPUS_NODES.find(n => n.id === edge.to);
      if (!fromNode || !toNode) return;

      const p1 = this.geoTo3D(fromNode.lat, fromNode.lng);
      const p2 = this.geoTo3D(toNode.lat, toNode.lng);

      const dx = p2.x - p1.x;
      const dz = p2.z - p1.z;
      const length = Math.sqrt(dx * dx + dz * dz);
      const angle = Math.atan2(dx, dz);
      const midX = (p1.x + p2.x) / 2;
      const midZ = (p1.z + p2.z) / 2;

      const roadWidth = edge.type === 'paved_road' ? 12 : 5;
      const roadGeo = new THREE.PlaneGeometry(roadWidth, length);
      const roadMat = edge.type === 'paved_road' 
        ? this.materials.asphaltRoad 
        : new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.8 });

      const roadMesh = new THREE.Mesh(roadGeo, roadMat);
      roadMesh.rotation.x = -Math.PI / 2;
      roadMesh.rotation.z = -angle;
      roadMesh.position.set(midX, 0.4, midZ);
      roadMesh.receiveShadow = true;
      this.scene.add(roadMesh);

      // Add center dashed white line for paved main roads
      if (edge.type === 'paved_road' && length > 30) {
        const stripeGeo = new THREE.PlaneGeometry(0.8, length * 0.9);
        const stripeMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc, transparent: true, opacity: 0.6 });
        const stripe = new THREE.Mesh(stripeGeo, stripeMat);
        stripe.rotation.x = -Math.PI / 2;
        stripe.rotation.z = -angle;
        stripe.position.set(midX, 0.45, midZ);
        this.scene.add(stripe);
      }
    });
  }

  // ================= ARCHITECTURAL LANDMARKS =================
  buildCampusLandmarks() {
    // 1. Knowledge Tower (AB-4: 14-Story Flagship Skyscraper)
    const ktPos = this.geoTo3D(23.8778, 90.3206);
    this.createRealisticKnowledgeTower(ktPos.x, ktPos.z);

    // 2. Academic Building 1 (AB-1: CSE & Software Engineering)
    const ab1Pos = this.geoTo3D(23.8787, 90.3213);
    this.createRealisticAB1(ab1Pos.x, ab1Pos.z);

    // 3. Academic Building 2 & 3 (AB-2 & AB-3 with Skybridge)
    const ab2Pos = this.geoTo3D(23.8794, 90.3221);
    const ab3Pos = this.geoTo3D(23.8802, 90.3229);
    this.createRealisticAB2AndAB3(ab2Pos, ab3Pos);

    // 4. DIU Central Library & Innovation Lab
    const libPos = this.geoTo3D(23.8781, 90.3219);
    this.createRealisticLibrary(libPos.x, libPos.z);

    // 5. Central Cafeteria (Charulata Food Court)
    const cafePos = this.geoTo3D(23.8773, 90.3224);
    this.createRealisticCafeteria(cafePos.x, cafePos.z);

    // 6. DIU Central Mosque
    const mosquePos = this.geoTo3D(23.8761, 90.3217);
    this.createRealisticMosque(mosquePos.x, mosquePos.z);

    // 7. DIU Lake & Iconic Wooden Bridge
    const lakePos = this.geoTo3D(23.8765, 90.3236);
    this.createRealisticLakeAndBridge(lakePos.x, lakePos.z);

    // 8. DIU Sports Arena (With 400m Running Track)
    const sportsPos = this.geoTo3D(23.8752, 90.3225);
    this.createRealisticSportsArena(sportsPos.x, sportsPos.z);

    // 9. DIU Main Entrance Gate & Checkpost
    const gatePos = this.geoTo3D(23.8766, 90.3201);
    this.createRealisticMainGate(gatePos.x, gatePos.z);

    // 10. Campus Bus Terminal
    const termPos = this.geoTo3D(23.8758, 90.3192);
    this.createRealisticBusTerminal(termPos.x, termPos.z);

    // 11. DIU Medical Center
    const medPos = this.geoTo3D(23.8770, 90.3204);
    this.createRealisticMedicalCenter(medPos.x, medPos.z);
  }

  // ---------- 1. KNOWLEDGE TOWER (AB-4) ----------
  createRealisticKnowledgeTower(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const towerHeight = 110;
    const towerWidth = 32;
    const towerDepth = 26;

    // Ground Entrance Plaza Podium
    const podiumGeo = new THREE.BoxGeometry(towerWidth + 14, 4, towerDepth + 14);
    const podium = new THREE.Mesh(podiumGeo, this.materials.whiteConcrete);
    podium.position.y = 2;
    podium.receiveShadow = true;
    group.add(podium);

    // Glass Main Body (14 Floors represented with floor slabs)
    const bodyGeo = new THREE.BoxGeometry(towerWidth, towerHeight, towerDepth);
    const bodyMesh = new THREE.Mesh(bodyGeo, this.materials.tintedGlass);
    bodyMesh.position.y = towerHeight / 2 + 4;
    bodyMesh.castShadow = true;
    group.add(bodyMesh);

    // Horizontal concrete floor slabs (14 levels)
    const floorsCount = 14;
    for (let f = 1; f <= floorsCount; f++) {
      const slabY = 4 + (f * (towerHeight / floorsCount));
      const slabGeo = new THREE.BoxGeometry(towerWidth + 0.8, 0.9, towerDepth + 0.8);
      const slab = new THREE.Mesh(slabGeo, this.materials.whiteConcrete);
      slab.position.y = slabY;
      group.add(slab);
    }

    // Vertical structural columns & DIU Green accent ribs
    [-towerWidth / 2 - 0.4, towerWidth / 2 + 0.4].forEach(px => {
      const ribGeo = new THREE.BoxGeometry(1.6, towerHeight, 3);
      const rib = new THREE.Mesh(ribGeo, this.materials.diuGreenTrim);
      rib.position.set(px, towerHeight / 2 + 4, 0);
      group.add(rib);
    });

    // Grand Entrance Cantilevered Glass Canopy
    const canopyGeo = new THREE.BoxGeometry(18, 1, 14);
    const canopy = new THREE.Mesh(canopyGeo, this.materials.tintedGlass);
    canopy.position.set(0, 8, towerDepth / 2 + 6);
    group.add(canopy);

    // Rooftop Communications Crown & Elevator Penthouse
    const roofTopGeo = new THREE.BoxGeometry(towerWidth * 0.7, 16, towerDepth * 0.7);
    const roofTop = new THREE.Mesh(roofTopGeo, this.materials.darkSlate);
    roofTop.position.y = towerHeight + 12;
    group.add(roofTop);

    // Satellite Dish on Roof
    const dishGeo = new THREE.SphereGeometry(3.5, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2.5);
    const dish = new THREE.Mesh(dishGeo, this.materials.whiteConcrete);
    dish.rotation.x = -Math.PI / 3;
    dish.position.set(6, towerHeight + 22, -4);
    group.add(dish);

    // Spire & Rotating Laser Sky-Beacon
    const spireGeo = new THREE.ConeGeometry(1.5, 24, 8);
    const spire = new THREE.Mesh(spireGeo, this.materials.diuEmeraldGlow);
    spire.position.y = towerHeight + 28;
    group.add(spire);

    const beamGeo = new THREE.CylinderGeometry(0.6, 16, 220, 16);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x00f59b,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.y = towerHeight + 130;
    group.add(beam);
    group.userData.beaconBeam = beam;

    this.attachNodeInteraction(bodyMesh, "knowledge_tower", "Knowledge Tower (Admin / AB-4)");
    this.createFloatingPin(group, towerHeight + 45, 0x00f59b, "Knowledge Tower (Admin)");

    this.buildingMeshes.set("knowledge_tower", group);
    this.scene.add(group);
  }

  // ---------- 2. ACADEMIC BUILDING 1 (AB-1) ----------
  createRealisticAB1(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const bHeight = 64;

    // Left Wing (CSE Laboratories)
    const leftWingGeo = new THREE.BoxGeometry(16, bHeight, 46);
    const leftWing = new THREE.Mesh(leftWingGeo, this.materials.redBrick);
    leftWing.position.set(-16, bHeight / 2, 0);
    leftWing.castShadow = true;
    group.add(leftWing);

    // Right Wing (Software Engineering Suites)
    const rightWingGeo = new THREE.BoxGeometry(16, bHeight, 46);
    const rightWing = new THREE.Mesh(rightWingGeo, this.materials.redBrick);
    rightWing.position.set(16, bHeight / 2, 0);
    rightWing.castShadow = true;
    group.add(rightWing);

    // Central Connecting Glass Atrium
    const atriumGeo = new THREE.BoxGeometry(18, bHeight - 6, 24);
    const atrium = new THREE.Mesh(atriumGeo, this.materials.tintedGlass);
    atrium.position.set(0, (bHeight - 6) / 2, -10);
    group.add(atrium);

    // Horizontal window bands across both wings
    for (let f = 1; f <= 6; f++) {
      const wy = f * 9.5;
      [-16, 16].forEach(wx => {
        const winBand = new THREE.Mesh(new THREE.BoxGeometry(16.4, 3, 44), this.materials.tintedGlass);
        winBand.position.set(wx, wy, 0);
        group.add(winBand);
      });
    }

    // Landscaped Inner Courtyard with central tree
    const court = new THREE.Mesh(new THREE.PlaneGeometry(16, 22), this.materials.grassLawn);
    court.rotation.x = -Math.PI / 2;
    court.position.set(0, 0.3, 10);
    group.add(court);
    group.add(this.createTree(0, 10));

    // Rooftop Solar Panel Arrays
    for (let s = 0; s < 3; s++) {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(10, 0.4, 8), this.materials.darkSlate);
      panel.rotation.x = -0.2;
      panel.position.set(-16, bHeight + 1.5, -12 + (s * 12));
      group.add(panel);
    }

    this.attachNodeInteraction(leftWing, "ab1_building", "Academic Building 1 (CSE / SWE)");
    this.createFloatingPin(group, bHeight + 16, 0x10b981, "AB-1 (CSE / Software)");

    this.buildingMeshes.set("ab1_building", group);
    this.scene.add(group);
  }

  // ---------- 3. ACADEMIC BUILDING 2 & 3 (WITH SKYBRIDGE) ----------
  createRealisticAB2AndAB3(ab2Pos, ab3Pos) {
    // AB-2 (EEE, Civil & Textile)
    const group2 = new THREE.Group();
    group2.position.set(ab2Pos.x, 0, ab2Pos.z);
    const b2Mesh = new THREE.Mesh(new THREE.BoxGeometry(36, 56, 30), this.materials.whiteConcrete);
    b2Mesh.position.y = 28;
    b2Mesh.castShadow = true;
    group2.add(b2Mesh);

    // Glass window ribbons on AB-2
    for (let f = 1; f <= 5; f++) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(36.4, 3.5, 26), this.materials.tintedGlass);
      win.position.set(0, f * 9.5, 0);
      group2.add(win);
    }
    this.attachNodeInteraction(b2Mesh, "ab2_building", "Academic Building 2 (EEE/Civil)");
    this.createFloatingPin(group2, 70, 0x38bdf8, "AB-2 (EEE / Civil)");
    this.buildingMeshes.set("ab2_building", group2);
    this.scene.add(group2);

    // AB-3 (BBA & Law)
    const group3 = new THREE.Group();
    group3.position.set(ab3Pos.x, 0, ab3Pos.z);
    const b3Mesh = new THREE.Mesh(new THREE.BoxGeometry(34, 50, 28), this.materials.darkSlate);
    b3Mesh.position.y = 25;
    b3Mesh.castShadow = true;
    group3.add(b3Mesh);

    for (let f = 1; f <= 5; f++) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(34.4, 3, 24), this.materials.tintedGlass);
      win.position.set(0, f * 8.5, 0);
      group3.add(win);
    }
    this.attachNodeInteraction(b3Mesh, "ab3_building", "Academic Building 3 (BBA/Law)");
    this.createFloatingPin(group3, 65, 0xa855f7, "AB-3 (BBA / Law)");
    this.buildingMeshes.set("ab3_building", group3);
    this.scene.add(group3);

    // Elevated Connecting Glass Skybridge between AB-2 and AB-3
    const bridgeX = (ab2Pos.x + ab3Pos.x) / 2;
    const bridgeZ = (ab2Pos.z + ab3Pos.z) / 2;
    const bridgeGroup = new THREE.Group();
    bridgeGroup.position.set(bridgeX, 28, bridgeZ);

    const dx = ab3Pos.x - ab2Pos.x;
    const dz = ab3Pos.z - ab2Pos.z;
    const bridgeDist = Math.sqrt(dx * dx + dz * dz);
    const bridgeAngle = Math.atan2(dx, dz);

    const bridgeSpan = new THREE.Mesh(new THREE.BoxGeometry(6, 6, bridgeDist - 28), this.materials.tintedGlass);
    bridgeSpan.rotation.y = bridgeAngle;
    bridgeGroup.add(bridgeSpan);
    this.scene.add(bridgeGroup);
  }

  // ---------- 4. DIU CENTRAL LIBRARY ----------
  createRealisticLibrary(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const h = 40;
    const libCube = new THREE.Mesh(new THREE.BoxGeometry(34, h, 34), this.materials.tintedGlass);
    libCube.position.y = h / 2;
    libCube.castShadow = true;
    group.add(libCube);

    // Structural perimeter white columns
    [-17, 17].forEach(cx => {
      [-17, 17].forEach(cz => {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, h, 8), this.materials.whiteConcrete);
        col.position.set(cx, h / 2, cz);
        group.add(col);
      });
    });

    // Rooftop Open Book Architectural Feature
    const bookBase = new THREE.Mesh(new THREE.BoxGeometry(18, 3, 14), this.materials.goldenDome);
    bookBase.position.y = h + 2;
    group.add(bookBase);

    this.attachNodeInteraction(libCube, "central_library", "DIU Central Library & Innovation Lab");
    this.createFloatingPin(group, h + 18, 0x38bdf8, "Central Library");
    this.buildingMeshes.set("central_library", group);
    this.scene.add(group);
  }

  // ---------- 5. CENTRAL CAFETERIA (CHARULATA FOOD COURT) ----------
  createRealisticCafeteria(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Raised Outdoor Timber Decking
    const deck = new THREE.Mesh(new THREE.CylinderGeometry(26, 28, 2.5, 24), this.materials.timberWood);
    deck.position.y = 1.2;
    group.add(deck);

    // Open-Air Pavilion Roof
    const roof = new THREE.Mesh(new THREE.ConeGeometry(24, 14, 16), this.materials.goldenDome);
    roof.position.y = 16;
    roof.castShadow = true;
    group.add(roof);

    // Circular steel support pillars
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const px = Math.cos(a) * 18;
      const pz = Math.sin(a) * 18;
      const pil = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 12, 8), this.materials.whiteConcrete);
      pil.position.set(px, 7.5, pz);
      group.add(pil);
    }

    // Outdoor Dining Tables & Parasols
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      const tx = Math.cos(a) * 22;
      const tz = Math.sin(a) * 22;

      const tbl = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 1.4, 8), this.materials.whiteConcrete);
      tbl.position.set(tx, 2.4, tz);
      group.add(tbl);

      const umb = new THREE.Mesh(new THREE.ConeGeometry(3.5, 1.8, 8), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
      umb.position.set(tx, 5.2, tz);
      group.add(umb);
    }

    this.attachNodeInteraction(deck, "central_cafeteria", "Central Cafeteria (Charulata Food Court)");
    this.createFloatingPin(group, 26, 0xf59e0b, "Charulata Cafeteria");
    this.buildingMeshes.set("central_cafeteria", group);
    this.scene.add(group);
  }

  // ---------- 6. DIU CENTRAL MOSQUE ----------
  createRealisticMosque(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Raised White Marble Plinth
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(36, 3, 36), this.materials.whiteConcrete);
    plinth.position.y = 1.5;
    group.add(plinth);

    // Main Cube Prayer Hall
    const hall = new THREE.Mesh(new THREE.BoxGeometry(28, 18, 28), this.materials.whiteConcrete);
    hall.position.y = 11;
    hall.castShadow = true;
    group.add(hall);

    // Arched Iwan Entrance Portal
    const portal = new THREE.Mesh(new THREE.BoxGeometry(10, 14, 4), this.materials.diuGreenTrim);
    portal.position.set(0, 9, 14.5);
    group.add(portal);

    // Central Ribbed Golden Dome
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(10, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      this.materials.goldenDome
    );
    dome.position.y = 20;
    group.add(dome);

    // Crescent Finial on Dome
    const crescent = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.3, 8, 16, Math.PI * 1.5), this.materials.goldenDome);
    crescent.position.set(0, 31, 0);
    group.add(crescent);

    // Authentic Tall Minaret (40m height) on Northeast Corner
    const minaret = new THREE.Mesh(new THREE.CylinderGeometry(2, 2.8, 52, 12), this.materials.whiteConcrete);
    minaret.position.set(15, 26, 15);
    minaret.castShadow = true;
    group.add(minaret);

    // Minaret Balconies (Sherefe)
    [32, 44].forEach(by => {
      const balc = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 2.5, 2, 12), this.materials.diuGreenTrim);
      balc.position.set(15, by, 15);
      group.add(balc);
    });

    // Minaret Emerald Conical Spire
    const spire = new THREE.Mesh(new THREE.ConeGeometry(2.4, 9, 12), this.materials.diuEmeraldGlow);
    spire.position.set(15, 56, 15);
    group.add(spire);

    this.attachNodeInteraction(hall, "central_mosque", "DIU Central Mosque");
    this.createFloatingPin(group, 36, 0x10b981, "DIU Central Mosque");
    this.buildingMeshes.set("central_mosque", group);
    this.scene.add(group);
  }

  // ---------- 7. DIU LAKE & ICONIC WOODEN BRIDGE ----------
  createRealisticLakeAndBridge(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Realistic Organic Shimmering Water Lake
    const lakeGeo = new THREE.PlaneGeometry(85, 52, 24, 24);
    const lake = new THREE.Mesh(lakeGeo, this.materials.waterSurface);
    lake.rotation.x = -Math.PI / 2;
    lake.position.y = 0.6;
    lake.receiveShadow = true;
    group.add(lake);
    group.userData.water = lake;

    // Stone / Sandy Shoreline Trim
    const shoreGeo = new THREE.RingGeometry(34, 37, 32);
    const shoreMat = new THREE.MeshStandardMaterial({ color: 0x475569, side: THREE.DoubleSide });
    const shore = new THREE.Mesh(shoreGeo, shoreMat);
    shore.rotation.x = -Math.PI / 2;
    shore.position.y = 0.65;
    group.add(shore);

    // ICONIC ARCHED WOODEN PEDESTRIAN BRIDGE (Spanning across the lake)
    const bridgeSpan = new THREE.Group();
    const archCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-24, 0.8, 0),
      new THREE.Vector3(0, 7.5, 0),
      new THREE.Vector3(24, 0.8, 0)
    );
    const bridgePoints = archCurve.getPoints(24);
    const deckGeo = new THREE.TubeGeometry(archCurve, 24, 2.2, 4, false);
    const deckMesh = new THREE.Mesh(deckGeo, this.materials.timberWood);
    deckMesh.scale.set(1, 0.25, 2.2);
    bridgeSpan.add(deckMesh);

    // Timber Handrails with glowing lantern posts
    [-2.2, 2.2].forEach(rz => {
      const railCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-24, 3.2, rz),
        new THREE.Vector3(0, 9.8, rz),
        new THREE.Vector3(24, 3.2, rz)
      );
      const railMesh = new THREE.Mesh(new THREE.TubeGeometry(railCurve, 24, 0.25, 6, false), this.materials.timberWood);
      bridgeSpan.add(railMesh);
    });
    group.add(bridgeSpan);

    // Lakeside Gazebo ("Chatro Chhaya") on the bank
    const gazebo = new THREE.Mesh(new THREE.ConeGeometry(6, 4, 6), this.materials.timberWood);
    gazebo.position.set(-36, 5, 18);
    group.add(gazebo);

    // 2 Miniature Paddle Boats on the lake
    [-12, 14].forEach((bx, idx) => {
      const boat = new THREE.Mesh(new THREE.BoxGeometry(4.5, 1.2, 2.4), this.materials.whiteConcrete);
      boat.position.set(bx, 0.9, idx === 0 ? 8 : -10);
      boat.rotation.y = idx * 0.8;
      group.add(boat);
    });

    // Weeping willow trees along the water bank
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      const tx = Math.cos(a) * 44;
      const tz = Math.sin(a) * 26;
      group.add(this.createTree(tx, tz));
    }

    this.attachNodeInteraction(lake, "diu_lake", "DIU Lake & Eco Walkway");
    this.createFloatingPin(group, 18, 0x06b6d4, "DIU Lake & Bridge");
    this.buildingMeshes.set("diu_lake", group);
    this.scene.add(group);
  }

  // ---------- 8. DIU SPORTS ARENA & RUNNING TRACK ----------
  createRealisticSportsArena(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // 400m Terracotta Red Athletics Running Track (Outer Ring)
    const trackGeo = new THREE.PlaneGeometry(94, 64);
    const track = new THREE.Mesh(trackGeo, this.materials.runningTrack);
    track.rotation.x = -Math.PI / 2;
    track.position.y = 0.5;
    track.receiveShadow = true;
    group.add(track);

    // Central Green Turf Pitch
    const fieldGeo = new THREE.PlaneGeometry(80, 50);
    const field = new THREE.Mesh(fieldGeo, this.materials.grassLawn);
    field.rotation.x = -Math.PI / 2;
    field.position.y = 0.6;
    field.receiveShadow = true;
    group.add(field);

    // Cricket Pitch Strip
    const pitch = new THREE.Mesh(new THREE.PlaneGeometry(18, 4), new THREE.MeshBasicMaterial({ color: 0xd97706 }));
    pitch.rotation.x = -Math.PI / 2;
    pitch.position.y = 0.65;
    group.add(pitch);

    // Covered Spectator Grandstand Gallery (South Side)
    const stand = new THREE.Mesh(new THREE.BoxGeometry(50, 8, 8), this.materials.whiteConcrete);
    stand.position.set(0, 4, 32);
    group.add(stand);

    // 4 Heavy-duty Stadium Floodlight Masts
    const corners = [[-44, -28], [44, -28], [-44, 28], [44, 28]];
    corners.forEach(([cx, cz]) => {
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.2, 34, 6), this.materials.whiteConcrete);
      mast.position.set(cx, 17, cz);
      group.add(mast);

      // Halogen Light Bar Head
      const head = new THREE.Mesh(new THREE.BoxGeometry(6, 2, 2.5), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
      head.position.set(cx, 34, cz);
      group.add(head);

      // Stadium Night Spot Light
      const spot = new THREE.PointLight(0xfef08a, 0, 120);
      spot.position.set(cx, 33, cz);
      group.add(spot);
      this.nightLights.push(spot);
    });

    this.attachNodeInteraction(field, "sports_ground", "DIU Sports Arena & Stadium");
    this.createFloatingPin(group, 24, 0x22c55e, "DIU Sports Arena");
    this.buildingMeshes.set("sports_ground", group);
    this.scene.add(group);
  }

  // ---------- 9. MAIN GATE ----------
  createRealisticMainGate(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Modern Archway Structure
    const pillar1 = new THREE.Mesh(new THREE.BoxGeometry(5, 20, 5), this.materials.diuGreenTrim);
    pillar1.position.set(-14, 10, 0);
    group.add(pillar1);

    const pillar2 = new THREE.Mesh(new THREE.BoxGeometry(5, 20, 5), this.materials.diuGreenTrim);
    pillar2.position.set(14, 10, 0);
    group.add(pillar2);

    const archBeam = new THREE.Mesh(new THREE.BoxGeometry(33, 4.5, 6), this.materials.whiteConcrete);
    archBeam.position.set(0, 20, 0);
    group.add(archBeam);

    // Security Checkpost Booth
    const booth = new THREE.Mesh(new THREE.BoxGeometry(6, 6, 6), this.materials.darkSlate);
    booth.position.set(0, 3, 0);
    group.add(booth);

    this.attachNodeInteraction(archBeam, "diu_main_gate", "DIU Main Entrance Gate");
    this.createFloatingPin(group, 26, 0x10b981, "Main Entrance Gate");
    this.buildingMeshes.set("diu_main_gate", group);
    this.scene.add(group);
  }

  // ---------- 10. BUS TERMINAL ----------
  createRealisticBusTerminal(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const lot = new THREE.Mesh(new THREE.PlaneGeometry(50, 34), this.materials.asphaltRoad);
    lot.rotation.x = -Math.PI / 2;
    lot.position.y = 0.5;
    group.add(lot);

    // 3 DIU University Student Shuttle Buses
    [-10, 0, 10].forEach(bz => {
      const bus = new THREE.Mesh(new THREE.BoxGeometry(18, 7, 7.5), this.materials.diuGreenTrim);
      bus.position.set(0, 4, bz);
      bus.castShadow = true;
      group.add(bus);

      // White roof
      const roof = new THREE.Mesh(new THREE.BoxGeometry(18, 0.8, 7.5), this.materials.whiteConcrete);
      roof.position.set(0, 7.6, bz);
      group.add(roof);

      // Windows
      const win = new THREE.Mesh(new THREE.BoxGeometry(16, 2.2, 7.7), this.materials.tintedGlass);
      win.position.set(0, 5, bz);
      group.add(win);
    });

    this.attachNodeInteraction(lot, "transport_terminal", "DIU Campus Bus Terminal");
    this.createFloatingPin(group, 18, 0x059669, "Campus Bus Terminal");
    this.buildingMeshes.set("transport_terminal", group);
    this.scene.add(group);
  }

  // ---------- 11. MEDICAL CENTER ----------
  createRealisticMedicalCenter(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const b = new THREE.Mesh(new THREE.BoxGeometry(24, 15, 20), this.materials.whiteConcrete);
    b.position.y = 7.5;
    b.castShadow = true;
    group.add(b);

    // Red Cross Emblem
    const cross1 = new THREE.Mesh(new THREE.BoxGeometry(7, 2, 2), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    cross1.position.set(0, 16.5, 0);
    group.add(cross1);
    const cross2 = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 7), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    cross2.position.set(0, 16.5, 0);
    group.add(cross2);

    this.attachNodeInteraction(b, "diu_medical", "DIU Medical Center & Pharmacy");
    this.createFloatingPin(group, 23, 0xef4444, "Medical Center");
    this.buildingMeshes.set("diu_medical", group);
    this.scene.add(group);
  }

  // ================= SURROUNDING STUDENT MESS HUBS =================
  buildSurroundingHubs() {
    // Khagan Bazar & Mess Lane
    const kBaz = this.geoTo3D(23.8828, 90.3138);
    this.createMessVillage(kBaz.x, kBaz.z, {
      id: "khagan_bazar",
      title: "Khagan Bazar & Bus Stand",
      color: 0xf97316,
      count: 6,
      height: 28,
      hasShops: true
    });

    const kMess = this.geoTo3D(23.8839, 90.3129);
    this.createMessVillage(kMess.x, kMess.z, {
      id: "khagan_student_mess",
      title: "Khagan Student Mess Lane",
      color: 0xa855f7,
      count: 7,
      height: 38,
      hasWaterTanks: true
    });

    // Dattapara Student Hub & Messes
    const dJunc = this.geoTo3D(23.8795, 90.3162);
    this.createMessVillage(dJunc.x, dJunc.z, {
      id: "dattapara_junction",
      title: "Dattapara Student Hub",
      color: 0xf59e0b,
      count: 5,
      height: 30,
      hasShops: true
    });

    const dMess = this.geoTo3D(23.8808, 90.3155);
    this.createMessVillage(dMess.x, dMess.z, {
      id: "dattapara_mess_lane",
      title: "Dattapara Student Messes",
      color: 0xec4899,
      count: 6,
      height: 34,
      hasWaterTanks: true
    });

    // Changaon & Sadhupara
    const chgPos = this.geoTo3D(23.8742, 90.3175);
    this.createMessVillage(chgPos.x, chgPos.z, {
      id: "changaon_hub",
      title: "Changaon Hub",
      color: 0x38bdf8,
      count: 4,
      height: 24
    });

    const chgM = this.geoTo3D(23.8732, 90.3168);
    this.createMessVillage(chgM.x, chgM.z, {
      id: "changaon_mess_lane",
      title: "Changaon Hostels",
      color: 0x818cf8,
      count: 4,
      height: 26
    });

    const sadhuPos = this.geoTo3D(23.8722, 90.3195);
    this.createBeaconNode(sadhuPos.x, sadhuPos.z, {
      id: "sadhupara_shortcut",
      title: "Sadhupara Shortcut Entry",
      color: 0x10b981
    });

    // Daffodil Model Town
    const mtPos = this.geoTo3D(23.8850, 90.3225);
    this.createMessVillage(mtPos.x, mtPos.z, {
      id: "model_town_gate",
      title: "Daffodil Model Town",
      color: 0x22c55e,
      count: 6,
      height: 32,
      isGated: true
    });

    // Kumkumari Highway Junction
    const kumPos = this.geoTo3D(23.8872, 90.3115);
    this.createBeaconNode(kumPos.x, kumPos.z, {
      id: "kumkumari_junction",
      title: "Kumkumari Highway Junction",
      color: 0x06b6d4
    });
  }

  createMessVillage(x, z, config) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    for (let i = 0; i < config.count; i++) {
      const offsetX = ((i % 3) - 1) * 18;
      const offsetZ = (Math.floor(i / 3) - 0.5) * 18;
      const h = config.height + ((i % 3) * 6);

      // Apartment block
      const bGeo = new THREE.BoxGeometry(13, h, 13);
      const bMat = (i % 2 === 0) ? this.materials.warmStone : this.materials.redBrick;
      const bMesh = new THREE.Mesh(bGeo, bMat);
      bMesh.position.set(offsetX, h / 2, offsetZ);
      bMesh.castShadow = true;
      group.add(bMesh);

      // Window recesses
      for (let f = 1; f < Math.floor(h / 7); f++) {
        const win = new THREE.Mesh(new THREE.BoxGeometry(13.2, 2.5, 9), this.materials.darkSlate);
        win.position.set(offsetX, f * 7, offsetZ);
        group.add(win);
      }

      // Rooftop Blue PVC Water Tanks (Classic Bangladeshi mess feature)
      if (config.hasWaterTanks) {
        const tank = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 3, 10), new THREE.MeshStandardMaterial({ color: 0x0284c7 }));
        tank.position.set(offsetX + 3, h + 1.5, offsetZ + 3);
        group.add(tank);
      }

      // Ground-floor colorful shop awnings (Bazar/Hub feature)
      if (config.hasShops && i < 2) {
        const awning = new THREE.Mesh(new THREE.BoxGeometry(13, 1, 4), new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
        awning.position.set(offsetX, 4, offsetZ + 8);
        group.add(awning);
      }
    }

    // Interaction target
    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(45, config.height, 45), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = config.height / 2;
    group.add(hitBox);

    this.attachNodeInteraction(hitBox, config.id, config.title);
    this.createFloatingPin(group, config.height + 20, config.color, config.title);

    this.buildingMeshes.set(config.id, group);
    this.scene.add(group);
  }

  createBeaconNode(x, z, config) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.4, 20, 8), this.materials.whiteConcrete);
    pole.position.y = 10;
    group.add(pole);

    this.attachNodeInteraction(pole, config.id, config.title);
    this.createFloatingPin(group, 24, config.color, config.title);

    this.buildingMeshes.set(config.id, group);
    this.scene.add(group);
  }

  // ================= VEGETATION & STREETLIGHTS =================
  populateCampusEnvironment() {
    // Add clusters of trees along avenues
    const treeCoords = [
      [20, 20], [-20, 20], [60, -30], [-50, -40],
      [80, 70], [-70, 80], [30, -70], [-30, -70]
    ];
    treeCoords.forEach(([tx, tz]) => {
      this.scene.add(this.createTree(tx, tz));
    });

    // Streetlights along main avenue
    const streetLightCoords = [
      [-15, 10], [15, 10], [0, 40], [0, 80], [-20, -20], [20, -20]
    ];
    streetLightCoords.forEach(([lx, lz]) => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 14, 6), this.materials.whiteConcrete);
      pole.position.set(lx, 7, lz);
      this.scene.add(pole);

      const lamp = new THREE.Mesh(new THREE.BoxGeometry(2, 0.6, 1), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
      lamp.position.set(lx, 14, lz);
      this.scene.add(lamp);

      const light = new THREE.PointLight(0xfef08a, 0, 45);
      light.position.set(lx, 13, lz);
      this.scene.add(light);
      this.nightLights.push(light);
    });
  }

  createTree(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 1, 5, 6), this.materials.timberWood);
    trunk.position.y = 2.5;
    group.add(trunk);

    // Multi-tiered lush green canopy
    [6, 9.5, 12].forEach((ty, idx) => {
      const radius = 5 - (idx * 1.1);
      const foliage = new THREE.Mesh(
        new THREE.ConeGeometry(radius, 4.5, 8),
        new THREE.MeshStandardMaterial({ color: idx === 1 ? 0x166534 : 0x15803d, roughness: 0.8 })
      );
      foliage.position.y = ty;
      foliage.castShadow = true;
      group.add(foliage);
    });

    return group;
  }

  createFloatingPin(parentGroup, yHeight, colorHex, title) {
    const pinGeo = new THREE.OctahedronGeometry(3.5, 0);
    const pinMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: 0.6,
      metalness: 0.8
    });
    const pin = new THREE.Mesh(pinGeo, pinMat);
    pin.position.y = yHeight;
    parentGroup.add(pin);

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(4.2, 5.4, 16),
      new THREE.MeshBasicMaterial({ color: colorHex, side: THREE.DoubleSide, transparent: true, opacity: 0.75 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = yHeight - 2;
    parentGroup.add(ring);

    // 3D Canvas Text Billboard Sprite (Visible from afar)
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 120;
      const ctx = canvas.getContext('2d');
      
      // Rounded background pill
      ctx.fillStyle = 'rgba(10, 15, 30, 0.92)';
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(10, 10, 492, 100, 24);
      } else {
        ctx.rect(10, 10, 492, 100);
      }
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#' + Number(colorHex).toString(16).padStart(6, '0');
      ctx.stroke();

      // Clear readable title
      ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(title, 256, 60);

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      const spriteMat = new THREE.SpriteMaterial({ map: texture, depthTest: false });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.y = yHeight + 14;
      sprite.scale.set(44, 10.5, 1);
      parentGroup.add(sprite);
    } catch (err) {
      // Fallback
    }

    parentGroup.userData.pin = pin;
    parentGroup.userData.ring = ring;
    parentGroup.userData.baseY = yHeight;
  }

  createAtmosphereParticles() {
    const count = 220;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 900;
      pos[i + 1] = Math.random() * 140 + 5;
      pos[i + 2] = (Math.random() - 0.5) * 900;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.particles = new THREE.Points(geo, new THREE.PointsMaterial({
      color: 0x10b981,
      size: 2.4,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    }));
    this.scene.add(this.particles);
  }

  attachNodeInteraction(mesh, nodeId, title) {
    mesh.userData = { nodeId, title, isInteractable: true };
    this.interactiveObjects.push(mesh);
  }

  // ================= 3D LASER ROUTE HIGHLIGHTING =================
  highlightRoute(pathNodes) {
    if (this.activeRouteLine) {
      this.scene.remove(this.activeRouteLine);
      this.activeRouteLine = null;
    }
    if (!pathNodes || pathNodes.length < 2) return;

    const points = [];
    pathNodes.forEach(node => {
      const p = this.geoTo3D(node.lat, node.lng);
      points.push(new THREE.Vector3(p.x, 3.8, p.z));
    });

    const curve = new THREE.CatmullRomCurve3(points);
    const tubeGeo = new THREE.TubeGeometry(curve, 64, 1.8, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({ color: 0x00f59b, transparent: true, opacity: 0.95 });

    this.activeRouteLine = new THREE.Mesh(tubeGeo, tubeMat);
    this.scene.add(this.activeRouteLine);

    this.focusOnPath(pathNodes);
  }

  focusOnPath(pathNodes) {
    if (!this.controls || !pathNodes.length) return;
    const startP = this.geoTo3D(pathNodes[0].lat, pathNodes[0].lng);
    const endP = this.geoTo3D(pathNodes[pathNodes.length - 1].lat, pathNodes[pathNodes.length - 1].lng);
    this.controls.target.set((startP.x + endP.x) / 2, 0, (startP.z + endP.z) / 2);
  }

  resetCamera(viewMode = 'iso') {
    if (!this.controls) return;
    if (viewMode === 'iso') {
      this.camera.position.set(0, 360, 490);
      this.controls.target.set(0, 0, 0);
    } else if (viewMode === 'top') {
      this.camera.position.set(0, 720, 10);
      this.controls.target.set(0, 0, 0);
    } else if (viewMode === 'diu' || viewMode === 'tower') {
      const ktPos = this.geoTo3D(23.8778, 90.3206);
      this.camera.position.set(ktPos.x + 90, 140, ktPos.z + 130);
      this.controls.target.set(ktPos.x, 30, ktPos.z);
    } else if (viewMode === 'dattapara') {
      const dPos = this.geoTo3D(23.8800, 90.3160);
      this.camera.position.set(dPos.x + 100, 140, dPos.z + 120);
      this.controls.target.set(dPos.x, 20, dPos.z);
    } else if (viewMode === 'chandgaon') {
      const cPos = this.geoTo3D(23.8738, 90.3172);
      this.camera.position.set(cPos.x + 90, 130, cPos.z + 110);
      this.controls.target.set(cPos.x, 20, cPos.z);
    } else if (viewMode === 'khagan') {
      const kPos = this.geoTo3D(23.8835, 90.3135);
      this.camera.position.set(kPos.x + 110, 150, kPos.z + 130);
      this.controls.target.set(kPos.x, 20, kPos.z);
    }
  }

  toggleAutoRotate() {
    this.isAutoRotating = !this.isAutoRotating;
    if (this.controls) this.controls.autoRotate = this.isAutoRotating;
    return this.isAutoRotating;
  }

  onPointerMove(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveObjects);

    if (intersects.length > 0) {
      const target = intersects[0].object;
      this.container.style.cursor = 'pointer';
      this.hoveredObject = target;
      this.showTooltip(event.clientX, event.clientY, target.userData.title);
    } else {
      this.container.style.cursor = 'default';
      this.hoveredObject = null;
      this.hideTooltip();
    }
  }

  onClick(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveObjects);

    if (intersects.length > 0) {
      const target = intersects[0].object;
      const nodeId = target.userData.nodeId;
      if (this.onNodeSelect && nodeId) {
        this.onNodeSelect(nodeId);
      }
    }
  }

  showTooltip(x, y, text) {
    let tip = document.getElementById('three-tooltip');
    if (!tip) {
      tip = document.createElement('div');
      tip.id = 'three-tooltip';
      tip.className = 'three-hud-tooltip';
      document.body.appendChild(tip);
    }
    tip.innerHTML = `<i class="fa-solid fa-location-dot" style="color: #00f59b; margin-right: 6px;"></i> ${text}`;
    tip.style.display = 'block';
    tip.style.left = `${x + 14}px`;
    tip.style.top = `${y - 12}px`;
  }

  hideTooltip() {
    const tip = document.getElementById('three-tooltip');
    if (tip) tip.style.display = 'none';
  }

  onWindowResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || (window.innerHeight - 64);
    if (width > 0 && height > 0) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }
  }

  // ================= ANIMATION LOOP =================
  animate() {
    requestAnimationFrame(this.animate);
    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Rotate Knowledge Tower beacon
    const ktGroup = this.buildingMeshes.get("knowledge_tower");
    if (ktGroup && ktGroup.userData.beaconBeam) {
      ktGroup.userData.beaconBeam.rotation.y += 0.02;
    }

    // Bobbing & rotating floating pins
    this.buildingMeshes.forEach(group => {
      if (group.userData.pin) {
        group.userData.pin.rotation.y += 0.015;
        group.userData.pin.position.y = group.userData.baseY + Math.sin(time * 2.2) * 1.6;
      }
      if (group.userData.ring) {
        const scale = 1 + Math.sin(time * 3) * 0.15;
        group.userData.ring.scale.set(scale, scale, scale);
      }
    });

    // Particle flow
    if (this.particles) {
      const pos = this.particles.geometry.attributes.position.array;
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] += delta * 4;
        if (pos[i] > 140) pos[i] = 5;
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
    }

    if (this.controls) this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

window.Campus3DViewer = Campus3DViewer;
