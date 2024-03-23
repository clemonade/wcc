import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {PokemonExtended} from "../../models/pokemon";
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
  MatCardTitleGroup
} from "@angular/material/card";
import {MatChip, MatChipSet} from "@angular/material/chips";
import {CARD_HEIGHT_TAILWIND_CSS, CARD_WIDTH_TAILWIND_CSS} from "../../../core/constants/pokemon";

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatCardTitleGroup,
    MatChip,
    MatChipSet,
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  @Input() pokemon?: PokemonExtended;
  protected readonly CARD_WIDTH_TAILWIND_CSS = CARD_WIDTH_TAILWIND_CSS;
  protected readonly CARD_HEIGHT_TAILWIND_CSS = CARD_HEIGHT_TAILWIND_CSS;
}
