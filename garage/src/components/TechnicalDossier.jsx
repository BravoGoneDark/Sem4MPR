import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell
} from 'recharts'
import { constructors, normalizeStats } from '../data/constructors'

const normalized = normalizeStats(constructors)

const STAT_LABELS = {
  topSpeed:       'Top Speed',
  acceleration:   'Accel',
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

const SPEC_LABELS = {
  founded:    'Founded',
  base:       'Base',
  engine:     'Power Unit',
  chassis:    'Chassis',
  gearbox:    'Gearbox',
  suspension: 'Suspension',
}

const RADAR_KEYS_A = ['topSpeed', 'acceleration', 'braking', 'downforce', 'drsGain', 'power']
const RADAR_KEYS_B = ['tyreWear', 'corneringSpeed', 'fuelEfficiency', 'reliability', 'wetPace', 'rakeAngle', 'deploymentRate']

const MAX_COMPARE = 2

// ── Bar tooltip ───────────────────────────────────────────────────────────────
const BarTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={{
      background: 'rgba(8,8,12,0.97)', border: `1px solid ${d.color}44`,
      borderRadius: '6px', padding: '0.5rem 0.75rem',
      fontFamily: 'Orbitron', fontSize: '0.6rem',
    }}>
      <p style={{ color: d.color, marginBottom: '2px', letterSpacing: '0.1em' }}>{d.name}</p>
      <p style={{ color: '#fff' }}>Score: <span style={{ color: d.color }}>{d.score}</span></p>
    </div>
  )
}

// ── Radar tooltip — shows all active cars ────────────────────────────────────
const RadarTooltipCustom = ({ active, payload, car, compareCars, statKeys }) => {
  if (!active || !payload?.length) return null
  const point = payload[0]?.payload
  if (!point) return null
  const label = point.stat
  const statKey = statKeys.find(k => STAT_LABELS[k] === label)
  const allCars = [car, ...compareCars]
  return (
    <div style={{
      background: 'rgba(8,8,12,0.97)', border: `1px solid ${car.teamColor}44`,
      borderRadius: '6px', padding: '0.5rem 0.75rem',
      fontFamily: 'Orbitron', fontSize: '0.6rem', minWidth: '140px',
    }}>
      <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: '5px' }}>{label}</p>
      {allCars.map((c, i) => {
        const valKey = `value${String.fromCharCode(65 + i)}` // valueA, valueB, valueC
        const real = statKey ? `${c.stats[statKey].value} ${c.stats[statKey].unit}` : point[valKey]
        return (
          <p key={c.id} style={{ color: c.teamColor, marginBottom: i < allCars.length - 1 ? '3px' : 0 }}>
            {c.car} — {real}
          </p>
        )
      })}
    </div>
  )
}

