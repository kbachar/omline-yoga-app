import { Component, computed, effect, EnvironmentInjector, inject, runInInjectionContext, signal } from '@angular/core';
import { MainHeader } from '../../main-header-component/main-header/main-header';
import { Teacher } from '../../shared/teacher-component/teacher/teacher';
import { YogaTeacher } from '../../shared/yoga-teacher-data';
import { doc, Firestore, getDoc, serverTimestamp, setDoc } from '@angular/fire/firestore';
import { SubscribeThanks } from "../../subscribe-thanks-component/subscribe-thanks/subscribe-thanks";
import { Auth, authState, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { from, map, of, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

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
  protected yogaTeacherData: YogaTeacher = {
    fullName: '',
    yogaStyle: [],
    email: '',
    website: '',
    country: '',
    teacherID: '',
    status: ''
  };

  private auth = inject(Auth);

  readonly user = toSignal(
    runInInjectionContext(this.injector, () => authState(this.auth)),
    { initialValue: null }
  );

  readonly isLoggedUser = computed(() => this.user() !== null);
  password: string = '';

  constructor() {
    effect(() => {
      const isLoggedIn = this.isLoggedUser();
      console.log('isLoggedUser:', isLoggedIn);
      if (isLoggedIn) {
        this.isThanksModalOpen.set(true);
      }
    });
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
    await runInInjectionContext(this.injector, async () => {
      const credential = await createUserWithEmailAndPassword(
        this.auth,
        this.yogaTeacherData.email,
        this.password
      );

      console.log(credential.user.uid);

      await runInInjectionContext(this.injector, () =>
        setDoc(
          doc(this.firestore, `users/${credential.user.uid}`),
          {
            Name: this.yogaTeacherData?.fullName,
            role: 'teacher',
            isAdmin: false
          }
        )
      );

      await runInInjectionContext(this.injector, async () => {
        //const { password: _password, ...teacherFormDataWithoutPassword } = this.yogaTeacherData;

        const teacherPayload = {
          password: '',
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
