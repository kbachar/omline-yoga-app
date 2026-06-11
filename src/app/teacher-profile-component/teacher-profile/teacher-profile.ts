import { Component, computed, EnvironmentInjector, inject, runInInjectionContext } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Auth, authState } from '@angular/fire/auth';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { Teacher } from '../../shared/teacher-component/teacher/teacher';
import { TeacherFormData } from '../../shared/teacher-form-data';
import { from, map, of, switchMap } from 'rxjs';


@Component({
  selector: 'app-teacher-profile',
  imports: [Teacher],
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

  readonly profileData = computed<TeacherFormData>(() => {
    const profile = this.rawProfileData();

    return {
      fullName: typeof profile?.['fullName'] === 'string' ? profile['fullName'] : '',
      yogaStyle: typeof profile?.['yogaStyle'] === 'string' ? profile['yogaStyle'] : '',
      email: typeof profile?.['email'] === 'string' ? profile['email'] : '',
      website: typeof profile?.['website'] === 'string' ? profile['website'] : '',
      country: typeof profile?.['country'] === 'string' ? profile['country'] : '',
      password: '',
      teacherID: typeof profile?.['teacherID'] === 'string' ? profile['teacherID'] : ''
    };
  });
}
