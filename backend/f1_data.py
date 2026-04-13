import fastf1
import numpy as np
from scipy.interpolate import interp1d
import os

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