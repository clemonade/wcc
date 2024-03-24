import {inject, Injectable} from "@angular/core";
import {Ability, EvolutionChain, NamedAPIResourceList, PokemonSpecies, Type} from "pokenode-ts";
import {HttpClient} from "@angular/common/http";
import {PokemonExtended, PokemonPaginationParams} from "../models/pokemon";

@Injectable({
  providedIn: "root"
})
export class PokemonService {
  private readonly pokemonEndpoint = "https://pokeapi.co/api/v2/";
  private readonly httpClient = inject(HttpClient);

  getPokemons$ = (params?: PokemonPaginationParams) => this.httpClient.get<NamedAPIResourceList>(`${this.pokemonEndpoint}pokemon/`, {params});
  getPokemonByNameOrId$ = (nameOrId: string | number) => this.httpClient.get<PokemonExtended>(`${this.pokemonEndpoint}pokemon/${nameOrId}`);
  getTypeByNameOrId$ = (nameOrId: string | number) => this.httpClient.get<Type>(`${this.pokemonEndpoint}type/${nameOrId}`);
  getAbilityByNameOrId$ = (nameOrId: string | number) => this.httpClient.get<Ability>(`${this.pokemonEndpoint}ability/${nameOrId}`);
  getSpeciesByNameOrId$ = (nameOrId: string | number) => this.httpClient.get<PokemonSpecies>(`${this.pokemonEndpoint}pokemon-species/${nameOrId}`);
  getEvolutionChainById$ = (id: number) => this.httpClient.get<EvolutionChain>(`${this.pokemonEndpoint}evolution-chain/${id}`);
}
