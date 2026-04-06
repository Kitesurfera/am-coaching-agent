import React from 'react';
import { Composition, AbsoluteFill, OffthreadVideo, staticFile } from 'remotion';

// 1. EL DISEÑO VISUAL DEL REEL
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

      {/* CAPA 3: ELEMENTOS AESTHETIC DE LA MARCA */}
      {/* Dependiendo de lo que decida la IA (cimientos, estructura...), aplicamos un estilo */}
      <AbsoluteFill style={{ 
        border: grafico_tipo === 'estructura_grid' ? '15px solid #2299AF' : 'none',
        opacity: 0.8,
        boxSizing: 'border-box'
      }} />

      {/* CAPA 4: EL GANCHO TEXTUAL (Hook) */}
      <AbsoluteFill style={{ 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '80px'
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

// 2. EXPORTAMOS LA COMPOSICIÓN (Lo que lee el index.jsx)
export const RemotionVideo = () => {
  return (
    <Composition
      id="MiVideo" // ⚠️ MUY IMPORTANTE: Este es el nombre que busca el workflow generar.yml
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
