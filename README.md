# 🍸 Bebidas Explorer

Buscador de recetas de cócteles construido con **React 17 + Context API**, consumiendo la API pública de [TheCocktailDB](https://www.thecocktaildb.com). Proyecto de práctica frontend para portafolio de desarrollador backend.

---

## 📸 Características

| Feature | Descripción |
|---|---|
| 🔍 Búsqueda dual | Por ingrediente y/o categoría simultáneamente |
| 🎨 Diseño dark bar | Tema oscuro con acento ámbar — inspirado en bares de coctelería |
| 🃏 Tarjetas animadas | Hover con zoom, elevación y transición de color |
| 🪟 Modal de receta | Ingredientes formateados, tipo de vaso, instrucciones completas |
| ⌨️ Accesibilidad | Cierre con `Escape`, foco de teclado, `aria` attrs |
| 📦 Estados UI | Loading, error, vacío, resultado — todos cubiertos |
| 🌐 Sin dependencias de UI | Zero Bootstrap, solo React + CSS-in-JS nativo |

---

## 🏗️ Estructura del proyecto

```
bebidas/
├── public/
│   └── index.html
└── src/
    ├── App.js                        ← Solo providers + layout, sin lógica
    │
    ├── utils/
    │   └── colors.js                 ← Paleta única, importada en todos lados
    │
    ├── styles/
    │   └── GlobalStyles.js           ← Keyframes y reset global, montado una vez
    │
    ├── context/
    │   ├── CategoriasContext.js      ← Fetch de categorías al montar
    │   ├── RecetasContext.js         ← Búsqueda, loading, error, resultados
    │   └── ModalContext.js           ← ID seleccionado + detalle de receta
    │
    └── components/
        ├── Header.js                 ← Hero visual, sin estado
        ├── Formulario.js             ← Inputs + submit, consume 2 contexts
        ├── RecetaCard.js             ← Tarjeta individual, hover local
        ├── ListaRecetas.js           ← Grid + todos los estados UI
        ├── RecetaModal.js            ← Modal completo con ingredientes
        ├── CategoryBadge.js          ← Pill reutilizable (usado en card y modal)
        ├── Spinner.js                ← Indicador de carga reutilizable
        └── Footer.js                 ← Sin estado, solo presentación
```

---

## 🔄 Flujo de datos — Context API

```
                         App.js
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
   CategoriasProvider  RecetasProvider   ModalProvider
          │                 │                 │
    GET /list.php      Búsqueda lazy      GET /lookup.php
    al montar          (bajo demanda)     cuando idReceta ≠ null
          │                 │                 │
    categorias[]       recetas[]          informacion{}
                       loading            loadingModal
                       error
          │                 │                 │
     <Formulario/>    <ListaRecetas/>    <RecetaModal/>
     (useContext)     (useContext)       (useContext)
                            │
                      <RecetaCard/>
                       onClick → abrir(id)
                            │
                            └──────────────► ModalContext.abrir()
                                               setIdReceta(id)
                                               → useEffect → fetch
```

---

## 📦 Librerías utilizadas

### React `^17.0.1`

El núcleo de la aplicación. Hooks y APIs en uso:

| Hook / API | Dónde | Propósito |
|---|---|---|
| `useState` | Formulario, Receta, Modal | Estado local de componentes |
| `useEffect` | CategoriasContext, RecetasContext, ModalContext | Efectos secundarios (fetch a API) |
| `useContext` | Formulario, ListaRecetas, RecetaCard, Modal | Consumo del estado global |
| `useCallback` | RecetasProvider, ModalProvider | Evita re-creación de funciones en cada render |
| `useRef` | RecetaModal | Referencia al overlay para cerrar al hacer clic fuera |
| `createContext` | Los 3 contexts | Creación del canal de comunicación global |

### Axios `^0.21.1`

Cliente HTTP para consumir TheCocktailDB. Ventajas sobre `fetch` nativo:
- Transformación automática de JSON
- Interceptores para manejo centralizado de errores (mejora futura)
- Soporte de cancelación de peticiones con `CancelToken`

Endpoints en uso:

```
GET /list.php?c=list            → Lista de categorías (al montar)
GET /filter.php?i={}&c={}       → Búsqueda de cócteles por ingrediente/categoría
GET /lookup.php?i={idDrink}     → Detalle completo de un cóctel
```


### Create React App (react-scripts `^5.0.1`)

Toolchain sin configuración manual: Webpack, Babel, ESLint, Jest, HMR.

### Web Vitals `^0.2.4`

Mide LCP, FID, CLS en producción. Ya está en el proyecto; actívalo en `index.js`:
```js
reportWebVitals(console.log);
```

---

## 🌿 Estrategia de Branching: Trunk-Based Development

### ¿Qué es Trunk-Based Development?

**Trunk-Based Development (TBD)** es una estrategia donde todos los desarrolladores integran su trabajo directamente en una única rama principal (`main` / `trunk`) con **frecuencia alta** — idealmente varias veces al día. Es la estrategia adoptada por equipos de alto rendimiento como Google, Facebook y Netflix.

El contraste con **Git Flow** es directo:

| Aspecto | Git Flow | Trunk-Based Dev |
|---|---|---|
| Ramas de larga vida | `develop`, `release`, `hotfix` | Solo `main` |
| Frecuencia de merge | Días o semanas | Horas |
| Conflictos de merge | Frecuentes y grandes | Mínimos |
| CI/CD | Difícil de automatizar | Nativo y fluido |
| Ideal para | Equipos grandes con releases fijos | Entrega continua, startups, SaaS |

### Diagrama de flujo Trunk-Based

```
                         TRUNK (main)
                             │
        ┌────────────────────┼────────────────────┐
        │                   │                    │
        ▼                   ▼                    ▼
  feature/search      feature/modal         feature/ui-redesign
  (1–2 días max)      (< 1 día)             (2–3 días max)
        │                   │                    │
        │  PR pequeño        │  PR pequeño        │  PR pequeño
        └──────► main ◄──────┘◄───────────────────┘
                   │
            CI/CD pipeline
                   │
            ┌──────┴──────┐
            │             │
           Tests         Build
            │             │
            └──────┬──────┘
                   │
               Deploy
            (automático)
```

### Flujo paso a paso para este proyecto

```bash
# 1. Siempre partir desde main actualizado
git checkout main
git pull origin main

# 2. Crear rama de feature con nombre descriptivo y corto
git checkout -b feature/search-filters

# 3. Commits pequeños y frecuentes (varias veces al día)
git add src/Components/Formulario.js
git commit -m "feat: add ingredient input with validation"

git add src/context/RecetasContext.js
git commit -m "feat: add error state to recipes context"

# 4. Mergear a main lo antes posible (máx. 2 días)
# NO esperar a tener todo perfecto
git checkout main
git merge feature/search-filters --no-ff
git push origin main

# 5. Eliminar la rama (ya no es necesaria)
git branch -d feature/search-filters
```

### Feature Flags — el complemento de TBD

Cuando una feature tarda más de 2 días, TBD usa **Feature Flags** para hacer merge sin activar la funcionalidad:

```js
// En tu código React
const FEATURES = {
  cocktailComparison: false,   // en desarrollo, no visible aún
  favorites:          true,    // ya activo para todos
  darkMode:           true,
};

// En el componente
{FEATURES.cocktailComparison && <ComparadorCocteles />}
```

Esto permite mergear código incompleto a `main` sin romper producción.

### Ramas en este proyecto (actuales)

```
origin/master    ← trunk principal
origin/develop   ← (legado de Git Flow, puede eliminarse en TBD)
feature/refactor-project-IA ← feature branch activa
```

**Recomendación:** Si adoptas TBD, renombra `master` → `main` y elimina `develop`. Fusiona las features directamente a `main`.

### Convención de commits (Conventional Commits)

Combina bien con TBD porque hace el historial legible y permite generar changelogs automáticos:

```
feat:     nueva funcionalidad
fix:      corrección de bug
refactor: refactorización sin cambio funcional
style:    cambios de estilo/CSS
docs:     documentación
test:     tests
chore:    configuración, dependencias
```

Ejemplos para este proyecto:
```
feat: add cocktail modal with full recipe details
fix: handle null response when API returns no drinks
refactor: extract ingredient parser to utility function
style: redesign header with amber dark theme
docs: add trunk-based development branching guide
```

---

## 🚀 Instalación

```bash
git clone https://github.com/JesusIsaiasbuenocastro/bebidas.git
cd bebidas
npm install
npm start
```

> La API de TheCocktailDB es pública y gratuita. No necesitas API key para el plan básico.

---
 

### Técnicas (impacto en empleabilidad)


**Custom Hooks** — Extrae la lógica de fetch a hooks reutilizables:
```js
// hooks/useCocktailSearch.js
export const useCocktailSearch = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const search = useCallback(async (params) => { ... }, []);
  return { ...state, search };
};
```

**useReducer** — Reemplaza los múltiples `useState` en RecetasContext por un reducer con estados explícitos: `idle | loading | success | error`.

**Cancelación de peticiones** — Si el usuario escribe rápido, cancela la petición anterior:
```js
useEffect(() => {
  const source = axios.CancelToken.source();
  axios.get(url, { cancelToken: source.token });
  return () => source.cancel();
}, [busqueda]);
```

### Nuevas funcionalidades

- **Favoritos** — Guardar cócteles en `localStorage` con un corazón en cada tarjeta
- **Búsqueda por nombre** — El endpoint `/search.php?s={nombre}` permite buscar por nombre de cóctel
- **Paginación / Infinite scroll** — La API no pagina, pero puedes hacerlo client-side
- **Filtro por tipo** — Alcohólico vs No alcohólico (ya disponible en la API)
- **Vista de ingrediente** — Al hacer clic en un ingrediente del modal, buscar cócteles que lo contengan
- **Modo comparar** — Ver dos recetas en el modal lado a lado
- **PWA** — Activar el service worker de CRA para que funcione offline

### Proximamente delpoy
---

---

## 🌐 API Reference — TheCocktailDB

Base URL: `https://www.thecocktaildb.com/api/json/v1/1/`

| Endpoint | Uso |
|---|---|
| `list.php?c=list` | Lista de categorías |
| `filter.php?i={ingrediente}&c={categoria}` | Búsqueda (devuelve lista parcial) |
| `lookup.php?i={idDrink}` | Detalle completo de un cóctel |
| `search.php?s={nombre}` | Búsqueda por nombre (no implementada aún) |
| `random.php` | Cóctel aleatorio |

---

## 📄 Licencia

MIT — libre para modificación y redistribución.
