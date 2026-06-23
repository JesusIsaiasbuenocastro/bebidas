// src/context/CategoriasContext.js
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CategoriasContext = createContext();

const CategoriasProvider = ({ children }) => {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    axios
      .get('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list')
      .then(r => setCategorias(r.data.drinks || []))
      .catch(() => {});
  }, []);

  return (
    <CategoriasContext.Provider value={{ categorias }}>
      {children}
    </CategoriasContext.Provider>
  );
};

export default CategoriasProvider;
