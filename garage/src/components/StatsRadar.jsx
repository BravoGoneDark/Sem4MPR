import { constructors, normalizeStats } from '../data/constructors'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'

const normalized = normalizeStats(constructors)

const STAT_LABELS = {
  topSpeed:     'Top Speed',
  acceleration: 'Acceleration',
  braking:      'Braking',
  downforce:    'Downforce',
  drsGain:      'DRS Gain',
  power:        'Power',
}

export default function StatsRadar({ constructor: car }) {
  // Build radar data for this car
  const radarData = Object.keys(car.stats).map((key) => {
    const entry = normalized[key].find((n) => n.id === car.id)
    return {
      stat: STAT_LABELS[key],
      value: Math.round(entry.normalized),
      real: `${car.stats[key].value} ${car.stats[key].unit}`,
    }
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>

      {/* Section label */}
      <div>
        <p style={{
          fontFamily: 'Orbitron',
          fontSize: '0.6rem',
          color: 'rgba(255,255,255,0.35)',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
        }}>
          Performance Profile
        </p>
        <div style={{
          width: '40px',
          height: '2px',
          background: car.teamColor,
          marginTop: '6px',
          boxShadow: `0 0 8px ${car.teamColor}`,
        }} />
      </div>

      {/* Radar Chart */}
      <div style={{ height: '280px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <PolarGrid
              stroke="rgba(255,255,255,0.08)"
              gridType="polygon"
            />
            <PolarAngleAxis
              dataKey="stat"
              tick={{
                fontFamily: 'Orbitron',
                fontSize: 9,
                fill: 'rgba(255,255,255,0.55)',
                letterSpacing: '0.05em',
              }}
            />
            <Radar
              name={car.car}
              dataKey="value"
              stroke={car.teamColor}
              fill={car.teamColor}
              fillOpacity={0.15}
              strokeWidth={2}
              dot={{ fill: car.teamColor, r: 3 }}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(10,10,10,0.95)',
                border: `1px solid ${car.teamColor}55`,
                borderRadius: '8px',
                fontFamily: 'Orbitron',
                fontSize: '0.7rem',
              }}
              formatter={(value, name, props) => [props.payload.real, '']}
              labelStyle={{ color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Stat callouts below radar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.75rem',
      }}>
        {Object.keys(car.stats).map((key) => (
          <div key={key} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            borderLeft: `2px solid ${car.teamColor}`,
          }}>
            <p style={{
              fontFamily: 'Orbitron',
              fontSize: '0.55rem',
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '4px',
            }}>
              {STAT_LABELS[key]}
            </p>
            <p style={{
              fontFamily: 'Orbitron',
              fontSize: '1.1rem',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '0.05em',
              lineHeight: 1,
            }}>
              {car.stats[key].value}
              <span style={{
                fontSize: '0.65rem',
                color: car.teamColor,
                marginLeft: '4px',
                fontWeight: 400,
              }}>
                {car.stats[key].unit}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}