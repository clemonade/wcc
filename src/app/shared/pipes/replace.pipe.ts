import {Pipe, PipeTransform} from "@angular/core";
import {DASH_REG_EXP} from "../constants/utils";

@Pipe({
  name: "replace",
  standalone: true
})
export class ReplacePipe implements PipeTransform {
  transform(value: string | null | undefined, regExp: RegExp = DASH_REG_EXP, replacement: string = " "): string | null | undefined {
    if (typeof value === "string")
      return value.replace(regExp, replacement);
    return value;
  }

}
