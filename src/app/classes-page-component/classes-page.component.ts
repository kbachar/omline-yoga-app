import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-classes-page',
  imports: [],
  templateUrl: './classes-page.component.html',
  styleUrl: './classes-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassesPageComponent {
  private readonly router = inject(Router);

  protected openPopup(page: 'about' | 'contact' | 'plans' | 'login'): void {
    this.router.navigate([`/${page}`]);
  }

  protected goHome(): void {
    this.router.navigate(['/']);
  }

  protected subscribe(): void {
    // TODO: implement subscribe flow
  }
}
