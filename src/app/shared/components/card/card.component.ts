import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {PokemonExtended} from "../../models/pokemon";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatCardTitleGroup} from "@angular/material/card";
import {STAT_MAP, TYPE_MAP} from "../../constants/pokemon";
import {DecimalPipe, SlicePipe, TitleCasePipe} from "@angular/common";
import {ReplacePipe} from "../../pipes/replace.pipe";
import {COMMA_REG_EXP} from "../../constants/utils";

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
  protected readonly STAT_MAP = STAT_MAP;
  protected readonly TYPE_MAP = TYPE_MAP;
  protected readonly COMMA_REG_EXP = COMMA_REG_EXP;
}
