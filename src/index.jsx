import React from "react";
import { registerRoot } from "remotion";
import { RemotionVideo } from "./Video.jsx";
import { RemotionCarrusel } from "./Carrusel.jsx";
import { RemotionPlan } from "./Plan.jsx"; // <-- AÑADIDO

const RaizRemotion = () => {
  return (
    <>
      <RemotionVideo />
      <RemotionCarrusel />
      <RemotionPlan /> 
    </>
  );
};

registerRoot(RaizRemotion);
