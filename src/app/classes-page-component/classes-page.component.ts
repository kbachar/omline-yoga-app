import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, inject, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { YogaClass, YogaService, YogaStyle } from '../services/yoga-service';
import { Observable, map, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-classes-page',
  imports: [CommonModule],
  templateUrl: './classes-page.component.html',
  styleUrl: './classes-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassesPageComponent implements OnInit {
  yogaStyle$!: Observable<YogaStyle>;
  classes$!: Observable<YogaClass[]>;
  protected selectedClasses: YogaClass[] = [];
  protected isYogaImageHovered = false;
  protected selectedStyleId: 'hatha' | 'vinyasa' | 'ashtanga' | 'all' = 'all';
  protected readonly items: Array<{
    id: 'hatha' | 'vinyasa' | 'ashtanga' | 'all';
    title: string;
  }> = [
      { id: 'hatha', title: 'Hatha Yoga' },
      { id: 'vinyasa', title: 'Vinyasa Yoga' },
      { id: 'ashtanga', title: 'Ashtanga Yoga' },
      { id: 'all', title: 'All Classes' }
    ];

  private route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private yogaService = inject(YogaService);
  private readonly filtersRowContainer = viewChild.required<ElementRef<HTMLDivElement>>('filtersRowContainer');

  ngOnInit() {
    this.yogaStyle$ = this.route.paramMap.pipe(
      map((params) => params.get('id')),
      tap((id) => {
        this.selectedStyleId = (id as 'hatha' | 'vinyasa' | 'ashtanga' | 'all') ?? 'all';
        this.classes$ = this.yogaService.getFilteredClasses(this.selectedStyleId, null, null);
      }),
      switchMap((id) => this.yogaService.getYogaStyle(id))
    );
  }

  protected classesNavbarClick(page: 'hatha' | 'vinyasa' | 'ashtanga' | 'all'): void {
    this.selectedStyleId = page;
    this.yogaStyle$ = this.yogaService.getYogaStyle(page);
    this.classes$ = this.yogaService.getFilteredClasses(this.selectedStyleId, null, null);
  }

  protected setYogaImageHovered(isHovered: boolean): void {
    this.isYogaImageHovered = isHovered;
  }

  protected addSelectedClass(yogaClass: YogaClass): void {
    const isAlreadySelected = this.selectedClasses.some((selected) => selected.id === yogaClass.id);
    if (isAlreadySelected) {
      this.selectedClasses = this.selectedClasses.filter((selected) => selected.id !== yogaClass.id);
      return;
    }

    this.selectedClasses = [...this.selectedClasses, yogaClass];
  }

  protected isClassSelected(yogaClass: YogaClass): boolean {
    return this.selectedClasses.some((selected) => selected.id === yogaClass.id);
  }

  protected clearFilters(): void {
    const container = this.filtersRowContainer().nativeElement;
    const checkboxes = container.querySelectorAll<HTMLInputElement>('input.check-box[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
  }


  protected openPopup(page: 'about' | 'contact' | 'plans' | 'login'): void {
    this.router.navigate([`/${page}`]);
  }

  protected goHome(): void {
    this.router.navigate(['/']);
  }

  protected subscribe(): void {
    // TODO: implement subscribe flow
  }
}
