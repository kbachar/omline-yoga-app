import { Component, computed, EnvironmentInjector, inject, OnInit, runInInjectionContext } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Auth, authState } from '@angular/fire/auth';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { Teacher } from '../../shared/teacher-component/teacher/teacher';
import { YogaTeacher } from '../../shared/yoga-teacher-data';
import { from, map, Observable, of, switchMap, tap } from 'rxjs';
import { TextArea } from "../../shared/text-area-component/text-area/text-area";
import { YogaClassesService } from '../../services/yoga-classes-service';
import { AuthService } from '../../services/auth-service';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-teacher-profile',
  imports: [Teacher, TextArea, AsyncPipe],
  templateUrl: './teacher-profile.html',
  styleUrl: './teacher-profile.css',
})
export class TeacherProfile implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private yogaService = inject(YogaClassesService);
  profile$!: Observable<YogaTeacher>;

  ngOnInit(): void {
    this.profile$ = this.route.paramMap.pipe(
      map((params) => params.get('teacherId') ?? undefined),
      switchMap((teacherId) => this.yogaService.getTeacher(teacherId)),
    );
  }
}
