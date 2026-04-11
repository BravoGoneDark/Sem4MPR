import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";

export default function DeltaChart({ data, driverColors }) {
  const baseDriver = data.baseDriver;
  const compDrivers = Object.keys(data.delta);
  const getColor = (drv) => driverColors[drv] || "#888888";

  const chartData = data.distance.map((d, i) => {
    const point = { dist: Math.round(d) };
    compDrivers.forEach(drv => {
      point[drv] = parseFloat(data.delta[drv][i]?.toFixed(3));
    });
    return point;
  });

  return (
    <div className="chart-wrapper">
      <div className="chart-title">
        Δ TIME DELTA (s) — negative = faster than{" "}
        <span style={{ color: getColor(baseDriver) }}>{baseDriver}</span>
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <LineChart data={chartData} syncId="pitwall" margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
          <CartesianGrid strokeDasharray="1 4" stroke="#151515" vertical={false} />
          <XAxis dataKey="dist" tick={{ fill: "#666", fontSize: 9, fontFamily: "monospace" }} axisLine={{ stroke: "#1a1a1a" }} tickLine={false} />
          <YAxis tick={{ fill: "#666", fontSize: 10, fontFamily: "monospace" }} width={38} axisLine={false} tickLine={false} />
          <ReferenceLine y={0} stroke="#333" strokeWidth={1} strokeDasharray="4 2" />
          <Tooltip
            contentStyle={{ background: "#0d0d0d", border: "1px solid #222", color: "white", fontFamily: "monospace", fontSize: 12 }}
            formatter={(v, name) => [`${v > 0 ? "+" : ""}${v}s`, name]}
          />
          {compDrivers.map(drv => (
            <Line key={drv} type="monotone" dataKey={drv} stroke={getColor(drv)}
              dot={false} strokeWidth={1.5} isAnimationActive={false}
              style={{ filter: `drop-shadow(0 0 3px ${getColor(drv)})` }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}