// src/components/RecetaModal.js
import { useContext, useEffect, useRef } from 'react';
import { ModalContext } from '../Context/ModalContext';
import CategoryBadge from './CategoryBadge';
import Spinner       from './Spinner';
import C from '../Utils/colors';

// Extrae los ingredientes y medidas del objeto de la API
const getIngredientes = info => {
  const lista = [];
  for (let i = 1; i <= 15; i++) {
    const ing = info[`strIngredient${i}`];
    const med = info[`strMeasure${i}`];
    if (ing?.trim()) lista.push({ ing: ing.trim(), med: med?.trim() || '' });
  }
  return lista;
};

const RecetaModal = () => {
  const { informacion, loadingModal, cerrar } = useContext(ModalContext);
  const overlayRef = useRef(null);

  // Cerrar con tecla Escape
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') cerrar(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [cerrar]);

  // Bloquear scroll del body mientras el modal está abierto
  useEffect(() => {
    document.body.style.overflow = (informacion || loadingModal) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [informacion, loadingModal]);

  if (!informacion && !loadingModal) return null;

  return (
    <div
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) cerrar(); }}
      style={{
        position:       'fixed',
        inset:           0,
        zIndex:          1000,
        background:     'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(6px)',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        padding:         20,
      }}
    >
      <div
        className="modal-anim"
        style={{
          background:    C.card,
          borderRadius:  24,
          border:        `1px solid ${C.border}`,
          boxShadow:     `0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px ${C.amber}22`,
          width:         '100%',
          maxWidth:       560,
          maxHeight:     '90vh',
          overflowY:     'auto',
          position:      'relative',
        }}
      >
        {/* Botón cerrar */}
        <button
          onClick={cerrar}
          aria-label="Cerrar modal"
          style={{
            position:       'sticky',
            top:             16,
            float:          'right',
            marginRight:     16,
            width:           36,
            height:          36,
            borderRadius:   '50%',
            background:     `${C.amber}22`,
            border:         `1px solid ${C.amber}44`,
            color:           C.cream,
            fontSize:        18,
            cursor:         'pointer',
            display:        'inline-flex',
            alignItems:     'center',
            justifyContent: 'center',
            zIndex:          10,
          }}
        >
          ✕
        </button>

        {/* ── Cargando detalle ── */}
        {loadingModal && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '80px 0' }}>
            <Spinner size={44} />
            <p style={{ color: C.muted }}>Destilando la receta...</p>
          </div>
        )}

        {/* ── Contenido del modal ── */}
        {!loadingModal && informacion && (
          <>
            {/* Imagen con título encima */}
            <div style={{ position: 'relative' }}>
              <img
                src={informacion.strDrinkThumb}
                alt={informacion.strDrink}
                style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '24px 24px 0 0' }}
              />
              <div style={{
                position:     'absolute',
                inset:         0,
                background:   `linear-gradient(to top, ${C.card} 5%, transparent 55%)`,
                borderRadius: '24px 24px 0 0',
              }} />
              <div style={{ position: 'absolute', bottom: 20, left: 24, right: 60 }}>
                <CategoryBadge label={informacion.strCategory || 'Cóctel'} />
                <h2 style={{
                  fontFamily:  "'Playfair Display', serif",
                  fontSize:    'clamp(1.4rem, 3vw, 1.9rem)',
                  fontWeight:   900,
                  color:        C.cream,
                  marginTop:    8,
                  lineHeight:   1.2,
                }}>
                  {informacion.strDrink}
                </h2>
              </div>
            </div>

            <div style={{ padding: '24px 28px 32px' }}>

              {/* Meta: tipo de vaso y alcohol */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
                {[
                  informacion.strAlcoholic && { label: '🍷 ' + informacion.strAlcoholic },
                  informacion.strGlass     && { label: '🥃 ' + informacion.strGlass },
                ].filter(Boolean).map(({ label }, i) => (
                  <span key={i} style={{
                    padding:      '5px 12px',
                    background:   `${C.amber}15`,
                    border:       `1px solid ${C.amber}33`,
                    borderRadius:  20,
                    fontSize:      13,
                    color:         C.gold,
                  }}>
                    {label}
                  </span>
                ))}
              </div>

              {/* Ingredientes */}
              <h3 style={{
                fontFamily:    "'Playfair Display', serif",
                fontSize:       17,
                color:          C.amber,
                marginBottom:   12,
                borderBottom:  `1px solid ${C.border}`,
                paddingBottom:  8,
              }}>
                Ingredientes
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24 }}>
                {getIngredientes(informacion).map(({ ing, med }, i) => (
                  <li key={i} style={{
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'space-between',
                    padding:        '8px 12px',
                    borderRadius:    8,
                    background:      i % 2 === 0 ? `${C.amber}0A` : 'transparent',
                    fontSize:        14,
                    color:           C.cream,
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: C.amber, fontSize: 16 }}>▸</span>
                      {ing}
                    </span>
                    {med && (
                      <span style={{ color: C.gold, fontWeight: 600, fontSize: 13 }}>{med}</span>
                    )}
                  </li>
                ))}
              </ul>

              {/* Instrucciones */}
              {informacion.strInstructions && (
                <>
                  <h3 style={{
                    fontFamily:    "'Playfair Display', serif",
                    fontSize:       17,
                    color:          C.amber,
                    marginBottom:   12,
                    borderBottom:  `1px solid ${C.border}`,
                    paddingBottom:  8,
                  }}>
                    Preparación
                  </h3>
                  <p style={{ fontSize: 14, lineHeight: 1.75, color: '#C4975A' }}>
                    {informacion.strInstructions}
                  </p>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecetaModal;
