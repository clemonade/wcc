import {Routes} from '@angular/router';
import {ListComponent} from "./features/list/list.component";
import {DetailComponent} from "./features/detail/detail.component";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'pokemon',
    pathMatch: 'full'
  },
  {
    path: 'pokemon',
    component: ListComponent
  },
  {
    // TODO: add guard/resolver
    path: 'pokemon/:nameOrId',
    component: DetailComponent
  },
  {
    // TODO: not found page
    path: '**',
    redirectTo: 'pokemon',
  },
];
