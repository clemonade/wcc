import {ResolveFn, Router} from "@angular/router";
import {DEFAULT_PATH, DETAIL_ROUTE_PARAM} from "../../core/constants/app";
import {inject} from "@angular/core";
import {PokemonService} from "../services/pokemon.service";
import {catchError, EMPTY, map, take} from "rxjs";
import {PokemonExtended} from "../models/pokemon";

export const pokemonResolver: ResolveFn<PokemonExtended> = (route) => {
  const router = inject(Router);

  return inject(PokemonService).getPokemonByNameOrId$(route.params[DETAIL_ROUTE_PARAM]).pipe(
    take(1),
    map((result) => {
      return result;
    }),
    catchError(() => {
      router.navigate([DEFAULT_PATH]); // TODO: navigate to error page
      return EMPTY;
    })
  );
};
