import { Component, input } from '@angular/core';

@Component({
  selector: 'app-text-box',
  imports: [],
  templateUrl: './text-box.html',
  styleUrl: './text-box.css',
})
export class TextBox {
  readonly inputValue = input<string | null>(null);
  readonly placeholderValue = input<string | null>(null);
  readonly inputType = input<string>('text');
  readonly readonly = input<boolean>();

}
