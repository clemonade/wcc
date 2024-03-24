import {ChangeDetectionStrategy, Component} from "@angular/core";
import {RouterOutlet} from "@angular/router";
import {ListComponent} from "./features/list/list.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, ListComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  // title = 'wcc';
}
