import {inject, Injectable} from '@angular/core';
import {NamedAPIResourceList} from "pokenode-ts";
import {HttpClient} from "@angular/common/http";
import {PokemonExtended} from "./pokemon";

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private readonly pokemonEndpoint = 'https://pokeapi.co/api/v2/pokemon/'
  private readonly httpClient = inject(HttpClient);


  listPokemons = this.httpClient.get<NamedAPIResourceList>(this.pokemonEndpoint)
  getPokemonByName = (name: string) => this.httpClient.get<PokemonExtended>(this.pokemonEndpoint + name);
}
