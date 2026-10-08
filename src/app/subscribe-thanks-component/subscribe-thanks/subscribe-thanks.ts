import { Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-subscribe-thanks',
  imports: [],
  templateUrl: './subscribe-thanks.html',
  styleUrl: './subscribe-thanks.css',
})
export class SubscribeThanks {
  readonly isOpen = input(false);
  readonly closed = output<void>();
  private readonly router = inject(Router);
  private authService = inject(AuthService);

  async navigateToTeacherDashboard() {
    const userId = await this.authService.getUserID();
    console.log('userId is - ' + userId)
    if (userId != '')
      this.router.navigate(['/teacher-dashboard']);

  }

}
