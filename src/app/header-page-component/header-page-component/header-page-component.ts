import { Component, inject, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, switchMap } from 'rxjs';
import { YogaStyleDescription } from '../../shared/yoga-style-description-data';
import { YogaClassesService } from '../../services/yoga-classes-service';
import { Router } from '@angular/router';
import { yogaStyles } from '../../shared/yoga-class-details-component/yoga-class-details/yoga-styles-data';
import { AsyncPipe } from '@angular/common';

type YogaStyleId = (typeof yogaStyles)[number] | 'beyond';

@Component({
  selector: 'app-header-page-component',
  imports: [ AsyncPipe],
  templateUrl: './header-page-component.html',
  styleUrl: './header-page-component.css',
})
export class HeaderPageComponent {
private readonly router = inject(Router);
  private yogaService = inject(YogaClassesService);
  protected isYogaImageHovered = false;
  readonly page = input<string>();
  readonly prefix = input<string>();
  readonly suffix = input<string>();
  
  yogaStyle$: Observable<YogaStyleDescription> = toObservable(this.page).pipe(
    switchMap((page) => this.yogaService.getYogaStyle(page ?? null))
  );

  protected classesNavbarClick(page: YogaStyleId): void {
    this.router.navigate([`classes/${page}`]);
  }

  protected setYogaImageHovered(isHovered: boolean): void {
    this.isYogaImageHovered = isHovered;
  }  
  
  
  
  
}
