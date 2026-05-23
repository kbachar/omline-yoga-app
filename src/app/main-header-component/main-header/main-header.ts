import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-header',
  imports: [],
  templateUrl: './main-header.html',
  styleUrl: './main-header.css',
})
export class MainHeader {
  private readonly router = inject(Router);
  
  protected onSubscribeClick() {
    this.router.navigate(['/teacher-subscribe-page']);

  }

  protected home() {
    this.router.navigate(['']);

  }

  protected openPopup(page: 'about' | 'contact' | 'plans' | 'login' | 'subscribe'): void {
    // Option A: route to a page
    // this.router.navigate([`/${page}`]);

    // Option B: open a modal state in this component/service
    // this.activePopup.set(page);
  }
}
