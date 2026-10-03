import { Component, computed, inject, signal } from '@angular/core';
import { PageHeader } from "../../shared/page-header-component/page-header/page-header";
import { ViewEditButton } from "../../shared/view-edit-button-component/view-edit-button/view-edit-button";
import { YogaClassData, YogaClassesService } from '../../services/yoga-classes-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

type SortColumn = 'title' | 'yogaStyle' | 'difficulty' | 'classLength' | 'approved' | 'status';
type SortDirection = 'ascending' | 'descending';

@Component({
  selector: 'app-videos',
  imports: [PageHeader, ViewEditButton],
  templateUrl: './videos.html',
  styleUrl: './videos.css',
})
export class Videos {
  private readonly router = inject(Router);
  private readonly yogaService = inject(YogaClassesService);
  readonly classes = toSignal(this.yogaService.getClasses(), { initialValue: [] });
  readonly sortColumn = signal<SortColumn>('title');
  readonly sortDirection = signal<SortDirection>('ascending');
  readonly sortedClasses = computed(() => {
    const column = this.sortColumn();
    const direction = this.sortDirection();

    return [...this.classes()].sort((left, right) => {
      const leftValue = left[column];
      const rightValue = right[column];
      const comparison = typeof leftValue === 'boolean' && typeof rightValue === 'boolean'
        ? Number(leftValue) - Number(rightValue)
        : String(leftValue ?? '').localeCompare(String(rightValue ?? ''), undefined, {
          numeric: true,
          sensitivity: 'base'
        });

      return direction === 'ascending' ? comparison : -comparison;
    });
  });

  sortBy(column: SortColumn): void {
    if (this.sortColumn() === column) {
      this.sortDirection.update((direction) =>
        direction === 'ascending' ? 'descending' : 'ascending'
      );
      return;
    }

    this.sortColumn.set(column);
    this.sortDirection.set('ascending');
  }

  onViewEditClick(classId: string) {
    this.router.navigate(['/admin-dashboard/yoga-class-details', classId]);
  }
}
