import { Component, input, OnInit, output } from '@angular/core';

@Component({
  selector: 'app-select-list',
  imports: [],
  templateUrl: './select-list.html',
  styleUrl: './select-list.css',
})
export class SelectList implements OnInit {
  readonly selectName = input<string | null>(null);
  readonly inputValue = input<string | null>(null);
  readonly options = input<string[] | null>(null);
  readonly selectedOption = output<string>();
  selectedValue = '';

  ngOnInit(): void {
    this.selectedValue = this.inputValue() ?? '';
  }

  onSelectChange(selectedOption: Event) {
    console.log('input value is - ' + this.selectedValue)

    const value = (selectedOption.target as HTMLInputElement).value;
    console.log('selectedValue is - ' + value)

    this.selectedValue = value;
    this.selectedOption.emit(value);
  }
}
