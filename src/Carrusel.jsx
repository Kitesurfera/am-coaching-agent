import React from "react";
import { Composition, AbsoluteFill, Img, getInputProps } from "remotion";

const Diapositiva = () => {
  const { titulo, contenido, numero, total } = getInputProps();
  const archivoLogo = "logo.png";

  return (
    <AbsoluteFill style={{ backgroundColor: "#111", padding: "8%" }}>
      {/* Numeración arriba a la derecha */}
      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "flex-end", padding: "50px" }}>
         <span style={{ color: "#2299AF", fontSize: "40px", fontWeight: "bold", fontFamily: "sans-serif" }}>{numero} / {total}</span>
      </AbsoluteFill>

      {/* Logo arriba a la izquierda */}
      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "flex-start", padding: "50px" }}>
        <Img src={archivoLogo} style={{ height: "80px", objectFit: "contain" }} />
      </AbsoluteFill>

      {/* Textos centrados */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "10%" }}>
        <h1 style={{ 
          color: "#FFFFFF", 
          fontSize: "70px", 
          textAlign: "center", 
          marginBottom: "40px", 
          textTransform: "uppercase", 
          fontFamily: "sans-serif", 
          textShadow: "2px 2px 8px rgba(0,0,0,0.5)" 
        }}>
          {titulo}
        </h1>
        <p style={{ 
          color: "#FFFFFF", 
          fontSize: "45px", 
          textAlign: "center", 
          lineHeight: "1.5", 
          fontFamily: "sans-serif", 
          opacity: 0.9 
        }}>
          {contenido}
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const RemotionCarrusel = () => {
  return (
    <Composition
      id="Carrusel"
      component={Diapositiva}
      width={1080}
      height={1350} // Formato retrato óptimo para feed
      defaultProps={{ 
        titulo: "TÍTULO DE PRUEBA", 
        contenido: "Este es el contenido de la diapositiva generado por la IA.", 
        numero: 1, 
        total: 4 
      }}
    />
  );
};
