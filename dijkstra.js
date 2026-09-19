/**
 * DIU Smart Campus Navigator - Dijkstra Shortest Path Engine
 * Supports Walking mode (includes shortcuts, footpaths, pedestrian gates)
 * and Rickshaw mode (paved roads only, calculates estimated fare & time).
 */

class CampusGraph {
  constructor(nodes, edges) {
    this.nodes = new Map();
    this.adjacencyList = new Map();

    // Index all nodes by id
    nodes.forEach(node => {
      this.nodes.set(node.id, node);
      this.adjacencyList.set(node.id, []);
    });

    // Build bidirectional adjacency list
    edges.forEach(edge => {
      const fromNode = this.nodes.get(edge.from);
      const toNode = this.nodes.get(edge.to);

      if (!fromNode || !toNode) {
        console.warn(`Edge connects unknown node: ${edge.from} <-> ${edge.to}`);
        return;
      }

      // Forward edge
      this.adjacencyList.get(edge.from).push({
        to: edge.to,
        distance: edge.distance,
        walkTimeSec: edge.walkTimeSec || Math.round(edge.distance / 1.3),
        rickshawTimeSec: edge.rickshawTimeSec,
        rickshawFareBDT: edge.rickshawFareBDT,
        type: edge.type,
        accessible: edge.accessible
      });

      // Reverse edge (bidirectional roads)
      this.adjacencyList.get(edge.to).push({
        to: edge.from,
        distance: edge.distance,
        walkTimeSec: edge.walkTimeSec || Math.round(edge.distance / 1.3),
        rickshawTimeSec: edge.rickshawTimeSec,
        rickshawFareBDT: edge.rickshawFareBDT,
        type: edge.type,
        accessible: edge.accessible
      });
    });
  }

