import { Component, inject } from '@angular/core';
import { PageHeader } from '../../shared/page-header-component/page-header/page-header';
import { AuthService } from '../../services/auth-service';
import { YogaClassesService } from '../../services/yoga-classes-service';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-teacher-home-page',
  imports: [PageHeader, AsyncPipe],
  templateUrl: './teacher-home-page.html',
  styleUrl: './teacher-home-page.css',
})
export class TeacherHomePage {
  private authService = inject(AuthService);
  private yogaService = inject(YogaClassesService);
  private route = inject(ActivatedRoute);
  
  user$ = this.route.paramMap.pipe(
    map((params) => params.get('teacherId') ?? this.authService.getUserID()),
    switchMap((id) => this.yogaService.getTeacher(id)),
  );

}
