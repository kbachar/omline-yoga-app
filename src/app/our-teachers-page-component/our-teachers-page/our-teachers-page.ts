import { Component, inject } from '@angular/core';
import { MainHeader } from '../../shared/main-header-component/main-header/main-header';
import { ClassesNavbar } from '../../shared/classes-navbar-component/classes-navbar/classes-navbar';
import { Router } from '@angular/router';
import { yogaStyles } from '../../shared/yoga-class-details-component/yoga-class-details/yoga-styles-data';
import { Observable } from 'rxjs';
import { YogaClassesService } from '../../services/yoga-classes-service';
import { YogaStyleDescription } from '../../shared/yoga-style-description-data';
import { AsyncPipe } from '@angular/common';
import { YogaTeacher } from '../../shared/yoga-teacher-data';

type YogaStyleId = (typeof yogaStyles)[number] | 'teachers';


@Component({
  selector: 'app-our-teachers-page',
  imports: [MainHeader, ClassesNavbar, AsyncPipe],
  templateUrl: './our-teachers-page.html',
  styleUrl: './our-teachers-page.css',
})
export class OurTeachersPage {
  private readonly router = inject(Router);
  private yogaService = inject(YogaClassesService);
  protected isYogaImageHovered = false;
  yogaStyle$: Observable<YogaStyleDescription> = this.yogaService.getYogaStyle("teachers");
  teachers$ = this.yogaService.getTeachers();

  protected classesNavbarClick(page: YogaStyleId): void {
    this.router.navigate([`classes/${page}`]);
  }

  protected setYogaImageHovered(isHovered: boolean): void {
    this.isYogaImageHovered = isHovered;
  }

  gotoTeacherPage(teacher: YogaTeacher) {
    this.router.navigate([`teacher-page/${teacher.teacherID}`]);

  }
}
