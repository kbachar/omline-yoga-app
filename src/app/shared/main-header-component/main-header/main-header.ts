import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth-service';
import { LoginComponent } from '../../login-component/login-component';
import { Observable } from 'rxjs';
import { YogaStyleDescription } from '../../yoga-style-description-data';

@Component({
  selector: 'app-main-header',
  imports: [LoginComponent, RouterLink],
  templateUrl: './main-header.html',
  styleUrl: './main-header.css',
})
export class MainHeader implements OnInit {
  private authService = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly isLoginModalOpen = signal(false);
  protected readonly isLoggedIn = signal(false);
  protected items!: Observable<YogaStyleDescription[]>;

  ngOnInit(): void {
    this.isLoggedIn.set(this.authService.getUserID() !== '');
  }
  protected openPopup(page: 'about' | 'contact' | 'plans' | 'login'): void {
    this.router.navigate([`/${page}`]);
  }

  protected login(): void {
    this.isLoginModalOpen.set(true);
  }

  protected async logout(): Promise<void> {
    await this.authService.logout();
    this.isLoggedIn.set(false);
  }

  protected goHome(): void {
    this.router.navigate(['/']);
  }

  protected closeLoginModal(): void {
    this.isLoginModalOpen.set(false);
  }

  protected async forgotPassword(email: string) {
    const message = await this.authService.resetPassword(email);
  }
}
