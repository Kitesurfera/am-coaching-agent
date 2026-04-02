import React from "react";
import { Composition, AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

// Este es el diseño de nuestro video
const AnimacionAndre = () => {
  const frame = useCurrentFrame();
  
  // Animación suave de aparición y movimiento hacia arriba
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const moveY = interpolate(frame, [0, 30], [50, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center" }}>
      <h1 style={{ color: "#404000", opacity, transform: `translateY(${moveY}px)`, fontSize: "120px", fontFamily: "sans-serif", margin: 0, fontWeight: "bold" }}>
        AM
      </h1>
      <h2 style={{ color: "#2299AF", opacity, transform: `translateY(${moveY}px)`, fontSize: "50px", fontFamily: "sans-serif", marginTop: "20px" }}>
        MOVIMIENTO CON PROPÓSITO
      </h2>
    </AbsoluteFill>
  );
};

// Configuración técnica (Reel de 5 segundos)
export const RemotionVideo = () => {
  return (
    <Composition
      id="MiVideo"
      component={AnimacionAndre}
      durationInFrames={150} 
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
