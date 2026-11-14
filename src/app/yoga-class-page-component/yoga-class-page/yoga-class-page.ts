import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { YogaClassesService } from '../../services/yoga-classes-service';
import { YogaClassData } from '../../shared/yoga-class-data';
import { AsyncPipe } from '@angular/common';
import { MainHeader } from '../../shared/main-header-component/main-header/main-header';
import { ClassesNavbar } from '../../shared/classes-navbar-component/classes-navbar/classes-navbar';
import { YogaClass } from '../../shared/yoga-class-component/yoga-class/yoga-class';

@Component({
  selector: 'app-yoga-class-page',
  imports: [AsyncPipe, MainHeader, ClassesNavbar, YogaClass],
  templateUrl: './yoga-class-page.html',
  styleUrl: './yoga-class-page.css',
})
export class YogaClassPage implements OnInit {
  private yogaService = inject(YogaClassesService);
  private readonly route = inject(ActivatedRoute);
  yogaClass$!: Observable<YogaClassData | undefined>;

   ngOnInit(): void {
      this.yogaClass$ = this.route.paramMap.pipe(
        switchMap((params) => {
          const classId = params.get('classID');
          return classId ? this.yogaService.getClassByID(classId) : of(undefined);
        })
      );
  }

}
