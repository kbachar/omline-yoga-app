import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoginComponent } from '../../login-component/login-component';
import { yogaStyles } from '../../yoga-class-details-component/yoga-class-details/yoga-styles-data';

type YogaStyleId = (typeof yogaStyles)[number] | 'all';

@Component({
  selector: 'app-inner-header',
  imports: [LoginComponent, RouterOutlet],
  templateUrl: './inner-header.html',
  styleUrl: './inner-header.css',
})

export class InnerHeader implements OnInit {

  private readonly router = inject(Router);
  protected readonly isLoginModalOpen = signal(false);
  readonly onClassesNavbarClick = output<YogaStyleId>();
  readonly yogaStyleId = input<YogaStyleId>();
  readonly showNavigationBar = input<boolean>(true);

  protected readonly items: Array<{
    id: YogaStyleId;
    title: string;
  }> = [
      { id: 'hatha', title: 'Hatha Yoga' },
      { id: 'vinyasa', title: 'Vinyasa Yoga' },
      { id: 'ashtanga', title: 'Ashtanga Yoga' },
      { id: 'all', title: 'All Classes' },
      { id: 'beyond', title: 'beyond practice' }
    ];

  ngOnInit(): void {


  }

  protected classesNavbarClick(page: YogaStyleId): void {
    console.log('page is ' + page)

    if (page != 'beyond')
      this.onClassesNavbarClick.emit(page);
    else
      this.router.navigate(['/beyond-practice-page']);
  }

  protected openPopup(page: 'about' | 'contact' | 'plans' | 'login'): void {
    this.router.navigate([`/${page}`]);
  }

  protected login(): void {
    this.isLoginModalOpen.set(true);
  }

  protected closeLoginModal(): void {
    this.isLoginModalOpen.set(false);
  }

  protected subscribe(): void {
    this.router.navigate(['/teacher-subscribe-page']);
  }

  protected goHome(): void {
    this.router.navigate(['/']);
  }
}
