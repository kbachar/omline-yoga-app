import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { YogaClassData, YogaClassesService } from '../../services/yoga-classes-service';
import { yogaStyles } from '../../shared/yoga-class-details-component/yoga-class-details/yoga-styles-data';
import { YogaClass } from "../../shared/yoga-class-component/yoga-class/yoga-class";
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MainHeader } from '../../shared/main-header-component/main-header/main-header';
import { ClassesNavbar } from '../../shared/classes-navbar-component/classes-navbar/classes-navbar';

type YogaStyleId = (typeof yogaStyles)[number] | 'all';

@Component({
  selector: 'app-selected-classes',
  imports: [YogaClass, AsyncPipe, MainHeader, ClassesNavbar],
  templateUrl: './selected-classes.html',
  styleUrl: './selected-classes.css',
})
export class SelectedClasses implements OnInit {
  private yogaService = inject(YogaClassesService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  selectedClasses$!: Observable<YogaClassData[]>;
  suggestedClasses$!: Observable<YogaClassData[]>;
  protected classesIds: string[] = [];
  protected isBackHovered = false;
  readonly yogaStyleId = signal<YogaStyleId>('all');

  ngOnInit(): void {
    this.yogaStyleId.set(
      (this.route.snapshot.queryParamMap.get('page') as YogaStyleId | null) ?? 'all'
    );

    this.classesIds = this.route.snapshot.queryParamMap
      .get('ids')
      ?.split(',')
      .filter(Boolean) ?? [];

    this.selectedClasses$ = this.yogaService.getClassByIDs(this.classesIds);
    this.suggestedClasses$ = this.yogaService.getFilteredClasses('all', null);
  }

  removeClass(yogaClass: YogaClassData) {
    this.classesIds = this.classesIds.filter((id) => id !== yogaClass.id);
    this.selectedClasses$ = this.yogaService.getClassByIDs(this.classesIds);
  }

  addClass(suggestedClass: YogaClassData) {
    if (this.classesIds.includes(suggestedClass.id)) {
      return;
    }

    this.classesIds = [...this.classesIds, suggestedClass.id];
    this.selectedClasses$ = this.yogaService.getClassByIDs(this.classesIds);
  }

  removeAllClasses() {
    this.classesIds = [];
    this.selectedClasses$ = this.yogaService.getClassByIDs(this.classesIds);
  }
  
  async back() {
    const page = await this.yogaStyleId();
    this.router.navigate(['/classes', page], {
      queryParams: { ids: this.classesIds.join(',') }
    });
  }

}
