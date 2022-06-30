import React, {useEffect, useState} from "react"
import axios from "axios"
import './styles.css'

// Cantidad inicial de datos a mostrar
var cantidad = 12;

// Lista con la info de cada pokemón
let each_list = []

const Pokemons = () => {
    const [pokemons, setPokemons] = useState([])
    const [next, setNext] = useState([]) 

    useEffect(() => {
        load()
    }, [])

    // Función que carga los pokemones con los resultados de la api
    const load = async () => {
        try {
            const {data} = await axios.get(`https://pokeapi.co/api/v2/pokemon/?offset=0&limit=${cantidad}`)
            each_list = []

            for (let result of data.results)
            {
                const data_each = await axios.get(result.url)
                each_list.push(data_each)
            }

            setPokemons(data.results)
            setNext(data.next)
        } 
        catch (error){
            console.log(error)
        }
   }

  // Gatillar cargar más
const [loadMore, setLoadMore] = useState(false)

  // Chequear si hay más que cargar

const [hasMore, setHasMore] = useState(next != null)

  // Click de cargar más
const handleLoadMore = () => {
setLoadMore(true)
  }

  // Manejamos el cargar más pokemones
useEffect(() => {
  if (loadMore && hasMore) {
    const limit = Number(next.split("limit")[1].split("=")[1])
    
    // Se inicializa variable de cuántos cargar
    var news = 0

    // Si hay menos de 12, se carga ese número
    if (limit < 12){
        news = limit
    }

    // De lo contrario se cargan 12
    else{
        news = 12
    } 

    cantidad += news
    load()
    setLoadMore(false)
  }
}, [loadMore, hasMore]) 

  // Se chequea si hay más
  useEffect(() => {
    const isMore = next != null
    setHasMore(isMore)
  }) 

  return (
    <body> 
        <div className="container pokedex">
            <section className="section pokedex-results overflow-visible">
                <ul className="results">
                {
                each_list.map((data) => (
                    <li className="animating">
                        <figure>
                            <img src={data.data.sprites.other["official-artwork"].front_default} width="205px" height="205px" float="left" position="absolute" top="0"></img>
                        </figure>
                        <div className="pokemon-info">
                            <p className="id">
		                        <span className="number-prefix" font-family="sans-serif">N.º</span>{data.data.id}
	                        </p>
                            <h5>{data.data.name}</h5>
                            <div className="abilities">
                            {data.data.types.map((type) => 
                            (
                                <span className={`pill background-color-${type.type.name}`}>{type.type.name}</span>
                            ))}                                                                
                            </div>
                        </div> 
                    </li>                          
                    ))
                    }
                    <div>
                    {hasMore ? (
                        <button id="loadMore" onClick={handleLoadMore}>Cargar más pokemón</button>
                    ) : (
                            <p>No hay más pokemones</p>
                    )}
                    </div>
                </ul>                
            </section>
        </div>
        {/* <section id="button">
            <div>
            {hasMore ? (
                <button id="loadMore" onClick={handleLoadMore}>Cargar más pokemón</button>
            ) : (
                <p>No hay más pokemones</p>
            )}
            </div>
        </section>         */}
    </body>
)
}

export default Pokemons