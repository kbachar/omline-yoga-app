import { Component, inject, OnInit } from '@angular/core';
import { PageHeader } from '../../shared/page-header-component/page-header/page-header';
import { AuthService } from '../../services/auth-service';
import { YogaClassesService } from '../../services/yoga-classes-service';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, switchMap, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { YogaTeacher } from '../../shared/yoga-teacher-data';
import { MessageComponent } from '../../shared/message-component-component/message-component/message-component';

@Component({
  selector: 'app-teacher-home-page',
  imports: [PageHeader, AsyncPipe, MessageComponent],
  templateUrl: './teacher-home-page.html',
  styleUrl: './teacher-home-page.css',
})
export class TeacherHomePage implements OnInit {
  private authService = inject(AuthService);
  private yogaService = inject(YogaClassesService);
  private route = inject(ActivatedRoute);
  teacher$!: Observable<YogaTeacher>;
  isOpen: boolean = true;
  ngOnInit(): void {
    const teacherId = this.authService.getUserID();
    this.teacher$ = this.yogaService.getTeacher(teacherId);
  }
}
