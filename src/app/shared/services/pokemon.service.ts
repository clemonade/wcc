import {inject, Injectable} from '@angular/core';
import {NamedAPIResourceList} from "pokenode-ts";
import {HttpClient} from "@angular/common/http";
import {PokemonPaginationParams, PokemonExtended} from "../models/pokemon";

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private readonly pokemonEndpoint = 'https://pokeapi.co/api/v2/pokemon/'
  private readonly httpClient = inject(HttpClient);

  getPokemons$ = (params?: PokemonPaginationParams) => this.httpClient.get<NamedAPIResourceList>(this.pokemonEndpoint, {params})
  getPokemonByNameOrId$ = (nameOrId: string | number) => this.httpClient.get<PokemonExtended>(this.pokemonEndpoint + nameOrId);
}
