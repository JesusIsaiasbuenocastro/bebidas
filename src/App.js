// src/App.js
import CategoriasProvider from './Context/CategoriasContext';
import RecetasProvider    from './Context/RecetasContext';
import ModalProvider      from './Context/ModalContext';

import GlobalStyles  from './Styles/GlobalStyles';
import Header        from './Components/Header';
import Formulario    from './Components/Formulario';
import ListaRecetas  from './Components/ListaRecetas';
import RecetaModal   from './Components/RecetaModal';
import Footer        from './Components/Footer';

function App() {
  return (
    <CategoriasProvider>
      <RecetasProvider>
        <ModalProvider>

          {/* Estilos globales + keyframes */}
          <GlobalStyles />

          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <Formulario />
            <main style={{ flex: 1 }}>
              <ListaRecetas />
            </main>
            <Footer />
            {/* Modal fuera del flujo normal, se posiciona con fixed */}
            <RecetaModal />
          </div>

        </ModalProvider>
      </RecetasProvider>
    </CategoriasProvider>
  );
}

export default App;
