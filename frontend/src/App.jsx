import { useState, useEffect } from "react";
import { fetchSchedule, fetchDrivers, fetchTelemetry } from "./api";
import TelemetryChart from "./components/TelemetryChart";
import DeltaChart from "./components/DeltaChart";
import "./App.css";

export default function App() {
  const [schedule, setSchedule] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [session, setSession] = useState("Q");
  const [selectedRound, setSelectedRound] = useState(null);
  const [selectedDrivers, setSelectedDrivers] = useState([]);
  const [telemetry, setTelemetry] = useState(null); 
  const [loading, setLoading] = useState(false);

  const [driverColors, setDriverColors] = useState({});

useEffect(() => {
    fetchSchedule().then(setSchedule);
  }, []);

const toggleDriver = (abbr) => {
  setSelectedDrivers(prev => {
    if (prev.includes(abbr)) {
      return prev.filter(d => d !== abbr);
    }
    if (prev.length >= 6) return prev;
    return [...prev, abbr];
  });
};


const onRoundChange = async (round) => {
  setSelectedRound(round);
  setDrivers([]);
  setSelectedDrivers([]);
  setTelemetry(null);
  const data = await fetchDrivers(round, session);
  setDrivers(data);
  const colors = {};
  data.forEach(d => { colors[d.Abbreviation] = `#${d.TeamColor}`; });
  setDriverColors(colors);
};

const onSessionChange = async (s) => {
  setSession(s);
  setSelectedDrivers([]);
  setTelemetry(null);
  if (selectedRound) {
    setDrivers([]);
    const data = await fetchDrivers(selectedRound, s);
    setDrivers(data);
    const colors = {};
    data.forEach(d => { colors[d.Abbreviation] = `#${d.TeamColor}`; });
    setDriverColors(colors);
  }
};

const onCompare = async () => {
  setLoading(true);
  setTelemetry(null);
  const data = await fetchTelemetry(2024, selectedRound, session, selectedDrivers);
  setTelemetry(data);
  setLoading(false);
};

const getColor = (abbr) => driverColors[abbr] || "#888888";



  return (
    <div className="app">
      <header className="header">
        <h1><span>Virtual</span> Pit Wall</h1>
        <div className="header-badge">F1 · 2024</div>
      </header>

      <div className="controls">
  <div className="control-group">
    <span className="control-label">Race</span>
    <select onChange={e => onRoundChange(Number(e.target.value))}>
      <option value="">— Select Race —</option>
      {schedule.map(r => (
        <option key={r.RoundNumber} value={r.RoundNumber}>
          R{r.RoundNumber} · {r.EventName}
        </option>
      ))}
    </select>
  </div>

  <div className="control-group" style={{ maxWidth: 140 }}>
    <span className="control-label">Session</span>
    <select onChange={e => onSessionChange(e.target.value)} value={session}>
      {["Q", "R", "FP1", "FP2", "FP3"].map(s => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  </div>

  <button
    className="compare-btn"
    onClick={onCompare}
    disabled={selectedDrivers.length < 2 || !selectedRound || loading}
  >
    {loading ? "Loading..." : "Compare Laps"}
  </button>
</div>

{/* Driver picker grid — shown once a round is selected */}
{drivers.length > 0 && (
  <div className="driver-picker">
    <div className="driver-picker-header">
      <span className="control-label">Select Drivers</span>
      <span className="driver-picker-hint">
        {selectedDrivers.length} selected · max 6
      </span>
    </div>
    <div className="driver-grid">
      {drivers.map(d => {
        const active = selectedDrivers.includes(d.Abbreviation);
        const color = `#${d.TeamColor}`;
        return (
          <button
            key={d.Abbreviation}
            className={`driver-chip ${active ? "active" : ""}`}
            style={active ? { borderColor: color, boxShadow: `0 0 8px ${color}40` } : {}}
            onClick={() => toggleDriver(d.Abbreviation)}
            disabled={!active && selectedDrivers.length >= 6}
          >
            <span className="chip-dot" style={{ background: active ? color : "#2a2a2a" }} />
            <span className="chip-abbr" style={{ color: active ? color : "#555" }}>
              {d.Abbreviation}
            </span>
            <span className="chip-name">{d.FullName}</span>
          </button>
        );
      })}
    </div>
  </div>
)}

      {loading && (
        <div className="loading">
          <div className="loading-dot" />
          FETCHING TELEMETRY FROM F1 SERVERS...
        </div>
      )}

{telemetry && (
  <>
    <div className="meta-bar">
      {telemetry.drivers.map(drv => (
        <div key={drv} className="meta-card"
          style={{ borderTop: `2px solid ${getColor(drv)}` }}>
          <span className="meta-label">
            {drv === telemetry.baseDriver ? "Base" : "vs Base"}
          </span>
          <span className="meta-driver" style={{ color: getColor(drv) }}>{drv}</span>
          <span className="meta-laptime">
            {telemetry.meta[drv]?.lapTime?.slice(11, 22)}
          </span>
          <span className="meta-label">{telemetry.meta[drv]?.compound}</span>
        </div>
      ))}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
        <div className="legend">
          {telemetry.drivers.map(drv => (
            <div key={drv} className="legend-item">
              <div className="legend-line"
                style={{ background: getColor(drv), boxShadow: `0 0 6px ${getColor(drv)}` }} />
              {drv}
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="charts-section">
      <DeltaChart data={telemetry} driverColors={driverColors} />
      {["Speed", "Throttle", "Brake", "RPM", "nGear"].map(ch => (
        <TelemetryChart key={ch} data={telemetry} channel={ch} driverColors={driverColors} />
      ))}
    </div>
  </>
)}
    </div>
  );
}