// src/components/ListaRecetas.js
import { useContext } from 'react';
import { RecetasContext } from '../Context/RecetasContext';
import RecetaCard from './RecetaCard';
import Spinner    from './Spinner';
import C from '../Utils/colors';

const ListaRecetas = () => {
  const { recetas, loading, error, consultado } = useContext(RecetasContext);

  // ── Estado: cargando ──────────────────────────────────────────
  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '80px 0' }}>
      <Spinner size={48} />
      <p style={{ color: C.muted, fontSize: 15, fontStyle: 'italic' }}>Preparando tu selección...</p>
    </div>
  );

  // ── Estado: error de API ──────────────────────────────────────
  if (error) return (
    <div style={{ textAlign: 'center', padding: '60px 24px' }}>
      <p style={{ fontSize: 40, marginBottom: 16 }}>🍹</p>
      <p style={{ color: '#FCA5A5', fontSize: 16 }}>{error}</p>
    </div>
  );

  // ── Estado: búsqueda sin resultados ───────────────────────────
  if (consultado && recetas.length === 0) return (
    <div style={{ textAlign: 'center', padding: '60px 24px', color: C.muted }}>
      <p style={{ fontSize: 40, marginBottom: 16 }}>🔍</p>
      <p style={{ fontSize: 16 }}>Sin resultados. Prueba con otros filtros.</p>
    </div>
  );

  // ── Estado: inicial (sin búsqueda aún) ────────────────────────
  if (!consultado) return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <p style={{ fontSize: 52, marginBottom: 16 }}>🍸</p>
      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: C.cream, marginBottom: 8 }}>
        El bar está listo
      </p>
      <p style={{ color: C.muted, fontSize: 15 }}>
        Usa el buscador para encontrar tu próxima receta
      </p>
    </div>
  );

  // ── Estado: resultados ────────────────────────────────────────
  return (
    <section style={{ padding: '40px 24px 64px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Encabezado de resultados */}
        <div style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          marginBottom:   32,
          paddingBottom:  16,
          borderBottom:   `1px solid ${C.border}`,
        }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: C.cream }}>
            Recetas encontradas
          </p>
          <span style={{
            background:   `${C.amber}22`,
            border:       `1px solid ${C.amber}44`,
            borderRadius:  20,
            padding:      '4px 14px',
            fontSize:      13,
            color:         C.gold,
            fontWeight:    600,
          }}>
            {recetas.length} resultados
          </span>
        </div>

        {/* Grid de tarjetas */}
        <div style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap:                  22,
        }}>
          {recetas.map((r, i) => (
            <RecetaCard key={r.idDrink} receta={r} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ListaRecetas;
