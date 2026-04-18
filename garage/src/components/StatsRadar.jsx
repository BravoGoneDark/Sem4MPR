import { constructors, normalizeStats } from '../data/constructors'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip
} from 'recharts'

const normalized = normalizeStats(constructors)

const RADAR_KEYS = ['topSpeed', 'acceleration', 'braking', 'downforce', 'drsGain', 'power']

const STAT_LABELS = {
  topSpeed:       'Top Speed',
  acceleration:   'Acceleration',
  braking:        'Braking',
  downforce:      'Downforce',
  drsGain:        'DRS Gain',
  power:          'Power',
  tyreWear:       'Tyre Wear',
  corneringSpeed: 'Cornering',
  fuelEfficiency: 'Fuel Eff.',
  reliability:    'Reliability',
  wetPace:        'Wet Pace',
  rakeAngle:      'Rake Angle',
  deploymentRate: 'ERS Deploy',
}

const CustomTooltip = ({ active, payload, carA, compareCars }) => {
  if (!active || !payload?.length) return null
  const point = payload[0]?.payload
  if (!point) return null
  const allCars = [carA, ...compareCars]
  return (
    <div style={{
      background: 'rgba(10,10,10,0.97)',
      border: `1px solid rgba(255,255,255,0.12)`,
      borderRadius: '8px',
      padding: '0.5rem 0.8rem',
      fontFamily: 'Orbitron',
      fontSize: '0.62rem',
      minWidth: '120px',
    }}>
      <p style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.15em', marginBottom: '5px' }}>
        {point.stat}
      </p>
      {allCars.map((car, i) => {
        const realKey = `real${String.fromCharCode(65 + i)}` // realA, realB, realC
        return (
          <p key={car.id} style={{
            color: car.teamColor,
            marginBottom: i < allCars.length - 1 ? '3px' : 0,
          }}>
            {car.car} — {point[realKey]}
          </p>
        )
      })}
    </div>
  )
}

export default function StatsRadar({ constructor: carA, compareCars = [] }) {
  const allStatKeys = Object.keys(carA.stats)
  const hasCompare  = compareCars.length > 0

  // Build radar data — valueA always present, valueB/valueC only when cars selected
  const radarData = RADAR_KEYS.map((key) => {
    const entryA = normalized[key].find(n => n.id === carA.id)
    const entryB = compareCars[0] ? normalized[key].find(n => n.id === compareCars[0].id) : null
    const entryC = compareCars[1] ? normalized[key].find(n => n.id === compareCars[1].id) : null
    return {
      stat:   STAT_LABELS[key],
      valueA: Math.round(entryA.normalized),
      valueB: entryB ? Math.round(entryB.normalized) : null,
      valueC: entryC ? Math.round(entryC.normalized) : null,
      realA:  `${carA.stats[key].value} ${carA.stats[key].unit}`,
      realB:  compareCars[0] ? `${compareCars[0].stats[key].value} ${compareCars[0].stats[key].unit}` : null,
      realC:  compareCars[1] ? `${compareCars[1].stats[key].value} ${compareCars[1].stats[key].unit}` : null,
    }
  })

  const allActiveCars = [carA, ...compareCars]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>

      {/* Section label + legend */}
      <div>
        <p style={{
          fontFamily: 'Orbitron', fontSize: '0.55rem',
          color: 'rgba(255,255,255,0.35)',
          letterSpacing: '0.3em', textTransform: 'uppercase',
        }}>
          {hasCompare ? `${allActiveCars.length}-Way Comparison` : 'Performance Profile'}
        </p>
        <div style={{
          width: '36px', height: '2px',
          background: carA.teamColor, marginTop: '5px',
          boxShadow: `0 0 8px ${carA.teamColor}`,
        }} />

        {hasCompare && (
          <div style={{ display: 'flex', gap: '1rem', marginTop: '8px', flexWrap: 'wrap' }}>
            {allActiveCars.map((car) => (
              <div key={car.id} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{
                  width: '16px', height: '2px',
                  background: car.teamColor,
                  boxShadow: `0 0 5px ${car.teamColor}`,
                }} />
                <span style={{
                  fontFamily: 'Orbitron', fontSize: '0.5rem',
                  color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em',
                }}>
                  {car.car}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Radar */}
      <div style={{ height: '230px', width: '100%', flexShrink: 0, minWidth: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            data={radarData}
            margin={{ top: 12, right: 32, bottom: 12, left: 32 }}
            outerRadius="68%"
          >
            <PolarGrid stroke="rgba(255,255,255,0.08)" gridType="polygon" />
            <PolarAngleAxis
              dataKey="stat"
              tick={{
                fontFamily: 'Orbitron', fontSize: 8,
                fill: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em',
              }}
            />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />

            {/* Car A — always */}
            <Radar
              name={carA.car} dataKey="valueA"
              stroke={carA.teamColor} fill={carA.teamColor}
              fillOpacity={hasCompare ? 0.10 : 0.18}
              strokeWidth={2}
              dot={{ fill: carA.teamColor, r: 3 }}
            />

            {/* Car B */}
            {compareCars[0] && (
              <Radar
                name={compareCars[0].car} dataKey="valueB"
                stroke={compareCars[0].teamColor} fill={compareCars[0].teamColor}
                fillOpacity={0.10} strokeWidth={2}
                dot={{ fill: compareCars[0].teamColor, r: 3 }}
              />
            )}

            {/* Car C */}
            {compareCars[1] && (
              <Radar
                name={compareCars[1].car} dataKey="valueC"
                stroke={compareCars[1].teamColor} fill={compareCars[1].teamColor}
                fillOpacity={0.10} strokeWidth={2}
                dot={{ fill: compareCars[1].teamColor, r: 3 }}
              />
            )}

            <Tooltip content={<CustomTooltip carA={carA} compareCars={compareCars} />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* All 13 stat cards — 3 columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '0.4rem',
      }}>
        {allStatKeys.map((key) => (
          <div key={key} style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.055)',
            borderRadius: '6px',
            padding: '0.4rem 0.55rem',
            borderLeft: `2px solid ${carA.teamColor}`,
          }}>
            <p style={{
              fontFamily: 'Orbitron', fontSize: '0.42rem',
              color: 'rgba(255,255,255,0.38)', letterSpacing: '0.12em',
              textTransform: 'uppercase', marginBottom: '2px',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {STAT_LABELS[key]}
            </p>

            {/* Car A — always white, primary */}
            <p style={{
              fontFamily: 'Orbitron', fontSize: '0.78rem', fontWeight: 700,
              color: '#fff', letterSpacing: '0.03em', lineHeight: 1,
            }}>
              {carA.stats[key].value}
              <span style={{ fontSize: '0.48rem', color: carA.teamColor, marginLeft: '3px', fontWeight: 400 }}>
                {carA.stats[key].unit}
              </span>
            </p>

            {/* Compare cars stacked below */}
            {compareCars.map((car) => (
              <p key={car.id} style={{
                fontFamily: 'Orbitron', fontSize: '0.65rem', fontWeight: 600,
                color: 'rgba(255,255,255,0.5)', letterSpacing: '0.03em', lineHeight: 1,
                marginTop: '3px', paddingTop: '3px',
                borderTop: '1px solid rgba(255,255,255,0.05)',
              }}>
                {car.stats[key].value}
                <span style={{ fontSize: '0.44rem', color: car.teamColor, marginLeft: '3px', fontWeight: 400 }}>
                  {car.stats[key].unit}
                </span>
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}