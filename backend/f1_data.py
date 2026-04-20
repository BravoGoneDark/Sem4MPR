import fastf1
import numpy as np
from scipy.interpolate import interp1d
from multiprocessing import Pool, cpu_count
import os
import pickle
import pandas as pd


cache = 'cache'
if not os.path.exists(cache):
    os.makedirs(cache)

fastf1.Cache.enable_cache('cache')

# ── In-memory session cache ──────────────────────────────────────────────────
# Keyed by (year, round_number, session_type, full_load)
# full_load=True  → session.load()         (telemetry included)
# full_load=False → session.load(telemetry=False, weather=False, messages=False)
_session_cache = {}

def _get_session(year: int, round_number: int, session_type: str, full_load: bool = False):
    key = (year, round_number, session_type, full_load)

    if key not in _session_cache:
        print(f"[cache MISS] Loading session {year} R{round_number} {session_type} full={full_load}")
        session = fastf1.get_session(year, round_number, session_type)
        if full_load:
            session.load()
        else:
            session.load(telemetry=False, weather=False, messages=False)
        _session_cache[key] = session
    else:
        print(f"[cache HIT]  Reusing session {year} R{round_number} {session_type} full={full_load}")

    return _session_cache[key]
# ─────────────────────────────────────────────────────────────────────────────


def get_schedule(year: int):
    schedule = fastf1.get_event_schedule(year, include_testing=False)
    return schedule[["RoundNumber", "EventName", "Country", "EventDate"]].to_dict("records")


def get_session_drivers(year: int, round_number: int, session_type: str = "Q"):
    session = _get_session(year, round_number, session_type, full_load=False)
    results = session.results[["Abbreviation", "FullName", "TeamName", "TeamColor"]].dropna()
    return results.to_dict("records")


def get_telemetry_comparison(year: int, round_number: int, session_type: str,
                              drivers: list, lap_selector: str = "fastest"):
    session = _get_session(year, round_number, session_type, full_load=True)

    def _get_lap(driver):
        try:
            if lap_selector == "fastest":
                lap = session.laps.pick_drivers(driver).pick_fastest()
                if lap is None or len(lap) == 0:
                    return None
            else:
                lap_num = int(lap_selector)
                laps_for_driver = session.laps.pick_drivers(driver)
                lap = laps_for_driver.loc[
                    laps_for_driver["LapNumber"] == lap_num
                ].iloc[0]
            return lap
        except Exception as e:
            print(f"Error getting lap for {driver}: {e}")
            return None

    tels = {}
    laps = {}
    for driver in drivers:
        lap = _get_lap(driver)
        if lap is None:
            print(f"No valid lap found for {driver}, skipping")
            continue
        laps[driver] = lap
        tels[driver] = lap.get_telemetry().add_distance()

    max_dist = min(tel["Distance"].max() for tel in tels.values())
    common_dist = np.linspace(0, max_dist, 1000)

    channels = ["Speed", "Throttle", "Brake", "RPM", "nGear"]
    result = {"distance": common_dist.tolist()}

    for driver, tel in tels.items():
        result[driver] = {}
        for ch in channels:
            if ch in tel.columns:
                interp = interp1d(
                    tel["Distance"].values,
                    tel[ch].values.astype(float),
                    bounds_error=False,
                    fill_value="extrapolate"
                )
                result[driver][ch] = interp(common_dist).tolist()

    base_driver = list(tels.keys())[0]
    result["delta"] = {}
    for driver in list(tels.keys())[1:]:
        result["delta"][driver] = _compute_delta(
            tels[base_driver], tels[driver], common_dist
        )

    base_tel = tels[base_driver]
    result["trackMap"] = {
        "x": base_tel["X"].tolist(),
        "y": base_tel["Y"].tolist(),
    }

    result["meta"] = {}
    for driver in tels.keys():
        result["meta"][driver] = {
            "lapTime": str(laps[driver]["LapTime"]),
            "compound": laps[driver].get("Compound", "N/A"),
        }

    result["drivers"] = list(tels.keys())
    result["baseDriver"] = base_driver

    # Sector distances — use base driver's lap
    try:
        base_lap = laps[base_driver]
        tel_base = tels[base_driver]

        s1_time = base_lap["Sector1Time"]
        s2_time = base_lap["Sector1Time"] + base_lap["Sector2Time"]

        def time_to_distance(sector_time):
            total_seconds = sector_time.total_seconds()
            tel_seconds = tel_base["Time"].dt.total_seconds()
            idx = (tel_seconds - total_seconds).abs().idxmin()
            return float(tel_base.loc[idx, "Distance"])

        result["sectors"] = {
            "s1": time_to_distance(s1_time),
            "s2": time_to_distance(s2_time),
        }
    except Exception as e:
        print(f"Could not compute sector distances: {e}")
        result["sectors"] = {"s1": None, "s2": None}

    return result


