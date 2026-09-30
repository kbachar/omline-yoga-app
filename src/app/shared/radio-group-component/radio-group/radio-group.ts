import { Component, input, output } from '@angular/core';
import { FilterChange } from '../../filter-change-data';

@Component({
  selector: 'app-radio-group',
  imports: [],
  templateUrl: './radio-group.html',
  styleUrl: './radio-group.css',
})
export class RadioGroup {
  readonly radioNames = input<string[]>([]);
  readonly selectedRadio = input<string>();
  readonly selectedOptionChange = output<FilterChange>();

  radioChanged(element: Event, radioName: string) {
    const target = element.target as HTMLInputElement;
    const checked = target.checked;
    this.selectedOptionChange.emit({
      checked,
      filterOption: radioName,
      filter: radioName
    });
  }
}
