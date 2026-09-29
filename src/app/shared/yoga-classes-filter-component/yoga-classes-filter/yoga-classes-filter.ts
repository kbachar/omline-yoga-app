import { Component, input, output, signal } from '@angular/core';
import { CheckBox } from "../../check-box-component/check-box/check-box";
import { FilterChange } from '../../filter-change-data';


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
  readonly savedOptions = input<FilterChange[]>();
  readonly readOnly = input<boolean>(false);
  readonly selectedOption = signal<string>('');

  readonly filterChange = output<FilterChange>();

  isOptionSaved(filterOption: string): boolean {
    return this.savedOption() === filterOption ||
      (this.savedOptions()?.some((savedFilter) =>
        savedFilter.checked && savedFilter.filterOption === filterOption
      ) ?? false);
  }

  onFilterChange(filterOption: string, checked: boolean) {
    const filter = this.filterName();

    this.filterChange.emit({
      checked,
      filterOption,
      filter: filter ?? ''
    });
    this.selectedOption.set(filterOption)
  }

}
