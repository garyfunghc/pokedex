import { useState, useEffect } from "react";
import stc from "string-to-color";
import styles from "../styles/Card.module.css";
import config from "../config";
import PokeApis, { IGetPokemon } from "../lib/PokeApis";

interface CardProps {
  name: string;
  displayPokemonId: number;
  handleShowPokemon: (pokemon: IGetPokemon) => void;
}

const pokeapi = new PokeApis(config.pokeApi);

const Card = ({ name, displayPokemonId, handleShowPokemon }: CardProps) => {
  const [pokemonState, setPokemonState] = useState<IGetPokemon | null>(null);
  const [loading, setLoading] = useState(false);


  const fetchPokemon = async (name: string) => {
    setLoading(true);
    try {
      const pokemon = await pokeapi.getPokemon(name);
      setPokemonState(pokemon);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!pokemonState) {
      fetchPokemon(name);
    }
  }, [name]);

  return (
    <div className={styles.cardContainer}>
      {pokemonState && pokemonState.id && pokemonState.sprites && (
        <div onClick={() => handleShowPokemon(pokemonState)} className={`${styles.card} ${displayPokemonId === pokemonState.id? styles.cardActive  : ""}`} style={{backgroundColor: stc(pokemonState.types) }} >
          <div className={styles.thumbnail}><img src={pokemonState.sprites.front_default} /></div>
          <div className={styles.name}>{pokemonState.name}</div>
        </div>
      )}
      
      {(!pokemonState || !pokemonState.id) && (
        <>
        <div>Loading...</div>
        <img className={styles.placeholder} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="></img>
        </>
      )}
    </div>
  );
};

export default Card;
