// src/context/RecetasContext.js
import { createContext, useState, useCallback } from 'react';
import axios from 'axios';

export const RecetasContext = createContext();

const RecetasProvider = ({ children }) => {
  const [recetas,    setRecetas]    = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [consultado, setConsultado] = useState(false);

  const buscarRecetas = useCallback(async ({ nombre, categoria }) => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${nombre}&c=${categoria}`;
      const res = await axios.get(url);
      setRecetas(Array.isArray(res.data.drinks)? res.data.drinks : []);
      setConsultado(true);
    } catch {
      setError('No encontramos cócteles con esos filtros. Intenta otra combinación.');
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

export default RecetasProvider;
