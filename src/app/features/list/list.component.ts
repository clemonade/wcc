import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewChild
} from '@angular/core';
import {PokemonService} from "../../shared/services/pokemon.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {NamedAPIResource} from "pokenode-ts";
import {
  BehaviorSubject,
  concatMap,
  debounceTime,
  distinct,
  fromEvent,
  map,
  merge,
  mergeMap,
  switchMap,
  tap
} from "rxjs";
import {PokemonExtended} from "../../shared/models/pokemon";
import {CardComponent} from "../../shared/components/card/card.component";
import {CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport} from "@angular/cdk/scrolling";
import {CARD_GAP_PX, CARD_GAP_TAILWIND_CSS, CARD_HEIGHT_PX, CARD_WIDTH_PX} from "../../core/constants/pokemon";

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CardComponent,
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf
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
  chunkedPokemons: NamedAPIResource[][] = [];
  pokedex: Record<string, PokemonExtended> = {};

  offset = new BehaviorSubject(0);
  limit = 20;
  end = false;

  protected readonly CARD_HEIGHT_PX = CARD_HEIGHT_PX;
  protected readonly CARD_GAP_TAILWIND_CSS = CARD_GAP_TAILWIND_CSS;

  // TODO: add documentation
  pokemons$ = this.offset.pipe(
    distinct(),
    concatMap((offset) => {
      return this.pokemonService.getPokemons$({offset, limit: this.limit})
    }),
    tap(({results, count}) => {
      this.pokemons = [...this.pokemons, ...results];
      this.chunkPokemons(); // TODO: chunk result only and merge instead
      this.end = this.offset.value >= count;
    }),
    switchMap(({results}) => {
      return results.map(pokemon => pokemon.name)
    }),
    mergeMap(name => this.pokemonService.getPokemonByNameOrId$(name).pipe(takeUntilDestroyed(this.destroyRef))),
    tap((pokemon) => {
      this.pokedex[pokemon.name] = pokemon;
    })
  );

  windowResize$ = fromEvent(window, 'resize').pipe(
    debounceTime(1000),
    map(() => {
      return this.getMaxCardsPerRow();
    }),
    distinct(),
    tap(() => {
      this.chunkPokemons();
    })
  )

  @ViewChild(CdkVirtualScrollViewport)
  cdkVirtualScrollViewport!: CdkVirtualScrollViewport;

  ngOnInit(): void {
    merge(this.pokemons$, this.windowResize$).pipe(
      tap(() => {
        this.changeDetectorRef.markForCheck()
      }),
      takeUntilDestroyed(this.destroyRef)).subscribe()
  }

  scrollIndexChanged(): void {
    if (this.end) {
      return;
    }
    const end = this.cdkVirtualScrollViewport.getRenderedRange().end;
    const total = this.cdkVirtualScrollViewport.getDataLength();
    if (end === total) {
      this.offset.next(this.offset.value + this.limit);
    }
  }

  chunkPokemons(): void {
    const maxCardsPerRow = this.getMaxCardsPerRow();
    this.chunkedPokemons = this.pokemons.reduce((acc: NamedAPIResource[][], curr: NamedAPIResource, index: number) => {
      if (index % maxCardsPerRow === 0) acc.push([curr]);
      else acc[acc.length - 1].push(curr);
      return acc;
    }, []);
  }

  getMaxCardsPerRow(): number {
    const cardsPerRow = Math.floor(window.innerWidth / CARD_WIDTH_PX);
    const cardsPerRowWithGap = Math.floor((window.innerWidth - ((cardsPerRow - 1) * CARD_GAP_PX)) / CARD_WIDTH_PX);
    return Math.min(cardsPerRow, cardsPerRowWithGap);
  }

  trackByIndex = (index: number) => index;
}
