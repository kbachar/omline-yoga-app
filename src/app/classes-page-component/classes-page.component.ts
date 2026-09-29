import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { YogaClassesService } from '../services/yoga-classes-service';
import { YogaClassData } from '../shared/yoga-class-data';
import { Observable, map, switchMap, take, tap } from 'rxjs';
import { YogaClass } from "../shared/yoga-class-component/yoga-class/yoga-class";
import { YogaStyleDescription } from '../shared/yoga-style-description-data';
import { YogaClassesFilter } from '../shared/yoga-classes-filter-component/yoga-classes-filter/yoga-classes-filter';
import { challengeLevels, durations } from '../shared/yoga-class-details-component/yoga-class-details/yoga-styles-data';
import { FilterChange } from '../shared/filter-change-data';
import { ClassesNavbar } from '../shared/classes-navbar-component/classes-navbar/classes-navbar';
import { MainHeader } from '../shared/main-header-component/main-header/main-header';


@Component({
  selector: 'app-classes-page',
  imports: [CommonModule, YogaClass, YogaClassesFilter, ClassesNavbar, MainHeader],
  templateUrl: './classes-page.component.html',
  styleUrl: './classes-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassesPageComponent implements OnInit {
  durations = durations;
  challengeLevels = challengeLevels;
  yogaStyle$!: Observable<YogaStyleDescription>;
  classes$!: Observable<YogaClassData[]>;
  protected selectedClasses = signal<YogaClassData[]>([]);
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
    console.log('classesIds - ' + JSON.stringify(classesIds))

    this.yogaService.getClassByIDs(classesIds).pipe(take(1)).subscribe((classes) => {
      this.selectedClasses.set(classes);
    });
  }

  onFilterChange(changed: FilterChange, filter: string) {
    const filters = this.existingFilters.get(filter);
    if (filters) {
      if (changed.checked == false)
        this.existingFilters.set(
          filter,
          filters.filter((currentFilter) => currentFilter.filterOption !== changed.filterOption)
        );
      else
        filters.push(changed);
    }
    else if (changed.checked == true)
      this.existingFilters.set(filter, [changed])

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

  protected addSelectedClass(yogaClass: YogaClassData): void {
    const selectedClasses = this.selectedClasses();
    const isAlreadySelected = selectedClasses.some((selected) => selected.id === yogaClass.id);
    if (isAlreadySelected) {
      this.selectedClasses.set(selectedClasses.filter((selected) => selected.id !== yogaClass.id));
      return;
    }

  this.selectedClasses.set([...selectedClasses, yogaClass]);
  }
    clearSelectedClasses() {
    this.selectedClasses.set([]);
  }

  protected isClassSelected(yogaClass: YogaClassData): boolean {
    return this.selectedClasses().some((selected) => selected.id === yogaClass.id);
  }

  selectedClassesClick(classes: YogaClassData[]) {
    this.router.navigate(['/selected-classes'], {
      queryParams: {
        ids: classes.map((yogaClass) => yogaClass.id).join(','),
        page: this.selectedStyleId
      }
    });
  }
}
