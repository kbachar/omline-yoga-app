import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { YogaClassesService } from '../services/yoga-classes-service';
import { YogaClassData } from '../shared/yoga-class-data';
import { Observable, map, switchMap, tap } from 'rxjs';
import { YogaClass } from "../shared/yoga-class-component/yoga-class/yoga-class";
import { yogaStyles } from '../shared/yoga-class-details-component/yoga-class-details/yoga-styles-data';
import { InnerHeader } from "../shared/inner-header-component/inner-header/inner-header";
import { YogaStyleDescription } from '../shared/yoga-style-description-data';

type YogaStyleId = (typeof yogaStyles)[number] | 'all';

@Component({
  selector: 'app-classes-page',
  imports: [CommonModule, YogaClass, InnerHeader],
  templateUrl: './classes-page.component.html',
  styleUrl: './classes-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassesPageComponent implements OnInit {
  yogaStyle$!: Observable<YogaStyleDescription>;
  classes$!: Observable<YogaClassData[]>;
  protected selectedClasses: YogaClassData[] = [];
  protected isYogaImageHovered = false;
  protected selectedStyleId: YogaStyleId = 'all';

  private route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private yogaService = inject(YogaClassesService);
  private readonly filtersRowContainer = viewChild.required<ElementRef<HTMLDivElement>>('filtersRowContainer');

  ngOnInit() {
    this.yogaStyle$ = this.route.paramMap.pipe(
      map((params) => params.get('id')),
      tap((id) => {
        this.selectedStyleId = (id as YogaStyleId) ?? 'all';
        this.classes$ = this.yogaService.getFilteredClasses(this.selectedStyleId, null, null);
      }),
      switchMap((id) => this.yogaService.getYogaStyle(id))
    );

    const classesIds = this.route.snapshot.queryParamMap
      .get('ids')
      ?.split(',')
      .filter(Boolean) ?? [];
    console.log('classesIds - ' + JSON.stringify(classesIds))
    //this.selectedClasses = this.yogaService.getClassByIDs(classesIds);

  }

  protected classesNavbarClick(page: YogaStyleId): void {
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
