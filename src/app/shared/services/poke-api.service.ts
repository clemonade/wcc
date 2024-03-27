import {inject, Injectable} from "@angular/core";
import {Ability, EvolutionChain, NamedAPIResourceList, PokemonSpecies, Type} from "pokenode-ts";
import {HttpClient, HttpContext} from "@angular/common/http";
import {PokemonExtended, PokemonPaginationParams} from "../models/pokemon";
import {BYPASS_ERROR_INTERCEPTOR} from "../../core/interceptors/error.interceptor";
import {Observable} from "rxjs";
import {BYPASS_LOADING_INTERCEPTOR} from "../../core/interceptors/loading.interceptor";
import {BypassInterceptor} from "../../core/models/app";

@Injectable({
  providedIn: "root"
})
export class PokeApiService {
  private readonly pokemonEndpoint = "https://pokeapi.co/api/v2/";
  private readonly httpClient = inject(HttpClient);

  getPokemons$: (params?: PokemonPaginationParams) => Observable<NamedAPIResourceList> = (params?: PokemonPaginationParams) => this.httpClient.get<NamedAPIResourceList>(`${this.pokemonEndpoint}pokemon/`, {params});
  getPokemonByNameOrId$: (nameOrId: (string | number), bypassInterceptor?: BypassInterceptor) => Observable<PokemonExtended> = (nameOrId: string | number, bypassInterceptor?: BypassInterceptor) => {
    const context = new HttpContext().set(BYPASS_LOADING_INTERCEPTOR, bypassInterceptor?.loading);
    context.set(BYPASS_ERROR_INTERCEPTOR, bypassInterceptor?.error);
    return this.httpClient.get<PokemonExtended>(`${this.pokemonEndpoint}pokemon/${nameOrId}`, {context});
  };
  getTypeByNameOrId$: (nameOrId: (string | number)) => Observable<Type> = (nameOrId: string | number) => this.httpClient.get<Type>(`${this.pokemonEndpoint}type/${nameOrId}`);
  getAbilityByNameOrId$: (nameOrId: (string | number)) => Observable<Ability> = (nameOrId: string | number) => this.httpClient.get<Ability>(`${this.pokemonEndpoint}ability/${nameOrId}`);
  getSpeciesByNameOrId$: (nameOrId: (string | number)) => Observable<PokemonSpecies> = (nameOrId: string | number) => this.httpClient.get<PokemonSpecies>(`${this.pokemonEndpoint}pokemon-species/${nameOrId}`);
  getEvolutionChainById$: (id: number) => Observable<EvolutionChain> = (id: number) => this.httpClient.get<EvolutionChain>(`${this.pokemonEndpoint}evolution-chain/${id}`);
}
