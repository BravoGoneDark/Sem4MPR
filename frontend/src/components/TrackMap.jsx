import { useMemo } from "react";

export default function TrackMap({ data, driverColors, hoverIndex }) {
  const WIDTH = 500;
  const HEIGHT = 400;
  const PADDING = 30;

  const rawX = data.trackMap.x;
  const rawY = data.trackMap.y;

  const minX = Math.min(...rawX);
  const maxX = Math.max(...rawX);
  const minY = Math.min(...rawY);
  const maxY = Math.max(...rawY);

  const scaleX = (x) =>
    PADDING + ((x - minX) / (maxX - minX)) * (WIDTH - 2 * PADDING);
  const scaleY = (y) =>
    PADDING + ((y - minY) / (maxY - minY)) * (HEIGHT - 2 * PADDING);

  const points = useMemo(() => rawX.map((x, i) => ({
    x: scaleX(x),
    y: scaleY(rawY[i]),
  })), [data]);

  const drivers = data.drivers;

  const getColorAtIndex = (i) => {
    let fastestDriver = null;
    let highestSpeed = -Infinity;
    for (const driver of drivers) {
      const speed = data[driver]?.Speed?.[i];
      if (speed !== undefined && speed > highestSpeed) {
        highestSpeed = speed;
        fastestDriver = driver;
      }
    }
    return driverColors[fastestDriver] || "#333";
  };

  // Memoize segments so they don't re-render on every hover
  const segments = useMemo(() => {
    const segs = [];
    for (let i = 0; i < points.length - 1; i++) {
      const telIndex = Math.floor((i / points.length) * 1000);
      const color = getColorAtIndex(telIndex);
      segs.push(
        <line
          key={i}
          x1={points[i].x}
          y1={points[i].y}
          x2={points[i + 1].x}
          y2={points[i + 1].y}
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
        />
      );
    }
    return segs;
  }, [data, driverColors]);

  // Hover dot — this is the only thing that re-renders on hover
  let hoverDot = null;
  if (hoverIndex !== null && hoverIndex !== undefined) {
    const pointIndex = Math.min(
      Math.floor((hoverIndex / 1000) * points.length),
      points.length - 1
    );
    const hoverPoint = points[pointIndex];
    if (hoverPoint) {
      hoverDot = (
        <>
          <circle cx={hoverPoint.x} cy={hoverPoint.y} r={10}
            fill="transparent" stroke="white" strokeWidth={2} opacity={0.3} />
          <circle cx={hoverPoint.x} cy={hoverPoint.y} r={5}
            fill="white" opacity={0.9} />
        </>
      );
    }
  }

  return (
    <div className="chart-wrapper" style={{ marginBottom: "24px" }}>
      <div className="chart-title">TRACK MAP — colored by fastest driver at each point</div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <svg width={WIDTH} height={HEIGHT} style={{ background: "transparent" }}>
          {segments}
          {hoverDot}
        </svg>
      </div>
    </div>
  );
}