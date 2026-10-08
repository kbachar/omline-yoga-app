import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-message-component',
  imports: [],
  templateUrl: './message-component.html',
  styleUrl: './message-component.css',
})
export class MessageComponent {
  readonly isOpen = input(false);
  readonly border = input<string>();
  public messageClick = output<boolean>();
  public messageText = input<string>();
  readonly yesButton = input(false);
  readonly noButton = input(false);
  readonly okButton = input(false);

  onClick(remove: boolean) {
    this.messageClick.emit(remove);
  }
}
