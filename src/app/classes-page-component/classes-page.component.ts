import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { YogaClassesService } from '../services/yoga-classes-service';
import { YogaClassData } from '../shared/yoga-class-data';
import { Observable, map, switchMap, tap } from 'rxjs';
import { YogaClass } from "../shared/yoga-class-component/yoga-class/yoga-class";
import { InnerHeader } from "../shared/inner-header-component/inner-header/inner-header";
import { YogaStyleDescription } from '../shared/yoga-style-description-data';
import { YogaClassesFilter } from '../shared/yoga-classes-filter-component/yoga-classes-filter/yoga-classes-filter';
import { challengeLevels, durations } from '../shared/yoga-class-details-component/yoga-class-details/yoga-styles-data';

//type YogaStyleId = (typeof yogaStyles)[number] | 'all';

@Component({
  selector: 'app-classes-page',
  imports: [CommonModule, YogaClass, InnerHeader, YogaClassesFilter],
  templateUrl: './classes-page.component.html',
  styleUrl: './classes-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassesPageComponent implements OnInit {
durations = durations;
challengeLevels = challengeLevels;
onFilterChange($event: string) {
throw new Error('Method not implemented.');
}
  yogaStyle$!: Observable<YogaStyleDescription>;
  classes$!: Observable<YogaClassData[]>;
  protected selectedClasses: YogaClassData[] = [];
  protected isYogaImageHovered = false;
  protected selectedStyleId: string = 'all';

  private route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private yogaService = inject(YogaClassesService);
  private readonly filtersRowContainer = viewChild.required<ElementRef<HTMLDivElement>>('filtersRowContainer');

  ngOnInit() {
    this.yogaStyle$ = this.route.paramMap.pipe(
      map((params) => params.get('id')),
      tap((id) => {
        this.selectedStyleId = (id) ?? 'all';
        this.classes$ = this.yogaService.getFilteredClasses(this.selectedStyleId, null, null);
      }),
      switchMap((id) => this.yogaService.getYogaStyle(id))
    );

    const classesIds = this.route.snapshot.queryParamMap
      .get('ids')
      ?.split(',')
      .filter(Boolean) ?? [];
    //console.log('classesIds - ' + JSON.stringify(classesIds))
  }

  protected classesNavbarClick(page: string): void {
    console.log.apply('page is ' + page)
    this.selectedStyleId = page;
    this.yogaStyle$ = this.yogaService.getYogaStyle(page);
    this.classes$ = this.yogaService.getFilteredClasses(this.selectedStyleId, null, null);
  }

  protected setYogaImageHovered(isHovered: boolean): void {
    this.isYogaImageHovered = isHovered;
  }

  protected addSelectedClass(yogaClass: YogaClassData): void {
    const isAlreadySelected = this.selectedClasses.some((selected) => selected.id === yogaClass.id);
    if (isAlreadySelected) {
      this.selectedClasses = this.selectedClasses.filter((selected) => selected.id !== yogaClass.id);
      return;
    }

    this.selectedClasses = [...this.selectedClasses, yogaClass];
  }

  protected isClassSelected(yogaClass: YogaClassData): boolean {
    return this.selectedClasses.some((selected) => selected.id === yogaClass.id);
  }

  protected clearFilters(): void {
    const container = this.filtersRowContainer().nativeElement;
    const checkboxes = container.querySelectorAll<HTMLInputElement>('input.check-box[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
  }

  selectedClassesClick(classes: YogaClassData[]) {
    this.router.navigate(['/selected-classes'], {
      queryParams: { ids: classes.map((yogaClass) => yogaClass.id).join(',') }
    });
  }
}
