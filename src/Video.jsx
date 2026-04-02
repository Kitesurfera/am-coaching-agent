import React from "react";
// Mantenemos OffthreadVideo para evitar bloqueos en GitHub Actions
import { Composition, AbsoluteFill, interpolate, useCurrentFrame, staticFile, OffthreadVideo, Img, getInputProps } from "remotion";

const colores = {
  blanco: "#FFFFFF",
};

const AnimacionAndre = () => {
  const frame = useCurrentFrame();
  const { archivo } = getInputProps(); 

  // Nombre exacto de tu logo cargado en la carpeta public/
  const archivoLogo = "logo.png"; 

  const esVideo = archivo.toLowerCase().endsWith('.mp4') || archivo.toLowerCase().endsWith('.mov');

  // Animaciones suaves idénticas para ambos elementos (aparecen juntas)
  const opacityBranding = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const moveYBranding = interpolate(frame, [0, 30], [50, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#111" }}>
      {/* 1. EL FONDO: Tu archivo crudo de entreno */}
      <AbsoluteFill>
        {esVideo ? (
          <OffthreadVideo src={staticFile(archivo)} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
        ) : (
          <Img src={staticFile(archivo)} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
        )}
      </AbsoluteFill>

      {/* 2. EL FILTRO OSCURO: Para asegurar legibilidad (40%) */}
      <AbsoluteFill style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }} />

      {/* 3. LOGO: Arriba a la derecha, más grande */}
      <AbsoluteFill style={{
        justifyContent: "flex-start", // Top
        alignItems: "flex-end",    // Right
        paddingTop: "60px",
        paddingRight: "60px",
        zIndex: 20
      }}>
        <div style={{
          transform: `translateY(${moveYBranding}px)`,
          opacity: opacityBranding,
        }}>
          <Img 
            src={staticFile(archivoLogo)} 
            style={{
              // Aumentamos el tamaño. Antes era 60% centrado (pequeño).
              // Ahora le damos un tamaño fijo controlado para que destaque arriba.
              height: "140px", // Aumenta o disminuye esto para el tamaño del logo
              width: "auto",
              objectFit: "contain"
            }}
          />
        </div>
      </AbsoluteFill>

      {/* 4. ESLOGAN: Abajo centrado, con espacio de seguridad para el copy de IG */}
      <AbsoluteFill style={{
        justifyContent: "flex-end", // Bottom
        alignItems: "center",     // Center
        // Margen de seguridad para la UI de Instagram (captions, iconos, etc.)
        // Usamos mucho espacio abajo (220px) para el "dead zone" de Reels
        paddingBottom: "220px", 
        paddingLeft: "10%",
        paddingRight: "10%",
        zIndex: 10
      }}>
        <h2 style={{
          color: colores.blanco,
          opacity: opacityBranding,
          // Movemos este elemento de abajo hacia arriba ligeramente para la animación
          transform: `translateY(${-moveYBranding}px)`, 
          fontSize: "45px", // Un poco más grande para que se lea mejor abajo
          fontFamily: "sans-serif",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          textAlign: "center",
          fontWeight: "bold", // Hacemos bold el eslogan para que tenga jerarquía
          textShadow: "2px 2px 8px rgba(0,0,0,0.5)", // Sombra más fuerte
          margin: 0
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
      durationInFrames={150} // 5 segundos
      fps={30}
      width={1080}
      height={1920} // Formato Reel vertical
      defaultProps={{
        archivo: "leeme.txt" // Archivo por defecto para evitar errores si no se pasa uno
      }}
    />
  );
};
