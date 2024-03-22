import {Pokemon} from "pokenode-ts";

export type PokemonExtended = Pokemon & {
  sprites: {
    other: {
      showdown: {
        front_default: string;
      }
    }
  }
}
