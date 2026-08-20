import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoginComponent } from '../../login-component/login-component';
import { yogaStyles } from '../../yoga-class-details-component/yoga-class-details/yoga-styles-data';
import { map, Observable, switchMap, tap } from 'rxjs';
import { YogaStyleDescription } from '../../yoga-style-description-data';

type YogaStyleId = (typeof yogaStyles)[number] | 'all';

@Component({
  selector: 'app-inner-header',
  imports: [LoginComponent],
  templateUrl: './inner-header.html',
  styleUrl: './inner-header.css',
})

export class InnerHeader implements OnInit {

  private readonly router = inject(Router);
  private route = inject(ActivatedRoute);
  protected readonly isLoginModalOpen = signal(false);
  //protected selectedStyleId: YogaStyleId = 'none';
  readonly onClassesNavbarClick = output<YogaStyleId>();
  readonly yogaStyleId = input<YogaStyleId>();
  //yogaStyle$!: Observable<YogaStyleDescription>;

  protected readonly items: Array<{
    id: YogaStyleId;
    title: string;
  }> = [
      { id: 'hatha', title: 'Hatha Yoga' },
      { id: 'vinyasa', title: 'Vinyasa Yoga' },
      { id: 'ashtanga', title: 'Ashtanga Yoga' },
      { id: 'all', title: 'All Classes' },
      { id: 'none', title: '' }
    ];

  ngOnInit(): void {
   

  }



  protected classesNavbarClick(page: YogaStyleId): void {
    //this.selectedStyleId = page;
    
    this.onClassesNavbarClick.emit(page);
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
