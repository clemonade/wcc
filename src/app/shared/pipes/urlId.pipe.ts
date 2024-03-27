import {Pipe, PipeTransform} from "@angular/core";
import {Nil} from "../../core/models/app";

@Pipe({
  name: "urlId",
  standalone: true
})
export class UrlIdPipe implements PipeTransform {
  transform(url: Nil<string>): Nil<string> {
    return typeof url === "string"
      ? url.split("/").filter(s => s).pop()
      : url;
  }
}
