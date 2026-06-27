import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-text-area',
  imports: [],
  templateUrl: './text-area.html',
  styleUrl: './text-area.css',
})
export class TextArea {
  readonly textAreaName = input<string | null>(null);
  readonly textValue = input<string>('');
  readonly textValueChange = output<string>();
  readonly textWidth = input<number>();
  readonly textHeight = input<number>();

  protected onInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.textValueChange.emit(value);
  }
}
