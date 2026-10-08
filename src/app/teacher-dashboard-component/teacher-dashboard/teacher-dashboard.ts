import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { YogaClassesService } from '../../services/yoga-classes-service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-teacher-dashboard',
  imports: [RouterOutlet, RouterLinkActive, RouterLinkWithHref, AsyncPipe],
  templateUrl: './teacher-dashboard.html',
  styleUrl: './teacher-dashboard.css',
})
export class TeacherDashboard {

  private readonly router = inject(Router);
  private authService = inject(AuthService);
  private yogaService = inject(YogaClassesService);
  uid$ = this.authService.getUserID();
  status$ = this.yogaService.getTeacherStatus();

  
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
