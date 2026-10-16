import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-text-box',
  imports: [],
  templateUrl: './text-box.html',
  styleUrl: './text-box.css',
})
export class TextBox {
  readonly inputValue = input<string | null>(null);
  readonly placeholderValue = input<string | null>(null);
  readonly inputType = input<string>('text');
  readonly readonly = input<boolean>();
  readonly textBoxWidth = input<number>();
  readonly textChange = output<string>();
  readonly passwordVisible = signal(false);
  readonly backgroundColor = input<string>();

  onTextChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.textChange.emit(value);
  }

  showPassword(event: PointerEvent): void {
    const control = event.currentTarget;
    if (event.button !== 0 || !(control instanceof HTMLElement)) {
      return;
    }

    event.preventDefault();
    control.setPointerCapture(event.pointerId);
    this.passwordVisible.set(true);
  }

  hidePassword(event?: PointerEvent): void {
    const control = event?.currentTarget;
    if (event && control instanceof HTMLElement && control.hasPointerCapture(event.pointerId)) {
      control.releasePointerCapture(event.pointerId);
    }

    this.passwordVisible.set(false);
  }

  showPasswordWithKeyboard(event: KeyboardEvent): void {
    if (event.key !== ' ' && event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    this.passwordVisible.set(true);
  }

  hidePasswordWithKeyboard(event: KeyboardEvent): void {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.passwordVisible.set(false);
    }
  }
}
