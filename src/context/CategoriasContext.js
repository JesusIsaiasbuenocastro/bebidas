import axios from 'axios';
import React, { createContext, useState, useEffect} from 'react';

//crear el context 
export const CategoriasContext =createContext();

//provider es donde se encuentran las funciones y state
const CategoriasProvider = (props) =>{

    //crear el state del context
    const [ categorias, guardarCategorias ] = useState([]);
    
    //Ejecutar el llamado a la api 
    useEffect(() => {
        const obtenerCategorias = async () => {
            const url =`https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list`;

            const categorias = await axios.get(url);

            guardarCategorias(categorias.data.drinks);
        }

        obtenerCategorias();
       
    }, [])
    
    //todo lo que se ponga en value es lo que estara disponible en todos los componentes
    return (
        <CategoriasContext.Provider
            value={{
                categorias
            }}
        >
            {props.children}
        </CategoriasContext.Provider>
    )
}

//para poder utilizar este archivo en otros componentes 
export default CategoriasProvider;



//NOTA: LA CARACTERISTICA PRINCIPAL DEL CONTEXT API ES QUE SE PUEDEN PASAR COMPONENTES DESDE EL PADRE PRINCIPAL(APP.JS) HASTA CUALQUIER HIJO 
//HASTA AHORITA SOLO SE HAN USADO PASAR DE PADRE A HIJO 