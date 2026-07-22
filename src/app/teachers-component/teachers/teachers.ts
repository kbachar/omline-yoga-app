import { Component, inject, OnInit } from '@angular/core';
import { PageHeader } from "../../shared/page-header-component/page-header/page-header";
import { YogaTeacher } from '../../shared/yoga-teacher-data';
import { Observable } from 'rxjs';
import { YogaClassesService } from '../../services/yoga-classes-service';
import { AsyncPipe } from '@angular/common';
import { ViewEditButton } from '../../shared/view-edit-button-component/view-edit-button/view-edit-button';

@Component({
  selector: 'app-teachers',
  imports: [PageHeader, AsyncPipe, ViewEditButton],
  templateUrl: './teachers.html',
  styleUrl: './teachers.css',
})
export class TeachersComponent implements OnInit {
  
  private yogaService = inject(YogaClassesService);
  teachers$!: Observable<YogaTeacher[]>;
  
  ngOnInit(): void {
    this.teachers$ = this.yogaService.getTeachers();
  }

  onViewEditClick() {

  }
  
}
