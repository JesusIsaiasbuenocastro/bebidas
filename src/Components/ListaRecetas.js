import React, {useContext} from 'react';
import { RecetasContext } from '../context/RecetasContext';
import Reseta from './Receta';

const ListaRecetas = () => {
    
    //Extraer las recetas
    const { recetas  } =useContext(RecetasContext);
    console.log(recetas);
    
    return ( 
        <div className="row mt-5">
            { recetas.map( receta => (
                <Reseta
                    key={receta.idDrink}
                    receta={receta}
                />
            )) }
        </div>
     );
}
 
export default ListaRecetas;