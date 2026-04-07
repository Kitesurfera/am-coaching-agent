import React from 'react';
import { Composition, AbsoluteFill } from 'remotion';

// Importamos el motor gráfico HUD que usamos en Video y Carrusel
const RenderAesthetic = ({ tipo }) => {
  // (Mismo código de RenderAesthetic que usaste en Video.jsx y Carrusel.jsx)
  // ... Pega aquí el switch(tipo) con los HUDs, cuadrículas, etc. ...
    switch (tipo) {
    case 'estructura_grid':
      return (
        <AbsoluteFill>
          <AbsoluteFill style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }} />
          <div style={{ position: 'absolute', top: 50, left: 50, width: 40, height: 40, borderTop: '2px solid #2299AF', borderLeft: '2px solid #2299AF' }} />
          <div style={{ position: 'absolute', top: 50, right: 50, width: 40, height: 40, borderTop: '2px solid #2299AF', borderRight: '2px solid #2299AF' }} />
          <div style={{ position: 'absolute', bottom: 50, left: 50, width: 40, height: 40, borderBottom: '2px solid #2299AF', borderLeft: '2px solid #2299AF' }} />
          <div style={{ position: 'absolute', bottom: 50, right: 50, width: 40, height: 40, borderBottom: '2px solid #2299AF', borderRight: '2px solid #2299AF' }} />
        </AbsoluteFill>
      );
    case 'fluidez':
      return (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%', opacity: 0.2, position: 'absolute' }}>
            <path d="M-10,50 Q25,20 50,50 T110,50" fill="none" stroke="#14b8a6" strokeWidth="0.3" />
            <path d="M-10,60 Q30,30 60,60 T110,60" fill="none" stroke="#14b8a6" strokeWidth="0.1" />
          </svg>
          <div style={{ position: 'absolute', width: '150%', height: '40%', background: 'radial-gradient(ellipse at center, rgba(20,184,166,0.1) 0%, transparent 60%)', transform: 'rotate(-10deg)' }} />
        </AbsoluteFill>
      );
    case 'cimientos':
      return (
        <AbsoluteFill style={{ justifyContent: 'flex-end' }}>
          <div style={{ height: '45%', background: 'linear-gradient(to top, rgba(17,17,17,0.95) 0%, rgba(17,17,17,0.6) 50%, transparent 100%)' }} />
          <div style={{ position: 'absolute', bottom: 120, left: '10%', width: '80%', height: '1px', background: 'rgba(255,255,255,0.2)' }} />
          <div style={{ position: 'absolute', bottom: 120, left: '45%', width: '10%', height: '3px', background: '#404000' }} />
        </AbsoluteFill>
      );
    case 'cadena':
      return (
        <AbsoluteFill>
          <div style={{ position: 'absolute', top: 60, left: 60, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', fontSize: '18px', letterSpacing: '4px' }}>SYNC // LINK_ACTIVE</div>
          <div style={{ position: 'absolute', bottom: 60, right: 60, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', fontSize: '18px', letterSpacing: '4px' }}>KINEMATIC_REC ●</div>
          <div style={{ position: 'absolute', left: '50%', top: '15%', height: '70%', width: '1px', background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.15), transparent)' }} />
        </AbsoluteFill>
      );
    default:
      return <AbsoluteFill style={{ border: '1px solid rgba(255,255,255,0.1)', margin: '30px' }} />;
  }
};

const DiseñoPlan = ({ enfoque_semanal, dias }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a0a', padding: '100px', display: 'flex', flexDirection: 'column' }}>
      
      {/* Fondo técnico unificado */}
      <RenderAesthetic tipo="cadena" />
      <RenderAesthetic tipo="estructura_grid" />

      {/* Cabecera */}
      <div style={{ zIndex: 10, borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '40px', marginBottom: '60px' }}>
        <h2 style={{ color: '#2299AF', fontSize: '30px', fontWeight: '900', letterSpacing: '10px', textTransform: 'uppercase', marginBottom: '10px' }}>
          PROTOCOLO ACTIVO
        </h2>
        <h1 style={{ color: 'white', fontSize: '70px', fontWeight: '900', textTransform: 'uppercase', lineHeight: '1.1' }}>
          {enfoque_semanal}
        </h1>
      </div>

      {/* Lista de días */}
      <div style={{ zIndex: 10, display: 'flex', flexDirection: 'column', gap: '35px', flexGrow: 1 }}>
        {dias && dias.map((diaInfo, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
            borderLeft: `4px solid ${diaInfo.tipo === 'cimientos' ? '#404000' : diaInfo.tipo === 'fluidez' ? '#14b8a6' : '#2299AF'}`,
            padding: '25px 40px',
            borderRadius: '0 20px 20px 0'
          }}>
            <div style={{ width: '200px' }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '25px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '3px' }}>
                {diaInfo.dia}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ color: 'white', fontSize: '38px', fontWeight: 'bold', margin: '0 0 10px 0' }}>{diaInfo.titulo}</h3>
              <p style={{ color: '#9CA3AF', fontSize: '22px', margin: 0, fontStyle: 'italic' }}>{diaInfo.tip}</p>
            </div>
          </div>
        ))}
      </div>
      
    </AbsoluteFill>
  );
};

export const RemotionPlan = () => {
  return (
    <Composition
      id="PlanSemanal" // ⚠️ El nombre que busca plan.yml
      component={DiseñoPlan}
      durationInFrames={1}
      fps={30}
      width={1080}
      height={1920} // Formato Stories de Instagram
      defaultProps={{
        enfoque_semanal: "CARGANDO DATOS...",
        dias: []
      }}
    />
  );
};