  /**
   * Find shortest path using Dijkstra's Algorithm
   * @param {string} startId - Starting node ID
   * @param {string} endId - Destination node ID
   * @param {string} mode - 'walking' | 'rickshaw'
   * @returns {Object|null} Path analysis object or null if unreachable
   */
  findShortestPath(startId, endId, mode = 'walking') {
    if (!this.nodes.has(startId) || !this.nodes.has(endId)) {
      return null;
    }

    if (startId === endId) {
      const node = this.nodes.get(startId);
      return {
        path: [node],
        coordinates: [[node.lat, node.lng]],
        totalDistance: 0,
        walkTimeSec: 0,
        rickshawTimeSec: 0,
        estimatedFareBDT: 0,
        mode: mode,
        steps: [
          {
            instruction: `You are already at ${node.name} (${node.bengaliName}).`,
            bengaliInstruction: `আপনি ইতিমধ্যে ${node.bengaliName}-এ আছেন।`,
            distance: 0,
            icon: "fa-solid fa-location-dot"
          }
        ]
      };
    }

    const distances = new Map();
    const previous = new Map();
    const visited = new Set();
    const edgeUsed = new Map();

    // Min-priority queue simulated with array
    const pq = [];

    this.nodes.forEach((_, id) => {
      distances.set(id, Infinity);
      previous.set(id, null);
      edgeUsed.set(id, null);
    });

    distances.set(startId, 0);
    pq.push({ id: startId, dist: 0 });

    while (pq.length > 0) {
      // Extract node with smallest distance
      pq.sort((a, b) => a.dist - b.dist);
      const current = pq.shift();
      const currentId = current.id;

      if (currentId === endId) break;
      if (visited.has(currentId)) continue;
      visited.add(currentId);

      const neighbors = this.adjacencyList.get(currentId) || [];

      for (const edge of neighbors) {
        // If mode is rickshaw, we can ONLY traverse paved_road
        if (mode === 'rickshaw' && edge.type !== 'paved_road') {
          continue;
        }

        const neighborId = edge.to;
        if (visited.has(neighborId)) continue;

        const weight = edge.distance;
        const newDist = distances.get(currentId) + weight;

        if (newDist < distances.get(neighborId)) {
          distances.set(neighborId, newDist);
          previous.set(neighborId, currentId);
          edgeUsed.set(neighborId, edge);
          pq.push({ id: neighborId, dist: newDist });
        }
      }
    }

    // If destination unreachable in chosen mode
    if (distances.get(endId) === Infinity) {
      return null;
    }

    // Reconstruct path
    const pathIds = [];
    let curr = endId;
    while (curr) {
      pathIds.unshift(curr);
      curr = previous.get(curr);
    }

    const pathNodes = pathIds.map(id => this.nodes.get(id));
    const coordinates = pathNodes.map(n => [n.lat, n.lng]);

    // Calculate aggregated metrics
    let totalDistance = 0;
    let totalWalkSec = 0;
    let totalRickshawSec = 0;
    let hasRickshawPortion = false;

    for (let i = 1; i < pathIds.length; i++) {
      const edge = edgeUsed.get(pathIds[i]);
      if (edge) {
        totalDistance += edge.distance;
        totalWalkSec += edge.walkTimeSec || Math.round(edge.distance / 1.3);
        if (edge.rickshawTimeSec) {
          totalRickshawSec += edge.rickshawTimeSec;
          hasRickshawPortion = true;
        } else {
          totalRickshawSec += edge.walkTimeSec; // must walk on non-paved segments
        }
      }
    }

    // Rickshaw fare formula: Base ৳15 for first 500m + ৳8 per next 500m
    let estimatedFareBDT = 0;
    if (mode === 'rickshaw' || hasRickshawPortion) {
      estimatedFareBDT = Math.max(15, Math.round(15 + Math.max(0, (totalDistance - 400) / 500) * 10));
    }

    // Generate Turn-by-Turn instructions with Bengali & English cues
    const steps = [];
    for (let i = 0; i < pathNodes.length - 1; i++) {
      const fromN = pathNodes[i];
      const toN = pathNodes[i + 1];
      const edge = edgeUsed.get(toN.id);
      const segmentDist = edge ? edge.distance : 0;
      const roadType = edge ? edge.type : 'road';

      let roadTypeLabel = "walkway";
      let roadTypeBn = "হাঁটার রাস্তা";
      let icon = "fa-solid fa-person-walking";

      if (roadType === 'paved_road') {
        roadTypeLabel = mode === 'rickshaw' ? "paved road (Rickshaw lane)" : "paved main road";
        roadTypeBn = mode === 'rickshaw' ? "পাকা রাস্তা (রিকশা চলাচলের উপযোগী)" : "পাকা প্রধান সড়ক";
        icon = mode === 'rickshaw' ? "fa-solid fa-car-side" : "fa-solid fa-road";
      } else if (roadType === 'shortcut_alley') {
        roadTypeLabel = "shortcut alleyway (pedestrians only)";
        roadTypeBn = "শর্টকাট গলি (শুধু হাঁটার জন্য)";
        icon = "fa-solid fa-shoe-prints";
      }

      steps.push({
        stepNumber: i + 1,
        fromNode: fromN,
        toNode: toN,
        distance: segmentDist,
        roadType: roadType,
        icon: icon,
        instruction: `Head from ${fromN.name} towards ${toN.name} via ${roadTypeLabel} (~${segmentDist}m).`,
        bengaliInstruction: `${fromN.bengaliName} থেকে ${roadTypeBn} ধরে ${toN.bengaliName}-এর দিকে এগিয়ে যান (~${segmentDist} মিটার)।`
      });
    }

    // Add final arrival step
    const destNode = pathNodes[pathNodes.length - 1];
    steps.push({
      stepNumber: steps.length + 1,
      fromNode: destNode,
      toNode: destNode,
      distance: 0,
      icon: "fa-solid fa-flag-checkered",
      instruction: `Arrive at destination: ${destNode.name}.`,
      bengaliInstruction: `গন্তব্যে পৌঁছে গেছেন: ${destNode.bengaliName}!`
    });

    return {
      path: pathNodes,
      coordinates: coordinates,
      totalDistance: Math.round(totalDistance),
      walkTimeSec: totalWalkSec,
      walkTimeMin: Math.ceil(totalWalkSec / 60),
      rickshawTimeSec: totalRickshawSec,
      rickshawTimeMin: Math.ceil(totalRickshawSec / 60),
      estimatedFareBDT: estimatedFareBDT,
      mode: mode,
      steps: steps
    };
  }
}

// Export for browser global
window.CampusGraph = CampusGraph;
