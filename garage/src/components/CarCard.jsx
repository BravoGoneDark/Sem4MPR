import { useState } from 'react'

export default function CarCard({ constructor, onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={() => onClick(constructor)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16/10',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        border: `1px solid ${hovered ? constructor.teamColor : 'rgba(255,255,255,0.08)'}`,
        boxShadow: hovered ? `0 0 24px ${constructor.teamColor}55, 0 0 48px ${constructor.teamColor}22` : '0 4px 24px rgba(0,0,0,0.6)',
        transition: 'border 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
        transform: hovered ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
      }}
    >
      {/* Background preview image */}
      <img
        src={constructor.preview}
        alt={constructor.car}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.4s ease, filter 0.3s ease',
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
          filter: hovered ? 'brightness(0.35) blur(3px)' : 'brightness(0.65)',
        }}
      />

      {/* Glassmorphism overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.4) 100%)',
        backdropFilter: 'blur(0px)',
      }} />

      {/* Team color bottom accent bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: constructor.teamColor,
        boxShadow: `0 0 12px ${constructor.teamColor}`,
        opacity: hovered ? 1 : 0.6,
        transition: 'opacity 0.3s ease',
      }} />

      {/* Car name — always visible at bottom */}
      <div style={{
        position: 'absolute',
        bottom: '14px',
        left: '16px',
        right: '16px',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        opacity: hovered ? 0 : 1,
        transform: hovered ? 'translateY(4px)' : 'translateY(0)',
      }}>
        <p style={{
          fontFamily: 'Orbitron',
          fontSize: '0.7rem',
          color: 'yellow',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          marginBottom: '2px',
        }}>
          {constructor.name}
        </p>
        <p style={{
          fontFamily: 'Orbitron',
          fontSize: '1.1rem',
          fontWeight: 700,
          color: 'yellow',
          letterSpacing: '0.05em',
        }}>
          {constructor.car}
        </p>
      </div>

      {/* Logo — fades in on hover, centered */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}>
        <img
          src={constructor.logo}
          alt={`${constructor.name} logo`}
          style={{
            width: constructor.logoscale || '110px',
            height: constructor.logoscale || '110px',
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.4))',
          }}
        />
        <p style={{
          fontFamily: 'Orbitron',
          fontSize: '0.65rem',
          color: 'var(--primary)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}>
          View Car
        </p>
      </div>
    </div>
  )
}