import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MainHeader } from '../main-header-component/main-header/main-header';

type YogaStyle = {
  id: 'hatha' | 'vinyasa' | 'ashtanga';
  title: string;
  description: string;
  defaultSrc: string;
  hoverSrc: string;
  imageId: string;
};

@Component({
  selector: 'app-home-page-component',
  imports: [MainHeader],
  templateUrl: './home-page-component.html',
  styleUrl: './home-page-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  private readonly router = inject(Router);

  protected readonly hoveredStyleId = signal<YogaStyle['id'] | null>(null);
  protected readonly allYogaHovered = signal(false);

  protected readonly yogaStyles: YogaStyle[] = [
    {
      id: 'hatha',
      title: 'Hatha Yoga',
      description:
        'A gentle and traditional yoga practice focused on postures, breathing, and relaxation.',
      defaultSrc: '/assets/images/hatha-main1.png',
      hoverSrc: '/assets/images/hatha-main2.png',
      imageId: 'hathaImg'
    },
    {
      id: 'vinyasa',
      title: 'Vinyasa yoga',
      description: 'A dynamic flow of movements synchronized with the breath.',
      defaultSrc: '/assets/images/vinyasa-main1.png',
      hoverSrc: '/assets/images/vinyasa-main2.png',
      imageId: 'vinyasaImg'
    },
    {
      id: 'ashtanga',
      title: 'Ashtanga yoga',
      description:
        'A structured and energetic yoga practice based on fixed sequences of postures.',
      defaultSrc: '/assets/images/ashtanga-main1.png',
      hoverSrc: '/assets/images/ashtanga-main2.png',
      imageId: 'ashtangaImg'
    }
  ];

  protected setHoveredStyle(id: YogaStyle['id'] | null): void {
    this.hoveredStyleId.set(id);
  }

  protected imageFor(style: YogaStyle): string {
    return this.hoveredStyleId() === style.id ? style.hoverSrc : style.defaultSrc;
  }

  protected onStyleHeaderClick(id: string): void {
    this.router.navigate(['/classes', id]);
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
    this.router.navigate(['/classes'], { queryParams: { id: 'all' } });
  }

  
}
