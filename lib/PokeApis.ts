import axios from 'axios';
import { IPokemon } from 'pokeapi-typescript';
import md5 from 'md5';

export interface IPokeApiConfig {
    url: string;
    cache?: boolean;
    limit?: number;
}

export interface IPokemonList {
    name: string;
    url: string;
    id?: number;
    types?: string[];
}

export interface IGetPokemon extends IPokemon { 
    stats?: {
        base_stat: number;
        stat: {
            name: string;
            url: string;
        }
    }[];
};
export interface IGetPokemons {
    count: number;
    next: string;
    previous: string;
    results: Array<IPokemonList>;
}


class PokeApis {

    config: IPokeApiConfig;

    constructor(confg: IPokeApiConfig) {
        this.config = confg;
    }

    getFromCache(url: string): string | null {
        if (typeof window === 'object' && sessionStorage && url != null && sessionStorage.getItem(md5(url)) != null) {
            return sessionStorage.getItem(md5(url));
        }
        return "";
    }

    setToCache(url: string, data: string): void {
        if (typeof window === 'object' &&  sessionStorage) {
            sessionStorage.setItem(md5(url), data);
        }
    }

    async getAllPokemons(): Promise<Array<IPokemonList>> {
        const data = await this.getPokemons(0, 9999);
        return data.results;
    }

    async getPokemons(offset: number, limit?: number): Promise<IGetPokemons> {
        const url = `${this.config.url}/pokemon?limit=${limit || this.config.limit}&offset=${offset}`;
        if (this.config.cache && this.getFromCache(url) != "") {
            const cacheData = this.getFromCache(url);
            if (cacheData != null) {
                return JSON.parse(cacheData);
            }
        }
        const response = axios.get(url);
        const data = (await response).data;
        if (this.config.cache) {
            this.setToCache(url, JSON.stringify(data));
        }
        return data;
    }

    async getPokemon(name: string): Promise<IPokemon> {
        const url = `${this.config.url}/pokemon/${name}`;
        if (this.config.cache && this.getFromCache(url) != "") {
            const cacheData = this.getFromCache(url);
            if (cacheData != null) {
                return JSON.parse(cacheData);
            }
        }
        const response = axios.get(`${this.config.url}/pokemon/${name}`);
        const data = (await response).data;
        if (this.config.cache) {
            this.setToCache(url, JSON.stringify({ name: data.name, id: data.id, sprites: { front_default: data.sprites.front_default, other: { 'official-artwork': { front_default: data.sprites.other['official-artwork'].front_default } } }, types: data.types, stats: data.stats }));
        }
        return data;
    }

}

export default PokeApis;