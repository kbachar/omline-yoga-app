import { Component, inject, signal } from '@angular/core';
import { MainHeader } from '../../main-header-component/main-header/main-header';
import { Teacher, TeacherFormData } from '../../teacher-component/teacher/teacher';
import { addDoc, collection, Firestore, serverTimestamp } from '@angular/fire/firestore';
import { SubscribeThanks } from "../../subscribe-thanks-component/subscribe-thanks/subscribe-thanks";

@Component({
  selector: 'app-teacher-subscribe-page',
  imports: [MainHeader, Teacher, SubscribeThanks],
  templateUrl: './teacher-subscribe-page.html',
  styleUrl: './teacher-subscribe-page.css',
})
export class TeacherSubscribePage {
  protected readonly isThanksModalOpen = signal(false);
  protected readonly isSubscribeHovered = signal(false);
  private firestore = inject(Firestore);
  protected teacherFormData: TeacherFormData = {
    fullName: '',
    yogaStyle: '',
    email: '',
    website: '',
    country: '',
    message: ''
  };

  constructor() {
    this.isThanksModalOpen.set(false);
  }

  protected setSubscribeHovered(isHovered: boolean): void {
    this.isSubscribeHovered.set(isHovered);
  }

  protected subscribeButtonSrc(): string {
    return this.isSubscribeHovered()
      ? '/assets/images/subscribe-btn2.png'
      : '/assets/images/subscribe-btn1.png';
  }

  protected async subscribe() {
    const teacherInvitesRef = collection(
      this.firestore,
      'teacherInvites'
    );

    const invitePayload = {
      ...this.teacherFormData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    console.log('Teacher invite payload:', invitePayload);
    console.table(invitePayload);

    const inviteRef = await addDoc(teacherInvitesRef, invitePayload);
    console.log('Teacher invite created with id:', inviteRef.id);
    this.isThanksModalOpen.set(true);
    return inviteRef;
  }

  protected onTeacherDataChange(data: TeacherFormData): void {
    this.teacherFormData = data;
  }

  protected closeThanksModal() {
    this.isThanksModalOpen.set(false);
  }
}
