import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { YogaClassData } from '../../shared/yoga-class-data';
import { map, Observable, switchMap } from 'rxjs';
import { YogaClassesService } from '../../services/yoga-classes-service';
import { YogaClass } from '../../shared/yoga-class-component/yoga-class/yoga-class';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeader } from "../../shared/page-header-component/page-header/page-header";
import { ViewEditButton } from '../../shared/view-edit-button-component/view-edit-button/view-edit-button';

@Component({
  selector: 'app-teacher-classes',
  imports: [AsyncPipe, YogaClass, PageHeader, ViewEditButton],
  templateUrl: './teacher-classes.html',
  styleUrl: './teacher-classes.css',
})
export class TeacherClasses implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  isEditImageHovered: boolean = false;
  hoveredClassId: string | null = null;


  classes$!: Observable<YogaClassData[]>;
  private yogaService = inject(YogaClassesService);


  ngOnInit(): void {
    this.classes$ = this.route.paramMap.pipe(
      map(params => params.get('teacherId') ?? undefined),
      switchMap(teacherId => this.yogaService.getClassesByTeacherID(teacherId))
    );
  }

  editClass(yogaClass: YogaClassData) {
    this.router.navigate(['/teacher-dashboard/yoga-class-details', yogaClass.id]);
  }

  addClass() {
    this.router.navigate(['/teacher-dashboard/yoga-class-details', ""]);

  }

  setYogaImageHovered(classId: string): void {
      this.hoveredClassId = classId;
  }

  changeImgSrc() {

  }

}
