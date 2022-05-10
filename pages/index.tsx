import { useState, useEffect, useRef } from "react";
import type { NextPage } from "next";
import config from "../config";
import PokeApis, { IPokemonList, IGetPokemon } from "../lib/PokeApis";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Detail from "../components/Detail";
import styles from "../styles/Home.module.css";

interface IndexProps {
  pokemons: Array<IPokemonList>;
}

const pokeapi = new PokeApis(config.pokeApi);

const Home: NextPage<IndexProps> = ({ pokemons }) => {
  const [pageState, setPagestate] = useState({
    offset: 0,
    displayPokemonId: 0,
    searchOn: false,
    displayOffset: 0,
    displayLimit: 5,
    searchText: "",
    searchSuggest: {} as IGetPokemon,
  });

  let faviouriteListFromCache: string[] = [];

  if (typeof window === 'object') {
    faviouriteListFromCache = JSON.parse(localStorage.getItem("favouriteList") || "[]");
  }
  
  const [faviouriteList, setFaviouriteList] = useState(faviouriteListFromCache);
  const [pokemonsState, setPokemonsState] = useState(pokemons);
  const [pokemonState, setPokemonState] = useState({} as IGetPokemon);
  const [loading, setLoading] = useState(false);

  const menu = useRef(document.createElement("div"));
  const searchInput = useRef(document.createElement("input"));

  const fetchPokemons = async () => {
    setLoading(true);
    try {
      const pokemons = await pokeapi.getAllPokemons()
      if (pokemonsState) {
        setPokemonsState(pokemonsState);
      } else {
        setPokemonsState(pokemons);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

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
    if (!pokemonsState) {
      fetchPokemons();
    }
    if (menu != null) {
      const displayLimit = Math.ceil(menu.current.clientWidth / 100);
      setPagestate({...pageState, displayLimit});
    }
  }, [pageState.displayOffset]);

  const search = (name: string) => {
    fetchPokemon(name);
  }

  const handleShowPokemon = (pokemon: IGetPokemon) => {
    setPagestate({ ...pageState, displayPokemonId: pokemon.id });
    menu.current.scroll({
      left: 100 * (pokemon.id - 1) - 50,
      behavior: "smooth",
    });

    setPokemonState(pokemon);
  };

  const handleScroll = (e: any) => {
    const currentPosition = e.target.scrollLeft;
    const maxPosition = e.target.scrollWidth - e.target.clientWidth;
    if (currentPosition === maxPosition) {
      setPagestate({ ...pageState, displayOffset: pageState.displayOffset + pageState.displayLimit });
    }
  };

  const handleToggleSearch = () => {
    if (pageState.searchOn && pageState.searchSuggest) {
      search(pageState.searchSuggest.name);
    } else {
      searchInput.current.focus();
    }
    setPagestate({ ...pageState, searchOn: !pageState.searchOn });
  };

  const handleSearchText = (e: any) => {
    const searchText = e.target.value;
    const charCode = e.which || e.keyCode;
    let searchSuggest;
    
    if (searchText.length > 0) {
      for (let i = 0; i < pokemonsState.length; i++) {
        if (pokemonsState[i].name.indexOf(searchText) === 0) {
          searchSuggest = pokemonsState[i];
          // @ts-expect-error
          setPagestate({ ...pageState, searchText, searchSuggest });
          break;
        }
      }
    }
  }

  const handleSearchSuggest = (e: any) => {
    const charCode = e.which || e.keyCode;
    if (charCode === 9 && pageState.searchSuggest) {
      setPagestate({ ...pageState, searchText: pageState.searchSuggest.name });
    }
    if (charCode === 13 && pageState.searchSuggest) {
      setPagestate({ ...pageState, searchText: pageState.searchSuggest.name, searchOn: false });
      search(pageState.searchSuggest.name);
    }
  }

  const handleFavorite = (name: string) => {
    if (faviouriteList.includes(name)) {
      setFaviouriteList(faviouriteList.filter((pokemon) => pokemon !== name));
    } else {
      faviouriteList.push(name);
      setFaviouriteList([...faviouriteList]);
      if (typeof window !== 'undefined') {
        localStorage.setItem("favouriteList", JSON.stringify(faviouriteList));
      }
      
    }
  }

  return (
    <Layout>
      <div className={styles.container}>
        <div
          className={`${styles.searchBar} ${
            pageState.searchOn ? styles.searchBarActive : ""
          }`}
        >
          <input className={styles.searchInput} ref={searchInput} onKeyDown={handleSearchSuggest} onChange={handleSearchText} value={pageState.searchText} />
          <div className={styles.searchSuggest}>{pageState.searchSuggest.name}</div>
          <div className={styles.searchIcon} onClick={handleToggleSearch}></div>
        </div>
        <div className={styles.detail}>
          {pokemonState.name && (<Detail pokemon={pokemonState} handleFavorite={handleFavorite} faviourite={faviouriteList.includes(pokemonState.name)} />)}
          {!pokemonState.name && (<>
            <div className={styles.title} >PokeDex</div>
            <div className={styles.subtitle}>@ Gary Fung</div>
          </>)}
        </div>
        <div className={styles.menu} ref={menu} onScroll={handleScroll}>
          <div className={styles.scrollContainer}>
            {pokemonsState &&
              pokemonsState.map((pokemon, idx) => {
                if (pageState.displayOffset +  pageState.displayLimit > idx) {
                  return (
                    <Card
                      key={idx}
                      name={pokemon.name}
                      displayPokemonId={pageState.displayPokemonId}
                      handleShowPokemon={handleShowPokemon}
                    />
                  );
                }
              })}
          </div>
        </div>
        <div className={styles.content}>{loading && <div>Loading...</div>}</div>
      </div>
    </Layout>
  );
};

export default Home;
