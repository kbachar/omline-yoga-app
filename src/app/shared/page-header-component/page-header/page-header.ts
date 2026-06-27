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
  readonly showBack = input<boolean>(false);
  public buttonClick = output<void>();
  public backToListClick = output<void>();

  onButtonClick(): void {
    this.buttonClick.emit();
  }

  onBackClick() {
    this.backToListClick.emit()
  }
}
