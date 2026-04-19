import CarCard from './CarCard'
import { constructors } from '../data/constructors'

export default function GarageGrid({ onCardClick }) {
  const first9 = constructors.slice(0, 9)
  const last1 = constructors[9]

  return (
    <section style={{ padding: '0 3rem 4rem' }}>
      {/* 3x3 grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1.5rem',
        marginBottom: '1.5rem',
      }}>
        {first9.map((constructor) => (
          <CarCard
            key={constructor.id}
            constructor={constructor}
            onClick={onCardClick}
          />
        ))}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
      }}>
        <div style={{ width: 'calc(33.333% - 0.75rem)' }}>
          <CarCard
            constructor={last1}
            onClick={onCardClick}
          />
        </div>
      </div>
    </section>
  )
}