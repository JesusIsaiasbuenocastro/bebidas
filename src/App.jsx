// BebidasApp.jsx — Rediseño completo del proyecto de recetas de bebidas
// Todas las librerías usadas vienen incluidas en Create React App + axios
// La API key pública de TheCocktailDB no requiere registro

import { createContext, useState, useEffect, useContext, useCallback, useRef } from "react";
import axios from "axios";

// ─── PALETA ────────────────────────────────────────────────────────────────
// Ámbar oscuro como protagonista: evoca whisky, madera, bar de noche
// Contraste en negro profundo y crema para legibilidad
const C = {
  bg:       "#0F0A06",   // negro espresso
  surface:  "#1A1108",   // superficie levemente cálida
  card:     "#211509",   // tarjeta
  amber:    "#D97706",   // acento principal — whisky ámbar
  amberLt:  "#F59E0B",   // hover ámbar
  gold:     "#FCD34D",   // detalles dorados
  cream:    "#FEF3C7",   // texto primario cálido
  muted:    "#92400E",   // texto secundario
  border:   "#2D1E0A",   // bordes
  red:      "#B91C1C",   // error
};

// ─── ESTILOS GLOBALES ───────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: ${C.bg}; color: ${C.cream}; font-family: 'Inter', sans-serif; min-height: 100vh; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: ${C.bg}; }
    ::-webkit-scrollbar-thumb { background: ${C.amber}; border-radius: 3px; }
    ::placeholder { color: ${C.muted}; opacity: 1; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes shimmer { 0%,100% { opacity: 0.4; } 50% { opacity: 0.9; } }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes scaleIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
    @keyframes slideUp { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
    .card-anim { animation: fadeUp 0.45s ease both; }
    .modal-anim { animation: scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both; }
  `}</style>
);

// ─── CONTEXTS ───────────────────────────────────────────────────────────────
const CategoriasContext = createContext();
const RecetasContext    = createContext();
const ModalContext      = createContext();

const CategoriasProvider = ({ children }) => {
  const [categorias, setCategorias] = useState([]);
  useEffect(() => {
    axios.get("https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list")
      .then(r => setCategorias(r.data.drinks || []))
      .catch(() => {});
  }, []);
  return <CategoriasContext.Provider value={{ categorias }}>{children}</CategoriasContext.Provider>;
};

const RecetasProvider = ({ children }) => {
  const [recetas, setRecetas]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [consultado, setConsultado] = useState(false);

  const buscarRecetas = useCallback(async ({ nombre, categoria }) => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${nombre}&c=${categoria}`;
      const res = await axios.get(url);
      setRecetas(res.data.drinks || []);
      setConsultado(true);
    } catch {
      setError("No encontramos cócteles con esos filtros. Intenta otra combinación.");
      setRecetas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <RecetasContext.Provider value={{ recetas, loading, error, consultado, buscarRecetas }}>
      {children}
    </RecetasContext.Provider>
  );
};

