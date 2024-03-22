import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {PokemonService} from "../pokemon.service";
import {JsonPipe} from "@angular/common";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {NamedAPIResource} from "pokenode-ts";
import {mergeMap, switchMap, tap} from "rxjs";
import {PokemonExtended} from "../pokemon";

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    JsonPipe
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {
  pokemonService = inject(PokemonService);
  changeDetectorRef = inject(ChangeDetectorRef);
  destroyRef = inject(DestroyRef)

  pokemons: NamedAPIResource[] = [];
  pokedex: Record<string, PokemonExtended> = {};

  listPokemons = this.pokemonService.listPokemons.pipe(
    tap(({results}) => {
      this.pokemons = results;
    }),
    switchMap(({results}) => {
      return results.map(pokemon => pokemon.name)
    }),
    mergeMap(name => this.pokemonService.getPokemonByName(name).pipe(takeUntilDestroyed(this.destroyRef))),
    tap((pokemon) => {
      this.pokedex[pokemon.name] = pokemon;
    })
  );

  ngOnInit(): void {
    this.listPokemons.pipe(
      tap(() => {
        this.changeDetectorRef.markForCheck()
      }),
      takeUntilDestroyed(this.destroyRef)).subscribe()
  }
}
