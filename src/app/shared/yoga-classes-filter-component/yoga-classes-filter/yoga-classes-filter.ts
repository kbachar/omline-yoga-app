import { Component, input, output, signal } from '@angular/core';
import { CheckBox } from "../../check-box-component/check-box/check-box";

@Component({
  selector: 'app-yoga-classes-filter',
  imports: [CheckBox],
  templateUrl: './yoga-classes-filter.html',
  styleUrl: './yoga-classes-filter.css',
})
export class YogaClassesFilter {
  readonly filterName = input<string | null>(null);
  readonly filterOptions = input<string[] | null>(null);
  readonly savedOption = input<string>();
  readonly selectedOption = signal<string>('');

  readonly filterChange = output<string>();
  
  onFilterChange(filterOption: string) {
    this.filterChange.emit(filterOption);
    this.selectedOption.set(filterOption)
  }
  
}
