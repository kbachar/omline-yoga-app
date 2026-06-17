import { Component, computed, EnvironmentInjector, inject, runInInjectionContext } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Auth, authState } from '@angular/fire/auth';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { Teacher } from '../../shared/teacher-component/teacher/teacher';
import { YogaTeacher } from '../../shared/yoga-teacher-data';
import { from, map, of, switchMap } from 'rxjs';
import { TextArea } from "../../shared/text-area-component/text-area/text-area";


@Component({
  selector: 'app-teacher-profile',
  imports: [Teacher, TextArea],
  templateUrl: './teacher-profile.html',
  styleUrl: './teacher-profile.css',
})
export class TeacherProfile {
  private readonly auth = inject(Auth);
  private readonly firestore = inject(Firestore);
  private readonly injector = inject(EnvironmentInjector);

  private readonly rawProfileData = toSignal(
    authState(this.auth).pipe(
      switchMap((user) => {
        if (!user) {
          return of(null);
        }

        return from(
          runInInjectionContext(this.injector, () => getDoc(doc(this.firestore, `teachers/${user.uid}`)))
        ).pipe(
          map((snapshot) => (snapshot.exists() ? (snapshot.data() as Record<string, unknown>) : null))
        );
      })
    ),
    { initialValue: null }
  );

  

  readonly profileData = computed<YogaTeacher>(() => {
    const profile = this.rawProfileData();

    console.log(profile);
    return {
      fullName: typeof profile?.['fullName'] === 'string' ? profile['fullName'] : '',
      yogaStyle: Array.isArray(profile?.['yogaStyle'])
        ? profile['yogaStyle'].filter((style): style is string => typeof style === 'string')
        : [],
      email: typeof profile?.['email'] === 'string' ? profile['email'] : '',
      website: typeof profile?.['website'] === 'string' ? profile['website'] : '',
      country: typeof profile?.['country'] === 'string' ? profile['country'] : '',
      password: '',
      teacherID: typeof profile?.['teacherID'] === 'string' ? profile['teacherID'] : '',
      status: typeof profile?.['status'] === 'string' ? profile['status'] : ''
    };
  });
}
