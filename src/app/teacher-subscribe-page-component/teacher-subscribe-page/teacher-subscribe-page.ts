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
  private firestore = inject(Firestore);
  protected yogaTeacherData: YogaTeacher = {
    fullName: '',
    yogaStyle: [],
    email: '',
    website: '',
    country: '',
    teacherID: '',
    status: ''
  };

  private authService = inject(AuthService);
  private auth = inject(Auth);

  role$ =  this.authService.getUserRole();
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
    // await runInInjectionContext(this.injector, async () => {
    //   const credential = await createUserWithEmailAndPassword(
    //     this.auth,
    //     this.yogaTeacherData.email,
    //     this.password
    //   );

    //   await runInInjectionContext(this.injector, () =>
    //     setDoc(
    //       doc(this.firestore, `users/${credential.user.uid}`),
    //       {
    //         Name: this.yogaTeacherData?.fullName,
    //         role: 'teacher',
    //         isAdmin: false
    //       }
    //     )
    //   );

    //   await runInInjectionContext(this.injector, async () => {
    //     const teacherPayload = {
    //       password: '',
    //       userId: credential.user.uid,
    //       status: 'pending',
    //       createdAt: serverTimestamp()
    //     };

    //     console.log('Teacher invite payload:', teacherPayload);
    //     console.table(teacherPayload);

    //     await setDoc(
    //       doc(this.firestore, `teachers/${credential.user.uid}`),
    //       teacherPayload,
    //       { merge: true }
    //     );
    //     console.log('Teacher record created/updated with user id:', credential.user.uid);
    //     this.isThanksModalOpen.set(true);
    //   });
    // });
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
