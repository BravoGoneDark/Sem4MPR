import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { lazy, Suspense } from 'react'
const CarViewer = lazy(() => import('./CarViewer'))
import StatsRadar from './StatsRadar'
import TechnicalDossier from './TechnicalDossier'
import { constructors } from '../data/constructors'

export default function CarModal({ constructor, onClose }) {
  const [compareIds, setCompareIds]     = useState([])   // max 2 entries
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [dossierOpen, setDossierOpen]   = useState(false)

  const MAX_COMPARE = 2

  const compareCars = compareIds
    .map(id => constructors.find(c => c.id === id))
    .filter(Boolean)

  const otherCars = constructors.filter(c => c.id !== constructor.id)

  const toggleCompare = (id) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= MAX_COMPARE) return prev   // already at max, ignore
      return [...prev, id]
    })
  }

  const clearAll = (e) => {
    e.stopPropagation()
    setCompareIds([])
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        if (dossierOpen)  { setDossierOpen(false); return }
        if (dropdownOpen) { setDropdownOpen(false); return }
        onClose()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, dropdownOpen, dossierOpen])

  useEffect(() => {
    if (!dropdownOpen) return
    const handler = (e) => {
      if (!e.target.closest('[data-compare-dropdown]')) setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dropdownOpen])

  const atMax = compareIds.length >= MAX_COMPARE

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(15, 20, 35, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '90vw', height: '83vh',
              background: 'rgba(10, 10, 10, 0.95)',
              border: `1px solid ${constructor.teamColor}55`,
              borderRadius: '16px',
              boxShadow: `0 0 60px ${constructor.teamColor}22, 0 24px 80px rgba(0,0,0,0.8)`,
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden', position: 'relative',
            }}
          >
            {/* Carbon fiber texture */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `
                repeating-linear-gradient(45deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 50%),
                repeating-linear-gradient(-45deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 50%)
              `,
              backgroundSize: '6px 6px',
              borderRadius: '16px', pointerEvents: 'none',
            }} />

            {/* Top accent */}
            <div style={{
              height: '3px', flexShrink: 0,
              background: `linear-gradient(90deg, transparent, ${constructor.teamColor}, transparent)`,
            }} />

            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1.2rem 2rem',
              borderBottom: `1px solid rgba(255,255,255,0.06)`,
              flexShrink: 0, gap: '1rem',
            }}>
              {/* Left — car identity */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src={constructor.logo} alt={constructor.name}
                  style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
                <div>
                  <p style={{
                    fontFamily: 'Orbitron', fontSize: '0.6rem',
                    color: constructor.teamColor, letterSpacing: '0.25em', textTransform: 'uppercase',
                  }}>
                    {constructor.name}
                  </p>
                  <h2 style={{
                    fontFamily: 'Orbitron', fontSize: '1.6rem', fontWeight: 800,
                    color: '#fff', letterSpacing: '0.05em', lineHeight: 1,
                  }}>
                    {constructor.car}
                  </h2>
                </div>
              </div>

              {/* Right — dossier + compare + close */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

                {/* DOSSIER */}
                <button
                  onClick={() => setDossierOpen(true)}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid rgba(255,255,255,0.1)`,
                    borderRadius: '8px',
                    color: 'rgba(255,255,255,0.55)',
                    fontFamily: 'Orbitron', fontSize: '0.65rem',
                    letterSpacing: '0.12em', padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    transition: 'all 0.2s ease', whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = `${constructor.teamColor}18`
                    e.currentTarget.style.borderColor = `${constructor.teamColor}88`
                    e.currentTarget.style.color = constructor.teamColor
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.55)'
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <rect x="1.5" y="0.5" width="9" height="11" rx="1" stroke="currentColor" strokeWidth="1.1"/>
                    <line x1="3.5" y1="3.5" x2="8.5" y2="3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                    <line x1="3.5" y1="5.5" x2="8.5" y2="5.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                    <line x1="3.5" y1="7.5" x2="6.5" y2="7.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                  </svg>
                  DOSSIER
                </button>

                {/* COMPARE — multi-select dropdown */}
                <div data-compare-dropdown style={{ position: 'relative' }}>
                  <button
                    onClick={() => setDropdownOpen(v => !v)}
                    style={{
                      background: compareCars.length > 0 ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${compareCars.length > 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'}`,
                      borderRadius: '8px',
                      color: 'rgba(255,255,255,0.6)',
                      fontFamily: 'Orbitron', fontSize: '0.65rem',
                      letterSpacing: '0.12em', padding: '0.5rem 1rem',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      transition: 'all 0.2s ease', whiteSpace: 'nowrap',
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6h8M8 4l2 2-2 2M4 4L2 6l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>

                    {compareCars.length === 0 ? (
                      'COMPARE'
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        {compareCars.map(car => (
                          <div key={car.id} style={{
                            width: '8px', height: '8px', borderRadius: '50%',
                            background: car.teamColor,
                            boxShadow: `0 0 5px ${car.teamColor}`,
                            flexShrink: 0,
                          }} />
                        ))}
                        <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)' }}>
                          {compareCars.length}/{MAX_COMPARE}
                        </span>
                        <span
                          onClick={clearAll}
                          style={{
                            opacity: 0.5, fontSize: '0.85rem', lineHeight: 1,
                            cursor: 'pointer', marginLeft: '2px',
                          }}
                        >
                          ×
                        </span>
                      </div>
                    )}
                  </button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        style={{
                          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                          background: 'rgba(12, 12, 16, 0.98)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '10px', overflow: 'hidden',
                          zIndex: 200, minWidth: '220px',
                          boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
                        }}
                      >
                        {/* Dropdown header */}
                        <div style={{
                          padding: '0.6rem 0.9rem',
                          borderBottom: '1px solid rgba(255,255,255,0.06)',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }}>
                          <p style={{
                            fontFamily: 'Orbitron', fontSize: '0.55rem',
                            color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase',
                          }}>
                            Select up to {MAX_COMPARE}
                          </p>
                          {/* Slot indicators */}
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {Array.from({ length: MAX_COMPARE }).map((_, i) => {
                              const filled = compareCars[i]
                              return (
                                <div key={i} style={{
                                  width: '18px', height: '18px', borderRadius: '4px',
                                  border: `1px solid ${filled ? filled.teamColor + '88' : 'rgba(255,255,255,0.12)'}`,
                                  background: filled ? `${filled.teamColor}22` : 'rgba(255,255,255,0.03)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                  {filled && (
                                    <div style={{
                                      width: '7px', height: '7px', borderRadius: '50%',
                                      background: filled.teamColor,
                                      boxShadow: `0 0 4px ${filled.teamColor}`,
                                    }} />
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        {/* Car rows */}
                        {otherCars.map((car) => {
                          const selected = compareIds.includes(car.id)
                          const disabled = atMax && !selected
                          return (
                            <button
                              key={car.id}
                              onClick={() => !disabled && toggleCompare(car.id)}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                width: '100%', padding: '0.6rem 0.9rem',
                                background: selected ? `rgba(${hexToRgb(car.teamColor)}, 0.12)` : 'transparent',
                                border: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)',
                                cursor: disabled ? 'not-allowed' : 'pointer',
                                textAlign: 'left', transition: 'background 0.15s ease',
                                opacity: disabled ? 0.35 : 1,
                              }}
                              onMouseEnter={e => {
                                if (!disabled) e.currentTarget.style.background = `rgba(${hexToRgb(car.teamColor)}, 0.08)`
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.background = selected ? `rgba(${hexToRgb(car.teamColor)}, 0.12)` : 'transparent'
                              }}
                            >
                              {/* Checkbox */}
                              <div style={{
                                width: '14px', height: '14px', borderRadius: '3px', flexShrink: 0,
                                border: `1px solid ${selected ? car.teamColor : 'rgba(255,255,255,0.2)'}`,
                                background: selected ? `${car.teamColor}33` : 'transparent',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.15s',
                              }}>
                                {selected && (
                                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                    <path d="M1.5 4L3.5 6L6.5 2" stroke={car.teamColor} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                              </div>

                              {/* Team color dot */}
                              <div style={{
                                width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                                background: car.teamColor, boxShadow: `0 0 5px ${car.teamColor}88`,
                              }} />

                              <div style={{ flex: 1 }}>
                                <p style={{
                                  fontFamily: 'Orbitron', fontSize: '0.7rem', fontWeight: 700,
                                  color: selected ? '#fff' : 'rgba(255,255,255,0.7)',
                                  letterSpacing: '0.05em', lineHeight: 1,
                                }}>
                                  {car.car}
                                </p>
                                <p style={{
                                  fontFamily: 'Orbitron', fontSize: '0.5rem',
                                  color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginTop: '2px',
                                }}>
                                  {car.name}
                                </p>
                              </div>
                            </button>
                          )
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* CLOSE */}
                <button
                  onClick={onClose}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px', color: '#fff',
                    fontFamily: 'Orbitron', fontSize: '0.7rem',
                    letterSpacing: '0.15em', padding: '0.5rem 1rem',
                    cursor: 'pointer', transition: 'background 0.2s ease, border 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.target.style.background = 'rgba(255,255,255,0.1)'
                    e.target.style.borderColor = constructor.teamColor
                  }}
                  onMouseLeave={e => {
                    e.target.style.background = 'rgba(255,255,255,0.05)'
                    e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                  }}
                >
                  ESC
                </button>
              </div>
            </div>

            {/* Body */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              flex: 1, overflow: 'hidden',
            }}>
              {/* Left — 3D Viewer */}
              <div style={{ borderRight: `1px solid rgba(255,255,255,0.06)`, position: 'relative' }}>
                <Suspense fallback={
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{
                      width: '40px', height: '40px',
                      border: `2px solid rgba(255,255,255,0.1)`,
                      borderTop: `2px solid ${constructor.teamColor}`,
                      borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                    }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                  </div>
                }>
                  <CarViewer
                    modelPath={constructor.model}
                    teamColor={constructor.teamColor}
                    modelScale={constructor.modelScale}
                    meshCount={constructor.meshCount}
                  />
                </Suspense>
              </div>

              {/* Right — Stats */}
              <div style={{ overflowY: 'auto', padding: '1.5rem 2rem', minHeight: 0 }}>
                <StatsRadar constructor={constructor} compareCars={compareCars} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {dossierOpen && (
          <TechnicalDossier
            constructor={constructor}
            onClose={() => setDossierOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.substring(0, 2), 16)
  const g = parseInt(clean.substring(2, 4), 16)
  const b = parseInt(clean.substring(4, 6), 16)
  return `${r}, ${g}, ${b}`
}