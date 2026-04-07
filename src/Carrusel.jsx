import React from 'react';
import { Composition, AbsoluteFill, Img } from 'remotion';

// 1. EL MOTOR DE GRÁFICOS AESTHETIC
const RenderAesthetic = ({ tipo }) => {
  switch (tipo) {
    case 'estructura_grid':
      // Dibuja una cuadrícula técnica tipo "blueprint" o plano de ingeniería
      return (
        <AbsoluteFill style={{
          backgroundImage: `linear-gradient(rgba(34, 153, 175, 0.2) 2px, transparent 2px), linear-gradient(90deg, rgba(34, 153, 175, 0.2) 2px, transparent 2px)`,
          backgroundSize: '100px 100px',
          opacity: 0.8
        }} />
      );
    
    case 'fluidez':
      // Dibuja una onda de energía dinámica en la parte inferior
      return (
        <AbsoluteFill style={{ justifyContent: 'flex-end' }}>
          <svg viewBox="0 0 1440 320" style={{ width: '100%', opacity: 0.6 }}>
            <path fill="#14b8a6" fillOpacity="1" d="M0,160L60,176C120,192,240,224,360,213.3C480,203,600,149,720,144C840,139,960,181,1080,197.3C1200,213,1320,203,1380,176L1440,149L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
          </svg>
        </AbsoluteFill>
      );

    case 'cimientos':
      // Dibuja un degradado sólido y pesado desde abajo (como raíces/tierra)
      return (
        <AbsoluteFill style={{
          background: 'linear-gradient(to top, rgba(64, 64, 0, 0.9) 0%, rgba(64, 64, 0, 0) 50%)'
        }} />
      );

    case 'cadena':
      // Dibuja líneas de conexión discontinuas (eslabones) en los laterales
      return (
        <AbsoluteFill style={{
          borderLeft: '10px dashed rgba(255,255,255,0.4)',
          borderRight: '10px dashed rgba(255,255,255,0.4)',
          margin: '40px'
        }} />
      );

    default:
      // Un marco minimalista por defecto
      return (
        <AbsoluteFill style={{ border: '8px solid rgba(255,255,255,0.2)', margin: '40px' }} />
      );
  }
};

// 2. EL DISEÑO VISUAL DE CADA DIAPOSITIVA
const DiseñoCarrusel = ({ 
  titulo, 
  contenido, 
  grafico_tipo, 
  imagen_fondo, 
  numero, 
  total 
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#111' }}>
      
      {/* CAPA 1: IMAGEN DE PEXELS */}
      {imagen_fondo ? (
        <Img 
          src={imagen_fondo} 
          style={{ objectFit: 'cover', width: '100%', height: '100%' }} 
        />
      ) : null}

      {/* CAPA 2: FILTRO OSCURO (Mejora la lectura del texto) */}
      <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} />

      {/* CAPA 3: GRÁFICO AESTHETIC DE LA IA */}
      <RenderAesthetic tipo={grafico_tipo} />

      {/* CAPA 4: TEXTOS (Título y Contenido) */}
      <AbsoluteFill style={{ 
        padding: '100px', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        zIndex: 10 // Aseguramos que el texto esté siempre por encima de los gráficos
      }}>
        <h1 style={{ 
          color: 'white', 
          fontSize: '85px', 
          fontWeight: '900', 
          textTransform: 'uppercase', 
          marginBottom: '50px', 
          lineHeight: '1.1',
          textShadow: '0px 8px 20px rgba(0,0,0,0.8)'
        }}>
          {titulo}
        </h1>
        <p style={{ 
          color: '#E5E7EB', 
          fontSize: '48px', 
          fontWeight: '400', 
          lineHeight: '1.4',
          textShadow: '0px 4px 10px rgba(0,0,0,0.5)'
        }}>
          {contenido}
        </p>
      </AbsoluteFill>

      {/* CAPA 5: INDICADOR DE PÁGINA (Ej: 1 / 4) */}
      <AbsoluteFill style={{ 
        justifyContent: 'flex-end', 
        alignItems: 'center', 
        paddingBottom: '80px',
        zIndex: 10
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          color: 'black', 
          padding: '15px 40px', 
          borderRadius: '50px', 
          fontSize: '35px', 
          fontWeight: '900' 
        }}>
          {numero} / {total}
        </div>
      </AbsoluteFill>

    </AbsoluteFill>
  );
};

// 3. EXPORTAMOS LA COMPOSICIÓN
export const RemotionCarrusel = () => {
  return (
    <Composition
      id="Carrusel" 
      component={DiseñoCarrusel}
      durationInFrames={1} 
      fps={30}
      width={1080}
      height={1350} 
      defaultProps={{
        titulo: "EL ARTE DE ATERRIZAR",
        contenido: "Controla tu inercia y protege tus articulaciones con estos 3 pasos básicos de conexión.",
        grafico_tipo: "estructura_grid",
        imagen_fondo: "",
        numero: 1,
        total: 4
      }}
    />
  );
};
