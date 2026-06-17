import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { YogaClassData } from '../../shared/yoga-class-data';
import { map, Observable, of, switchMap } from 'rxjs';
import { YogaClassesService } from '../../services/yoga-classes-service';
import { Auth, authState } from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';
import { YogaClass } from '../../shared/yoga-class-component/yoga-class/yoga-class';
import { doc, Firestore } from '@angular/fire/firestore';
import { docData } from '@angular/fire/firestore';
import { YogaTeacher } from '../../shared/yoga-teacher-data';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-teacher-classes',
  imports: [AsyncPipe, YogaClass],
  templateUrl: './teacher-classes.html',
  styleUrl: './teacher-classes.css',
})
export class TeacherClasses implements OnInit {
  private readonly auth = inject(Auth);
  private readonly firestore = inject(Firestore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly user$ = authState(this.auth);

  readonly profile$ = this.user$.pipe(
    switchMap(user => {
      if (!user) {
        return of(null);
      }
      console.log(user.uid)
      const teacherRef = doc(this.firestore, `teachers/${user.uid}`);
      return docData(teacherRef, { idField: 'teacherID' }) as Observable<YogaTeacher>;
    })
  );

  classes$!: Observable<YogaClassData[]>;
  private yogaService = inject(YogaClassesService);


  ngOnInit(): void {
    console.log('hello')

    this.classes$ = this.route.paramMap.pipe(
      map(params => params.get('teacherId') ?? undefined),
      switchMap(teacherId => this.yogaService.getClassesByTeacherID(teacherId))
    );
  }

  editClass(yogaClass: YogaClassData) {
    this.router.navigate(['/teacher-dashboard/yoga-class-details', yogaClass.id]);

  }
  
  changeImgSrc() {
    
  }

}
