import { Component, EnvironmentInjector, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MainHeader } from '../../main-header-component/main-header/main-header';
import { Teacher } from '../../shared/teacher-component/teacher/teacher';
import { YogaTeacher } from '../../shared/yoga-teacher-data';
import { Firestore } from '@angular/fire/firestore';
import { SubscribeThanks } from "../../subscribe-thanks-component/subscribe-thanks/subscribe-thanks";
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-teacher-subscribe-page',
  imports: [MainHeader, Teacher, SubscribeThanks, AsyncPipe],
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
    description: ''
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
