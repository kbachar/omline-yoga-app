import { Component, EnvironmentInjector, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Teacher } from '../../shared/teacher-component/teacher/teacher';
import { YogaTeacher } from '../../shared/yoga-teacher-data';
import { SubscribeThanks } from "../../subscribe-thanks-component/subscribe-thanks/subscribe-thanks";
import { AuthService } from '../../services/auth-service';
import { InnerHeader } from '../../shared/inner-header-component/inner-header/inner-header';

@Component({
  selector: 'app-teacher-subscribe-page',
  imports: [ Teacher, SubscribeThanks, AsyncPipe, InnerHeader],
  templateUrl: './teacher-subscribe-page.html',
  styleUrl: './teacher-subscribe-page.css',
})
export class TeacherSubscribePage {
  protected readonly isThanksModalOpen = signal(false);
  protected readonly isSubscribeHovered = signal(false);
  private readonly injector = inject(EnvironmentInjector);
  protected yogaTeacherData: YogaTeacher = {
    fullName: '',
    yogaStyle: [],
    email: '',
    website: '',
    country: '',
    teacherID: '',
    status: '',
    photo: '',
    description: '',
    approved: false
  };

  private authService = inject(AuthService);
  role$ = this.authService.getUserRole();
  password: string = '';

  protected setSubscribeHovered(isHovered: boolean): void {
    this.isSubscribeHovered.set(isHovered);
  }

  protected subscribeButtonSrc(): string {
    return this.isSubscribeHovered()
      ? '/assets/images/subscribe-btn2.png'
      : '/assets/images/subscribe-btn1.png';
  }

  protected async subscribe() {
    await this.authService.subscribe(this.yogaTeacherData?.fullName, this.yogaTeacherData?.email, this.password, 'teacher');
  }

  protected onTeacherDataChange(data: YogaTeacher): void {
    this.yogaTeacherData = data;
  }

  protected onPasswordChange(password: string) {
    this.password = password;
  }

  protected closeThanksModal() {
    this.isThanksModalOpen.set(false);
  }
}
