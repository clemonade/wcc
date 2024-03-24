import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {PokemonExtended} from "../../models/pokemon";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatCardTitleGroup} from "@angular/material/card";
import {STAT_MAP, TYPE_MAP} from "../../constants/pokemon";
import {DecimalPipe, SlicePipe, TitleCasePipe} from "@angular/common";
import {ReplacePipe} from "../../pipes/replace.pipe";

@Component({
  selector: "app-card",
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatCardTitleGroup,
    TitleCasePipe,
    SlicePipe,
    ReplacePipe,
    DecimalPipe,
  ],
  templateUrl: "./card.component.html",
  styleUrl: "./card.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  @Input() pokemon?: PokemonExtended;
  commaRegExp = /[,]/g;
  protected readonly STAT_LABELS = STAT_MAP;
  protected readonly TYPE_MAP = TYPE_MAP;
}
