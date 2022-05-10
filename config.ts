import { IPokeApiConfig } from './lib/PokeApis';

export interface Config {
    pokeApi: IPokeApiConfig;
}

const config: Config = {
    pokeApi: {
        url: 'https://pokeapi.co/api/v2',
        cache: true,
        limit: 2000
    }
}


export default config;