import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: "replace",
  standalone: true
})
export class ReplacePipe implements PipeTransform {
  transform(value: string | null | undefined, regExp: RegExp = /-/g, replacement: string = " "): string | null | undefined {
    if (typeof value === "string")
      return value.replace(regExp, replacement);
    return value;
  }

}
