// src/components/Formulario.js
import { useState, useContext } from 'react';
import { CategoriasContext } from '../Context/CategoriasContext';
import { RecetasContext }    from '../Context/RecetasContext';
import Spinner from './Spinner';
import C from '../Utils/colors';

const Formulario = () => {
  const { categorias }              = useContext(CategoriasContext);
  const { buscarRecetas, loading }  = useContext(RecetasContext);

  const [nombre,    setNombre]    = useState('');
  const [categoria, setCategoria] = useState('');
  const [error,     setError]     = useState('');

  const inputBase = {
    width:       '100%',
    padding:     '13px 18px',
    background:  `${C.surface}CC`,
    border:      `1.5px solid ${C.border}`,
    borderRadius: 12,
    color:        C.cream,
    fontSize:     15,
    fontFamily:  'Inter',
    outline:     'none',
    transition:  'border-color 0.2s',
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!nombre.trim() && !categoria) {
      setError('Escribe un ingrediente o elige una categoría para buscar.');
      return;
    }
    setError('');
    buscarRecetas({ nombre, categoria });
  };

  return (
    <section style={{
      background:   `linear-gradient(180deg, ${C.surface}, ${C.bg})`,
      padding:      '40px 24px',
      borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>

          <div style={{
            display:             'grid',
            gridTemplateColumns: '1fr 1fr auto',
            gap:                 14,
            alignItems:          'start',
          }}>

            {/* ── Ingrediente ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: C.amber, letterSpacing: 1, textTransform: 'uppercase' }}>
                Ingrediente
              </label>
              <input
                type="text"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Ej: Vodka, Gin, Rum..."
                style={inputBase}
                onFocus={e => (e.target.style.borderColor = C.amber)}
                onBlur={e  => (e.target.style.borderColor = C.border)}
              />
            </div>

            {/* ── Categoría ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: C.amber, letterSpacing: 1, textTransform: 'uppercase' }}>
                Categoría
              </label>
              <select
                value={categoria}
                onChange={e => setCategoria(e.target.value)}
                style={{ ...inputBase, cursor: 'pointer', appearance: 'none' }}
                onFocus={e => (e.target.style.borderColor = C.amber)}
                onBlur={e  => (e.target.style.borderColor = C.border)}
              >
                <option value="">— Todas —</option>
                {categorias.map(c => (
                  <option key={c.strCategory} value={c.strCategory} style={{ background: C.surface }}>
                    {c.strCategory}
                  </option>
                ))}
              </select>
            </div>

            {/* ── Botón ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {/* Label invisible para alinear con los otros inputs */}
              <label style={{ fontSize: 11, color: 'transparent' }}>.</label>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding:      '13px 28px',
                  borderRadius: 12,
                  border:       'none',
                  background:   `linear-gradient(135deg, ${C.amber}, ${C.amberLt})`,
                  color:        C.bg,
                  fontWeight:   700,
                  fontSize:     15,
                  cursor:       loading ? 'not-allowed' : 'pointer',
                  fontFamily:  'Inter',
                  display:     'flex',
                  alignItems:  'center',
                  gap:          8,
                  opacity:      loading ? 0.7 : 1,
                  whiteSpace:  'nowrap',
                  transition:  'opacity 0.2s, transform 0.15s',
                  boxShadow:   `0 0 24px ${C.amber}44`,
                }}
                onMouseOver={e => { if (!loading) e.currentTarget.style.transform = 'scale(1.03)'; }}
                onMouseOut={e  => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                {loading ? <Spinner size={18} /> : '🍸'}
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </div>

          {/* ── Error ── */}
          {error && (
            <p style={{
              marginTop:    12,
              padding:      '10px 14px',
              borderRadius: 10,
              background:   `${C.red}22`,
              border:       `1px solid ${C.red}55`,
              color:        '#FCA5A5',
              fontSize:     14,
            }}>
              ⚠️ {error}
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default Formulario;
