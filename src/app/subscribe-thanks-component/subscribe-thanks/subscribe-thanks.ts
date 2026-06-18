import { Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';

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

  navigateToTeacherDashboard() {
    this.router.navigate(['/teacher-dashboard']);

  }

}
