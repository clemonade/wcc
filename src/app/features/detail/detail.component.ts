import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from "@angular/core";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {EMPTY, map, merge, mergeMap, switchMap, tap} from "rxjs";
import {CardComponent} from "../../shared/components/card/card.component";
import {AsyncPipe, JsonPipe, KeyValuePipe, NgTemplateOutlet} from "@angular/common";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {PokemonService} from "../../shared/services/pokemon.service";
import {Ability, EvolutionChain, PokemonSpecies, Type} from "pokenode-ts";
import {PokemonExtended} from "../../shared/models/pokemon";
import {MatChip} from "@angular/material/chips";
import {DEFAULT_PATH, LANGUAGE} from "../../core/constants/app";
import {MatBadge} from "@angular/material/badge";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: "app-detail",
  standalone: true,
  imports: [
    CardComponent,
    AsyncPipe,
    KeyValuePipe,
    JsonPipe,
    MatChip,
    MatBadge,
    NgTemplateOutlet,
    RouterLink,
    MatButton,
    MatIcon
  ],
  templateUrl: "./detail.component.html",
  styleUrl: "./detail.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailComponent implements OnInit {
  pokemonService = inject(PokemonService);
  activatedRoute = inject(ActivatedRoute);
  changeDetectorRef = inject(ChangeDetectorRef);
  destroyRef = inject(DestroyRef);

  pokemon?: PokemonExtended;
  types: Record<string, Type> = {};
  abilities: Record<string, Ability> = {};
  species?: PokemonSpecies;
  evolutionChain?: EvolutionChain;

  pokemon$ = this.activatedRoute.data.pipe(
    map(({pokemon}) => {
      return pokemon;
    }),
    tap((pokemon) => {
      this.pokemon = pokemon;
    })
  );

  types$ = this.pokemon$.pipe(
    switchMap((pokemon: PokemonExtended) => {
      return pokemon.types.map(type => type.type.name);
    }),
    mergeMap((typeName) => {
      return this.pokemonService.getTypeByNameOrId$(typeName).pipe(takeUntilDestroyed(this.destroyRef));
    }),
    tap((type) => {
      this.types[type.name] = type;
    })
  );

  abilities$ = this.pokemon$.pipe(
    switchMap((pokemon: PokemonExtended) => {
      return pokemon.abilities.map(ability => ability.ability.name);
    }),
    mergeMap((abilityName) => {
      return this.pokemonService.getAbilityByNameOrId$(abilityName).pipe(takeUntilDestroyed(this.destroyRef));
    }),
    tap((ability) => {
      this.abilities[ability.name] = ability;
    })
  );

  species$ = this.pokemon$.pipe(
    switchMap((pokemon: PokemonExtended) => {
      return this.pokemonService.getSpeciesByNameOrId$(pokemon.species.name).pipe(takeUntilDestroyed(this.destroyRef));
    }),
    tap((species) => {
      this.species = species;
    }),
    switchMap((species) => {
      const id = species.evolution_chain.url.split("/").filter(x => x).pop();
      if (id)
        return this.pokemonService.getEvolutionChainById$(+id).pipe(takeUntilDestroyed(this.destroyRef));
      else
        return EMPTY;
    }),
    tap((evolutionChain) => {
      this.evolutionChain = evolutionChain;
    })
  );

  ngOnInit(): void {
    merge(this.types$, this.abilities$, this.species$).pipe(
      tap(() => {
        this.changeDetectorRef.markForCheck();
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  protected readonly LANGUAGE = LANGUAGE;
  protected readonly DEFAULT_PATH = DEFAULT_PATH;
}
