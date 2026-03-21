import { useState } from 'react'
import GarageGrid from './components/GarageGrid'
import CarModal from './components/CarModal'

export default function App() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="min-h-screen">
      <div style={{
        padding: '3rem 3rem 2rem',
        borderBottom: '1px solid rgba(0, 194, 222, 0.15)',
        marginBottom: '2.5rem',
      }}>
        <p style={{
          fontFamily: 'Orbitron',
          fontSize: '0.7rem',
          color: 'var(--primary)',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          marginBottom: '0.5rem',
        }}>
          2025 Season
        </p>
        <h1 style={{
          fontFamily: 'Orbitron',
          fontSize: '2.8rem',
          fontWeight: 800,
          color: '#fff',
          letterSpacing: '0.05em',
          lineHeight: 1,
        }}>
          THE PADDOCK
        </h1>
        <p style={{
          fontFamily: 'Rajdhani',
          fontSize: '1.2rem',
          color: 'rgba(255,255,255,0.45)',
          marginTop: '0.75rem',
          letterSpacing: '0.05em',
          lineHeight: 1.6,
        }}>
          Where engineering meets obsession.<br />
          The fastest machines on earth — Precision. Power. Performance.
        </p>
      </div>

      <GarageGrid onCardClick={(c) => setSelected(c)} />

      {selected && (
        <CarModal
          constructor={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}