import React from "react";
// IMPORTANTE: Cambiamos Video por OffthreadVideo
import { Composition, AbsoluteFill, interpolate, useCurrentFrame, staticFile, OffthreadVideo, Img, getInputProps } from "remotion";

const colores = {
  blanco: "#FFFFFF",
};

const AnimacionAndre = () => {
  const frame = useCurrentFrame();
  const { archivo } = getInputProps(); 

  const archivoLogo = "logo.png"; 

  const esVideo = archivo.toLowerCase().endsWith('.mp4') || archivo.toLowerCase().endsWith('.mov');

  const opacityBranding = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const moveYBranding = interpolate(frame, [0, 30], [50, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#111" }}>
      <AbsoluteFill>
        {esVideo ? (
          /* AQUI ESTA LA MAGIA: OffthreadVideo es a prueba de bloqueos en GitHub Actions */
          <OffthreadVideo src={staticFile(archivo)} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
        ) : (
          <Img src={staticFile(archivo)} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
        )}
      </AbsoluteFill>

      <AbsoluteFill style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }} />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", zIndex: 10, padding: "10%" }}>
        <div style={{
          transform: `translateY(${moveYBranding}px)`,
          opacity: opacityBranding,
          marginBottom: "60px",
          display: "flex",
          justifyContent: "center"
        }}>
          <Img 
            src={staticFile(archivoLogo)} 
            style={{ width: "60%", maxHeight: "400px", objectFit: "contain" }}
          />
        </div>

        <h2 style={{
          color: colores.blanco,
          opacity: opacityBranding,
          transform: `translateY(${moveYBranding}px)`,
          fontSize: "40px",
          fontFamily: "sans-serif",
          marginTop: "0",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          textAlign: "center",
          fontWeight: "normal",
          textShadow: "1px 1px 4px rgba(0,0,0,0.3)"
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
      defaultProps={{ archivo: "leeme.txt" }}
    />
  );
};
