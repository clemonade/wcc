import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {map} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {DEFAULT_PATH, NAVIGATE_STATE_ERROR_MESSAGE} from "../../constants/app";
import {MatButton} from "@angular/material/button";

@Component({
  selector: "app-error",
  standalone: true,
  imports: [
    AsyncPipe,
    MatButton,
    RouterLink
  ],
  templateUrl: "./error.component.html",
  styleUrl: "./error.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorComponent {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  protected readonly DEFAULT_PATH = DEFAULT_PATH;

  errorMessage$ = this.activatedRoute.data.pipe(
    map((data) => {
      return this.router.lastSuccessfulNavigation?.extras?.state?.[NAVIGATE_STATE_ERROR_MESSAGE] ?? data[NAVIGATE_STATE_ERROR_MESSAGE];
    }),
  );
}