// ── Compare dropdown ─────────────────────────────────────────────────────────
function CompareDropdown({ car, compareIds, setCompareIds, otherCars }) {
  const [open, setOpen] = useState(false)

  const compareCars = compareIds.map(id => constructors.find(c => c.id === id)).filter(Boolean)
  const atMax = compareIds.length >= MAX_COMPARE

  const toggle = (id) => {
    setCompareIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id)
        : prev.length >= MAX_COMPARE ? prev
        : [...prev, id]
    )
  }

  const clearAll = (e) => { e.stopPropagation(); setCompareIds([]) }

  // Close on outside click
  const ref = (node) => {
    if (!node) return
    const handler = (e) => { if (!node.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          fontFamily: 'Orbitron', fontSize: '0.48rem',
          letterSpacing: '0.1em', padding: '3px 8px',
          borderRadius: '4px', cursor: 'pointer',
          border: compareIds.length > 0 ? `1px solid ${car.teamColor}` : '1px solid rgba(255,255,255,0.08)',
          background: compareIds.length > 0 ? `${car.teamColor}20` : 'rgba(255,255,255,0.03)',
          color: compareIds.length > 0 ? car.teamColor : 'rgba(255,255,255,0.35)',
          transition: 'all 0.15s',
          display: 'flex', alignItems: 'center', gap: '5px',
        }}
      >
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
          <path d="M2 6h8M8 4l2 2-2 2M4 4L2 6l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {compareIds.length === 0 ? 'Compare' : (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {compareCars.map(c => (
              <span key={c.id} style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: c.teamColor, display: 'inline-block',
                boxShadow: `0 0 4px ${c.teamColor}`,
              }} />
            ))}
            {compareIds.length}/{MAX_COMPARE}
            <span onClick={clearAll} style={{ opacity: 0.6, fontSize: '0.7rem', marginLeft: '2px', cursor: 'pointer' }}>×</span>
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute', top: 'calc(100% + 6px)', right: 0,
              background: 'rgba(10,10,14,0.98)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px', overflow: 'hidden',
              zIndex: 300, minWidth: '190px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '0.5rem 0.8rem',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <p style={{ fontFamily: 'Orbitron', fontSize: '0.48rem', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Select up to {MAX_COMPARE}
              </p>
              <div style={{ display: 'flex', gap: '3px' }}>
                {Array.from({ length: MAX_COMPARE }).map((_, i) => {
                  const filled = compareCars[i]
                  return (
                    <div key={i} style={{
                      width: '16px', height: '16px', borderRadius: '3px',
                      border: `1px solid ${filled ? filled.teamColor + '88' : 'rgba(255,255,255,0.12)'}`,
                      background: filled ? `${filled.teamColor}22` : 'rgba(255,255,255,0.03)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {filled && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: filled.teamColor, boxShadow: `0 0 4px ${filled.teamColor}` }} />}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Car rows */}
            {otherCars.map(c => {
              const selected = compareIds.includes(c.id)
              const disabled = atMax && !selected
              return (
                <button key={c.id}
                  onClick={() => !disabled && toggle(c.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem',
                    width: '100%', padding: '0.5rem 0.8rem',
                    background: selected ? `${c.teamColor}18` : 'transparent',
                    border: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    textAlign: 'left', transition: 'background 0.12s',
                    opacity: disabled ? 0.3 : 1,
                  }}
                  onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = `${c.teamColor}12` }}
                  onMouseLeave={e => { e.currentTarget.style.background = selected ? `${c.teamColor}18` : 'transparent' }}
                >
                  {/* Checkbox */}
                  <div style={{
                    width: '12px', height: '12px', borderRadius: '3px', flexShrink: 0,
                    border: `1px solid ${selected ? c.teamColor : 'rgba(255,255,255,0.2)'}`,
                    background: selected ? `${c.teamColor}33` : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {selected && (
                      <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4L3.5 6L6.5 2" stroke={c.teamColor} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: c.teamColor, boxShadow: `0 0 4px ${c.teamColor}88`, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontFamily: 'Orbitron', fontSize: '0.6rem', fontWeight: 700, color: selected ? '#fff' : 'rgba(255,255,255,0.65)', letterSpacing: '0.04em', lineHeight: 1 }}>{c.car}</p>
                    <p style={{ fontFamily: 'Orbitron', fontSize: '0.44rem', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.08em', marginTop: '2px' }}>{c.name}</p>
                  </div>
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TechnicalDossier({ constructor: car, onClose }) {
  const [activeIds, setActiveIds] = useState(
    constructors.filter(c => c.id !== car.id).map(c => c.id)
  )
  const [activeStat, setActiveStat]   = useState('topSpeed')
  const [radarGroup, setRadarGroup]   = useState('A')
  const [compareIds, setCompareIds]   = useState([])   // for radar overlay, max 2

  const otherCars = constructors.filter(c => c.id !== car.id)
  const compareCars = compareIds.map(id => constructors.find(c => c.id === id)).filter(Boolean)
  const hasCompare  = compareCars.length > 0

  const currentRadarKeys = radarGroup === 'A' ? RADAR_KEYS_A : RADAR_KEYS_B

  // Build radar data — valueA always present, valueB/valueC for compare cars
  const radarData = currentRadarKeys.map((key) => {
    const entryA = normalized[key].find(n => n.id === car.id)
    const entryB = compareCars[0] ? normalized[key].find(n => n.id === compareCars[0].id) : null
    const entryC = compareCars[1] ? normalized[key].find(n => n.id === compareCars[1].id) : null
    return {
      stat:   STAT_LABELS[key],
      valueA: Math.round(entryA.normalized),
      valueB: entryB ? Math.round(entryB.normalized) : null,
      valueC: entryC ? Math.round(entryC.normalized) : null,
    }
  })

  const barData = constructors
    .filter(c => c.id === car.id || activeIds.includes(c.id))
    .map(c => {
      const entry = normalized[activeStat].find(n => n.id === c.id)
      return { name: c.car, score: Math.round(entry.normalized), color: c.teamColor, isSelf: c.id === car.id }
    })
    .sort((a, b) => b.score - a.score)

  const { details } = car
  const specKeys = Object.keys(SPEC_LABELS)
  const allActiveCars = [car, ...compareCars]

  return (
    <AnimatePresence>
      <motion.div
        key="dossier-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)',
          zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <motion.div
          key="dossier-panel"
          initial={{ opacity: 0, scale: 0.82, y: 32 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.86, y: 20 }}
          transition={{
            opacity: { duration: 0.55, delay: 0.12, ease: 'easeOut' },
            scale:   { duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] },
            y:       { duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] },
          }}
          onClick={e => e.stopPropagation()}
          style={{
            width: '93vw', height: '91vh', background: '#06060a',
            border: `1px solid ${car.teamColor}2e`, borderRadius: '20px',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden', position: 'relative',
            boxShadow: `0 0 120px ${car.teamColor}14, 0 40px 120px rgba(0,0,0,0.95)`,
          }}
        >
          {/* Noise overlay */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '20px',
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E")`,
            pointerEvents: 'none', zIndex: 0,
          }} />

          {/* Accent line */}
          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              height: '3px', flexShrink: 0, transformOrigin: 'left',
              background: `linear-gradient(90deg, ${car.teamColor}, ${car.teamColor}88, transparent)`,
              position: 'relative', zIndex: 1,
            }}
          />

          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1rem 2rem', borderBottom: `1px solid rgba(255,255,255,0.05)`,
            flexShrink: 0, position: 'relative', zIndex: 1,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img src={car.logo} alt={car.name} style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
              <div>
                <p style={{ fontFamily: 'Orbitron', fontSize: '0.5rem', color: car.teamColor, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
                  Technical Dossier
                </p>
                <h2 style={{ fontFamily: 'Orbitron', fontSize: '1.4rem', fontWeight: 800, color: '#fff', letterSpacing: '0.05em', lineHeight: 1 }}>
                  {car.car}
                  <span style={{ fontFamily: 'Orbitron', fontSize: '0.6rem', fontWeight: 400, color: 'rgba(255,255,255,0.3)', marginLeft: '10px', letterSpacing: '0.2em' }}>
                    {car.name.toUpperCase()}
                  </span>
                </h2>
              </div>
            </div>
            <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px', color: 'rgba(255,255,255,0.45)',
              fontFamily: 'Orbitron', fontSize: '0.65rem',
              letterSpacing: '0.15em', padding: '0.45rem 0.9rem',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = car.teamColor }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
            >
              CLOSE
            </button>
          </div>

          {/* Body */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 1 }}>

            {/* Top 40% — info */}
            <div style={{
              height: '40%', flexShrink: 0,
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              borderBottom: `1px solid rgba(255,255,255,0.05)`, overflow: 'hidden',
            }}>
              {/* Left — history + specs */}
              <div style={{ borderRight: `1px solid rgba(255,255,255,0.05)`, padding: '1.25rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '0.9rem', overflowY: 'auto' }}>
                <div>
                  <p style={{ fontFamily: 'Orbitron', fontSize: '0.48rem', color: car.teamColor, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Constructor History
                  </p>
                  <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.65 }}>
                    {details.history}
                  </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem' }}>
                  {specKeys.map(key => (
                    <div key={key} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', padding: '0.45rem 0.7rem' }}>
                      <p style={{ fontFamily: 'Orbitron', fontSize: '0.42rem', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '3px' }}>
                        {SPEC_LABELS[key]}
                      </p>
                      <p style={{ fontFamily: 'Orbitron', fontSize: '0.58rem', color: '#e8e8e8', letterSpacing: '0.03em', lineHeight: 1.3 }}>
                        {details[key]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — strengths + weaknesses */}
              <div style={{ padding: '1.25rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: car.teamColor, boxShadow: `0 0 8px ${car.teamColor}` }} />
                    <p style={{ fontFamily: 'Orbitron', fontSize: '0.48rem', color: car.teamColor, letterSpacing: '0.25em', textTransform: 'uppercase' }}>Performance Advantages</p>
                  </div>
                  {details.strengths.map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '7px' }}>
                      <span style={{ fontFamily: 'Orbitron', fontSize: '0.5rem', color: car.teamColor, marginTop: '2px', flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</span>
                      <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.82rem', color: 'rgba(255,255,255,0.68)', lineHeight: 1.5 }}>{s}</p>
                    </div>
                  ))}
                </div>
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,75,75,0.85)', boxShadow: '0 0 8px rgba(255,75,75,0.45)' }} />
                    <p style={{ fontFamily: 'Orbitron', fontSize: '0.48rem', color: 'rgba(255,75,75,0.85)', letterSpacing: '0.25em', textTransform: 'uppercase' }}>Known Limitations</p>
                  </div>
                  {details.weaknesses.map((w, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '7px' }}>
                      <span style={{ fontFamily: 'Orbitron', fontSize: '0.5rem', color: 'rgba(255,75,75,0.6)', marginTop: '2px', flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</span>
                      <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.82rem', color: 'rgba(255,255,255,0.52)', lineHeight: 1.5 }}>{w}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom 60% — charts */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' }}>

              {/* Left — Radar */}
              <div style={{ borderRight: `1px solid rgba(255,255,255,0.05)`, padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', overflow: 'hidden' }}>

                {/* Radar controls row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                  <p style={{ fontFamily: 'Orbitron', fontSize: '0.48rem', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                    Performance Signature
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {/* Core / Extended toggle */}
                    {[{ key: 'A', label: 'Core' }, { key: 'B', label: 'Extended' }].map(({ key, label }) => (
                      <button key={key} onClick={() => setRadarGroup(key)} style={{
                        fontFamily: 'Orbitron', fontSize: '0.48rem',
                        letterSpacing: '0.1em', padding: '3px 8px',
                        borderRadius: '4px', cursor: 'pointer',
                        border: radarGroup === key ? `1px solid ${car.teamColor}` : '1px solid rgba(255,255,255,0.08)',
                        background: radarGroup === key ? `${car.teamColor}20` : 'rgba(255,255,255,0.03)',
                        color: radarGroup === key ? car.teamColor : 'rgba(255,255,255,0.35)',
                        transition: 'all 0.15s',
                      }}>
                        {label}
                      </button>
                    ))}
                    {/* Divider */}
                    <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.08)' }} />
                    {/* Compare dropdown */}
                    <CompareDropdown
                      car={car}
                      compareIds={compareIds}
                      setCompareIds={setCompareIds}
                      otherCars={otherCars}
                    />
                  </div>
                </div>

                {/* Legend when comparing */}
                {hasCompare && (
                  <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', flexShrink: 0 }}>
                    {allActiveCars.map(c => (
                      <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '14px', height: '2px', background: c.teamColor, boxShadow: `0 0 4px ${c.teamColor}` }} />
                        <span style={{ fontFamily: 'Orbitron', fontSize: '0.44rem', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.08em' }}>{c.car}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Radar chart */}
                <div style={{ flex: 1, minHeight: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} outerRadius="70%"
                      margin={{ top: 22, right: 44, bottom: 22, left: 44 }}>
                      <PolarGrid stroke="rgba(255,255,255,0.07)" gridType="polygon" />
                      <PolarAngleAxis dataKey="stat" tick={{ fontFamily: 'Orbitron', fontSize: 8.5, fill: 'rgba(255,255,255,0.48)', letterSpacing: '0.04em' }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />

                      {/* Main car — always */}
                      <Radar
                        name={car.car} dataKey="valueA"
                        stroke={car.teamColor} fill={car.teamColor}
                        fillOpacity={hasCompare ? 0.12 : 0.2} strokeWidth={2.5}
                        dot={{ fill: car.teamColor, r: 4, strokeWidth: 0 }}
                      />

                      {/* Compare car B */}
                      {compareCars[0] && (
                        <Radar
                          name={compareCars[0].car} dataKey="valueB"
                          stroke={compareCars[0].teamColor} fill={compareCars[0].teamColor}
                          fillOpacity={0.12} strokeWidth={2}
                          dot={{ fill: compareCars[0].teamColor, r: 3, strokeWidth: 0 }}
                        />
                      )}

                      {/* Compare car C */}
                      {compareCars[1] && (
                        <Radar
                          name={compareCars[1].car} dataKey="valueC"
                          stroke={compareCars[1].teamColor} fill={compareCars[1].teamColor}
                          fillOpacity={0.12} strokeWidth={2}
                          dot={{ fill: compareCars[1].teamColor, r: 3, strokeWidth: 0 }}
                        />
                      )}

                      <Tooltip content={<RadarTooltipCustom car={car} compareCars={compareCars} statKeys={currentRadarKeys} />} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right — Bar chart (unchanged) */}
              <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', overflow: 'hidden' }}>
                <div style={{ flexShrink: 0 }}>
                  <p style={{ fontFamily: 'Orbitron', fontSize: '0.48rem', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '7px' }}>
                    Field Comparison
                  </p>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {Object.keys(STAT_LABELS).map(key => (
                      <button key={key} onClick={() => setActiveStat(key)} style={{
                        fontFamily: 'Orbitron', fontSize: '0.48rem',
                        letterSpacing: '0.08em', padding: '3px 7px',
                        borderRadius: '4px', cursor: 'pointer',
                        border: activeStat === key ? `1px solid ${car.teamColor}` : '1px solid rgba(255,255,255,0.07)',
                        background: activeStat === key ? `${car.teamColor}22` : 'rgba(255,255,255,0.025)',
                        color: activeStat === key ? car.teamColor : 'rgba(255,255,255,0.35)',
                        transition: 'all 0.15s',
                      }}>
                        {STAT_LABELS[key]}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ flex: 1, minHeight: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} layout="vertical"
                      margin={{ top: 4, right: 24, bottom: 4, left: 4 }} barSize={13}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.04)" />
                      <XAxis type="number" domain={[40, 100]} hide />
                      <YAxis type="category" dataKey="name" width={54}
                        tick={{ fontFamily: 'Orbitron', fontSize: 7.5, fill: 'rgba(255,255,255,0.42)' }}
                        axisLine={false} tickLine={false} />
                      <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.025)' }} />
                      <Bar dataKey="score" radius={[0, 3, 3, 0]}>
                        {barData.map((entry, index) => (
                          <Cell key={index} fill={entry.color}
                            opacity={entry.isSelf ? 1 : 0.6}
                            stroke={entry.isSelf ? entry.color : 'none'}
                            strokeWidth={entry.isSelf ? 1 : 0}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ flexShrink: 0 }}>
                  <p style={{ fontFamily: 'Orbitron', fontSize: '0.42rem', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '5px' }}>
                    Toggle Constructors
                  </p>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {constructors.filter(c => c.id !== car.id).map(c => {
                      const on = activeIds.includes(c.id)
                      return (
                        <button key={c.id} onClick={() => setActiveIds(prev => prev.includes(c.id) ? prev.filter(x => x !== c.id) : [...prev, c.id])} style={{
                          fontFamily: 'Orbitron', fontSize: '0.42rem',
                          letterSpacing: '0.07em', padding: '3px 7px',
                          borderRadius: '4px', cursor: 'pointer',
                          border: on ? `1px solid ${c.teamColor}80` : '1px solid rgba(255,255,255,0.06)',
                          background: on ? `${c.teamColor}18` : 'rgba(255,255,255,0.02)',
                          color: on ? c.teamColor : 'rgba(255,255,255,0.22)',
                          transition: 'all 0.15s',
                        }}>
                          {c.car}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}