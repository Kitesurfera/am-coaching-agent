import React from "react";
import { Composition, AbsoluteFill, interpolate, useCurrentFrame, staticFile, Video, Img, getInputProps } from "remotion";

// Paleta de colores Andre Molli para el eslogan (usamos blanco para máxima legibilidad sobre video)
const colores = {
  blanco: "#FFFFFF",
};

const AnimacionAndre = () => {
  const frame = useCurrentFrame();
  const { archivo } = getInputProps(); // El archivo de entrenamiento de fondo

  // IMPORTANTE: Este es el nombre exacto de tu archivo de logo en la carpeta public
  const archivoLogo = "logo.png"; 

  // Detectamos si el fondo es video o foto
  const esVideo = archivo.toLowerCase().endsWith('.mp4') || archivo.toLowerCase().endsWith('.mov');

  // Animaciones suaves para la identidad visual (aparecen juntas)
  const opacityBranding = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const moveYBranding = interpolate(frame, [0, 30], [50, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#111" }}>
      {/* 1. EL FONDO: Tu archivo crudo de entreno */}
      <AbsoluteFill>
        {esVideo ? (
          <Video src={staticFile(archivo)} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
        ) : (
          <Img src={staticFile(archivo)} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
        )}
      </AbsoluteFill>

      {/* 2. EL FILTRO OSCURO: Para asegurar legibilidad (40%) */}
      <AbsoluteFill style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }} />

      {/* 3. LA IDENTIDAD VISUAL (LOGO PNG REAL + ESLOGAN TEXTO) */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", zIndex: 10, padding: "10%" }}>
        
        {/* Contenedor del Logo PNG con animación */}
        <div style={{
          transform: `translateY(${moveYBranding}px)`,
          opacity: opacityBranding,
          marginBottom: "60px", // Espaciado antes del eslogan
          display: "flex",
          justifyContent: "center"
        }}>
          {/* USAMOS LA ETIQUETA IMG DE REMOTION APUNTANDO AL LOGO ESTÁTICO */}
          <Img 
            src={staticFile(archivoLogo)} 
            style={{
              width: "60%", // Ajusta el ancho del logo relativo a la pantalla
              maxHeight: "400px", // Altura máxima para que no pise el eslogan
              objectFit: "contain" // Asegura que el logo no se deforme
            }}
          />
        </div>

        {/* Eslogan Oficial (Usa el formato exacto de tu flyer resumido pero en blanco para video) */}
        <h2 style={{
          color: colores.blanco, // Blanco para el video
          opacity: opacityBranding, // Sincronizado con el logo
          transform: `translateY(${moveYBranding}px)`, // Sincronizado
          fontSize: "40px",
          fontFamily: "sans-serif",
          marginTop: "0",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          textAlign: "center",
          fontWeight: "normal",
          textShadow: "1px 1px 4px rgba(0,0,0,0.3)" // Sutil sombra para mejor legibilidad sobre videos claros
        }}>
          COACHING | FITNESS | MOVIMIENTO
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
        archivo: "leeme.txt" // Archivo por defecto si no se pasa uno
      }}
    />
  );
};
