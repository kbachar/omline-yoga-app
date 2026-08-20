import { Component, OnInit, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { YogaClassData, YogaClassesService } from '../../services/yoga-classes-service';
import { InnerHeader } from "../../shared/inner-header-component/inner-header/inner-header";
import { yogaStyles } from '../../shared/yoga-class-details-component/yoga-class-details/yoga-styles-data';
import { YogaClass } from "../../shared/yoga-class-component/yoga-class/yoga-class";
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

type YogaStyleId = (typeof yogaStyles)[number] | 'all';

@Component({
  selector: 'app-selected-classes',
  imports: [InnerHeader, YogaClass, AsyncPipe],
  templateUrl: './selected-classes.html',
  styleUrl: './selected-classes.css',
})
export class SelectedClasses implements OnInit {
  private yogaService = inject(YogaClassesService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  classes$!: Observable<YogaClassData[]>;
  protected classesIds: string[] = [];
  readonly yogaStyleId = input<YogaStyleId>();

   ngOnInit(): void {
    this.classesIds = this.route.snapshot.queryParamMap
      .get('ids')
      ?.split(',')
      .filter(Boolean) ?? [];

    this.classes$ = this.yogaService.getClassByIDs(this.classesIds);
  }

  protected classesNavbarClick(page: YogaStyleId): void {
    this.router.navigate(['/classes', page]);
  }

}
