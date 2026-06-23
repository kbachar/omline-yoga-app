import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth-service';
import { YogaClassesService } from '../../services/yoga-classes-service';
import { map } from 'rxjs';

@Component({
  selector: 'app-teacher-dashboard',
  imports: [RouterOutlet, RouterLinkWithHref],
  templateUrl: './teacher-dashboard.html',
  styleUrl: './teacher-dashboard.css',
})
export class TeacherDashboard {
  
  
  private readonly router = inject(Router);
  private authService = inject(AuthService);
  private yogaService = inject(YogaClassesService);
    
  uid$ = this.authService.getUserID();
  status$ = this.yogaService.getTeacherStatus(this.uid$);
  


  readonly teacherStatusPending = toSignal(
    this.status$.pipe(map((status) => status === 'pending')),
    { initialValue: false }
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
