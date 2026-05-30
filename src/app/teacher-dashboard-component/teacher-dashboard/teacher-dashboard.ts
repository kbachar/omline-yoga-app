import { Component, EnvironmentInjector, inject, runInInjectionContext } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Auth, authState } from '@angular/fire/auth';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { Router, RouterOutlet } from '@angular/router';
import { from, map, of, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-teacher-dashboard',
  imports: [RouterOutlet, AsyncPipe],
  templateUrl: './teacher-dashboard.html',
  styleUrl: './teacher-dashboard.css',
})
export class TeacherDashboard {
  private readonly router = inject(Router);
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private readonly injector = inject(EnvironmentInjector);
  private authService = inject(AuthService);

  user$ = runInInjectionContext(this.injector, () => authState(this.auth));
  profile$ = this.user$.pipe(
    switchMap(user => {
      if (!user) return of(null);

      return from(
        runInInjectionContext(this.injector, () => getDoc(doc(this.firestore, `users/${user.uid}`)))
      ).pipe(
        map(snapshot => (snapshot.exists() ? snapshot.data() : null))
      );
    })
  );

  async logout() {
    await this.authService.logout();
    this.home();

  }
  protected home(): void {
    this.router.navigate(['']);
  }

}
