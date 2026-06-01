import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-subscribe-thanks',
  imports: [],
  templateUrl: './subscribe-thanks.html',
  styleUrl: './subscribe-thanks.css',
})
export class SubscribeThanks {
  readonly isOpen = input(false);
    readonly closed = output<void>();

}
