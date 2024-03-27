import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {MatProgressBar} from "@angular/material/progress-bar";
import {LoadingService} from "../../services/loading.service";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: "app-loading",
  standalone: true,
  imports: [
    MatProgressBar,
    AsyncPipe
  ],
  templateUrl: "./loading.component.html",
  styleUrl: "./loading.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingComponent {
  loadingService = inject(LoadingService);
}
