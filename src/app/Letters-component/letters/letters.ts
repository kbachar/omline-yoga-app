import { Component, inject, OnInit } from '@angular/core';
import { PageHeader } from '../../shared/page-header-component/page-header/page-header';
import { AsyncPipe } from '@angular/common';
import { ViewEditButton } from '../../shared/view-edit-button-component/view-edit-button/view-edit-button';
import { YogaClassesService } from '../../services/yoga-classes-service';
import { Observable } from 'rxjs';
import { LetterData } from '../../shared/letter-date';
import { Router } from '@angular/router';

@Component({
  selector: 'app-letters',
  imports: [PageHeader, AsyncPipe, ViewEditButton],
  templateUrl: './letters.html',
  styleUrl: './letters.css',
})
export class Letters implements OnInit {
  
  private readonly router = inject(Router);
  private yogaService = inject(YogaClassesService);
  letters$!: Observable<LetterData[]>;
  
  ngOnInit(): void {
    this.letters$ = this.yogaService.getLetters();
  }
  
  addLetter(){
    this.router.navigate(['/admin-dashboard/letter']);
  }

  onViewEditClick(letterId: string) {
    this.router.navigate(['/admin-dashboard/letter', letterId]);
    
  }
}
