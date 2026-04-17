from flask import Flask,jsonify,request
from flask_cors import CORS
from f1_data import get_schedule, get_session_drivers, get_telemetry_comparison, get_driver_laps

app=Flask(__name__)
CORS(app)

@app.route("/schedule/<int:year>")
def schedule(year):
    return jsonify(get_schedule(year))

@app.route("/drivers/<int:year>/<int:round_number>/<session_type>")
def drivers(year, round_number, session_type):
    return jsonify(get_session_drivers(year, round_number, session_type))

@app.route("/telemetry")
def telemetry():
    year = int(request.args.get("year"))
    round_number = int(request.args.get("round"))
    session = request.args.get("session")
    drivers = request.args.getlist("drivers")
    lap_selector = request.args.get("lap", "fastest")
    return jsonify(get_telemetry_comparison(year, round_number, session, drivers, lap_selector))

@app.route("/laps/<int:year>/<int:round_number>/<session_type>/<driver>")
def driver_laps(year, round_number, session_type, driver):
    return jsonify(get_driver_laps(year, round_number, session_type, driver))

@app.route("/replay")
def replay():
    print("REPLAY ROUTE HIT")
    year= int(request.args.get("year"))
    round_number = int(request.args.get("round"))
    session_type = request.args.get("session", "R")
    from f1_data import get_replay_data
    return jsonify(get_replay_data(year, round_number, session_type))

if __name__ == "__main__":
    app.run(debug=True, port=8000)
