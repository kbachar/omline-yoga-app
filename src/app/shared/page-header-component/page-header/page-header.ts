import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-page-header',
  imports: [],
  templateUrl: './page-header.html',
  styleUrl: './page-header.css',
})
export class PageHeader {
  readonly buttonText = input<string>('');
  readonly headerText = input<string>('');
  public buttonClick = output<void>();

  onButtonClick(): void {
    this.buttonClick.emit();
  }
}
