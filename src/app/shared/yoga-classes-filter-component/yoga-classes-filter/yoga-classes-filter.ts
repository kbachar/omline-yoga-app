import { Component, input } from '@angular/core';
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
  readonly selectedOptions = input<string[] | null>(null);

  
  constructor() {
    //console.log('filterOptions' + this.filterOptions)
    console.log('selectedOptions - ' + this.selectedOptions()?.includes('Vinyasa'))

  }

}
