import React from "react";
import { Composition, AbsoluteFill, interpolate, useCurrentFrame, staticFile, Video, Img, getInputProps } from "remotion";

const AnimacionAndre = () => {
  const frame = useCurrentFrame();
  
  // Recibimos el nombre del archivo desde GitHub Actions
  const { archivo } = getInputProps();
  
  // Detectamos si es video o foto por la extensión
  const esVideo = archivo.toLowerCase().endsWith('.mp4') || archivo.toLowerCase().endsWith('.mov');

  // Animación del texto
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const moveY = interpolate(frame, [0, 30], [50, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#111" }}>
      {/* 1. EL FONDO: Tu video o foto */}
      <AbsoluteFill>
        {esVideo ? (
          <Video src={staticFile(archivo)} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
        ) : (
          <Img src={staticFile(archivo)} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
        )}
      </AbsoluteFill>

      {/* 2. EL FILTRO OSCURO: Para que el texto se lea bien */}
      <AbsoluteFill style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }} />

      {/* 3. EL BRANDING: Logo y eslogan encima de tu contenido */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", zIndex: 10 }}>
        <h1 style={{ color: "#FFFFFF", opacity, transform: `translateY(${moveY}px)`, fontSize: "140px", fontFamily: "sans-serif", margin: 0, fontWeight: "bold", textShadow: "2px 2px 10px rgba(0,0,0,0.5)" }}>
          AM
        </h1>
        <h2 style={{ color: "#2299AF", opacity, transform: `translateY(${moveY}px)`, fontSize: "50px", fontFamily: "sans-serif", marginTop: "20px", textShadow: "2px 2px 10px rgba(0,0,0,0.5)" }}>
          MOVIMIENTO CON PROPÓSITO
        </h2>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const RemotionVideo = () => {
  return (
    <Composition
      id="MiVideo"
      component={AnimacionAndre}
      durationInFrames={150} 
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        archivo: "leeme.txt" // Valor por defecto para evitar errores si no se pasa nada
      }}
    />
  );
};
