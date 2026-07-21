import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-delete-class-message',
  imports: [],
  templateUrl: './delete-class-message.html',
  styleUrl: './delete-class-message.css',
})
export class DeleteClassMessage {
  readonly isOpen = input(false);
  public Click = output<boolean>();

  onClick(remove: boolean) {
    this.Click.emit(remove);
  }
}
