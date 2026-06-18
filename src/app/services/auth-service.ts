import { EnvironmentInjector, inject, Injectable, runInInjectionContext } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { doc, Firestore, getDoc, serverTimestamp, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { from, map, of, switchMap } from 'rxjs';
import { UserProfile } from '../shared/user-profile-data';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private readonly injector = inject(EnvironmentInjector);

  user$ = runInInjectionContext(this.injector, () => authState(this.auth));

  async login(email: string, password: string) {
    console.log("log in")
    return runInInjectionContext(this.injector, () =>
      signInWithEmailAndPassword(this.auth, email, password)
    );
  }

  async logout() {
    return runInInjectionContext(this.injector, () => signOut(this.auth));
  }

  async subscribe(fullName:string, email: string, password: string, role: string) {
    await runInInjectionContext(this.injector, async () => {
      const credential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      await runInInjectionContext(this.injector, () =>
        setDoc(
          doc(this.firestore, `users/${credential.user.uid}`),
          {
            Name: fullName,
            role: role,
            isAdmin: false
          }
        )
      );

      await runInInjectionContext(this.injector, async () => {
        const teacherPayload = {
          password: password,
          userId: credential.user.uid,
          status: 'pending',
          createdAt: serverTimestamp()
        };

        console.table(teacherPayload);

        await setDoc(
          doc(this.firestore, `teachers/${credential.user.uid}`),
          teacherPayload,
          { merge: true }
        );
      });
    });
  }

  async createUserProfile(user: User) {
    await runInInjectionContext(this.injector, () => {
      const ref = doc(this.firestore, `users/${user.uid}`);

      return setDoc(ref, {
        uid: user.uid,
        email: user.email,
        roles: {
          student: true,
          teacher: false,
          admin: false,
        },
        createdAt: serverTimestamp(),
      }, { merge: true });
    });
  }

  getUserProfile(uid: string) {
    return from(
      runInInjectionContext(this.injector, () => getDoc(doc(this.firestore, `users/${uid}`)))
    ).pipe(
      map((snapshot) => {
        return snapshot.exists() ? (snapshot.data() as Record<string, unknown>) : null;
      })
    );
  }

  getUserRole(): Observable<string> {
    return authState(this.auth).pipe(
      switchMap(user => {
        if (!user) {
          return of('');
        }

        return from(
          runInInjectionContext(this.injector, () =>
            getDoc(doc(this.firestore, `users/${user.uid}`))
          )
        ).pipe(
          map((snapshot) => {
            if (!snapshot.exists()) {
              return '';
            }

            const data = snapshot.data() as Record<string, unknown>;
            return typeof data['role'] === 'string' ? data['role'] : '';
          })
        );
      })
    );
  }
}
