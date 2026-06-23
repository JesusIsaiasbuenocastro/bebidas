// src/components/RecetaCard.js
import { useState, useContext } from 'react';
import { ModalContext }  from '../Context/ModalContext';
import CategoryBadge from './CategoryBadge';
import C from '../Utils/colors';

const RecetaCard = ({ receta, index }) => {
  const { abrir }           = useContext(ModalContext);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="card-anim"
      style={{ animationDelay: `${index * 0.06}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        onClick={() => abrir(receta.idDrink)}
        style={{
          background:   C.card,
          borderRadius: 18,
          border:       `1px solid ${hovered ? C.amber + '66' : C.border}`,
          overflow:     'hidden',
          transition:   'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
          boxShadow:    hovered ? `0 12px 40px ${C.amber}22` : '0 2px 8px rgba(0,0,0,0.4)',
          transform:    hovered ? 'translateY(-4px)' : 'translateY(0)',
          cursor:       'pointer',
          display:      'flex',
          flexDirection:'column',
        }}
      >
        {/* ── Imagen ── */}
        <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4/3' }}>
          <img
            src={receta.strDrinkThumb}
            alt={receta.strDrink}
            style={{
              width:      '100%',
              height:     '100%',
              objectFit:  'cover',
              transition: 'transform 0.5s ease',
              transform:   hovered ? 'scale(1.07)' : 'scale(1)',
            }}
          />
          {/* Gradiente sobre imagen */}
          <div style={{
            position:   'absolute',
            inset:       0,
            background: `linear-gradient(to top, ${C.card}EE 0%, transparent 55%)`,
          }} />
          {/* Badge */}
          <div style={{ position: 'absolute', top: 12, right: 12 }}>
            <CategoryBadge label="Cóctel" />
          </div>
        </div>

        {/* ── Contenido ── */}
        <div style={{ padding: '16px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize:    17,
            fontWeight:  700,
            color:       C.cream,
            lineHeight:  1.3,
          }}>
            {receta.strDrink}
          </h3>

          <button
            style={{
              marginTop:    'auto',
              padding:      '10px 0',
              borderRadius:  10,
              border:       `1.5px solid ${hovered ? C.amber : C.border}`,
              background:    hovered ? `${C.amber}18` : 'transparent',
              color:         hovered ? C.gold : C.muted,
              fontWeight:    600,
              fontSize:      13,
              cursor:       'pointer',
              fontFamily:  'Inter',
              transition:  'all 0.2s',
            }}
          >
            Ver receta completa →
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecetaCard;
