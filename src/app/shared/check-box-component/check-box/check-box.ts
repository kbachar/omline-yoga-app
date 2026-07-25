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
  readonly checkValue = output<string>();
  readonly checkChange = output<boolean>();

  onCheckChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    const checked = target.checked;
    this.checkValue.emit(value);
    this.checkChange.emit(checked);

  }
}
