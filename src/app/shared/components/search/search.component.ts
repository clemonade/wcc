import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit
} from "@angular/core";
import {MatFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatDialog, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {catchError, debounceTime, distinctUntilChanged, filter, of, switchMap, tap} from "rxjs";
import {DEFAULT_PATH, SEARCH_DEBOUNCE_TIME} from "../../../core/constants/app";
import {PokeApiService} from "../../services/poke-api.service";
import {PokemonExtended} from "../../models/pokemon";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {CardComponent} from "../card/card.component";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {RouterLink} from "@angular/router";

@Component({
  selector: "app-search",
  standalone: true,
  imports: [
    MatFabButton,
    MatIcon
  ],
  template: `
    <div class="fixed bottom-4 right-4 z-50">
      <button mat-fab (click)="openSearchDialog()">
        <mat-icon fontIcon="search"></mat-icon>
      </button>
    </div>
  `,
  styleUrl: "./search.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnDestroy{
  matDialog = inject(MatDialog);

  ngOnDestroy(): void {
    this.matDialog.closeAll();
  }

  openSearchDialog() {
    this.matDialog.open(SearchDialogComponent);
  }
}

@Component({
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    CardComponent,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatFormField,
    RouterLink
  ],
  templateUrl: "./search.component.html",
  styleUrl: "./search.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchDialogComponent implements OnInit {
  pokeApiService = inject(PokeApiService);
  changeDetectorRef = inject(ChangeDetectorRef);
  destroyRef = inject(DestroyRef);

  formControl = new FormBuilder().control("");
  pokemon?: PokemonExtended;

  protected readonly DEFAULT_PATH = DEFAULT_PATH;

  formControlValueChanges$ = this.formControl.valueChanges.pipe(
    debounceTime(SEARCH_DEBOUNCE_TIME),
    // TODO: map to allow leading zeroes if id, etc.
    distinctUntilChanged(),
    filter((value): value is string => !!value),
    switchMap((value) => this.pokeApiService.getPokemonByNameOrId$(value, true).pipe(
      catchError(() => of(undefined))
    )),
    tap((pokemon) => this.pokemon = pokemon),
  );

  ngOnInit(): void {
    this.formControlValueChanges$.pipe(
      tap(() => {
        this.changeDetectorRef.markForCheck();
      }),
      takeUntilDestroyed(this.destroyRef)).subscribe();
  }
}
