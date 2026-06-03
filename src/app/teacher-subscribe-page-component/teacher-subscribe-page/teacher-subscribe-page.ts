import { Component, EnvironmentInjector, inject, runInInjectionContext, signal } from '@angular/core';
import { MainHeader } from '../../main-header-component/main-header/main-header';
import { Teacher, TeacherFormData } from '../../teacher-component/teacher/teacher';
import { doc, Firestore, serverTimestamp, setDoc } from '@angular/fire/firestore';
import { SubscribeThanks } from "../../subscribe-thanks-component/subscribe-thanks/subscribe-thanks";
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-teacher-subscribe-page',
  imports: [MainHeader, Teacher, SubscribeThanks],
  templateUrl: './teacher-subscribe-page.html',
  styleUrl: './teacher-subscribe-page.css',
})
export class TeacherSubscribePage {
  protected readonly isThanksModalOpen = signal(false);
  protected readonly isSubscribeHovered = signal(false);
  private readonly injector = inject(EnvironmentInjector);
  private firestore = inject(Firestore);
  protected teacherFormData: TeacherFormData = {
    fullName: '',
    yogaStyle: '',
    email: '',
    website: '',
    country: '',
    password: '',
    message: ''
  };

  private auth = inject(Auth);

  protected setSubscribeHovered(isHovered: boolean): void {
    this.isSubscribeHovered.set(isHovered);
  }

  protected subscribeButtonSrc(): string {
    return this.isSubscribeHovered()
      ? '/assets/images/subscribe-btn2.png'
      : '/assets/images/subscribe-btn1.png';
  }

  protected async subscribe() {
    await runInInjectionContext(this.injector, async () => {
      const credential = await createUserWithEmailAndPassword(
        this.auth,
        this.teacherFormData.email,
        this.teacherFormData.password
      );

      console.log(credential.user.uid);

      await runInInjectionContext(this.injector, () =>
        setDoc(
          doc(this.firestore, `users/${credential.user.uid}`),
          {
            Name: this.teacherFormData.fullName,
            role: 'teacher',
            isAdmin: false
          }
        )
      );

      await runInInjectionContext(this.injector, async () => {
        const { password: _password, ...teacherFormDataWithoutPassword } = this.teacherFormData;

        const teacherPayload = {
          ...teacherFormDataWithoutPassword,
          userId: credential.user.uid,
          status: 'pending',
          createdAt: serverTimestamp()
        };

        console.log('Teacher invite payload:', teacherPayload);
        console.table(teacherPayload);

        await setDoc(
          doc(this.firestore, `teachers/${credential.user.uid}`),
          teacherPayload,
          { merge: true }
        );
        console.log('Teacher record created/updated with user id:', credential.user.uid);
        this.isThanksModalOpen.set(true);
      });
    });
  }

  protected onTeacherDataChange(data: TeacherFormData): void {
    this.teacherFormData = data;
  }

  protected closeThanksModal() {
    this.isThanksModalOpen.set(false);
  }
}
