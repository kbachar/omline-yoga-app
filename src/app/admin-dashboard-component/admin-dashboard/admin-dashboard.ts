import { Component, inject  } from '@angular/core';
import { Router, RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterOutlet, RouterLinkWithHref],
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
