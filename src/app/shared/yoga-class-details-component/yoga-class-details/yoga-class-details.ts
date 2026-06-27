import { Component, inject, OnInit, signal } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { YogaClassData } from '../../yoga-class-data';
import { YogaClassesService } from '../../../services/yoga-classes-service';
import { map, Observable, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TextBox } from "../../text-box-component/text-box/text-box";
import { PageHeader } from "../../page-header-component/page-header/page-header";
import { challengeLevels, yogaStyles, durations } from './yoga-styles-data';
import { YogaClassesFilter } from "../../yoga-classes-filter-component/yoga-classes-filter/yoga-classes-filter";
import { TextArea } from "../../text-area-component/text-area/text-area";
import { ToggleSetting } from "../../toggle-setting-component/toggle-setting/toggle-setting";
import { DeleteClassMessage } from "../../../delete-class-message-component/delete-class-message/delete-class-message";

@Component({
  selector: 'app-yoga-class-details',
  imports: [AsyncPipe, DatePipe, TextBox, PageHeader, YogaClassesFilter, TextArea, ToggleSetting, DeleteClassMessage],
  templateUrl: './yoga-class-details.html',
  styleUrl: './yoga-class-details.css',
})
export class YogaClassDetails implements OnInit {
  yogaClass$: Observable<YogaClassData | undefined> | undefined;
  private teacherId = '';
  readonly yogaStyles = yogaStyles;
  readonly durations = durations;
  readonly challengeLevels = challengeLevels;
  protected readonly isDeleteModalOpen = signal(false);

  ngOnInit(): void {
    this.yogaClass$ = this.route.paramMap.pipe(
      map(params => params.get('classID') ?? undefined),
      switchMap(classId => this.yogaService.getClassByID(classId)),
      tap((yogaClass) => {
        this.teacherId = yogaClass?.teacherId ?? '';
        console.log(yogaClass)
      })
    );

  }
  private yogaService = inject(YogaClassesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  deleteClass() {
    this.isDeleteModalOpen.set(true);
  }

  keepClass() {
    this.isDeleteModalOpen.set(false);

  }

  backToList() {
    console.log('ID is -' + this.teacherId)
    if (this.teacherId) {
      this.router.navigate(['/teacher-dashboard/teacher-classes', this.teacherId]);
      return;
    }

    this.router.navigate(['/teacher-dashboard']);

  }

}
