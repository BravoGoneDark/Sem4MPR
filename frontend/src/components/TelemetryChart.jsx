import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function TelemetryChart({ data, channel, driverColors }) {
  const drivers = data.drivers;
  const getColor = (drv) => driverColors[drv] || "#888888";

  const chartData = data.distance.map((d, i) => {
    const point = { dist: Math.round(d) };
    drivers.forEach(drv => { point[drv] = data[drv]?.[channel]?.[i]; });
    return point;
  });

  return (
    <div className="chart-wrapper">
      <div className="chart-title">{channel}</div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={chartData} syncId="pitwall" margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
          <CartesianGrid strokeDasharray="1 4" stroke="#151515" vertical={false} />
          <XAxis dataKey="dist" tick={{ fill: "#666", fontSize: 9, fontFamily: "monospace" }} axisLine={{ stroke: "#1a1a1a" }} tickLine={false} />
          <YAxis tick={{ fill: "#666", fontSize: 11, fontFamily: "monospace" }} width={38} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "#0d0d0d", border: "1px solid #222", color: "white", fontFamily: "monospace", fontSize: 12 }}
            labelStyle={{ color: "#555", marginBottom: 4 }}
            formatter={(v, name) => [v?.toFixed(1), name]}
          />
          {drivers.map(drv => (
            <Line key={drv} type="monotone" dataKey={drv} stroke={getColor(drv)}
              dot={false} strokeWidth={1.5} isAnimationActive={false}
              style={{ filter: `drop-shadow(0 0 3px ${getColor(drv)})` }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}