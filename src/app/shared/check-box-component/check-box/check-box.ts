import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-check-box',
  imports: [],
  templateUrl: './check-box.html',
  styleUrl: './check-box.css',
})
export class CheckBox {
  readonly inputValue = input<string | null>(null);
  readonly checked = input<boolean>(false);
  readonly checkChange = output<string>();

  onCheckChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.checkChange.emit(value);

  }
}
