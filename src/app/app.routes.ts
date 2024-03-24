import {Routes} from "@angular/router";
import {ListComponent} from "./features/list/list.component";
import {DetailComponent} from "./features/detail/detail.component";
import {pokemonResolver} from "./shared/guards/pokemon.resolver";
import {DEFAULT_PATH, DETAIL_ROUTE_PARAM} from "./core/constants/app";

export const routes: Routes = [
  {
    path: "",
    redirectTo: DEFAULT_PATH,
    pathMatch: "full"
  },
  {
    path: DEFAULT_PATH,
    component: ListComponent
  },
  {
    path: `${DEFAULT_PATH}/:${DETAIL_ROUTE_PARAM}`,
    resolve: {
      pokemon: pokemonResolver
    },
    component: DetailComponent
  },
  {
    // TODO: not found page
    path: "**",
    redirectTo: DEFAULT_PATH,
  },
];
