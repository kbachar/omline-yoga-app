import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { YogaClassesService } from '../services/yoga-classes-service';
import { YogaClassData } from '../shared/yoga-class-data';
import { Observable, map, switchMap, take, tap } from 'rxjs';
import { YogaStyleDescription } from '../shared/yoga-style-description-data';
import { FilterChange } from '../shared/filter-change-data';
import { ClassesNavbar } from '../shared/classes-navbar-component/classes-navbar/classes-navbar';
import { MainHeader } from '../shared/main-header-component/main-header/main-header';
import { HeaderPageComponent } from '../header-page-component/header-page-component/header-page-component';
import { MainFilter } from '../shared/main-filter-component/main-filter/main-filter';
import { ClassesDisplay } from '../shared/classes-display-component/classes-display/classes-display';


@Component({
  selector: 'app-classes-page',
  imports: [CommonModule, ClassesNavbar, MainHeader, HeaderPageComponent, MainFilter, ClassesDisplay],
  templateUrl: './classes-page.component.html',
  styleUrl: './classes-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassesPageComponent implements OnInit {
  yogaStyle$!: Observable<YogaStyleDescription>;
  classes$!: Observable<YogaClassData[]>;
  protected selectedClasses: YogaClassData[] = [];
  protected isYogaImageHovered = false;
  protected isShowOnPageHovered = false;
  protected selectedStyleId: string = 'all';
  existingFilters = new Map<string, FilterChange[]>();

  private route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private yogaService = inject(YogaClassesService);
  private readonly filtersRowContainer = viewChild.required<ElementRef<HTMLDivElement>>('filtersRowContainer');

  ngOnInit() {
    this.yogaStyle$ = this.route.paramMap.pipe(
      map((params) => params.get('id')),
      tap((id) => {
        this.selectedStyleId = (id) ?? 'all';
        this.classes$ = this.yogaService.getFilteredClasses(this.selectedStyleId, this.existingFilters);
      }),
      switchMap((id) => this.yogaService.getYogaStyle(id))
    );

    const classesIds = this.route.snapshot.queryParamMap
      .get('ids')
      ?.split(',')
      .filter(Boolean) ?? [];
    //console.log('classesIds - ' + JSON.stringify(classesIds))

    this.yogaService.getClassByIDs(classesIds).pipe(take(1)).subscribe((classes) => {
      this.selectedClasses = classes;
    });
  }

  onFilterChange(filters: FilterChange[]) {
    this.existingFilters = filters.reduce((groupedFilters, filter) => {
      const group = groupedFilters.get(filter.filter) ?? [];
      group.push(filter);
      groupedFilters.set(filter.filter, group);
      return groupedFilters;
    }, new Map<string, FilterChange[]>());

    this.classes$ = this.yogaService.getFilteredClasses(this.selectedStyleId, this.existingFilters);
  }

  protected clearFilters(): void {
    this.existingFilters.clear();
    this.classes$ = this.yogaService.getFilteredClasses(this.selectedStyleId, null);
  }

  protected classesNavbarClick(page: string): void {
    console.log.apply('page is ' + page)
    this.selectedStyleId = page;
    this.yogaStyle$ = this.yogaService.getYogaStyle(page);
    this.classes$ = this.yogaService.getFilteredClasses(this.selectedStyleId, null);
  }

  protected setYogaImageHovered(isHovered: boolean): void {
    this.isYogaImageHovered = isHovered;
  }

  selectedClassChanged(change: { yogaClass: YogaClassData; checked: boolean }): void {
    if (change.checked)
      this.selectedClasses = [...this.selectedClasses, change.yogaClass];
    else
      this.selectedClasses = this.selectedClasses.filter((selected) => selected.id !== change.yogaClass.id);
  }

  clearSelectedClasses(): void {
    this.selectedClasses = [];
  }

  async removeSelectedClass(selectedClass: YogaClassData) {
    this.selectedClasses = this.selectedClasses.filter((selected) => selected.id !== selectedClass.id);
  }

  selectedClassesClick() {
    this.router.navigate(['/selected-classes'], {
      queryParams: {
        ids: this.selectedClasses.map((yogaClass) => yogaClass.id).join(','),
        page: this.selectedStyleId
      }
    });
  }
}
