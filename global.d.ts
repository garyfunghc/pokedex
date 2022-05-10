declare module 'pokeapi-typescript' {
    export interface IPokemonSprites {
        other: {
            front_default: string;
        }
    }
    export interface IPokemon {
        id: number;
        types: string;
        name: string;
        sprites?: {
            front_default: string;
            other: {
                'official-artwork': {
                    front_default: string;
                }
            }
        };
    }
}