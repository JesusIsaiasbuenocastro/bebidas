// src/components/Header.js
import C from '../Utils/colors';

const Header = () => (
  <header
    style={{
      position:     'relative',
      overflow:     'hidden',
      background:   `linear-gradient(165deg, ${C.surface} 0%, #1C0E02 60%, #0F0804 100%)`,
      borderBottom: `1px solid ${C.border}`,
      padding:      '60px 24px 56px',
      textAlign:    'center',
    }}
  >
    {/* Orbes decorativos de luz ámbar */}
    {[
      { w: 320, h: 320, top: -80,  right: -60, opacity: 0.07 },
      { w: 200, h: 200, bottom: -40, left: -40, opacity: 0.05 },
    ].map((o, i) => (
      <div
        key={i}
        style={{
          position:     'absolute',
          width:        o.w,
          height:       o.h,
          top:          o.top,
          right:        o.right,
          bottom:       o.bottom,
          left:         o.left,
          background:   `radial-gradient(circle, ${C.amber}, transparent 70%)`,
          opacity:      o.opacity,
          borderRadius: '50%',
          pointerEvents:'none',
        }}
      />
    ))}

    {/* Eyebrow */}
    <p style={{
      fontFamily:    'Inter',
      fontWeight:    500,
      fontSize:      11,
      letterSpacing: 4,
      textTransform: 'uppercase',
      color:         C.amber,
      marginBottom:  16,
    }}>
      ✦ The Cocktail Lab ✦
    </p>

    {/* Título principal */}
    <h1 style={{
      fontFamily:  "'Playfair Display', Georgia, serif",
      fontWeight:  900,
      fontSize:    'clamp(2.4rem, 6vw, 4.2rem)',
      lineHeight:  1.05,
      color:       C.cream,
      marginBottom:16,
      textShadow:  `0 0 60px ${C.amber}44`,
    }}>
      Descubre tu próximo<br />
      <span style={{ color: C.amber }}>cóctel favorito</span>
    </h1>

    {/* Subtítulo */}
    <p style={{
      fontFamily: 'Inter',
      fontWeight: 300,
      fontSize:   'clamp(0.95rem, 2vw, 1.1rem)',
      color:      '#A07840',
      maxWidth:   480,
      margin:     '0 auto',
      lineHeight: 1.7,
    }}>
      Miles de recetas de TheCocktailDB — busca por ingrediente o categoría
    </p>

    {/* Línea decorativa ámbar */}
    <div style={{
      width:        60,
      height:       3,
      background:   `linear-gradient(90deg, transparent, ${C.amber}, transparent)`,
      margin:       '28px auto 0',
      borderRadius: 2,
    }} />
  </header>
);

export default Header;
