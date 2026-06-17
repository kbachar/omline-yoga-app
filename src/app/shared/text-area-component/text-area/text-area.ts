import { Component, input } from '@angular/core';

@Component({
  selector: 'app-text-area',
  imports: [],
  templateUrl: './text-area.html',
  styleUrl: './text-area.css',
})
export class TextArea {
  readonly textAreaName = input<string | null>(null);

}
