/**
 * DIU Smart Campus Navigator - Three.js 3D Interactive Holographic Campus
 * Renders an isometric 3D cyber-campus model of Daffodil International University (DIU)
 * and its surrounding residential mess hubs (Khagan, Dattapara, Changaon, Sadhupara, Model Town).
 */

class Campus3DViewer {
  constructor(containerId, onNodeSelect) {
    this.container = document.getElementById(containerId);
    this.onNodeSelect = onNodeSelect; // callback when a building/node is clicked

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.buildingMeshes = new Map(); // nodeId -> mesh group
    this.interactiveObjects = [];
    this.activeRouteLine = null;
    this.hoveredObject = null;
    this.isAutoRotating = false;
    this.clock = new THREE.Clock();

    // Map geo coordinates (lat, lng) to 3D world space (X, Z)
    // DIU Campus center: lat 23.8778, lng 90.3206 -> (0, 0) in 3D
    this.centerLat = 23.8778;
    this.centerLng = 90.3206;
    this.coordScale = 45000; // scaling factor for geo to 3D units

    this.init();
  }

  geoTo3D(lat, lng) {
    // Mercator-like local flat projection centered at campus
    const x = (lng - this.centerLng) * this.coordScale;
    const z = -(lat - this.centerLat) * this.coordScale;
    return { x, z };
  }

  init() {
    if (!this.container) return;

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || (window.innerHeight - 70);

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x070b09);
    this.scene.fog = new THREE.FogExp2(0x070b09, 0.0018);

