import { Component, inject, OnInit } from '@angular/core';
import { PageHeader } from "../../shared/page-header-component/page-header/page-header";
import { ViewEditButton } from "../../shared/view-edit-button-component/view-edit-button/view-edit-button";
import { YogaClassData, YogaClassesService } from '../../services/yoga-classes-service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-videos',
  imports: [PageHeader, ViewEditButton, AsyncPipe],
  templateUrl: './videos.html',
  styleUrl: './videos.css',
})
export class Videos implements OnInit {
  
  private readonly router = inject(Router);
  private yogaService = inject(YogaClassesService);
  classes$!: Observable<YogaClassData[]>;

  ngOnInit(): void {
    this.classes$ = this.yogaService.getClasses();
  }

  
  
  onViewEditClick(classId: string) {
    this.router.navigate(['/admin-dashboard/yoga-class-details', classId]);
    
  }
}
