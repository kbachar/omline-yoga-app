import { EnvironmentInjector, inject, Injectable, runInInjectionContext } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { doc, Firestore, getDoc, serverTimestamp, setDoc } from '@angular/fire/firestore';
import { from, map } from 'rxjs';

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
}
