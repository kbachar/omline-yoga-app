import { Component, computed, inject, signal } from '@angular/core';
import { PageHeader } from '../../shared/page-header-component/page-header/page-header';
import { DatePipe } from '@angular/common';
import { ViewEditButton } from '../../shared/view-edit-button-component/view-edit-button/view-edit-button';
import { YogaClassesService } from '../../services/yoga-classes-service';
import { Router } from '@angular/router';
import { EmailData } from '../../shared/email-data';
import { toSignal } from '@angular/core/rxjs-interop';

type EmailSortColumn = 'origin' | 'from' | 'recipients' | 'title' | 'updatedAt';
type SortDirection = 'ascending' | 'descending';
type ResizableEmailColumn = 'from' | 'recipients' | 'title';

@Component({
  selector: 'app-emails',
  imports: [PageHeader, DatePipe, ViewEditButton],
  templateUrl: './emails.html',
  styleUrl: './emails.css',
})
export class Emails {
  private readonly router = inject(Router);
  private readonly yogaService = inject(YogaClassesService);
  readonly emails = toSignal(this.yogaService.getEmails(), { initialValue: [] });
  readonly sortColumn = signal<EmailSortColumn>('updatedAt');
  readonly sortDirection = signal<SortDirection>('descending');
  readonly columnWidths = signal({ from: 180, recipients: 150, title: 220 });
  protected readonly isDeleteModalOpen = signal(false);

  setEmailOrigin(email: EmailData): string {
    if (email.from.includes("yoga-om-line.com"))
      return 'out';

    return 'in';
  }
  
  deleteEmail(email: EmailData) {
    this.isDeleteModalOpen.set(true);
  }

  readonly sortedEmails = computed(() => {
    const column = this.sortColumn();
    const direction = this.sortDirection();

    return [...this.emails()].sort((left, right) => {
      const comparison = column === 'updatedAt'
        ? left.updatedAt.getTime() - right.updatedAt.getTime()
        : this.sortValue(left, column).localeCompare(this.sortValue(right, column), undefined, {
          numeric: true,
          sensitivity: 'base'
        });

      return direction === 'ascending' ? comparison : -comparison;
    });
  });
  private resizeState: { column: ResizableEmailColumn; startX: number; startWidth: number } | null = null;

  sortBy(column: EmailSortColumn): void {
    if (this.sortColumn() === column) {
      this.sortDirection.update((direction) => direction === 'ascending' ? 'descending' : 'ascending');
      return;
    }

    this.sortColumn.set(column);
    this.sortDirection.set('ascending');
  }

  startColumnResize(event: PointerEvent, column: ResizableEmailColumn): void {
    if (event.button !== 0 || !(event.currentTarget instanceof HTMLElement)) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    this.resizeState = {
      column,
      startX: event.clientX,
      startWidth: this.columnWidths()[column]
    };
  }

  resizeColumn(event: PointerEvent): void {
    if (!this.resizeState) {
      return;
    }

    const { column, startX, startWidth } = this.resizeState;
    const width = Math.max(80, Math.min(700, startWidth + event.clientX - startX));
    this.columnWidths.update((widths) => ({ ...widths, [column]: width }));
  }

  stopColumnResize(event: PointerEvent): void {
    if (event.currentTarget instanceof HTMLElement && event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    this.resizeState = null;
  }

  resizeColumnWithKeyboard(event: KeyboardEvent, column: ResizableEmailColumn): void {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      return;
    }

    event.preventDefault();
    const step = event.shiftKey ? 50 : 10;
    const adjustment = event.key === 'ArrowRight' ? step : -step;
    this.columnWidths.update((widths) => ({
      ...widths,
      [column]: Math.max(80, Math.min(700, widths[column] + adjustment))
    }));
  }

  private sortValue(email: EmailData, column: Exclude<EmailSortColumn, 'updatedAt'>): string {
    switch (column) {
      case 'origin':
        return this.setEmailOrigin(email);
      case 'recipients':
        return email.recipients.join('; ');
      default:
        return email[column];
    }
  }

  addEmail() {
    this.router.navigate(['/admin-dashboard/email']);
  }

  onViewEditClick(emailId: string) {
    this.router.navigate(['/admin-dashboard/email', emailId]);
  }
}