    // 2. Camera (Isometric Perspective)
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 3000);
    this.camera.position.set(0, 380, 480);

    // 3. Renderer with antialiasing
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // 4. Orbit Controls
    if (window.THREE && THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxPolarAngle = Math.PI / 2.1; // don't go below ground
      this.controls.minDistance = 80;
      this.controls.maxDistance = 1200;
      this.controls.target.set(0, 0, 0);
    }

    // 5. Lighting
    this.setupLighting();

    // 6. Terrain & Roads
    this.createTerrainGrid();
    this.createRoadNetwork();

    // 7. DIU Campus Architecture
    this.buildCampusLandmarks();

    // 8. Surrounding Mess Areas & Hubs
    this.buildSurroundingHubs();

    // 9. Floating Cyber Atmosphere & Particles
    this.createAtmosphereParticles();

    // 10. Event Listeners
    window.addEventListener('resize', () => this.onWindowResize());
    this.container.addEventListener('mousemove', (e) => this.onPointerMove(e));
    this.container.addEventListener('click', (e) => this.onClick(e));

    // 11. Animation Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setupLighting() {
    // Ambient soft emerald/cyan light
    const ambientLight = new THREE.AmbientLight(0x102820, 1.8);
    this.scene.add(ambientLight);

    // Main directional sunlight with warm cyber accent
    const dirLight = new THREE.DirectionalLight(0xa7f3d0, 1.4);
    dirLight.position.set(200, 400, 200);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 1000;
    const d = 350;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    this.scene.add(dirLight);

    // Subtle blue secondary fill light
    const fillLight = new THREE.DirectionalLight(0x0284c7, 0.8);
    fillLight.position.set(-200, 250, -200);
    this.scene.add(fillLight);

    // Central knowledge tower cyan uplight
    const corePointLight = new THREE.PointLight(0x00f59b, 2.5, 300);
    corePointLight.position.set(0, 40, 0);
    this.scene.add(corePointLight);
  }

  createTerrainGrid() {
    // Dark base ground
    const groundGeo = new THREE.PlaneGeometry(1600, 1600);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x090f0c,
      roughness: 0.9,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Neon Cyber Grid
    const grid = new THREE.GridHelper(1400, 70, 0x10b981, 0x132e24);
    grid.position.y = 0.5;
    this.scene.add(grid);

    // Green campus boundary perimeter glow
    const campusBoundsGeo = new THREE.RingGeometry(180, 185, 64);
    const campusBoundsMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25
    });
    const campusRing = new THREE.Mesh(campusBoundsGeo, campusBoundsMat);
    campusRing.rotation.x = -Math.PI / 2;
    campusRing.position.set(30, 0.6, 20);
    this.scene.add(campusRing);
  }

  createRoadNetwork() {
    // Render graph edges as glowing roads in 3D
    CAMPUS_EDGES.forEach(edge => {
      const fromNode = CAMPUS_NODES.find(n => n.id === edge.from);
      const toNode = CAMPUS_NODES.find(n => n.id === edge.to);
      if (!fromNode || !toNode) return;

      const p1 = this.geoTo3D(fromNode.lat, fromNode.lng);
      const p2 = this.geoTo3D(toNode.lat, toNode.lng);

      const points = [
        new THREE.Vector3(p1.x, 1, p1.z),
        new THREE.Vector3(p2.x, 1, p2.z)
      ];
      const roadGeo = new THREE.BufferGeometry().setFromPoints(points);

      let roadColor = 0x10b981; // default green walkway
      let opacity = 0.4;
      if (edge.type === 'paved_road') {
        roadColor = 0x38bdf8; // cyan paved road
        opacity = 0.65;
      } else if (edge.type === 'shortcut_alley') {
        roadColor = 0xf59e0b; // amber shortcut
        opacity = 0.5;
      }

      const roadMat = new THREE.LineBasicMaterial({
        color: roadColor,
        transparent: true,
        opacity: opacity,
        linewidth: edge.type === 'paved_road' ? 2 : 1
      });

      const line = new THREE.Line(roadGeo, roadMat);
      this.scene.add(line);
    });
  }

  // ================= 3D ARCHITECTURAL GENERATION =================
  buildCampusLandmarks() {
    // 1. Knowledge Tower (Admin Skyscraper)
    const ktPos = this.geoTo3D(23.8778, 90.3206);
    const ktGroup = this.createSkyscraper(ktPos.x, ktPos.z, {
      id: "knowledge_tower",
      title: "Knowledge Tower (Admin)",
      floors: 14,
      width: 28,
      height: 95,
      depth: 24,
      primaryColor: 0x064e3b,
      glassColor: 0x0284c7,
      hasBeacon: true
    });
    this.scene.add(ktGroup);

    // 2. Academic Building 1 (AB-1, CSE & Software)
    const ab1Pos = this.geoTo3D(23.8787, 90.3213);
    const ab1Group = this.createTechBuilding(ab1Pos.x, ab1Pos.z, {
      id: "ab1_building",
      title: "Academic Building 1 (CSE/SWE)",
      width: 38,
      height: 58,
      depth: 26,
      primaryColor: 0x0f291e,
      accentColor: 0x10b981,
      roofText: "AB-1 CSE"
    });
    this.scene.add(ab1Group);

    // 3. Academic Building 2 (AB-2, EEE & Textile)
    const ab2Pos = this.geoTo3D(23.8794, 90.3221);
    const ab2Group = this.createTechBuilding(ab2Pos.x, ab2Pos.z, {
      id: "ab2_building",
      title: "Academic Building 2 (EEE/Civil)",
      width: 34,
      height: 52,
      depth: 28,
      primaryColor: 0x1e293b,
      accentColor: 0x38bdf8,
      roofText: "AB-2 EEE"
    });
    this.scene.add(ab2Group);

    // 4. Academic Building 3 (AB-3, BBA & Law)
    const ab3Pos = this.geoTo3D(23.8802, 90.3229);
    const ab3Group = this.createTechBuilding(ab3Pos.x, ab3Pos.z, {
      id: "ab3_building",
      title: "Academic Building 3 (BBA/Law)",
      width: 32,
      height: 48,
      depth: 25,
      primaryColor: 0x1a2e22,
      accentColor: 0xa855f7,
      roofText: "AB-3"
    });
    this.scene.add(ab3Group);

    // 5. Central Library & Innovation Hub
    const libPos = this.geoTo3D(23.8781, 90.3219);
    const libGroup = this.createGlassLibrary(libPos.x, libPos.z, {
      id: "central_library",
      title: "DIU Central Library",
      width: 32,
      height: 38,
      depth: 32
    });
    this.scene.add(libGroup);

    // 6. Central Cafeteria (Charulata Food Court)
    const cafePos = this.geoTo3D(23.8773, 90.3224);
    const cafeGroup = this.createCafeteria(cafePos.x, cafePos.z, {
      id: "central_cafeteria",
      title: "Central Cafeteria (Charulata)"
    });
    this.scene.add(cafeGroup);

    // 7. Central Mosque
    const mosquePos = this.geoTo3D(23.8761, 90.3217);
    const mosqueGroup = this.createMosque(mosquePos.x, mosquePos.z, {
      id: "central_mosque",
      title: "DIU Central Mosque"
    });
    this.scene.add(mosqueGroup);

    // 8. DIU Lake & Eco Walkway
    const lakePos = this.geoTo3D(23.8765, 90.3236);
    const lakeGroup = this.createWaterLake(lakePos.x, lakePos.z, {
      id: "diu_lake",
      title: "DIU Lake & Eco Walkway"
    });
    this.scene.add(lakeGroup);

    // 9. DIU Sports Arena (Cricket/Football Ground)
    const sportsPos = this.geoTo3D(23.8752, 90.3225);
    const sportsGroup = this.createSportsGround(sportsPos.x, sportsPos.z, {
      id: "sports_ground",
      title: "DIU Sports Arena"
    });
    this.scene.add(sportsGroup);

    // 10. DIU Main Entrance Gate
    const gatePos = this.geoTo3D(23.8766, 90.3201);
    const gateGroup = this.createEntranceGate(gatePos.x, gatePos.z, {
      id: "diu_main_gate",
      title: "DIU Main Entrance Gate"
    });
    this.scene.add(gateGroup);

    // 11. Campus Bus Terminal
    const termPos = this.geoTo3D(23.8758, 90.3192);
    const termGroup = this.createTransportTerminal(termPos.x, termPos.z, {
      id: "transport_terminal",
      title: "Campus Bus Terminal"
    });
    this.scene.add(termGroup);

    // 12. DIU Medical Center
    const medPos = this.geoTo3D(23.8770, 90.3204);
    const medGroup = this.createMedicalCenter(medPos.x, medPos.z, {
      id: "diu_medical",
      title: "DIU Medical Center"
    });
    this.scene.add(medGroup);
  }

  buildSurroundingHubs() {
    // 13. Dattapara Student Hub & Market
    const dJunc = this.geoTo3D(23.8795, 90.3162);
    this.createStudentVillage(dJunc.x, dJunc.z, {
      id: "dattapara_junction",
      title: "Dattapara Student Hub",
      color: 0xf59e0b,
      count: 4,
      height: 25
    });

    // 14. Dattapara Mess Cluster
    const dMess = this.geoTo3D(23.8808, 90.3155);
    this.createStudentVillage(dMess.x, dMess.z, {
      id: "dattapara_mess_lane",
      title: "Dattapara Student Messes",
      color: 0xec4899,
      count: 5,
      height: 30
    });

    // 15. Khagan Bazar & Bus Stand
    const kBaz = this.geoTo3D(23.8828, 90.3138);
    this.createStudentVillage(kBaz.x, kBaz.z, {
      id: "khagan_bazar",
      title: "Khagan Bazar",
      color: 0xf97316,
      count: 5,
      height: 22
    });

    // 16. Khagan Student Mess Lane
    const kMess = this.geoTo3D(23.8839, 90.3129);
    this.createStudentVillage(kMess.x, kMess.z, {
      id: "khagan_student_mess",
      title: "Khagan Mess Lane",
      color: 0xa855f7,
      count: 6,
      height: 35
    });

    // 17. Changaon Residential Intersection
    const chgPos = this.geoTo3D(23.8742, 90.3175);
    this.createStudentVillage(chgPos.x, chgPos.z, {
      id: "changaon_hub",
      title: "Changaon Hub",
      color: 0x38bdf8,
      count: 3,
      height: 22
    });

    // 18. Changaon Hostels
    const chgM = this.geoTo3D(23.8732, 90.3168);
    this.createStudentVillage(chgM.x, chgM.z, {
      id: "changaon_mess_lane",
      title: "Changaon Hostels",
      color: 0x818cf8,
      count: 4,
      height: 24
    });

    // 19. Sadhupara Shortcut
    const sadhuPos = this.geoTo3D(23.8722, 90.3195);
    this.createBeaconNode(sadhuPos.x, sadhuPos.z, {
      id: "sadhupara_shortcut",
      title: "Sadhupara Shortcut Entry",
      color: 0x10b981
    });

    // 20. Daffodil Model Town Main Gate
    const mtPos = this.geoTo3D(23.8850, 90.3225);
    this.createStudentVillage(mtPos.x, mtPos.z, {
      id: "model_town_gate",
      title: "Daffodil Model Town",
      color: 0x22c55e,
      count: 5,
      height: 28
    });

    // 21. Kumkumari Junction
    const kumPos = this.geoTo3D(23.8872, 90.3115);
    this.createBeaconNode(kumPos.x, kumPos.z, {
      id: "kumkumari_junction",
      title: "Kumkumari Highway Junction",
      color: 0x06b6d4
    });
  }

  // ================= PROCEDURAL 3D SHAPES =================

  createSkyscraper(x, z, config) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Main tower core
    const towerGeo = new THREE.BoxGeometry(config.width, config.height, config.depth);
    const towerMat = new THREE.MeshStandardMaterial({
      color: 0x0b1a14,
      roughness: 0.2,
      metalness: 0.85
    });
    const towerMesh = new THREE.Mesh(towerGeo, towerMat);
    towerMesh.position.y = config.height / 2;
    towerMesh.castShadow = true;
    towerMesh.receiveShadow = true;
    group.add(towerMesh);

    // Glowing wireframe edge highlights
    const edges = new THREE.EdgesGeometry(towerGeo);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x00f59b, linewidth: 2 });
    const edgeLines = new THREE.LineSegments(edges, lineMat);
    edgeLines.position.copy(towerMesh.position);
    group.add(edgeLines);

    // Upper tiered section
    const tierGeo = new THREE.BoxGeometry(config.width * 0.7, 18, config.depth * 0.7);
    const tierMesh = new THREE.Mesh(tierGeo, towerMat);
    tierMesh.position.y = config.height + 9;
    tierMesh.castShadow = true;
    group.add(tierMesh);

    const tierEdges = new THREE.EdgesGeometry(tierGeo);
    const tierLine = new THREE.LineSegments(tierEdges, lineMat);
    tierLine.position.copy(tierMesh.position);
    group.add(tierLine);

    // Top Sky Beacon Spire
    const spireGeo = new THREE.ConeGeometry(2, 22, 8);
    const spireMat = new THREE.MeshBasicMaterial({ color: 0x00f59b });
    const spire = new THREE.Mesh(spireGeo, spireMat);
    spire.position.y = config.height + 28;
    group.add(spire);

    // Rotating laser beacon beam
    const beamGeo = new THREE.CylinderGeometry(0.8, 14, 180, 16);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x00f59b,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.y = config.height + 110;
    group.add(beam);
    group.userData.beaconBeam = beam;

    this.attachNodeInteraction(towerMesh, config.id, config.title);
    this.createFloatingPin(group, config.height + 45, 0x00f59b, config.title);

    this.buildingMeshes.set(config.id, group);
    return group;
  }

  createTechBuilding(x, z, config) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Main modern block
    const mainGeo = new THREE.BoxGeometry(config.width, config.height, config.depth);
    const mainMat = new THREE.MeshStandardMaterial({
      color: config.primaryColor,
      roughness: 0.4,
      metalness: 0.6
    });
    const mainMesh = new THREE.Mesh(mainGeo, mainMat);
    mainMesh.position.y = config.height / 2;
    mainMesh.castShadow = true;
    mainMesh.receiveShadow = true;
    group.add(mainMesh);

    // Neon edge lines
    const edges = new THREE.EdgesGeometry(mainGeo);
    const lineMat = new THREE.LineBasicMaterial({ color: config.accentColor });
    const wireframe = new THREE.LineSegments(edges, lineMat);
    wireframe.position.copy(mainMesh.position);
    group.add(wireframe);

    // Rooftop cyber solar/lab pavilion
    const roofGeo = new THREE.BoxGeometry(config.width * 0.5, 4, config.depth * 0.5);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3 });
    const roofMesh = new THREE.Mesh(roofGeo, roofMat);
    roofMesh.position.y = config.height + 2;
    group.add(roofMesh);

    this.attachNodeInteraction(mainMesh, config.id, config.title);
    this.createFloatingPin(group, config.height + 15, config.accentColor, config.title);

    this.buildingMeshes.set(config.id, group);
    return group;
  }

  createGlassLibrary(x, z, config) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Transparent modern cube
    const libGeo = new THREE.BoxGeometry(config.width, config.height, config.depth);
    const libMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.75,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.6,
      ior: 1.5
    });
    const libMesh = new THREE.Mesh(libGeo, libMat);
    libMesh.position.y = config.height / 2;
    libMesh.castShadow = true;
    group.add(libMesh);

    // Neon edge border
    const edges = new THREE.EdgesGeometry(libGeo);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8 });
    const wireframe = new THREE.LineSegments(edges, lineMat);
    wireframe.position.copy(libMesh.position);
    group.add(wireframe);

    // Rooftop stylized open book sculpture
    const bookGeo = new THREE.CylinderGeometry(8, 8, 3, 6);
    const bookMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const bookMesh = new THREE.Mesh(bookGeo, bookMat);
    bookMesh.position.y = config.height + 3;
    group.add(bookMesh);

    this.attachNodeInteraction(libMesh, config.id, config.title);
    this.createFloatingPin(group, config.height + 15, 0x38bdf8, config.title);

    this.buildingMeshes.set(config.id, group);
    return group;
  }

  createCafeteria(x, z, config) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Open pavilion cylindrical base
    const baseGeo = new THREE.CylinderGeometry(18, 20, 10, 16);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.5 });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = 5;
    baseMesh.castShadow = true;
    group.add(baseMesh);

    // Conical colorful glowing roof
    const roofGeo = new THREE.ConeGeometry(22, 12, 16);
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.2
    });
    const roofMesh = new THREE.Mesh(roofGeo, roofMat);
    roofMesh.position.y = 16;
    roofMesh.castShadow = true;
    group.add(roofMesh);

    // Outdoor umbrellas around food court
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const ux = Math.cos(angle) * 24;
      const uz = Math.sin(angle) * 24;
      const umbGeo = new THREE.ConeGeometry(3, 2, 8);
      const umbMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const umb = new THREE.Mesh(umbGeo, umbMat);
      umb.position.set(ux, 3.5, uz);
      group.add(umb);
    }

    this.attachNodeInteraction(baseMesh, config.id, config.title);
    this.createFloatingPin(group, 26, 0xf59e0b, config.title);

    this.buildingMeshes.set(config.id, group);
    return group;
  }

  createMosque(x, z, config) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Main prayer hall cube
    const hallGeo = new THREE.BoxGeometry(26, 16, 26);
    const hallMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 });
    const hallMesh = new THREE.Mesh(hallGeo, hallMat);
    hallMesh.position.y = 8;
    hallMesh.castShadow = true;
    group.add(hallMesh);

    // Golden Central Dome
    const domeGeo = new THREE.SphereGeometry(9, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 0.8,
      roughness: 0.2
    });
    const domeMesh = new THREE.Mesh(domeGeo, domeMat);
    domeMesh.position.y = 16;
    group.add(domeMesh);

    // Elegant tall minaret on northeast corner
    const minaretBase = new THREE.CylinderGeometry(2, 2.5, 42, 12);
    const minaretMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9 });
    const minaret = new THREE.Mesh(minaretBase, minaretMat);
    minaret.position.set(12, 21, 12);
    group.add(minaret);

    // Minaret top crescent cap
    const topCapGeo = new THREE.ConeGeometry(2.5, 6, 8);
    const topCapMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const cap = new THREE.Mesh(topCapGeo, topCapMat);
    cap.position.set(12, 45, 12);
    group.add(cap);

    this.attachNodeInteraction(hallMesh, config.id, config.title);
    this.createFloatingPin(group, 32, 0x10b981, config.title);

    this.buildingMeshes.set(config.id, group);
    return group;
  }

  createWaterLake(x, z, config) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Shimmering reflective water surface
    const lakeGeo = new THREE.PlaneGeometry(65, 38, 16, 16);
    const lakeMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.1,
      metalness: 0.85,
      transparent: true,
      opacity: 0.85
    });
    const lake = new THREE.Mesh(lakeGeo, lakeMat);
    lake.rotation.x = -Math.PI / 2;
    lake.position.y = 0.8;
    group.add(lake);
    group.userData.water = lake;

    // Glowing cyan shoreline ring
    const shoreGeo = new THREE.RingGeometry(24, 26, 32);
    const shoreMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
    });
    const shore = new THREE.Mesh(shoreGeo, shoreMat);
    shore.rotation.x = -Math.PI / 2;
    shore.position.y = 0.9;
    group.add(shore);

    // Small stylized greenery trees around the shore
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const tx = Math.cos(angle) * 32;
      const tz = Math.sin(angle) * 20;
      const tree = this.createTree(tx, tz);
      group.add(tree);
    }

    this.attachNodeInteraction(lake, config.id, config.title);
    this.createFloatingPin(group, 15, 0x06b6d4, config.title);

    this.buildingMeshes.set(config.id, group);
    return group;
  }

  createSportsGround(x, z, config) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Green grass arena turf
    const turfGeo = new THREE.PlaneGeometry(75, 48);
    const turfMat = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      roughness: 0.8
    });
    const turf = new THREE.Mesh(turfGeo, turfMat);
    turf.rotation.x = -Math.PI / 2;
    turf.position.y = 0.8;
    group.add(turf);

    // Cricket pitch strip in the middle
    const pitchGeo = new THREE.PlaneGeometry(18, 5);
    const pitchMat = new THREE.MeshBasicMaterial({ color: 0xd97706 });
    const pitch = new THREE.Mesh(pitchGeo, pitchMat);
    pitch.rotation.x = -Math.PI / 2;
    pitch.position.y = 0.85;
    group.add(pitch);

    // 4 Corner floodlight towers
    const corners = [
      [-36, -23], [36, -23], [-36, 23], [36, 23]
    ];
    corners.forEach(([cx, cz]) => {
      const towerGeo = new THREE.CylinderGeometry(0.5, 0.8, 22, 6);
      const towerMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8 });
      const tower = new THREE.Mesh(towerGeo, towerMat);
      tower.position.set(cx, 11, cz);
      group.add(tower);

      const lampGeo = new THREE.BoxGeometry(3, 1, 2);
      const lampMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
      const lamp = new THREE.Mesh(lampGeo, lampMat);
      lamp.position.set(cx, 22, cz);
      group.add(lamp);
    });

    this.attachNodeInteraction(turf, config.id, config.title);
    this.createFloatingPin(group, 22, 0x22c55e, config.title);

    this.buildingMeshes.set(config.id, group);
    return group;
  }

  createEntranceGate(x, z, config) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Grand archway pillars
    const p1 = new THREE.Mesh(new THREE.BoxGeometry(4, 18, 4), new THREE.MeshStandardMaterial({ color: 0x10b981 }));
    p1.position.set(-12, 9, 0);
    group.add(p1);

    const p2 = new THREE.Mesh(new THREE.BoxGeometry(4, 18, 4), new THREE.MeshStandardMaterial({ color: 0x10b981 }));
    p2.position.set(12, 9, 0);
    group.add(p2);

    // Overhead beam
    const beam = new THREE.Mesh(new THREE.BoxGeometry(28, 4, 5), new THREE.MeshStandardMaterial({ color: 0x064e3b }));
    beam.position.set(0, 18, 0);
    group.add(beam);

    // Glowing welcome banner
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(24, 2), new THREE.MeshBasicMaterial({ color: 0x00f59b }));
    sign.position.set(0, 18, 2.6);
    group.add(sign);

    this.attachNodeInteraction(beam, config.id, config.title);
    this.createFloatingPin(group, 25, 0x10b981, config.title);

    this.buildingMeshes.set(config.id, group);
    return group;
  }

  createTransportTerminal(x, z, config) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Parking lot tarmac
    const lotGeo = new THREE.PlaneGeometry(42, 30);
    const lotMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const lot = new THREE.Mesh(lotGeo, lotMat);
    lot.rotation.x = -Math.PI / 2;
    lot.position.y = 0.8;
    group.add(lot);

    // 2 DIU Campus buses parked
    [-8, 8].forEach(bz => {
      const busGeo = new THREE.BoxGeometry(16, 6, 7);
      const busMat = new THREE.MeshStandardMaterial({ color: 0x059669 });
      const bus = new THREE.Mesh(busGeo, busMat);
      bus.position.set(0, 3.5, bz);
      bus.castShadow = true;
      group.add(bus);

      // Bus roof stripe
      const stripeGeo = new THREE.BoxGeometry(16, 1, 3);
      const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.position.set(0, 6.6, bz);
      group.add(stripe);
    });

    this.attachNodeInteraction(lot, config.id, config.title);
    this.createFloatingPin(group, 16, 0x059669, config.title);

    this.buildingMeshes.set(config.id, group);
    return group;
  }

  createMedicalCenter(x, z, config) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const bGeo = new THREE.BoxGeometry(22, 14, 20);
    const bMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
    const bMesh = new THREE.Mesh(bGeo, bMat);
    bMesh.position.y = 7;
    bMesh.castShadow = true;
    group.add(bMesh);

    // Red Cross emblem on top
    const cross1 = new THREE.Mesh(new THREE.BoxGeometry(6, 1.8, 1.8), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    cross1.position.set(0, 15, 0);
    group.add(cross1);
    const cross2 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.8, 6), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    cross2.position.set(0, 15, 0);
    group.add(cross2);

    this.attachNodeInteraction(bMesh, config.id, config.title);
    this.createFloatingPin(group, 22, 0xef4444, config.title);

    this.buildingMeshes.set(config.id, group);
    return group;
  }

  createStudentVillage(x, z, config) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Cluster of residential student apartment buildings
    for (let i = 0; i < config.count; i++) {
      const offsetX = ((i % 3) - 1) * 16;
      const offsetZ = (Math.floor(i / 3) - 0.5) * 16;
      const h = config.height + ((i % 2) * 8);

      const bGeo = new THREE.BoxGeometry(12, h, 12);
      const bMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.6
      });
      const bMesh = new THREE.Mesh(bGeo, bMat);
      bMesh.position.set(offsetX, h / 2, offsetZ);
      bMesh.castShadow = true;
      group.add(bMesh);

      // Window edges
      const edgeLines = new THREE.LineSegments(
        new THREE.EdgesGeometry(bGeo),
        new THREE.LineBasicMaterial({ color: config.color, transparent: true, opacity: 0.5 })
      );
      edgeLines.position.copy(bMesh.position);
      group.add(edgeLines);
    }

    // Interaction target
    const hitBox = new THREE.Mesh(
      new THREE.BoxGeometry(36, config.height, 36),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitBox.position.y = config.height / 2;
    group.add(hitBox);

    this.attachNodeInteraction(hitBox, config.id, config.title);
    this.createFloatingPin(group, config.height + 18, config.color, config.title);

    this.buildingMeshes.set(config.id, group);
    this.scene.add(group);
    return group;
  }

  createBeaconNode(x, z, config) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const poleGeo = new THREE.CylinderGeometry(0.8, 1.2, 16, 8);
    const poleMat = new THREE.MeshBasicMaterial({ color: config.color });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.y = 8;
    group.add(pole);

    this.attachNodeInteraction(pole, config.id, config.title);
    this.createFloatingPin(group, 22, config.color, config.title);

    this.buildingMeshes.set(config.id, group);
    this.scene.add(group);
    return group;
  }

  createTree(x, z) {
    const treeGroup = new THREE.Group();
    treeGroup.position.set(x, 0, z);

    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.8, 4, 6),
      new THREE.MeshStandardMaterial({ color: 0x5c4033 })
    );
    trunk.position.y = 2;
    treeGroup.add(trunk);

    const foliage = new THREE.Mesh(
      new THREE.ConeGeometry(3.5, 7, 7),
      new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.7 })
    );
    foliage.position.y = 6;
    treeGroup.add(foliage);

    return treeGroup;
  }

  createFloatingPin(parentGroup, yHeight, colorHex, title) {
    // Holographic diamond beacon above the landmark
    const pinGeo = new THREE.OctahedronGeometry(2.8, 0);
    const pinMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.8
    });
    const pin = new THREE.Mesh(pinGeo, pinMat);
    pin.position.y = yHeight;
    parentGroup.add(pin);

    // Glowing vertical pulse ring
    const ringGeo = new THREE.RingGeometry(3.5, 4.2, 16);
    const ringMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = yHeight - 2;
    parentGroup.add(ring);

    parentGroup.userData.pin = pin;
    parentGroup.userData.ring = ring;
    parentGroup.userData.baseY = yHeight;
  }

  createAtmosphereParticles() {
    // Ambient cyber dust particles floating over campus
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 800;
      positions[i + 1] = Math.random() * 120 + 5;
      positions[i + 2] = (Math.random() - 0.5) * 800;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x10b981,
      size: 2.2,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  attachNodeInteraction(mesh, nodeId, title) {
    mesh.userData = { nodeId, title, isInteractable: true };
    this.interactiveObjects.push(mesh);
  }

  // ================= 3D ROUTE VISUALIZATION =================
  highlightRoute(pathNodes) {
    // Remove previous route line if any
    if (this.activeRouteLine) {
      this.scene.remove(this.activeRouteLine);
      this.activeRouteLine = null;
    }

    if (!pathNodes || pathNodes.length < 2) return;

    // Create a 3D spline/line along the path
    const points = [];
    pathNodes.forEach(node => {
      const p = this.geoTo3D(node.lat, node.lng);
      points.push(new THREE.Vector3(p.x, 3.5, p.z));
    });

    // Create curved tube geometry for a 3D glowing laser ribbon
    const curve = new THREE.CatmullRomCurve3(points);
    const tubeGeo = new THREE.TubeGeometry(curve, 64, 1.6, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({
      color: 0x00f59b,
      transparent: true,
      opacity: 0.95
    });

    this.activeRouteLine = new THREE.Mesh(tubeGeo, tubeMat);
    this.scene.add(this.activeRouteLine);

    // Animate camera to frame the start and destination
    this.focusOnPath(pathNodes);
  }

  focusOnPath(pathNodes) {
    if (!this.controls || !pathNodes.length) return;
    const startP = this.geoTo3D(pathNodes[0].lat, pathNodes[0].lng);
    const endP = this.geoTo3D(pathNodes[pathNodes.length - 1].lat, pathNodes[pathNodes.length - 1].lng);

    const midX = (startP.x + endP.x) / 2;
    const midZ = (startP.z + endP.z) / 2;

    // Smoothly pan camera target to route center
    this.controls.target.set(midX, 0, midZ);
  }

  resetCamera(viewMode = 'iso') {
    if (!this.controls) return;
    if (viewMode === 'iso') {
      this.camera.position.set(0, 380, 480);
      this.controls.target.set(0, 0, 0);
    } else if (viewMode === 'top') {
      this.camera.position.set(0, 650, 10);
      this.controls.target.set(0, 0, 0);
    } else if (viewMode === 'tower') {
      const ktPos = this.geoTo3D(23.8778, 90.3206);
      this.camera.position.set(ktPos.x + 80, 120, ktPos.z + 120);
      this.controls.target.set(ktPos.x, 40, ktPos.z);
    }
  }

  toggleAutoRotate() {
    this.isAutoRotating = !this.isAutoRotating;
    if (this.controls) this.controls.autoRotate = this.isAutoRotating;
    return this.isAutoRotating;
  }

  // ================= RAYCASTING & INTERACTION =================
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
    tip.textContent = text;
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

  // ================= RENDER LOOP =================
  animate() {
    requestAnimationFrame(this.animate);
    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Rotate Knowledge Tower beacon beam
    const ktGroup = this.buildingMeshes.get("knowledge_tower");
    if (ktGroup && ktGroup.userData.beaconBeam) {
      ktGroup.userData.beaconBeam.rotation.y += 0.02;
    }

    // Animate floating pin diamonds (gentle bobbing & rotation)
    this.buildingMeshes.forEach(group => {
      if (group.userData.pin) {
        group.userData.pin.rotation.y += 0.015;
        group.userData.pin.position.y = group.userData.baseY + Math.sin(time * 2) * 1.5;
      }
      if (group.userData.ring) {
        const scale = 1 + Math.sin(time * 3) * 0.15;
        group.userData.ring.scale.set(scale, scale, scale);
      }
    });

    // Animate particles
    if (this.particles) {
      const positions = this.particles.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += delta * 4;
        if (positions[i] > 120) positions[i] = 5;
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
    }

    if (this.controls) this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

window.Campus3DViewer = Campus3DViewer;
