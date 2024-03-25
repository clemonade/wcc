import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {ReplacePipe} from "../../pipes/replace.pipe";
import {TitleCasePipe} from "@angular/common";

@Component({
  selector: "app-tag",
  standalone: true,
  imports: [
    ReplacePipe,
    TitleCasePipe
  ],
  templateUrl: "./tag.component.html",
  styleUrl: "./tag.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagComponent {
  @Input() text?: string;
  @Input() textColor: string = "text-black";
  @Input() backgroundColor: string = "bg-gray-200";
}