def get_driver_laps(year: int, round_number: int, session_type: str, driver: str):
    session = _get_session(year, round_number, session_type, full_load=False)
    laps = session.laps.pick_drivers(driver)[
        ["LapNumber", "LapTime", "Compound", "IsPersonalBest"]
    ].dropna(subset=["LapNumber", "LapTime"]).copy()
    laps["LapNumber"] = laps["LapNumber"].astype(int)
    laps["LapTimeSeconds"] = laps["LapTime"].dt.total_seconds()
    laps["LapTimeStr"] = laps["LapTime"].apply(
        lambda t: f"{int(t.total_seconds() // 60)}:{t.total_seconds() % 60:06.3f}"
    )
    return laps[["LapNumber", "LapTimeStr", "Compound", "IsPersonalBest"]].sort_values("LapNumber").to_dict("records")


def _compute_delta(tel1, tel2, common_dist):
    def dist_to_time(tel):
        return interp1d(
            tel["Distance"].values,
            tel["Time"].dt.total_seconds().values,
            bounds_error=False, fill_value="extrapolate"
        )
    t1_interp = dist_to_time(tel1)
    t2_interp = dist_to_time(tel2)
    delta = t1_interp(common_dist) - t2_interp(common_dist)
    return delta.tolist()


TYRE_MAP   = {"SOFT": 1, "MEDIUM": 2, "HARD": 3, "INTERMEDIATE": 4, "WET": 5}
REPLAY_FPS = 10
REPLAY_DT  = 1.0 / 10


# Top-level function required for multiprocessing (cannot be nested)
def _process_replay_driver(args):
    driver_no, year, round_number, session_type = args
    try:
        fastf1.Cache.enable_cache('cache')
        session = fastf1.get_session(year, round_number, session_type)
        session.load(telemetry=True, weather=False)

        code        = session.get_driver(driver_no)["Abbreviation"]
        laps_driver = session.laps.pick_drivers(driver_no)
        if laps_driver.empty:
            return None

        t_all=[]; x_all=[]; y_all=[]; dst_all=[]; lap_all=[]
        tyr_all=[]; spd_all=[]; gea_all=[]; drs_all=[]; thr_all=[]; brk_all=[]
        cum_dist = 0.0

        for _, lap in laps_driver.iterlaps():
            tel = lap.get_telemetry()
            if tel.empty:
                continue
            t_lap = tel["SessionTime"].dt.total_seconds().to_numpy()
            d_lap = tel["Distance"].to_numpy()
            t_all.append(t_lap)
            x_all.append(tel["X"].to_numpy())
            y_all.append(tel["Y"].to_numpy())
            dst_all.append(cum_dist + d_lap)
            lap_all.append(np.full(len(t_lap), int(lap.LapNumber)))
            tyr_all.append(np.full(len(t_lap), TYRE_MAP.get(lap.Compound, 0)))
            spd_all.append(tel["Speed"].to_numpy())
            gea_all.append(tel["nGear"].to_numpy())
            drs_all.append(tel["DRS"].to_numpy())
            thr_all.append(tel["Throttle"].to_numpy())
            brk_all.append(tel["Brake"].to_numpy().astype(float) * 100.0)
            cum_dist += d_lap[-1] if len(d_lap) else 0.0

        if not t_all:
            return None

        t_cat = np.concatenate(t_all)
        order = np.argsort(t_cat)
        t_cat = t_cat[order]
        print(f"  ✓ {code}")
        return {
            "code": code,
            "t":    t_cat,
            "x":    np.concatenate(x_all)[order],
            "y":    np.concatenate(y_all)[order],
            "dist": np.concatenate(dst_all)[order],
            "lap":  np.concatenate(lap_all)[order],
            "tyre": np.concatenate(tyr_all)[order],
            "spd":  np.concatenate(spd_all)[order],
            "gear": np.concatenate(gea_all)[order],
            "drs":  np.concatenate(drs_all)[order],
            "thr":  np.concatenate(thr_all)[order],
            "brk":  np.concatenate(brk_all)[order],
        }
    except Exception as e:
        print(f"  ✗ driver {driver_no}: {e}")
        return None
    

