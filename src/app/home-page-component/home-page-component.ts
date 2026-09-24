import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { YogaClassesService } from '../services/yoga-classes-service';
import { YogaStyleDescription } from '../shared/yoga-style-description-data';
import { AsyncPipe } from '@angular/common';
import { InnerHeader } from '../shared/inner-header-component/inner-header/inner-header';

@Component({
  selector: 'app-home-page-component',
  imports: [ AsyncPipe, InnerHeader],
  templateUrl: './home-page-component.html',
  styleUrl: './home-page-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  private readonly router = inject(Router);
  private yogaService = inject(YogaClassesService);

  protected readonly hoveredStyleId = signal<YogaStyleDescription['id'] | null>(null);
  protected readonly allYogaHovered = signal(false);

  yogaStyles = this.yogaService.getYogaStyles();

  protected setHoveredStyle(id: string): void {
    this.hoveredStyleId.set(id || null);
  }

  protected imageFor(style: YogaStyleDescription): string {
    return this.hoveredStyleId() === style.id ? style.hoverSrc : style.defaultSrc;
  }

  protected onStyleHeaderClick(id: string): void {
    this.router.navigate(['/classes', id]);
  }

  protected onBeyondHeaderClick() {
    this.router.navigate(['/beyond-practice-page']);

  }

  protected setAllYogaHovered(value: boolean): void {
    this.allYogaHovered.set(value);
  }

  protected allYogaImageSrc(): string {
    return this.allYogaHovered()
      ? '/assets/images/all-main2.png'
      : '/assets/images/all-main1.png';
  }

  protected onAllYogaClick(): void {
    this.router.navigate(['/classes', 'all']);
  }


}
