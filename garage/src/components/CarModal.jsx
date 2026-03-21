import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { lazy, Suspense } from 'react'
const CarViewer = lazy(() => import('./CarViewer'))
import StatsRadar from './StatsRadar'

export default function CarModal({ constructor, onClose }) {
  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 20, 35, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Modal Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '90vw',
            height: '83vh',
            background: 'rgba(10, 10, 10, 0.95)',
            border: `1px solid ${constructor.teamColor}55`,
            borderRadius: '16px',
            boxShadow: `0 0 60px ${constructor.teamColor}22, 0 24px 80px rgba(0,0,0,0.8)`,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Carbon fiber texture inside modal */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              repeating-linear-gradient(45deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 50%),
              repeating-linear-gradient(-45deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 50%)
            `,
            backgroundSize: '6px 6px',
            borderRadius: '16px',
            pointerEvents: 'none',
          }} />

          {/* Top accent line in team color */}
          <div style={{
            height: '3px',
            background: `linear-gradient(90deg, transparent, ${constructor.teamColor}, transparent)`,
            flexShrink: 0,
          }} />

          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.2rem 2rem',
            borderBottom: `1px solid rgba(255,255,255,0.06)`,
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img
                src={constructor.logo}
                alt={constructor.name}
                style={{ width: '36px', height: '36px', objectFit: 'contain' }}
              />
              <div>
                <p style={{
                  fontFamily: 'Orbitron',
                  fontSize: '0.6rem',
                  color: constructor.teamColor,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                }}>
                  {constructor.name}
                </p>
                <h2 style={{
                  fontFamily: 'Orbitron',
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  color: '#fff',
                  letterSpacing: '0.05em',
                  lineHeight: 1,
                }}>
                  {constructor.car}
                </h2>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff',
                fontFamily: 'Orbitron',
                fontSize: '0.7rem',
                letterSpacing: '0.15em',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                transition: 'background 0.2s ease, border 0.2s ease',
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

          {/* Body — two columns */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            flex: 1,
            overflow: 'hidden',
          }}>
            {/* Left — 3D Viewer */}
            <div style={{
                borderRight: `1px solid rgba(255,255,255,0.06)`,
                position: 'relative',
            }}>
              <Suspense fallback={
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    border: `2px solid rgba(255,255,255,0.1)`,
                    borderTop: `2px solid ${constructor.teamColor}`,
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
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
            <div style={{
              overflowY: 'auto',
              padding: '1.5rem 2rem',
            }}>
              <StatsRadar constructor={constructor} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}