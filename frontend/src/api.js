const BASE = "http://127.0.0.1:8000";

export const fetchSchedule = () => 
  fetch(`${BASE}/schedule/2024`).then(r => r.json());

export const fetchDrivers = (round, session) => 
  fetch(`${BASE}/drivers/2024/${round}/${session}`).then(r => r.json());

export const fetchTelemetry = (year, round, session, drivers, lap = "fastest") => {
  const params = new URLSearchParams({ year, round, session, lap });
  drivers.forEach(d => params.append("drivers", d));
  return fetch(`${BASE}/telemetry?${params}`).then(r => r.json());
};