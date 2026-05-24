import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent } from '../../shared/login-component/login-component';

@Component({
  selector: 'app-main-header',
  imports: [LoginComponent],
  templateUrl: './main-header.html',
  styleUrl: './main-header.css',
})
export class MainHeader {
  private readonly router = inject(Router);
  protected readonly isLoginModalOpen = signal(false);
  
  protected onSubscribeClick() {
    this.router.navigate(['/teacher-subscribe-page']);

  }

  protected home() {
    this.router.navigate(['']);

  }

  protected login(): void {
    this.isLoginModalOpen.set(true);
  }

  protected closeLoginModal(): void {
    this.isLoginModalOpen.set(false);
  }

  protected openPopup(page: 'about' | 'contact' | 'plans' | 'subscribe'): void {
    // Option A: route to a page
    // this.router.navigate([`/${page}`]);

    // Option B: open a modal state in this component/service
    // this.activePopup.set(page);
  }
}
