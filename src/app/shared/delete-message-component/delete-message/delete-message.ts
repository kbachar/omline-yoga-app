import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-delete-message',
  imports: [],
  templateUrl: './delete-message.html',
  styleUrl: './delete-message.css',
})
export class DeleteMessage {
  readonly isOpen = input(false);
  public Click = output<boolean>();

  onClick(remove: boolean) {
    this.Click.emit(remove);
  }
}
