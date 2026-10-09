import { Component, inject, input, output } from '@angular/core';
import { YogaClassesFilter } from '../../yoga-classes-filter-component/yoga-classes-filter/yoga-classes-filter';
import { challengeLevels, durations } from '../../yoga-class-details-component/yoga-class-details/yoga-styles-data';
import { FilterChange } from '../../filter-change-data';
import { YogaClassesService } from '../../../services/yoga-classes-service';

@Component({
  selector: 'app-main-filter',
  imports: [YogaClassesFilter],
  templateUrl: './main-filter.html',
  styleUrl: './main-filter.css',
})
export class MainFilter {
  private yogaService = inject(YogaClassesService);
  durations = durations;
  challengeLevels = challengeLevels;
  existingFilters = new Map<string, FilterChange[]>();
  readonly selectedStyleId = input<string>();
  readonly selectedFilters = output<FilterChange[]>();
  
  onFilterChange(changed: FilterChange, filter: string) {
      const filters = this.existingFilters.get(filter);
      if (filters) {
        if (changed.checked == false)
          this.existingFilters.set(
            filter,
            filters.filter((currentFilter) => currentFilter.filterOption !== changed.filterOption)
          );
        else
          filters.push(changed);
      }
      else if (changed.checked == true)
        this.existingFilters.set(filter, [changed])

      this.selectedFilters.emit([...this.existingFilters.values()].flat());


    }
  
    protected clearFilters(): void {
      this.existingFilters.clear();
      this.selectedFilters.emit([]);
    }
  
}
