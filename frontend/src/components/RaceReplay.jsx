import { useEffect, useRef, useState, useCallback } from "react";

const TYRE_COLOR = {
  1: "#e8002d",
  2: "#ffd700",
  3: "#c8c8c8",
  4: "#00a550",
  5: "#0067ff",
  0: "#888",
};
const TYRE_NAME = { 1:"S", 2:"M", 3:"H", 4:"I", 5:"W", 0:"?" };

const STATUS_BAR = {
  "1": null,
  "2": { bg:"#ffd700", label:"YELLOW FLAG" },
  "4": { bg:"#f97316", label:"SAFETY CAR" },
  "5": { bg:"#e8002d", label:"RED FLAG" },
  "6": { bg:"#a3e635", label:"VIRTUAL SAFETY CAR" },
};

const SPEEDS = [0.25, 0.5, 1, 2, 4, 8];

export default function RaceReplay({ year, round }) {
  const [loadState, setLoadState]     = useState("idle");
  const [loadMsg,   setLoadMsg]       = useState("");
  const [started,   setStarted]       = useState(false);
  const dataRef      = useRef(null);
  const trackPathRef = useRef(null);

  const frameRef     = useRef(0);
  const isPlayingRef = useRef(false);
  const speedRef     = useRef(1);
  const lastTsRef    = useRef(null);
  const rafRef       = useRef(null);

  const [isPlaying,      setIsPlaying]      = useState(false);
  const [speedIdx,       setSpeedIdx]       = useState(2);
  const [displayFrame,   setDisplayFrame]   = useState(0);
  const [leaderboard,    setLeaderboard]    = useState([]);
  const [weather,        setWeather]        = useState(null);
  const [trackStatus,    setTrackStatus]    = useState("1");
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [driverTel,      setDriverTel]      = useState(null);

  const selectedDriverRef = useRef(null);
  useEffect(() => {
    selectedDriverRef.current = selectedDriver;
  }, [selectedDriver]);

  const canvasRef = useRef(null);
  const scaleRef  = useRef(null);

  // Reset when year or round changes
  useEffect(() => {
    setStarted(false);
    dataRef.current = null;
    setLoadState("idle");
    setLoadMsg("");
    frameRef.current = 0;
    setIsPlaying(false);
    isPlayingRef.current = false;
    setLeaderboard([]);
    setWeather(null);
    setSelectedDriver(null);
    setDriverTel(null);
    cancelAnimationFrame(rafRef.current);
  }, [year, round]);

  // Load data only when started
  useEffect(() => {
    if (!year || !round || !started) return;
    if (dataRef.current) return;

    setLoadState("loading");
    setLoadMsg("Fetching telemetry from F1 servers… (this may take 1–2 min on first load)");
    frameRef.current = 0;

    fetch(`http://127.0.0.1:8000/replay?year=${year}&round=${round}&session=R`)
      .then(r => {
        if (!r.ok) throw new Error(`Server error ${r.status}`);
        setLoadMsg("Parsing data…");
        return r.json();
      })
      .then(data => {
        dataRef.current = data;
        buildScale(data);
        buildTrackPath(data);
        setLoadState("ready");
        setDisplayFrame(0);
        updateUIState(0);
      })
      .catch(err => {
        setLoadState("error");
        setLoadMsg(err.message);
      });

    return () => cancelAnimationFrame(rafRef.current);
  }, [year, round, started]);

  const buildScale = (data) => {
    const xs = data.trackMap.x;
    const ys = data.trackMap.y;
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    scaleRef.current = { minX, maxX, minY, maxY };
  };

  const toCanvas = useCallback((worldX, worldY, W, H, pad = 30) => {
    const s = scaleRef.current;
    if (!s) return [0, 0];
    const cx = pad + ((worldX - s.minX) / (s.maxX - s.minX)) * (W - 2 * pad);
    const cy = pad + ((worldY - s.minY) / (s.maxY - s.minY)) * (H - 2 * pad);
    return [cx, cy];
  }, []);

  const buildTrackPath = (data) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width, H = canvas.height;
    const xs = data.trackMap.x, ys = data.trackMap.y;
    const path = new Path2D();
    const [sx, sy] = toCanvas(xs[0], ys[0], W, H);
    path.moveTo(sx, sy);
    for (let i = 1; i < xs.length; i++) {
      const [cx, cy] = toCanvas(xs[i], ys[i], W, H);
      path.lineTo(cx, cy);
    }
    path.closePath();
    trackPathRef.current = path;
  };

  const drawFrame = useCallback((fi) => {
    const canvas = canvasRef.current;
    const data   = dataRef.current;
    if (!canvas || !data || !scaleRef.current) return;

    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    if (trackPathRef.current) {
      ctx.strokeStyle = "#2a2a2a";
      ctx.lineWidth   = 10;
      ctx.lineCap     = "round";
      ctx.lineJoin    = "round";
      ctx.stroke(trackPathRef.current);
      ctx.strokeStyle = "#3a3a3a";
      ctx.lineWidth   = 7;
      ctx.stroke(trackPathRef.current);
    }

    const drivers = data.drivers;
    const frames  = data.frames;
    const currentDriver = selectedDriverRef.current;

    for (const code of drivers) {
      const fd = frames[code];
      if (!fd) continue;

      const wx = fd.x[fi], wy = fd.y[fi];
      const [cx, cy] = toCanvas(wx, wy, W, H);
      const color    = data.driverColors[code] || "#888";
      const isSelected = code === currentDriver;

      if (isSelected) {
        ctx.beginPath();
        ctx.arc(cx, cy, 12, 0, Math.PI * 2);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(cx, cy, isSelected ? 9 : 7, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur  = isSelected ? 16 : 6;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.font      = "bold 9px monospace";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.fillText(code, cx, cy - 12);
    }
  }, [toCanvas]);

  const updateUIState = useCallback((fi) => {
    const data = dataRef.current;
    if (!data) return;

    const frames  = data.frames;
    const drivers = data.drivers;

    const lb = drivers
      .map(code => ({
        code,
        pos:  Math.round(frames[code]?.pos?.[fi] ?? 99),
        lap:  Math.round(frames[code]?.lap?.[fi]  ?? 0),
        tyre: Math.round(frames[code]?.tyre?.[fi] ?? 0),
      }))
      .sort((a, b) => a.pos - b.pos);
    setLeaderboard(lb);

    const t = frames.t[fi];
    let curStatus = "1";
    for (const ts of data.trackStatuses) {
      if (ts.t <= t) curStatus = ts.status;
    }
    setTrackStatus(curStatus);

    if (data.weather?.trackTemp) {
      setWeather({
        trackTemp: data.weather.trackTemp[fi]?.toFixed(1),
        airTemp:   data.weather.airTemp?.[fi]?.toFixed(1),
        humidity:  data.weather.humidity?.[fi]?.toFixed(0),
        windSpeed: data.weather.windSpeed?.[fi]?.toFixed(1),
        rain:      (data.weather.rainfall?.[fi] ?? 0) >= 0.5 ? "RAIN" : "DRY",
      });
    }

    const currentDriver = selectedDriverRef.current;
    if (currentDriver && frames[currentDriver]) {
      const fd = frames[currentDriver];
      setDriverTel({
        speed: fd.spd[fi]?.toFixed(0),
        gear:  Math.round(fd.gear[fi] ?? 0),
        drs:   Math.round(fd.drs[fi] ?? 0) > 8,
        thr:   fd.thr[fi]?.toFixed(0),
        brk:   fd.brk[fi]?.toFixed(0),
        tyre:  Math.round(fd.tyre[fi] ?? 0),
        lap:   Math.round(fd.lap[fi] ?? 0),
      });
    }
  }, []);

  const animate = useCallback((ts) => {
    if (!isPlayingRef.current) return;

    if (lastTsRef.current === null) lastTsRef.current = ts;
    const dt = (ts - lastTsRef.current) / 1000;
    lastTsRef.current = ts;

    const data = dataRef.current;
    if (!data) return;

    frameRef.current += dt * speedRef.current * data.meta.fps;

    if (frameRef.current >= data.meta.totalFrames - 1) {
      frameRef.current = data.meta.totalFrames - 1;
      isPlayingRef.current = false;
      setIsPlaying(false);
    }

    const fi = Math.floor(frameRef.current);
    drawFrame(fi);
    setDisplayFrame(fi);
    updateUIState(fi);

    rafRef.current = requestAnimationFrame(animate);
  }, [drawFrame, updateUIState]);

  const play = useCallback(() => {
    if (!dataRef.current) return;
    isPlayingRef.current = true;
    lastTsRef.current    = null;
    setIsPlaying(true);
    rafRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const pause = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    cancelAnimationFrame(rafRef.current);
  }, []);

  const togglePlay = useCallback(() => {
    isPlaying ? pause() : play();
  }, [isPlaying, play, pause]);

  const seek = useCallback((fi) => {
    frameRef.current = fi;
    drawFrame(fi);
    setDisplayFrame(fi);
    updateUIState(fi);
  }, [drawFrame, updateUIState]);

  const skip = useCallback((seconds) => {
    const data = dataRef.current;
    if (!data) return;
    const delta = seconds * data.meta.fps;
    const next  = Math.max(0, Math.min(data.meta.totalFrames - 1,
                           frameRef.current + delta));
    seek(Math.floor(next));
  }, [seek]);

  const cycleSpeed = useCallback((dir) => {
    setSpeedIdx(prev => {
      const next = Math.max(0, Math.min(SPEEDS.length - 1, prev + dir));
      speedRef.current = SPEEDS[next];
      return next;
    });
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (loadState !== "ready") return;
      switch (e.code) {
        case "Space":      e.preventDefault(); togglePlay(); break;
        case "ArrowLeft":  skip(-10); break;
        case "ArrowRight": skip(10);  break;
        case "ArrowUp":    e.preventDefault(); cycleSpeed(1);  break;
        case "ArrowDown":  e.preventDefault(); cycleSpeed(-1); break;
        case "KeyR":       seek(0); break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [loadState, togglePlay, skip, cycleSpeed, seek]);

  useEffect(() => {
    if (loadState === "ready") {
      drawFrame(Math.floor(frameRef.current));
      updateUIState(Math.floor(frameRef.current));
    }
  }, [selectedDriver, loadState, drawFrame, updateUIState]);

  useEffect(() => {
    if (loadState !== "ready") return;
    const canvas = canvasRef.current;
    const resize = () => {
      const w = canvas.parentElement.clientWidth;
      canvas.width  = w;
      canvas.height = Math.round(w * 0.56);
      buildTrackPath(dataRef.current);
      drawFrame(Math.floor(frameRef.current));
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [loadState]);

  const data        = dataRef.current;
  const totalFrames = data?.meta?.totalFrames ?? 1;
  const totalLaps   = data?.meta?.totalLaps   ?? 0;
  const currentT    = data ? (data.frames.t[displayFrame] ?? 0) : 0;
  const leaderLap   = leaderboard[0]?.lap ?? 0;
  const statusBar   = STATUS_BAR[trackStatus];

  const fmtTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    return h > 0
      ? `${h}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`
      : `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  };

  return (
    <div className="replay-root">

      {loadState === "idle" && (
        <div className="replay-placeholder">
          {!round ? (
            <span>Select a race above first</span>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"16px" }}>
              <span style={{ color:"#555", fontFamily:"monospace", fontSize:"12px" }}>
                {year} · Round {round} · Race
              </span>
              <button className="compare-btn" onClick={() => setStarted(true)}>
                Load Replay
              </button>
              <span style={{ color:"#333", fontFamily:"monospace", fontSize:"10px" }}>
                First load may take 1–2 minutes
              </span>
            </div>
          )}
        </div>
      )}

      {loadState === "loading" && (
        <div className="replay-loading">
          <div className="loading-dot" style={{ width:10, height:10 }} />
          <span>{loadMsg}</span>
        </div>
      )}

      {loadState === "error" && (
        <div className="replay-error">⚠ {loadMsg}</div>
      )}

      {loadState === "ready" && (
        <div className="replay-layout">

          {statusBar && (
            <div className="replay-status-bar" style={{ background: statusBar.bg }}>
              {statusBar.label}
            </div>
          )}

          <div className="replay-info-bar">
            <span className="replay-info-item">
              Lap <strong>{leaderLap} / {totalLaps}</strong>
            </span>
            <span className="replay-info-item">
              Race Time <strong>{fmtTime(currentT)}</strong>
            </span>
            <span className="replay-info-item replay-speed-badge">
              {SPEEDS[speedIdx]}x
            </span>
            {weather && (
              <span className="replay-info-item replay-weather">
                🌡 Track {weather.trackTemp}°C · Air {weather.airTemp}°C ·
                💧 {weather.humidity}% · 💨 {weather.windSpeed} km/h · {weather.rain}
              </span>
            )}
          </div>

          <div className="replay-body">
            <div className="replay-canvas-wrap">
              <canvas
                ref={canvasRef}
                className="replay-canvas"
                onClick={(e) => {
                  const rect = canvasRef.current.getBoundingClientRect();
                  const mx   = e.clientX - rect.left;
                  const my   = e.clientY - rect.top;
                  const W    = canvasRef.current.width;
                  const H    = canvasRef.current.height;
                  let closest = null, minDist = 20;
                  for (const code of (data?.drivers ?? [])) {
                    const fd = data.frames[code];
                    if (!fd) continue;
                    const fi = Math.floor(frameRef.current);
                    const [cx, cy] = toCanvas(fd.x[fi], fd.y[fi], W, H);
                    const d = Math.hypot(mx - cx, my - cy);
                    if (d < minDist) { minDist = d; closest = code; }
                  }
                  setSelectedDriver(prev => prev === closest ? null : closest);
                }}
              />

              <div className="replay-scrubber-wrap">
                <input
                  type="range" min={0} max={totalFrames - 1}
                  value={displayFrame}
                  className="replay-scrubber"
                  onChange={e => seek(Number(e.target.value))}
                />
                <div className="replay-tyre-strip">
                  {leaderboard[0] && data && (() => {
                    const fd = data.frames[leaderboard[0].code];
                    if (!fd) return null;
                    const step = Math.max(1, Math.floor(totalFrames / 200));
                    return Array.from({ length: Math.ceil(totalFrames / step) }, (_, i) => {
                      const fi  = i * step;
                      const col = TYRE_COLOR[Math.round(fd.tyre[fi] ?? 0)];
                      return <div key={i} style={{ flex:1, background:col, height:"100%" }} />;
                    });
                  })()}
                </div>
              </div>

              <div className="replay-controls">
                <button className="replay-ctrl-btn" onClick={() => skip(-30)}>⏪</button>
                <button className="replay-ctrl-btn replay-play-btn" onClick={togglePlay}>
                  {isPlaying ? "⏸" : "▶"}
                </button>
                <button className="replay-ctrl-btn" onClick={() => skip(30)}>⏩</button>

                <div className="replay-speed-ctrl">
                  <button onClick={() => cycleSpeed(-1)} disabled={speedIdx === 0}>−</button>
                  <span>{SPEEDS[speedIdx]}x</span>
                  <button onClick={() => cycleSpeed(1)} disabled={speedIdx === SPEEDS.length-1}>+</button>
                </div>

                <button className="replay-ctrl-btn" onClick={() => seek(0)}>↺</button>

                <span className="replay-time-display">
                  {fmtTime(currentT)} / {fmtTime(data.meta.duration)}
                </span>
              </div>
            </div>

            <div className="replay-right-panel">

              {selectedDriver && driverTel && (
                <div className="replay-tel-panel"
                     style={{ borderTop:`3px solid ${data.driverColors[selectedDriver] || "#888"}` }}>
                  <div className="replay-tel-header"
                       style={{ color: data.driverColors[selectedDriver] }}>
                    {selectedDriver}
                    <button className="replay-tel-close"
                            onClick={() => setSelectedDriver(null)}>×</button>
                  </div>
                  <div className="replay-tel-row">
                    <span>Speed</span><strong>{driverTel.speed} km/h</strong>
                  </div>
                  <div className="replay-tel-row">
                    <span>Gear</span><strong>{driverTel.gear}</strong>
                  </div>
                  <div className="replay-tel-row">
                    <span>DRS</span>
                    <strong style={{ color: driverTel.drs ? "#00ff87" : "#555" }}>
                      {driverTel.drs ? "OPEN" : "OFF"}
                    </strong>
                  </div>
                  <div className="replay-tel-row">
                    <span>Lap</span><strong>{driverTel.lap}</strong>
                  </div>
                  <div className="replay-tel-row">
                    <span>Tyre</span>
                    <strong style={{ color: TYRE_COLOR[driverTel.tyre] }}>
                      {TYRE_NAME[driverTel.tyre]}
                    </strong>
                  </div>
                  <div className="replay-tel-bars">
                    <div className="replay-bar-label">THR</div>
                    <div className="replay-bar-track">
                      <div className="replay-bar-fill"
                           style={{ width:`${driverTel.thr}%`, background:"#00cc66" }} />
                    </div>
                    <div className="replay-bar-label">BRK</div>
                    <div className="replay-bar-track">
                      <div className="replay-bar-fill"
                           style={{ width:`${driverTel.brk}%`, background:"#e8002d" }} />
                    </div>
                  </div>
                </div>
              )}

              <div className="replay-leaderboard">
                <div className="replay-lb-title">LEADERBOARD</div>
                {leaderboard.map((entry) => {
                  const color = data.driverColors[entry.code] || "#888";
                  return (
                    <button
                      key={entry.code}
                      className={`replay-lb-row ${selectedDriver === entry.code ? "selected" : ""}`}
                      onClick={() => setSelectedDriver(
                        prev => prev === entry.code ? null : entry.code
                      )}
                      style={selectedDriver === entry.code
                        ? { background:`${color}22`, borderLeft:`3px solid ${color}` }
                        : {}}
                    >
                      <span className="lb-pos">{entry.pos}</span>
                      <span className="lb-code" style={{ color }}>{entry.code}</span>
                      <span className="lb-tyre" style={{ color: TYRE_COLOR[entry.tyre] }}>
                        {TYRE_NAME[entry.tyre]}
                      </span>
                      <span className="lb-lap">L{entry.lap}</span>
                    </button>
                  );
                })}
              </div>

              <div className="replay-hints">
                <div>[SPACE] Play/Pause</div>
                <div>[← →] ±10s</div>
                <div>[↑ ↓] Speed</div>
                <div>[R] Restart</div>
                <div>[click dot] Driver info</div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}