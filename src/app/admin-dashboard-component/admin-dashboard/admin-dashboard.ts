import { Component, inject  } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  private readonly router = inject(Router);
  private authService = inject(AuthService);

  async logout() {
    await this.authService.logout();
    this.home();

  }
  protected home(): void {
    this.router.navigate(['']);
  }


}
