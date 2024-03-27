import {Pipe, PipeTransform} from "@angular/core";
import {Nil} from "../../core/models/app";
import {DASH_REG_EXP} from "../../core/constants/app";

@Pipe({
  name: "replace",
  standalone: true
})
export class ReplacePipe implements PipeTransform {
  transform(value: Nil<string>, regExp: RegExp = DASH_REG_EXP, replacement: string = " "): Nil<string> {
    return typeof value === "string"
      ? value.replace(regExp, replacement)
      : value;
  }
}
