import { Component, signal } from '@angular/core';
import { MainHeader } from '../../main-header-component/main-header/main-header';
import { Teacher } from "../../teacher-component/teacher/teacher";

@Component({
  selector: 'app-teacher-subscribe-page',
  imports: [MainHeader, Teacher],
  templateUrl: './teacher-subscribe-page.html',
  styleUrl: './teacher-subscribe-page.css',
})
export class TeacherSubscribePage {
  protected readonly isSubscribeHovered = signal(false);

  protected setSubscribeHovered(isHovered: boolean): void {
    this.isSubscribeHovered.set(isHovered);
  }

  protected subscribeButtonSrc(): string {
    return this.isSubscribeHovered()
      ? '/assets/images/subscribe-btn2.png'
      : '/assets/images/subscribe-btn1.png';
  }
}
