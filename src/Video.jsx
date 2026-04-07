import React from 'react';
import { Composition, AbsoluteFill, OffthreadVideo, staticFile } from 'remotion';

// 1. EL MOTOR DE GRÁFICOS AESTHETIC PREMIUM
const RenderAesthetic = ({ tipo }) => {
  switch (tipo) {
    case 'estructura_grid':
      // Estilo: Análisis de movimiento. Cruces de enfoque y malla muy sutil para medir el rango.
      return (
        <AbsoluteFill>
          <AbsoluteFill style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }} />
          {/* Tracking corners */}
          <div style={{ position: 'absolute', top: 50, left: 50, width: 40, height: 40, borderTop: '2px solid #2299AF', borderLeft: '2px solid #2299AF' }} />
          <div style={{ position: 'absolute', top: 50, right: 50, width: 40, height: 40, borderTop: '2px solid #2299AF', borderRight: '2px solid #2299AF' }} />
          <div style={{ position: 'absolute', bottom: 50, left: 50, width: 40, height: 40, borderBottom: '2px solid #2299AF', borderLeft: '2px solid #2299AF' }} />
          <div style={{ position: 'absolute', bottom: 50, right: 50, width: 40, height: 40, borderBottom: '2px solid #2299AF', borderRight: '2px solid #2299AF' }} />
        </AbsoluteFill>
      );
    
    case 'fluidez':
      // Estilo: Tensión y estela. Líneas vectoriales elegantes simulando inercias.
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
      // Estilo: Impacto y base. Un degradado negro ahumado con una línea de anclaje sólida.
      return (
        <AbsoluteFill style={{ justifyContent: 'flex-end' }}>
          <div style={{
            height: '45%',
            background: 'linear-gradient(to top, rgba(17,17,17,0.95) 0%, rgba(17,17,17,0.6) 50%, transparent 100%)',
          }} />
          <div style={{ position: 'absolute', bottom: 120, left: '10%', width: '80%', height: '1px', background: 'rgba(255,255,255,0.2)' }} />
          <div style={{ position: 'absolute', bottom: 120, left: '45%', width: '10%', height: '3px', background: '#404000' }} />
        </AbsoluteFill>
      );

    case 'cadena':
      // Estilo: HUD Cinematográfico. Ejes de conexión técnicos y datos en pantalla.
      return (
        <AbsoluteFill>
          <div style={{ position: 'absolute', top: 60, left: 60, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', fontSize: '18px', letterSpacing: '4px' }}>
            SYNC // LINK_ACTIVE
          </div>
          <div style={{ position: 'absolute', bottom: 60, right: 60, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', fontSize: '18px', letterSpacing: '4px' }}>
            KINEMATIC_REC ●
          </div>
          <div style={{ position: 'absolute', left: '50%', top: '15%', height: '70%', width: '1px', background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.15), transparent)' }} />
        </AbsoluteFill>
      );

    default:
      // Minimalismo absoluto
      return (
        <AbsoluteFill style={{ border: '1px solid rgba(255,255,255,0.1)', margin: '30px' }} />
      );
  }
};

// 2. EL DISEÑO VISUAL DEL REEL
const DiseñoReel = ({ 
  hook_visual, 
  voiceover, 
  grafico_tipo, 
  video_fondo_url, 
  archivo_local 
}) => {
  // El Agente decide: ¿Usamos el vídeo del Hub o el stock de Pexels?
  const videoSrc = archivo_local ? staticFile(archivo_local) : video_fondo_url;

  return (
    <AbsoluteFill style={{ backgroundColor: '#111' }}>
      
      {/* CAPA 1: EL VÍDEO DE FONDO */}
      {videoSrc ? (
        <OffthreadVideo 
          src={videoSrc} 
          style={{ objectFit: 'cover', width: '100%', height: '100%' }} 
        />
      ) : null}

      {/* CAPA 2: FILTRO CINEMATOGRÁFICO (Oscurece el fondo para que el texto brille) */}
      <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} />

      {/* CAPA 3: ELEMENTOS AESTHETIC DE LA MARCA (CORREGIDO) */}
      <RenderAesthetic tipo={grafico_tipo} />

      {/* CAPA 4: EL GANCHO TEXTUAL (Hook) */}
      <AbsoluteFill style={{ 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '80px',
        zIndex: 10 // Asegura que el texto quede por encima de las mallas
      }}>
        <h1 style={{ 
          color: 'white', 
          fontSize: '90px', 
          fontWeight: '900',
          textTransform: 'uppercase',
          textAlign: 'center',
          lineHeight: '1.1',
          textShadow: '0px 10px 40px rgba(0,0,0,0.9)'
        }}>
          {hook_visual}
        </h1>
      </AbsoluteFill>

    </AbsoluteFill>
  );
};

// 3. EXPORTAMOS LA COMPOSICIÓN (Lo que lee el index.jsx)
export const RemotionVideo = () => {
  return (
    <Composition
      id="MiVideo" 
      component={DiseñoReel}
      durationInFrames={150} // 5 segundos a 30fps
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        // Valores por defecto por si la IA falla
        hook_visual: "DOMINA TU INERCIA",
        grafico_tipo: "estructura_grid",
        video_fondo_url: "",
        archivo_local: null
      }}
    />
  );
};
