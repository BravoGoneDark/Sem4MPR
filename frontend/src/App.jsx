import { useState, useEffect, useCallback, useRef } from "react";
import { fetchSchedule, fetchDrivers, fetchTelemetry, fetchDriverLaps } from "./api";import TelemetryChart from "./components/TelemetryChart";
import DeltaChart from "./components/DeltaChart";
import TrackMap from "./components/TrackMap";
import "./App.css";

const FALLBACK_COLORS = [
  "#e8002d", "#0090ff", "#00d2be", "#ff8700", 
  "#ffffff", "#9b0000", "#00ff87", "#ff1e00"
];

const buildColorMap = (data) => {
  const colors = {};
  const usedColors = new Set();
  
  data.forEach((d, index) => {
    let color = `#${d.TeamColor}`;
    if (usedColors.has(color)) {
      // Same team — assign a fallback color
      const fallback = FALLBACK_COLORS.find(c => !usedColors.has(c));
      color = fallback || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
    }
    usedColors.add(color);
    colors[d.Abbreviation] = color;
  });
  
  return colors;
};

export default function App() {
  const [schedule, setSchedule] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [session, setSession] = useState("Q");
  const [selectedRound, setSelectedRound] = useState(null);
  const [selectedDrivers, setSelectedDrivers] = useState([]);
  const [telemetry, setTelemetry] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [driverColors, setDriverColors] = useState({});
  const [lapMode, setLapMode] = useState("fastest");   // "fastest" | "specific"
  const [availableLaps, setAvailableLaps] = useState([]);
  const [selectedLap, setSelectedLap] = useState("");
  const [lapsLoading, setLapsLoading] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const throttleRef = useRef(null);
  const [year, setYear] = useState(2024);



const onHover = useCallback((index) => {
  if (throttleRef.current) return;
  throttleRef.current = setTimeout(() => {
    throttleRef.current = null;
  }, 16); // ~60fps
  setHoverIndex(index);
}, []);

useEffect(() => {
  fetchSchedule(year).then(setSchedule);
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
  const data = await fetchDrivers(round, session, year);
  setDrivers(data);
  setDriverColors(buildColorMap(data));
};

const onSessionChange = async (s) => {
  setSession(s);
  setSelectedDrivers([]);
  setTelemetry(null);
  if (selectedRound) {
    setDrivers([]);
    const data = await fetchDrivers(selectedRound, s, year);
    setDrivers(data);
    setDriverColors(buildColorMap(data));;
  }
};

const onCompare = async () => {
  setLoading(true);
  setTelemetry(null);
  try {
    const lap = lapMode === "fastest" ? "fastest" : selectedLap;
    const data = await fetchTelemetry(year, selectedRound, session, selectedDrivers, lap);
    setTelemetry(data);
    console.log("Sectors:", data.sectors);
  } catch (err) {
    console.error("Telemetry fetch failed:", err);
  } finally {
    setLoading(false);
  }
};




const onLapModeChange = async (mode) => {
  setLapMode(mode);
  setSelectedLap("");
  if (mode === "specific" && selectedDrivers.length > 0 && selectedRound) {
    setLapsLoading(true);
    const laps = await fetchDriverLaps(selectedRound, session, selectedDrivers[0]);
    setAvailableLaps(laps);
    setLapsLoading(false);
  }
};

const getColor = (abbr) => driverColors[abbr] || "#888888";



  return (
    <div className="app">
      <header className="header">
        <h1><span>Virtual</span> Pit Wall</h1>
        <div className="header-badge">F1 · 2018-2024</div>

        {/* Back to Archives button */}
        <button
          className="back-btn"
          onClick={() => window.location.href = '../../mainpage.html'}
        >
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          F1 Archives
        </button>
      </header>

  <div className="controls">
    <div className="control-group">
  <span className="control-label">Season</span>
  <select onChange={e => {
    setYear(Number(e.target.value));
    setSelectedRound(null);
    setDrivers([]);
    setSelectedDrivers([]);
    setTelemetry(null);
    fetchSchedule(Number(e.target.value)).then(setSchedule);
  }}>
    {[2024, 2023, 2022, 2021, 2020, 2019, 2018].map(y => (
      <option key={y} value={y}>{y}</option>
    ))}
  </select>
</div>

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
disabled={
  selectedDrivers.length < 2 ||
  !selectedRound ||
  loading ||
  (lapMode === "specific" && !selectedLap)
}  >
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

{drivers.length > 0 && (
  <div className="lap-selector">
    <span className="control-label">Lap</span>
    <div className="lap-toggle">
      <button
        className={`lap-toggle-btn ${lapMode === "fastest" ? "active" : ""}`}
        onClick={() => onLapModeChange("fastest")}
      >
        Fastest
      </button>
      <button
        className={`lap-toggle-btn ${lapMode === "specific" ? "active" : ""}`}
        onClick={() => onLapModeChange("specific")}
        disabled={selectedDrivers.length === 0}
      >
        Specific Lap
      </button>
    </div>

    {lapMode === "specific" && (
      <div className="lap-dropdown-wrap">
        {lapsLoading ? (
          <span className="lap-loading">Loading laps...</span>
        ) : (
          <select
            className="lap-dropdown"
            value={selectedLap}
            onChange={e => setSelectedLap(e.target.value)}
          >
            <option value="">— Pick a lap —</option>
            {availableLaps.map(l => (
              <option key={l.LapNumber} value={l.LapNumber}>
                Lap {l.LapNumber} · {l.LapTimeStr}
                {l.IsPersonalBest ? " ★" : ""}
                {l.Compound ? ` · ${l.Compound}` : ""}
              </option>
            ))}
          </select>
        )}
        {selectedDrivers.length > 1 && (
          <span className="lap-hint">
            Laps shown for {selectedDrivers[0]} · other drivers will use the same lap number
          </span>
        )}
      </div>
    )}
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
    {telemetry.drivers.map((drv, idx) => {
      // Calculate gap vs base driver
      const baseTime = telemetry.meta[telemetry.baseDriver]?.lapTime;
      const drvTime = telemetry.meta[drv]?.lapTime;
      
      let gap = null;
      if (drv !== telemetry.baseDriver && baseTime && drvTime) {
        const toSeconds = (t) => {
          const parts = t.slice(11, 22).split(":");
          return parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
        };
        const diff = toSeconds(drvTime) - toSeconds(baseTime);
        gap = (diff >= 0 ? "+" : "") + diff.toFixed(3) + "s";
      }

      return (
        <div key={drv} className="meta-card"
          style={{ borderTop: `2px solid ${getColor(drv)}` }}>
          <span className="meta-label">
            {drv === telemetry.baseDriver ? "Base" : "vs Base"}
          </span>
          <span className="meta-driver" style={{ color: getColor(drv) }}>{drv}</span>
          <span className="meta-laptime">
            {telemetry.meta[drv]?.lapTime?.slice(11, 19) ?? "NO TIME"}
          </span>
          {gap && (
            <span style={{
              fontSize: "13px",
              fontFamily: "monospace",
              color: gap.startsWith("+") ? "#ff4444" : "#00cc66",
              fontWeight: "600"
            }}>
              {gap}
            </span>
          )}
          <span className="meta-label">{telemetry.meta[drv]?.compound}</span>
        </div>
      );
    })}
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
      <TrackMap data={telemetry} driverColors={driverColors} hoverIndex={hoverIndex} />
      <DeltaChart data={telemetry} driverColors={driverColors} onHover={onHover} sectors={telemetry.sectors} />
      {["Speed", "Throttle", "Brake", "RPM", "nGear"].map(ch => (
        <TelemetryChart key={ch} data={telemetry} channel={ch} driverColors={driverColors} onHover={onHover} sectors={telemetry.sectors} />
      ))}
    </div>
  </>
)}
    </div>
  );
}