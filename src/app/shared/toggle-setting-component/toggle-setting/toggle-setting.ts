import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-toggle-setting',
  imports: [],
  templateUrl: './toggle-setting.html',
  styleUrl: './toggle-setting.css',
})
export class ToggleSetting {
  readonly labelText = input<string>();
  readonly imageSrc = input<string>();
  readonly toggleImageSrc = input<string>();
  readonly switchState = model<boolean>(false);

  toggleSwitch() {
    this.switchState.update((value) => !value);
  }

}
