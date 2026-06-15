import { Component, input } from '@angular/core';

@Component({
  selector: 'app-select-list',
  imports: [],
  templateUrl: './select-list.html',
  styleUrl: './select-list.css',
})
export class SelectList {
  readonly selectName = input<string | null>(null);
  readonly inputValue = input<string | null>(null);
  readonly options = input<string[] | null>(null);
  
  onSelectChange(event: Event) {

  }
}
