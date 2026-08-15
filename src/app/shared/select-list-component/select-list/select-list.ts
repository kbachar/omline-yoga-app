import { Component, input, output } from '@angular/core';

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
  readonly selectedOption = output<string>();
  
  onSelectChange(selectedOption: Event) {
    const value = (selectedOption.target as HTMLInputElement).value;
    this.selectedOption.emit(value);
  }
}