def _is_dnf(status):
    if not status or pd.isna(status):
        return False
    s = str(status).strip()
    # Completed the race (possibly lapped)
    if s == "Finished" or s == "Lapped":
        return False
    # "+1 Lap", "+2 Laps", "+3 Laps" etc — completed race while being lapped
    if s.startswith("+") and "Lap" in s:
        return False
    # Everything else is a retirement:
    # "Retired", "Accident", "Oil leak", "Engine", "Gearbox", "Hydraulics" etc.
    return True


def get_replay_data(year: int, round_number: int, session_type: str = "R"):
    """
    Build columnar per-frame replay data for the web player.
    Heavily adapted from Tom Shaw's f1-race-replay
    (github.com/IAmTomShaw/f1-race-replay) — data layer only,
    Arcade/desktop rendering completely removed.
    """
    cache_dir = "computed_data"
    os.makedirs(cache_dir, exist_ok=True)
    cache_path = os.path.join(cache_dir, f"{year}_{round_number}_{session_type}_replay.pkl")

    if os.path.exists(cache_path):
        print(f"[Replay] Loading cached data from {cache_path}")
        with open(cache_path, "rb") as f:
            return pickle.load(f)

    print(f"[Replay] Processing {year} R{round_number} {session_type} …")
    session = fastf1.get_session(year, round_number, session_type)
    session.load(telemetry=True, weather=True)

    for _, row in session.results.iterrows():
        print(f"  {row['Abbreviation']}: status = '{row.get('Status', 'N/A')}'")

    event_name = session.event["EventName"]
    total_laps  = int(session.laps["LapNumber"].max()) if not session.laps.empty else 0

    # ── driver meta ───────────────────────────────────────────────────────────
    driver_colors = {}
    driver_info   = {}
    for _, row in session.results.iterrows():
        abbr  = row["Abbreviation"]
        color = row.get("TeamColor", "888888")
        driver_colors[abbr] = f"#{color}" if pd.notna(color) else "#888888"
        driver_info[abbr] = {
            "fullName": row.get("FullName", abbr),
            "team":     row.get("TeamName", ""),
        }

    # ── per-driver telemetry (parallel) ──────────────────────────────────────
    driver_data  = {}
    global_t_min = None
    global_t_max = None

    args      = [(d, year, round_number, session_type) for d in session.drivers]
    num_procs = min(cpu_count(), len(args))
    print(f"[Replay] Processing {len(args)} drivers across {num_procs} cores…")

    with Pool(processes=num_procs) as pool:
        results = pool.map(_process_replay_driver, args)

    for result in results:
        if result is None:
            continue
        code = result.pop("code")
        driver_data[code] = result
        global_t_min = result["t"].min() if global_t_min is None else min(global_t_min, result["t"].min())
        global_t_max = result["t"].max() if global_t_max is None else max(global_t_max, result["t"].max())

    if not driver_data:
        raise ValueError("No valid telemetry data found")

    # ── common timeline ───────────────────────────────────────────────────────
    timeline = np.arange(global_t_min, global_t_max, REPLAY_DT) - global_t_min
    n        = len(timeline)

    # ── resample every driver onto timeline ───────────────────────────────────
    channels = ["x", "y", "dist", "lap", "tyre", "spd", "gear", "drs", "thr", "brk"]
    resampled = {}
    for code, data in driver_data.items():
        t_rel  = data["t"] - global_t_min
        order  = np.argsort(t_rel)
        t_s    = t_rel[order]
        resampled[code] = {
            ch: np.interp(timeline, t_s, data[ch][order]).round(2).tolist()
            for ch in channels
        }

    # ── live leaderboard position per frame ───────────────────────────────────
    drivers_list = list(resampled.keys())

    # Use actual position data from fastf1
    pos_data = {}
    for driver_no in session.drivers:
        try:
            code = session.get_driver(driver_no)["Abbreviation"]
            if code not in resampled:
                continue
            driver_pos = session.pos_data[driver_no][["SessionTime", "Status"]].copy()
            # fastf1 position data has actual race positions
            laps_driver = session.laps.pick_drivers(driver_no)[["LapNumber", "Position", "Time"]].dropna()
            if laps_driver.empty:
                continue
            # interpolate position across timeline
            t_pos = laps_driver["Time"].dt.total_seconds().to_numpy() - global_t_min
            p_pos = laps_driver["Position"].to_numpy()
            order = np.argsort(t_pos)
            resampled[code]["pos"] = np.interp(
                timeline, t_pos[order], p_pos[order]
            ).round(0).astype(int).tolist()
        except Exception as e:
            print(f"Position data error for {code}: {e}")
            # fallback to calculated position
            for i in range(n):
                if "pos" not in resampled[code]:
                    resampled[code]["pos"] = [0] * n

    # Fill any missing pos arrays with calculated fallback
    for i in range(n):
        ranked = sorted(
            [c for c in drivers_list if "pos" in resampled[c]],
            key=lambda c: resampled[c]["pos"][i]
        )

    # ── DNF / DNS detection using actual session results ─────────────────────
    dnf_frames = {}
    for code in drivers_list:
        dnf_frame = None
        try:
            # Get driver's finishing status from results
            driver_result = session.results[session.results["Abbreviation"] == code]
            if not driver_result.empty:
                status = driver_result.iloc[0].get("Status", "Finished")
                # If status is not "Finished" or "Lapped", driver retired
                if _is_dnf(status):
                    # Find the frame where their distance stopped increasing
                    drv_dist = resampled[code]["dist"]
                    start_check = n // 5
                    for i in range(start_check, n):
                        window = 100
                        if i >= window:
                            dist_change = drv_dist[i] - drv_dist[i - window]
                            if dist_change < 5.0:
                                dnf_frame = i
                                break
        except Exception as e:
            print(f"DNF detection error for {code}: {e}")

        dnf_frames[code] = dnf_frame
        if dnf_frame:
            print(f"  DNF detected: {code} at frame {dnf_frame} ({dnf_frame/REPLAY_FPS:.0f}s)")

    
    # ── pit stop counts per frame ─────────────────────────────────────────────
    for driver_no in session.drivers:
        try:
            code = session.get_driver(driver_no)["Abbreviation"]
            if code not in resampled:
                continue
            laps_driver = session.laps.pick_drivers(driver_no)
            
            # Get pit in times
            pit_laps = laps_driver[laps_driver["PitInTime"].notna()]["PitInTime"]
            pit_times = (pit_laps.dt.total_seconds() - global_t_min).tolist()
            
            # For each frame count how many pits have happened
            pit_counts = []
            for t in timeline:
                count = sum(1 for pt in pit_times if pt <= t)
                pit_counts.append(count)
            
            resampled[code]["pits"] = pit_counts
        except Exception as e:
            print(f"Pit data error for {code}: {e}")
            resampled[code]["pits"] = [0] * n
    

    # ── gap to leader per frame ───────────────────────────────────────────────
    for i in range(n):
        # Find leader at this frame
        leader = min(drivers_list, 
                    key=lambda c: resampled[c]["pos"][i] if "pos" in resampled[c] else 99)
        leader_dist = resampled[leader]["dist"][i]
        leader_spd  = max(resampled[leader]["spd"][i], 1)  # avoid division by zero
        
        for code in drivers_list:
            if "gap" not in resampled[code]:
                resampled[code]["gap"] = [0.0] * n
            
            if code == leader:
                resampled[code]["gap"][i] = 0.0
            else:
                dist_diff = leader_dist - resampled[code]["dist"][i]
                # Convert distance gap to time gap using leader's speed (km/h → m/s)
                speed_ms = leader_spd / 3.6
                resampled[code]["gap"][i] = round(dist_diff / speed_ms, 1) if speed_ms > 0 else 0.0


    # ── track status (SC / VSC / red flag) ───────────────────────────────────
    track_statuses = []
    STATUS_LABEL = {"1": "clear", "2": "yellow", "4": "sc", "5": "red", "6": "vsc"}
    for _, row in session.track_status.iterrows():
        t_sec = row["Time"].total_seconds() - global_t_min
        track_statuses.append({
            "t":      round(float(t_sec), 2),
            "status": str(row["Status"]),
            "label":  STATUS_LABEL.get(str(row["Status"]), "unknown"),
        })

    # ── weather ───────────────────────────────────────────────────────────────
    weather_out = {}
    try:
        wd = session.weather_data
        if wd is not None and not wd.empty:
            wt    = (wd["Time"].dt.total_seconds() - global_t_min).to_numpy()
            order = np.argsort(wt)
            wt    = wt[order]
            for col, key in [("TrackTemp","trackTemp"),("AirTemp","airTemp"),
                             ("Humidity","humidity"),("WindSpeed","windSpeed")]:
                if col in wd.columns:
                    weather_out[key] = np.interp(timeline, wt,
                                                  wd[col].to_numpy()[order]).round(1).tolist()
            if "Rainfall" in wd.columns:
                weather_out["rainfall"] = np.interp(
                    timeline, wt, wd["Rainfall"].to_numpy().astype(float)[order]
                ).round(2).tolist()
    except Exception as exc:
        print(f"  Weather error: {exc}")

    # ── track map ─────────────────────────────────────────────────────────────
    try:
        fastest  = session.laps.pick_fastest()
        tel_fast = fastest.get_telemetry()
        track_map = {"x": tel_fast["X"].tolist(), "y": tel_fast["Y"].tolist()}
    except Exception:
        first = drivers_list[0]
        track_map = {"x": resampled[first]["x"], "y": resampled[first]["y"]}

    result = {
        "meta": {
            "eventName":   event_name,
            "year":        year,
            "round":       round_number,
            "sessionType": session_type,
            "totalFrames": n,
            "totalLaps":   total_laps,
            "fps":         REPLAY_FPS,
            "duration":    round(float(timeline[-1]), 1),
        },
        "trackMap":      track_map,
        "driverColors":  driver_colors,
        "driverInfo":    driver_info,
        "drivers":       drivers_list,
        "dnfFrames":     dnf_frames,
        "frames": {
            "t": timeline.round(2).tolist(),
            **resampled,
        },
        "weather":       weather_out,
        "trackStatuses": track_statuses,
    }

    with open(cache_path, "wb") as f:
        pickle.dump(result, f, protocol=pickle.HIGHEST_PROTOCOL)
    print(f"[Replay] Cached → {cache_path}")
    return result