const ModalProvider = ({ children }) => {
  const [idReceta, setIdReceta]   = useState(null);
  const [informacion, setInfo]    = useState(null);
  const [loadingModal, setLoadingModal] = useState(false);

  useEffect(() => {
    if (!idReceta) return;
    setLoadingModal(true);
    axios.get(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idReceta}`)
      .then(r => setInfo(r.data.drinks?.[0] || null))
      .catch(() => setInfo(null))
      .finally(() => setLoadingModal(false));
  }, [idReceta]);

  const abrir  = useCallback(id => setIdReceta(id), []);
  const cerrar = useCallback(() => { setIdReceta(null); setInfo(null); }, []);

  return (
    <ModalContext.Provider value={{ informacion, loadingModal, abrir, cerrar }}>
      {children}
    </ModalContext.Provider>
  );
};

// ─── COMPONENTES UI ──────────────────────────────────────────────────────────

// Spinner
const Spinner = ({ size = 36 }) => (
  <div style={{
    width: size, height: size, border: `3px solid ${C.border}`,
    borderTopColor: C.amber, borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  }} />
);

// Badge de categoría
const CategoryBadge = ({ label }) => (
  <span style={{
    display: "inline-block", padding: "3px 10px",
    background: `${C.amber}22`, border: `1px solid ${C.amber}55`,
    borderRadius: 20, fontSize: 11, color: C.gold,
    fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase",
  }}>{label}</span>
);

// ─── HEADER ──────────────────────────────────────────────────────────────────
const Header = () => (
  <header style={{
    position: "relative", overflow: "hidden",
    background: `linear-gradient(165deg, ${C.surface} 0%, #1C0E02 60%, #0F0804 100%)`,
    borderBottom: `1px solid ${C.border}`,
    padding: "60px 24px 56px",
    textAlign: "center",
  }}>
    {/* Decorative orbs */}
    {[
      { w:320, h:320, top:-80, right:-60, opacity:0.07 },
      { w:200, h:200, bottom:-40, left:-40, opacity:0.05 },
    ].map((o,i) => (
      <div key={i} style={{
        position:"absolute", width:o.w, height:o.h,
        top:o.top, right:o.right, bottom:o.bottom, left:o.left,
        background:`radial-gradient(circle, ${C.amber}, transparent 70%)`,
        opacity:o.opacity, borderRadius:"50%", pointerEvents:"none",
      }}/>
    ))}

    {/* Eyebrow */}
    <p style={{
      fontFamily:"Inter", fontWeight:500, fontSize:11, letterSpacing:4,
      textTransform:"uppercase", color:C.amber, marginBottom:16,
    }}>
      ✦ The Cocktail Lab ✦
    </p>

    {/* Title */}
    <h1 style={{
      fontFamily:"'Playfair Display', Georgia, serif",
      fontWeight:900, fontSize:"clamp(2.4rem, 6vw, 4.2rem)",
      lineHeight:1.05, color:C.cream, marginBottom:16,
      textShadow:`0 0 60px ${C.amber}44`,
    }}>
      Descubre tu próximo<br/>
      <span style={{ color:C.amber }}>cóctel favorito</span>
    </h1>

    <p style={{
      fontFamily:"Inter", fontWeight:300, fontSize:"clamp(0.95rem,2vw,1.1rem)",
      color:"#A07840", maxWidth:480, margin:"0 auto",
      lineHeight:1.7,
    }}>
      Miles de recetas de TheCocktailDB — busca por ingrediente o categoría
    </p>

    {/* Amber line accent */}
    <div style={{
      width:60, height:3, background:`linear-gradient(90deg,transparent,${C.amber},transparent)`,
      margin:"28px auto 0", borderRadius:2,
    }}/>
  </header>
);

// ─── FORMULARIO ──────────────────────────────────────────────────────────────
const Formulario = () => {
  const { categorias } = useContext(CategoriasContext);
  const { buscarRecetas, loading } = useContext(RecetasContext);

  const [nombre,    setNombre]    = useState("");
  const [categoria, setCategoria] = useState("");
  const [error,     setError]     = useState("");

  const inputStyle = {
    width:"100%", padding:"13px 18px",
    background:`${C.surface}CC`, border:`1.5px solid ${C.border}`,
    borderRadius:12, color:C.cream, fontSize:15,
    fontFamily:"Inter", outline:"none", transition:"border-color 0.2s",
  };
  const focusStyle = { borderColor: C.amber };

  const handleSubmit = e => {
    e.preventDefault();
    if (!nombre.trim() && !categoria) {
      setError("Escribe un ingrediente o elige una categoría para buscar.");
      return;
    }
    setError("");
    buscarRecetas({ nombre, categoria });
  };

  return (
    <section style={{
      background:`linear-gradient(180deg,${C.surface},${C.bg})`,
      padding:"40px 24px",
      borderBottom:`1px solid ${C.border}`,
    }}>
      <div style={{ maxWidth:760, margin:"0 auto" }}>
        <form onSubmit={handleSubmit}>
          <div style={{
            display:"grid",
            gridTemplateColumns:"1fr 1fr auto",
            gap:14, alignItems:"start",
            flexWrap:"wrap",
          }}>

            {/* Ingrediente */}
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <label style={{ fontSize:11, fontWeight:600, color:C.amber, letterSpacing:1, textTransform:"uppercase" }}>
                Ingrediente
              </label>
              <input
                type="text"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Ej: Vodka, Gin, Rum..."
                style={inputStyle}
                onFocus={e => Object.assign(e.target.style, focusStyle)}
                onBlur={e => e.target.style.borderColor = C.border}
              />
            </div>

            {/* Categoría */}
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <label style={{ fontSize:11, fontWeight:600, color:C.amber, letterSpacing:1, textTransform:"uppercase" }}>
                Categoría
              </label>
              <select
                value={categoria}
                onChange={e => setCategoria(e.target.value)}
                style={{ ...inputStyle, cursor:"pointer", appearance:"none" }}
                onFocus={e => Object.assign(e.target.style, focusStyle)}
                onBlur={e => e.target.style.borderColor = C.border}
              >
                <option value="">— Todas —</option>
                {categorias.map(c => (
                  <option key={c.strCategory} value={c.strCategory}
                    style={{ background:C.surface }}
                  >{c.strCategory}</option>
                ))}
              </select>
            </div>

            {/* Botón */}
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <label style={{ fontSize:11, color:"transparent" }}>.</label>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding:"13px 28px", borderRadius:12, border:"none",
                  background:`linear-gradient(135deg,${C.amber},${C.amberLt})`,
                  color:C.bg, fontWeight:700, fontSize:15,
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily:"Inter", display:"flex", alignItems:"center", gap:8,
                  opacity: loading ? 0.7 : 1, whiteSpace:"nowrap",
                  transition:"opacity 0.2s, transform 0.15s",
                  boxShadow:`0 0 24px ${C.amber}44`,
                }}
                onMouseOver={e => { if (!loading) e.currentTarget.style.transform = "scale(1.03)"; }}
                onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
              >
                {loading ? <Spinner size={18} /> : "🍸"}
                {loading ? "Buscando..." : "Buscar"}
              </button>
            </div>
          </div>

          {error && (
            <p style={{
              marginTop:12, padding:"10px 14px", borderRadius:10,
              background:`${C.red}22`, border:`1px solid ${C.red}55`,
              color:"#FCA5A5", fontSize:14,
            }}>⚠️ {error}</p>
          )}
        </form>
      </div>
    </section>
  );
};

