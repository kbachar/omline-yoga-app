import { Component, Input, input } from '@angular/core';
import { CheckBox } from "../../check-box-component/check-box/check-box";

@Component({
  selector: 'app-filter',
  imports: [CheckBox],
  templateUrl: './filter.html',
  styleUrl: './filter.css',
})
export class Filter {
  readonly inputValue = input<string | null>(null);
  @Input() checkBoxes: string[] = [];

}
