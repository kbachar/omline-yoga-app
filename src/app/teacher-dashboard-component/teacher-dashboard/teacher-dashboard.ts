import { Component, EnvironmentInjector, computed, inject, runInInjectionContext } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Auth, authState } from '@angular/fire/auth';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { NavigationEnd, Router, RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, from, map, of, startWith, switchMap, tap } from 'rxjs';
import { AuthService } from '../../services/auth-service';
import { TeacherCompleteRegister } from "../../teacher-complete-register-component/teacher-complete-register/teacher-complete-register";

@Component({
  selector: 'app-teacher-dashboard',
  imports: [RouterOutlet, AsyncPipe, RouterLinkWithHref, TeacherCompleteRegister],
  templateUrl: './teacher-dashboard.html',
  styleUrl: './teacher-dashboard.css',
})
export class TeacherDashboard {
  private readonly router = inject(Router);
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private readonly injector = inject(EnvironmentInjector);
  private authService = inject(AuthService);
  uid: string | undefined;

  user$ = runInInjectionContext(this.injector, () => authState(this.auth));
  profile$ = this.user$.pipe(
    switchMap(user => {
      if (!user) return of(null);      
      return from(
        runInInjectionContext(this.injector, () => getDoc(doc(this.firestore, `teachers/${user.uid}`)))
      ).pipe(
        map(snapshot => (snapshot.exists() ? snapshot.data() : null))
      );
    })
  );
  readonly user = this.user$.pipe(
    tap((user) => {
      this.uid = user?.uid;
      console.log('user:', user);
    })
  ).subscribe();

  readonly teacherStatusPending = toSignal(
    this.profile$.pipe(
      map(profile => profile?.['status'] === 'pending'),
      tap(isPending => console.log('teacherStatusPending:', isPending))
    ),
    { initialValue: false }
  );
  readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );
  readonly hideCompleteRegister = computed(
    () => !this.teacherStatusPending() || this.currentUrl().includes('/teacher-dashboard/teacher')
  );
  
  async logout() {
    await this.authService.logout();
    this.home();

  }
  protected home(): void {
    this.router.navigate(['']);
  }

  protected openTeacherProfile(): void {
    this.router.navigate(['teacher-dashboard', 'teacher-profile']);
  }

}
