import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-view-edit-button',
  imports: [],
  templateUrl: './view-edit-button.html',
  styleUrl: './view-edit-button.css',
})
export class ViewEditButton {
  readonly viewEditButtonClick = output<void>();
  isHovered = false;

  setImageHovered(hovered: boolean) {
    this.isHovered = hovered;
  }

}