// ─── CARD DE RECETA ───────────────────────────────────────────────────────────
const RecetaCard = ({ receta, index }) => {
  const { abrir } = useContext(ModalContext);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="card-anim"
      style={{ animationDelay: `${index * 0.06}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        background: C.card,
        borderRadius:18,
        border:`1px solid ${hovered ? C.amber + "66" : C.border}`,
        overflow:"hidden",
        transition:"border-color 0.25s, box-shadow 0.25s, transform 0.25s",
        boxShadow: hovered ? `0 12px 40px ${C.amber}22` : "0 2px 8px rgba(0,0,0,0.4)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        cursor:"pointer",
        display:"flex", flexDirection:"column",
      }}
        onClick={() => abrir(receta.idDrink)}
      >
        {/* Imagen */}
        <div style={{ position:"relative", overflow:"hidden", aspectRatio:"4/3" }}>
          <img
            src={receta.strDrinkThumb}
            alt={receta.strDrink}
            style={{
              width:"100%", height:"100%", objectFit:"cover",
              transition:"transform 0.5s ease",
              transform: hovered ? "scale(1.07)" : "scale(1)",
            }}
          />
          {/* Overlay gradient */}
          <div style={{
            position:"absolute", inset:0,
            background:`linear-gradient(to top, ${C.card}EE 0%, transparent 55%)`,
          }}/>
          {/* Badge */}
          <div style={{ position:"absolute", top:12, right:12 }}>
            <CategoryBadge label="Cóctel" />
          </div>
        </div>

        {/* Contenido */}
        <div style={{ padding:"16px 18px 18px", flex:1, display:"flex", flexDirection:"column", gap:14 }}>
          <h3 style={{
            fontFamily:"'Playfair Display', serif",
            fontSize:17, fontWeight:700, color:C.cream,
            lineHeight:1.3,
          }}>{receta.strDrink}</h3>

          <button
            style={{
              marginTop:"auto", padding:"10px 0", borderRadius:10,
              border:`1.5px solid ${hovered ? C.amber : C.border}`,
              background: hovered ? `${C.amber}18` : "transparent",
              color: hovered ? C.gold : C.muted,
              fontWeight:600, fontSize:13, cursor:"pointer",
              fontFamily:"Inter", transition:"all 0.2s",
            }}
          >
            Ver receta completa →
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── LISTA DE RECETAS ─────────────────────────────────────────────────────────
const ListaRecetas = () => {
  const { recetas, loading, error, consultado } = useContext(RecetasContext);

  if (loading) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:20, padding:"80px 0" }}>
      <Spinner size={48} />
      <p style={{ color:C.muted, fontSize:15, fontStyle:"italic" }}>Preparando tu selección...</p>
    </div>
  );

  if (error) return (
    <div style={{ textAlign:"center", padding:"60px 24px" }}>
      <p style={{ fontSize:40, marginBottom:16 }}>🍹</p>
      <p style={{ color:"#FCA5A5", fontSize:16 }}>{error}</p>
    </div>
  );

  if (consultado && recetas.length === 0) return (
    <div style={{ textAlign:"center", padding:"60px 24px", color:C.muted }}>
      <p style={{ fontSize:40, marginBottom:16 }}>🔍</p>
      <p style={{ fontSize:16 }}>Sin resultados. Prueba con otros filtros.</p>
    </div>
  );

  if (!consultado) return (
    <div style={{ textAlign:"center", padding:"80px 24px" }}>
      <p style={{ fontSize:52, marginBottom:16 }}>🍸</p>
      <p style={{ fontFamily:"'Playfair Display', serif", fontSize:22, color:C.cream, marginBottom:8 }}>
        El bar está listo
      </p>
      <p style={{ color:C.muted, fontSize:15 }}>
        Usa el buscador para encontrar tu próxima receta
      </p>
    </div>
  );

  return (
    <section style={{ padding:"40px 24px 64px" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        {/* Results header */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          marginBottom:32, paddingBottom:16,
          borderBottom:`1px solid ${C.border}`,
        }}>
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:C.cream }}>
            Recetas encontradas
          </p>
          <span style={{
            background:`${C.amber}22`, border:`1px solid ${C.amber}44`,
            borderRadius:20, padding:"4px 14px",
            fontSize:13, color:C.gold, fontWeight:600,
          }}>
            {recetas.length} resultados
          </span>
        </div>

        {/* Grid */}
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))",
          gap:22,
        }}>
          {recetas.map((r, i) => <RecetaCard key={r.idDrink} receta={r} index={i} />)}
        </div>
      </div>
    </section>
  );
};

// ─── MODAL ────────────────────────────────────────────────────────────────────
const RecetaModal = () => {
  const { informacion, loadingModal, cerrar } = useContext(ModalContext);
  const overlayRef = useRef(null);

  // Cerrar con Escape
  useEffect(() => {
    const handler = e => { if (e.key === "Escape") cerrar(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [cerrar]);

  // Bloquear scroll
  useEffect(() => {
    document.body.style.overflow = (informacion || loadingModal) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [informacion, loadingModal]);

  if (!informacion && !loadingModal) return null;

  const getIngredientes = info => {
    const lista = [];
    for (let i = 1; i <= 15; i++) {
      const ing  = info[`strIngredient${i}`];
      const med  = info[`strMeasure${i}`];
      if (ing?.trim()) lista.push({ ing: ing.trim(), med: med?.trim() || "" });
    }
    return lista;
  };

  return (
    <div
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) cerrar(); }}
      style={{
        position:"fixed", inset:0, zIndex:1000,
        background:"rgba(0,0,0,0.85)", backdropFilter:"blur(6px)",
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:20,
      }}
    >
      <div className="modal-anim" style={{
        background:C.card, borderRadius:24,
        border:`1px solid ${C.border}`,
        boxShadow:`0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px ${C.amber}22`,
        width:"100%", maxWidth:560,
        maxHeight:"90vh", overflowY:"auto",
        position:"relative",
      }}>
        {/* Close button */}
        <button
          onClick={cerrar}
          style={{
            position:"sticky", top:16, float:"right", marginRight:16,
            width:36, height:36, borderRadius:"50%",
            background:`${C.amber}22`, border:`1px solid ${C.amber}44`,
            color:C.cream, fontSize:18, cursor:"pointer",
            display:"inline-flex", alignItems:"center", justifyContent:"center",
            zIndex:10,
          }}
        >✕</button>

        {loadingModal ? (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:20, padding:"80px 0" }}>
            <Spinner size={44} />
            <p style={{ color:C.muted }}>Destilando la receta...</p>
          </div>
        ) : informacion ? (
          <>
            {/* Imagen */}
            <div style={{ position:"relative" }}>
              <img
                src={informacion.strDrinkThumb}
                alt={informacion.strDrink}
                style={{ width:"100%", aspectRatio:"16/9", objectFit:"cover", borderRadius:"24px 24px 0 0" }}
              />
              <div style={{
                position:"absolute", inset:0,
                background:`linear-gradient(to top, ${C.card} 5%, transparent 55%)`,
                borderRadius:"24px 24px 0 0",
              }}/>
              {/* Título sobre imagen */}
              <div style={{ position:"absolute", bottom:20, left:24, right:60 }}>
                <CategoryBadge label={informacion.strCategory || "Cóctel"} />
                <h2 style={{
                  fontFamily:"'Playfair Display',serif",
                  fontSize:"clamp(1.4rem,3vw,1.9rem)",
                  fontWeight:900, color:C.cream,
                  marginTop:8, lineHeight:1.2,
                }}>{informacion.strDrink}</h2>
              </div>
            </div>

            <div style={{ padding:"24px 28px 32px" }}>
              {/* Meta */}
              <div style={{
                display:"flex", gap:10, flexWrap:"wrap", marginBottom:24,
              }}>
                {[
                  informacion.strAlcoholic && { label:"🍷 " + informacion.strAlcoholic },
                  informacion.strGlass     && { label:"🥃 " + informacion.strGlass },
                ].filter(Boolean).map(({ label }, i) => (
                  <span key={i} style={{
                    padding:"5px 12px",
                    background:`${C.amber}15`, border:`1px solid ${C.amber}33`,
                    borderRadius:20, fontSize:13, color:C.gold,
                  }}>{label}</span>
                ))}
              </div>

              {/* Ingredientes */}
              <h3 style={{
                fontFamily:"'Playfair Display',serif",
                fontSize:17, color:C.amber, marginBottom:12,
                borderBottom:`1px solid ${C.border}`, paddingBottom:8,
              }}>Ingredientes</h3>
              <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:6, marginBottom:24 }}>
                {getIngredientes(informacion).map(({ ing, med }, i) => (
                  <li key={i} style={{
                    display:"flex", alignItems:"center", justifyContent:"space-between",
                    padding:"8px 12px", borderRadius:8,
                    background: i % 2 === 0 ? `${C.amber}0A` : "transparent",
                    fontSize:14, color:C.cream,
                  }}>
                    <span style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ color:C.amber, fontSize:16 }}>▸</span> {ing}
                    </span>
                    {med && <span style={{ color:C.gold, fontWeight:600, fontSize:13 }}>{med}</span>}
                  </li>
                ))}
              </ul>

              {/* Instrucciones */}
              {informacion.strInstructions && (
                <>
                  <h3 style={{
                    fontFamily:"'Playfair Display',serif",
                    fontSize:17, color:C.amber, marginBottom:12,
                    borderBottom:`1px solid ${C.border}`, paddingBottom:8,
                  }}>Preparación</h3>
                  <p style={{
                    fontSize:14, lineHeight:1.75, color:"#C4975A",
                  }}>{informacion.strInstructions}</p>
                </>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

// ─── FOOTER ────────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer style={{
    textAlign:"center", padding:"20px 24px",
    borderTop:`1px solid ${C.border}`,
    color:C.muted, fontSize:12,
  }}>
    Recetas por{" "}
    <a href="https://www.thecocktaildb.com" target="_blank" rel="noopener noreferrer"
      style={{ color:C.amber, textDecoration:"none" }}>
      TheCocktailDB
    </a>
    {" "}· Bebidas Explorer — React + Context API
  </footer>
);

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <CategoriasProvider>
      <RecetasProvider>
        <ModalProvider>
          <GlobalStyles />
          <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column" }}>
            <Header />
            <Formulario />
            <main style={{ flex:1 }}>
              <ListaRecetas />
            </main>
            <Footer />
            <RecetaModal />
          </div>
        </ModalProvider>
      </RecetasProvider>
    </CategoriasProvider>
  );
}
