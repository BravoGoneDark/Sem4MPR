export const constructors = [
  {
    id: "redbull",
    logoscale: "200px",
    modelScale: 1.2,
    meshCount: 7,
    name: "Red Bull Racing",
    car: "RB20",
    teamColor: "#3671C6",
    logo: "/logos/redbull.webp",
    preview: "/previews/redbull.jpg",
    model: "/models/redbull.glb",
    stats: {
      topSpeed:     { value: 373, unit: "km/h",  higherIsBetter: true  },
      acceleration: { value: 2.5, unit: "s",      higherIsBetter: false },
      braking:      { value: 15,  unit: "m",      higherIsBetter: false },
      downforce:    { value: 800, unit: "kg",     higherIsBetter: true  },
      drsGain:      { value: 20,  unit: "km/h",   higherIsBetter: true  },
      power:        { value: 1050,unit: "hp",     higherIsBetter: true  },
    },
  },
  {
    id: "mercedes",
    logoscale: "250px",
    modelScale: 1.7,
    meshCount: 9,
    name: "Mercedes AMG",
    car: "W15",
    teamColor: "#27F4D2",
    logo: "/logos/mercedes.webp",
    preview: "/previews/mercedes.jpg",
    model: "/models/mercedes.glb",
    stats: {
      topSpeed:     { value: 368, unit: "km/h",  higherIsBetter: true  },
      acceleration: { value: 2.8, unit: "s",      higherIsBetter: false },
      braking:      { value: 17,  unit: "m",      higherIsBetter: false },
      downforce:    { value: 710, unit: "kg",     higherIsBetter: true  },
      drsGain:      { value: 16,  unit: "km/h",   higherIsBetter: true  },
      power:        { value: 1020,unit: "hp",     higherIsBetter: true  },
    },
  },
  {
    id: "mclaren",
    logoscale: "200px",
    modelScale: 0.8,
    meshCount: 8,
    name: "McLaren",
    car: "MCL38",
    teamColor: "#FF8000",
    logo: "/logos/mclaren.png",
    preview: "/previews/mclaren.jpg",
    model: "/models/mclaren.glb",
    stats: {
      topSpeed:     { value: 371, unit: "km/h",  higherIsBetter: true  },
      acceleration: { value: 2.6, unit: "s",      higherIsBetter: false },
      braking:      { value: 16,  unit: "m",      higherIsBetter: false },
      downforce:    { value: 760, unit: "kg",     higherIsBetter: true  },
      drsGain:      { value: 19,  unit: "km/h",   higherIsBetter: true  },
      power:        { value: 1010,unit: "hp",     higherIsBetter: true  },
    },
  },
  {
    id: "ferrari",
    logoscale: "160px",
    meshCount: 7,
    name: "Ferrari",
    car: "SF-24",
    teamColor: "#E8002D",
    logo: "/logos/ferrari.png",
    preview: "/previews/ferrari.jpg",
    model: "/models/ferrari.glb",
    stats: {
      topSpeed:     { value: 372, unit: "km/h",  higherIsBetter: true  },
      acceleration: { value: 2.6, unit: "s",      higherIsBetter: false },
      braking:      { value: 16,  unit: "m",      higherIsBetter: false },
      downforce:    { value: 770, unit: "kg",     higherIsBetter: true  },
      drsGain:      { value: 18,  unit: "km/h",   higherIsBetter: true  },
      power:        { value: 1040,unit: "hp",     higherIsBetter: true  },
    },
  },
  {
    id: "williams",
    modelScale: 0.8,
    logoscale: "200px",
    meshCount: 44,
    name: "Williams Racing",
    car: "FW46",
    teamColor: "#64C4FF",
    logo: "/logos/williams.png",
    preview: "/previews/williams.jpg",
    model: "/models/williams.glb",
    stats: {
      topSpeed:     { value: 362, unit: "km/h",  higherIsBetter: true  },
      acceleration: { value: 3.1, unit: "s",      higherIsBetter: false },
      braking:      { value: 21,  unit: "m",      higherIsBetter: false },
      downforce:    { value: 620, unit: "kg",     higherIsBetter: true  },
      drsGain:      { value: 13,  unit: "km/h",   higherIsBetter: true  },
      power:        { value: 980, unit: "hp",     higherIsBetter: true  },
    },
  },
  {
    id: "haas",
    logoscale: "200px",
    meshCount: 46,
    name: "Haas F1 Team",
    car: "VF-24",
    teamColor: "#B6BABD",
    logo: "/logos/haas.webp",
    preview: "/previews/haas.jpg",
    model: "/models/haas.glb",
    stats: {
      topSpeed:     { value: 360, unit: "km/h",  higherIsBetter: true  },
      acceleration: { value: 3.2, unit: "s",      higherIsBetter: false },
      braking:      { value: 22,  unit: "m",      higherIsBetter: false },
      downforce:    { value: 600, unit: "kg",     higherIsBetter: true  },
      drsGain:      { value: 12,  unit: "km/h",   higherIsBetter: true  },
      power:        { value: 975, unit: "hp",     higherIsBetter: true  },
    },
  },
  {
    id: "alpine",
    logoscale: "200px",
    modelScale: 0.11,
    meshCount: 9,
    name: "Alpine F1 Team",
    car: "A524",
    teamColor: "#FF87BC",
    logo: "/logos/alpine.png",
    preview: "/previews/alpine.jpg",
    model: "/models/alpine.glb",
    stats: {
      topSpeed:     { value: 364, unit: "km/h",  higherIsBetter: true  },
      acceleration: { value: 2.9, unit: "s",      higherIsBetter: false },
      braking:      { value: 20,  unit: "m",      higherIsBetter: false },
      downforce:    { value: 650, unit: "kg",     higherIsBetter: true  },
      drsGain:      { value: 14,  unit: "km/h",   higherIsBetter: true  },
      power:        { value: 990, unit: "hp",     higherIsBetter: true  },
    },
  },
];

export function normalizeStats(constructors) {
  const statKeys = Object.keys(constructors[0].stats);
  const normalized = {};
  statKeys.forEach((key) => {
    const allValues = constructors.map((c) => c.stats[key].value);
    const max = Math.max(...allValues);
    const min = Math.min(...allValues);
    const higherIsBetter = constructors[0].stats[key].higherIsBetter;
    normalized[key] = constructors.map((c) => ({
      id: c.id,
      normalized: higherIsBetter
        ? (c.stats[key].value / max) * 100
        : (min / c.stats[key].value) * 100,
    }));
  });
  return normalized;
}