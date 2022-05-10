import Image from 'next/image';
import stc from "string-to-color";
import { padLeftZero } from "../utils/common";
import styles from "../styles/Detail.module.css";
import { IGetPokemon } from "../lib/PokeApis";

interface DetailProps {
  pokemon?: IGetPokemon;
  faviourite?: boolean;
  handleFavorite: (name: string) => void;
}

const Detail = ({ pokemon, faviourite, handleFavorite }: DetailProps) => {
  return (
    <div className={styles.container}>
      {pokemon && pokemon.id && pokemon.sprites && pokemon.stats? (
        <>
          <div
            className={styles.background}
            style={{ backgroundColor: stc(pokemon ? pokemon.types : "") }}
          >
            <div>
              <span>#{padLeftZero(pokemon.id, 3)}</span>
              <div className={styles.name} >
                <img src="/star.png" className={`${styles.favIcon} ${faviourite ? styles.favIconActive : ""}`} />
                {pokemon.name}
              </div>
            </div>
          </div>
          <div className={styles.statsContainer}>
            <div className={styles.thumbnail} onClick={() => {handleFavorite(pokemon.name)}} >
              <img
                src={pokemon.sprites.other["official-artwork"].front_default}
              />
            </div>
            <div className={styles.stats}>
              <div className={styles.statTitle}>Base Stats</div>
              <div className={styles.statList}>
                {pokemon.stats.map((stat) => (
                  <div className={styles.statItem} key={stat.stat.name}>
                    <div className={styles.statName}>
                      {stat.stat.name.toUpperCase()}
                    </div>
                    <div className={styles.statValue} style={{width: `${stat.base_stat}%`, backgroundColor: stc(stat.stat.name)}}>
                      {stat.stat.name.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default Detail;
