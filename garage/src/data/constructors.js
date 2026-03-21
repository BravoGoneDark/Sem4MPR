export const constructors = [
  {
    id: "redbull",
    name: "Red Bull Racing",
    car: "RB20",
    teamColor: "#3671C6",
    logo: "/logos/redbull.png",
    preview: "/previews/redbull.jpg",
    model: "/models/redbull.glb",
    stats: {
      topSpeed:     { value: 373, unit: "km/h",  higherIsBetter: true  },
      acceleration: { value: 2.6, unit: "s",      higherIsBetter: false },
      braking:      { value: 17,  unit: "m",      higherIsBetter: false },
      downforce:    { value: 750, unit: "kg",     higherIsBetter: true  },
      drsGain:      { value: 18,  unit: "km/h",   higherIsBetter: true  },
      power:        { value: 1000,unit: "hp",     higherIsBetter: true  },
    },
  },
  {
    id: "mercedes",
    name: "Mercedes AMG",
    car: "W15",
    teamColor: "#27F4D2",
    logo: "/logos/mercedes.png",
    preview: "/previews/mercedes.jpg",
    model: "/models/mercedes.glb",
    stats: {
      topSpeed:     { value: 369, unit: "km/h",  higherIsBetter: true  },
      acceleration: { value: 2.7, unit: "s",      higherIsBetter: false },
      braking:      { value: 18,  unit: "m",      higherIsBetter: false },
      downforce:    { value: 720, unit: "kg",     higherIsBetter: true  },
      drsGain:      { value: 16,  unit: "km/h",   higherIsBetter: true  },
      power:        { value: 1000,unit: "hp",     higherIsBetter: true  },
    },
  },
  {
    id: "mclaren",
    name: "McLaren",
    car: "MCL38",
    teamColor: "#FF8000",
    logo: "/logos/mclaren.png",
    preview: "/previews/mclaren.jpg",
    model: "/models/mclaren.glb",
    stats: {
      topSpeed:     { value: 368, unit: "km/h",  higherIsBetter: true  },
      acceleration: { value: 2.7, unit: "s",      higherIsBetter: false },
      braking:      { value: 17,  unit: "m",      higherIsBetter: false },
      downforce:    { value: 730, unit: "kg",     higherIsBetter: true  },
      drsGain:      { value: 17,  unit: "km/h",   higherIsBetter: true  },
      power:        { value: 990, unit: "hp",     higherIsBetter: true  },
    },
  },
  {
    id: "ferrari",
    name: "Ferrari",
    car: "SF-24",
    teamColor: "#E8002D",
    logo: "/logos/ferrari.png",
    preview: "/previews/ferrari.jpg",
    model: "/models/ferrari.glb",
    stats: {
      topSpeed:     { value: 371, unit: "km/h",  higherIsBetter: true  },
      acceleration: { value: 2.6, unit: "s",      higherIsBetter: false },
      braking:      { value: 17,  unit: "m",      higherIsBetter: false },
      downforce:    { value: 740, unit: "kg",     higherIsBetter: true  },
      drsGain:      { value: 17,  unit: "km/h",   higherIsBetter: true  },
      power:        { value: 1000,unit: "hp",     higherIsBetter: true  },
    },
  },
  {
    id: "williams",
    name: "Williams Racing",
    car: "FW46",
    teamColor: "#64C4FF",
    logo: "/logos/williams.png",
    preview: "/previews/williams.jpg",
    model: "/models/williams.glb",
    stats: {
      topSpeed:     { value: 365, unit: "km/h",  higherIsBetter: true  },
      acceleration: { value: 2.9, unit: "s",      higherIsBetter: false },
      braking:      { value: 19,  unit: "m",      higherIsBetter: false },
      downforce:    { value: 680, unit: "kg",     higherIsBetter: true  },
      drsGain:      { value: 15,  unit: "km/h",   higherIsBetter: true  },
      power:        { value: 990, unit: "hp",     higherIsBetter: true  },
    },
  },
  {
    id: "haas",
    name: "Haas F1 Team",
    car: "VF-24",
    teamColor: "#B6BABD",
    logo: "/logos/haas.png",
    preview: "/previews/haas.jpg",
    model: "/models/haas.glb",
    stats: {
      topSpeed:     { value: 364, unit: "km/h",  higherIsBetter: true  },
      acceleration: { value: 2.9, unit: "s",      higherIsBetter: false },
      braking:      { value: 19,  unit: "m",      higherIsBetter: false },
      downforce:    { value: 670, unit: "kg",     higherIsBetter: true  },
      drsGain:      { value: 15,  unit: "km/h",   higherIsBetter: true  },
      power:        { value: 990, unit: "hp",     higherIsBetter: true  },
    },
  },
  {
    id: "alpine",
    name: "Alpine F1 Team",
    car: "A524",
    teamColor: "#FF87BC",
    logo: "/logos/alpine.png",
    preview: "/previews/alpine.jpg",
    model: "/models/alpine.glb",
    stats: {
      topSpeed:     { value: 366, unit: "km/h",  higherIsBetter: true  },
      acceleration: { value: 2.8, unit: "s",      higherIsBetter: false },
      braking:      { value: 18,  unit: "m",      higherIsBetter: false },
      downforce:    { value: 700, unit: "kg",     higherIsBetter: true  },
      drsGain:      { value: 16,  unit: "km/h",   higherIsBetter: true  },
      power:        { value: 985, unit: "hp",     higherIsBetter: true  },
    },
  },
];

// Normalization utility — used by StatsRadar
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