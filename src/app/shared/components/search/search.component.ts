import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit
} from "@angular/core";
import {MatButton, MatFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {catchError, debounceTime, distinctUntilChanged, filter, map, of, switchMap, tap} from "rxjs";
import {DEFAULT_PATH, SEARCH_DEBOUNCE_TIME, WHITESPACE_REG_EXP} from "../../../core/constants/app";
import {PokeApiService} from "../../services/poke-api.service";
import {PokemonExtended} from "../../models/pokemon";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {CardComponent} from "../card/card.component";
import {MatError, MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {RouterLink} from "@angular/router";
import {MatProgressBar} from "@angular/material/progress-bar";
import {SEARCH_REG_EXP} from "../../constants/pokemon";

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnDestroy {
  matDialog = inject(MatDialog);

  ngOnDestroy(): void {
    this.matDialog.closeAll();
  }

  openSearchDialog(): void {
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
    MatError,
    RouterLink,
    MatDialogClose,
    MatButton,
    MatDialogActions,
    MatProgressBar
  ],
  templateUrl: "./search.component.html",
  styleUrl: "./search.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchDialogComponent implements OnInit {
  pokeApiService = inject(PokeApiService);
  changeDetectorRef = inject(ChangeDetectorRef);
  destroyRef = inject(DestroyRef);

  formControl = new FormBuilder().control("", {nonNullable: true});
  pokemon?: PokemonExtended;
  loading = false;

  protected readonly DEFAULT_PATH = DEFAULT_PATH;

  formControlValueChanges$ = this.formControl.valueChanges.pipe(
    tap(() => this.formControl.setErrors(null)),
    debounceTime(SEARCH_DEBOUNCE_TIME),
    // TODO: form control validator too
    filter((value) => SEARCH_REG_EXP.test(value)),
    // transform to valid params
    map((value) => {
      const handleNumber = (val: string): string => !isNaN(+val)
        ? (+val).toString()
        : val.trim().toLowerCase().replace(WHITESPACE_REG_EXP, "-");
      return value.startsWith("#") ? handleNumber(value.slice(1)) : handleNumber(value);
    }),
    distinctUntilChanged(),
    tap(() => {
      this.loading = true;
      this.changeDetectorRef.markForCheck();
    }),
    switchMap((value) => this.pokeApiService.getPokemonByNameOrId$(value, {loading: true, error: true}).pipe(
      catchError(() => {
        this.formControl.setErrors({});
        return of(undefined);
      })
    )),
    tap((pokemon) => {
      this.pokemon = pokemon;
      this.loading = false;
    }),
  );

  ngOnInit(): void {
    this.formControlValueChanges$.pipe(
      tap(() => {
        this.changeDetectorRef.markForCheck();
      }),
      takeUntilDestroyed(this.destroyRef)).subscribe();
  }
}
