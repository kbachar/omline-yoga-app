import { Component, inject } from '@angular/core';
import { InnerHeader } from '../../shared/inner-header-component/inner-header/inner-header';
import { yogaStyles } from '../../shared/yoga-class-details-component/yoga-class-details/yoga-styles-data';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { YogaStyleDescription } from '../../shared/yoga-style-description-data';
import { YogaClassesService } from '../../services/yoga-classes-service';
import { AsyncPipe } from '@angular/common';

type YogaStyleId = (typeof yogaStyles)[number] | 'beyond';

@Component({
  selector: 'app-beyond-practice-page',
  imports: [InnerHeader, AsyncPipe],
  templateUrl: './beyond-practice-page.html',
  styleUrl: './beyond-practice-page.css',
})
export class BeyondPracticePage {
  private readonly router = inject(Router);
  private yogaService = inject(YogaClassesService);
  protected isYogaImageHovered = false;
  yogaStyle$: Observable<YogaStyleDescription> = this.yogaService.getYogaStyle("beyond");

  protected classesNavbarClick(page: YogaStyleId): void {
    this.router.navigate([`classes/${page}`]);
  }

  protected setYogaImageHovered(isHovered: boolean): void {
    this.isYogaImageHovered = isHovered;
  }
}
