// src/context/ModalContext.js
import { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const ModalContext = createContext();

const ModalProvider = ({ children }) => {
  const [idReceta,     setIdReceta]     = useState(null);
  const [informacion,  setInformacion]  = useState(null);
  const [loadingModal, setLoadingModal] = useState(false);

  useEffect(() => {
    if (!idReceta) return;
    setLoadingModal(true);
    axios
      .get(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idReceta}`)
      .then(r => setInformacion(r.data.drinks?.[0] || null))
      .catch(() => setInformacion(null))
      .finally(() => setLoadingModal(false));
  }, [idReceta]);

  const abrir  = useCallback(id => setIdReceta(id), []);
  const cerrar = useCallback(() => { setIdReceta(null); setInformacion(null); }, []);

  return (
    <ModalContext.Provider value={{ informacion, loadingModal, abrir, cerrar }}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
