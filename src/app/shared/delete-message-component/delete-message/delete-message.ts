import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-delete-message',
  imports: [],
  templateUrl: './delete-message.html',
  styleUrl: './delete-message.css',
})
export class DeleteMessage {
  readonly isOpen = input(false);
  public messageClick = output<boolean>();
  public itemName = input<string>();

  onClick(remove: boolean) {
    this.messageClick.emit(remove);
  }
}
