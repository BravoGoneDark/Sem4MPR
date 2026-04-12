const BASE = "http://127.0.0.1:8000";

export const fetchSchedule = (year = 2024) =>
  fetch(`${BASE}/schedule/${year}`).then(r => r.json());

export const fetchDrivers = (round, session, year = 2024) =>
  fetch(`${BASE}/drivers/${year}/${round}/${session}`).then(r => r.json());

export const fetchTelemetry = (year, round, session, drivers, lap = "fastest") => {
  const params = new URLSearchParams({ year, round, session, lap });
  drivers.forEach(d => params.append("drivers", d));
  return fetch(`${BASE}/telemetry?${params}`).then(r => r.json());
};

export const fetchDriverLaps = (round, session, driver) =>
  fetch(`${BASE}/laps/2024/${round}/${session}/${driver}`).then(r => r.json());