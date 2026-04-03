import React from "react";
import { registerRoot } from "remotion";
import { RemotionVideo } from "./Video.jsx";
import { RemotionCarrusel } from "./Carrusel.jsx";

// Agrupamos todos los agentes visuales en una sola raíz
const RaizRemotion = () => {
  return (
    <>
      <RemotionVideo />
      <RemotionCarrusel />
    </>
  );
};

registerRoot(RaizRemotion);
