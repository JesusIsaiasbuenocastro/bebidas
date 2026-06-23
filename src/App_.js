import React,{Fragment} from 'react';
import Header from './Components/Header';
import Formulario from './Components/Formulario';
import ListaRecetas from './Components/ListaRecetas';

import CategoriasProvider from './context/CategoriasContext';
import RecetasProvider from './context/RecetasContext';
import ModalProvider from './context/ModalContext';

function App() {
  return (
    <Fragment>
    <CategoriasProvider>
      <RecetasProvider>
        <ModalProvider>
          <Header/>
          <div className="container mt-5">
            <div className="row">
                <Formulario />
            </div>
            <ListaRecetas />
          </div>
        </ModalProvider>
      </RecetasProvider>
    </CategoriasProvider>
    </Fragment>
  );
}

export default App;
