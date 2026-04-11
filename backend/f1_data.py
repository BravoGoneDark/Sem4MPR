import fastf1
import numpy as np
from scipy.interpolate import interp1d
import os

cache = 'cache'
if not os.path.exists(cache):
    os.makedirs(cache)

fastf1.Cache.enable_cache('cache')

def get_schedule(year: int):
    schedule = fastf1.get_event_schedule(year, include_testing=False)
    return schedule[["RoundNumber", "EventName", "Country", "EventDate"]].to_dict("records")

def get_session_drivers(year: int, round_number: int, session_type: str = "Q"):
    session = fastf1.get_session(year, round_number, session_type)
    session.load(telemetry=False, weather=False, messages=False)
    results = session.results[["Abbreviation", "FullName", "TeamName", "TeamColor"]].dropna()
    return results.to_dict("records")

def get_telemetry_comparison(year: int, round_number: int, session_type: str,
                              drivers: list, lap_selector: str = "fastest"):
    session = fastf1.get_session(year, round_number, session_type)
    session.load()

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

    base_driver = drivers[0]
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
        result["meta"][driver] =  {
            "lapTime": str(laps[driver]["LapTime"]),
            "compound": laps[driver].get("Compound", "N/A"),
        }

    result["drivers"] = list(tels.keys())
    result["baseDriver"] = base_driver

    return result

def get_driver_laps(year: int, round_number: int, session_type: str, driver: str):
    session = fastf1.get_session(year, round_number, session_type)
    session.load(telemetry=False, weather=False, messages=False)
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