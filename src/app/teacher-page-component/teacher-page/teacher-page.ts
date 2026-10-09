import { Component, inject, OnInit } from '@angular/core';
import { MainHeader } from '../../shared/main-header-component/main-header/main-header';
import { ClassesNavbar } from '../../shared/classes-navbar-component/classes-navbar/classes-navbar';
import { Observable, map, tap, switchMap, shareReplay } from 'rxjs';
import { YogaTeacher } from '../../shared/yoga-teacher-data';
import { ActivatedRoute } from '@angular/router';
import { YogaClassData, YogaClassesService } from '../../services/yoga-classes-service';
import { AsyncPipe } from '@angular/common';
import { MainFilter } from '../../shared/main-filter-component/main-filter/main-filter';
import { ClassesDisplay } from '../../shared/classes-display-component/classes-display/classes-display';

@Component({
  selector: 'app-teacher-page',
  imports: [MainHeader, ClassesNavbar, AsyncPipe, MainFilter, ClassesDisplay],
  templateUrl: './teacher-page.html',
  styleUrl: './teacher-page.css',
})
export class TeacherPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private yogaService = inject(YogaClassesService);
  teacher$!: Observable<YogaTeacher>;
  classes$!: Observable<YogaClassData[]>;

  ngOnInit(): void {
    this.teacher$ = this.route.paramMap.pipe(
      map((params) => params.get('id') ?? undefined),
      switchMap((teacherId) => this.yogaService.getTeacher(teacherId)),
    );

    this.classes$ = this.teacher$.pipe(
      switchMap((teacher) => this.yogaService.getClassesByTeacherID(teacher.teacherID)),
    );
  }
}
