import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { YogaClassesService } from '../services/yoga-classes-service';
import { YogaClassData } from '../shared/yoga-class-data';
import { Observable, map, switchMap, tap } from 'rxjs';
import { YogaStyleDescription } from '../shared/yoga-style-description-data';
import { FilterChange } from '../shared/filter-change-data';
import { ClassesNavbar } from '../shared/classes-navbar-component/classes-navbar/classes-navbar';
import { MainHeader } from '../shared/main-header-component/main-header/main-header';
import { HeaderPageComponent } from '../header-page-component/header-page-component/header-page-component';
import { MainFilter } from '../shared/main-filter-component/main-filter/main-filter';
import { ClassesDisplay } from '../shared/classes-display-component/classes-display/classes-display';
import { MessageComponent } from '../shared/message-component-component/message-component/message-component';


@Component({
  selector: 'app-classes-page',
  imports: [CommonModule, ClassesNavbar, MainHeader, HeaderPageComponent, MainFilter, ClassesDisplay, MessageComponent],
  templateUrl: './classes-page.component.html',
  styleUrl: './classes-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassesPageComponent implements OnInit {
  yogaStyle$!: Observable<YogaStyleDescription>;
  classes$!: Observable<YogaClassData[]>;
  selectedClasses$!: Observable<YogaClassData[]>;

  protected isYogaImageHovered = false;
  protected isShowOnPageHovered = false;
  protected selectedStyleId: string = 'all';
  existingFilters = new Map<string, FilterChange[]>();

  private route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private yogaService = inject(YogaClassesService);
  protected readonly isDeleteModalOpen = signal(false);

  ngOnInit() {
    this.yogaStyle$ = this.route.paramMap.pipe(
      map((params) => params.get('id')),
      tap((id) => {
        this.selectedStyleId = (id) ?? 'all';
        this.classes$ = this.yogaService.getFilteredClasses(this.selectedStyleId, this.existingFilters);
      }),
      switchMap((id) => this.yogaService.getYogaStyle(id))
    );

    const selectedClassesIds = this.yogaService.getSelectedClasses();
    this.selectedClasses$ = this.yogaService.getClassByIDs(selectedClassesIds);
  }

  messageClick(remove: boolean) {
    this.isDeleteModalOpen.set(false);

    if (remove == true) {
      this.yogaService.setSelectedClasses([]);
      this.selectedClasses$ = this.yogaService.getClassByIDs([]);
    }
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

  protected setYogaImageHovered(isHovered: boolean): void {
    this.isYogaImageHovered = isHovered;
  }

  selectedClassChanged(change: { yogaClass: YogaClassData; checked: boolean }): void {
    let selectedClassesIds = this.yogaService.getSelectedClasses();
    if (change.checked)
      selectedClassesIds.push(change.yogaClass.id);
    else
      selectedClassesIds = selectedClassesIds.filter(c => c == change.yogaClass.id);

    this.yogaService.setSelectedClasses(selectedClassesIds);
    this.selectedClasses$ = this.yogaService.getClassByIDs(selectedClassesIds);
  }

  clearSelectedClasses(): void {
    this.isDeleteModalOpen.set(true);


  }

  async removeSelectedClass(selectedClass: YogaClassData) {
    let selectedClassesIds = this.yogaService.getSelectedClasses();
    selectedClassesIds = selectedClassesIds.filter(c => c != selectedClass.id);
    this.yogaService.setSelectedClasses(selectedClassesIds);
    this.selectedClasses$ = this.yogaService.getClassByIDs(selectedClassesIds);
  }

  selectedClassesClick() {
    this.router.navigate(['/selected-classes']);
  }
}
