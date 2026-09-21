import { Component, inject, OnInit } from '@angular/core';
import { PageHeader } from '../../shared/page-header-component/page-header/page-header';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ViewEditButton } from '../../shared/view-edit-button-component/view-edit-button/view-edit-button';
import { YogaClassesService } from '../../services/yoga-classes-service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { EmailData } from '../../shared/email-data';

@Component({
  selector: 'app-emails',
  imports: [PageHeader, AsyncPipe, DatePipe, ViewEditButton],
  templateUrl: './emails.html',
  styleUrl: './emails.css',
})
export class Emails implements OnInit {

  private readonly router = inject(Router);
  private readonly yogaService = inject(YogaClassesService);
  protected emails$!: Observable<EmailData[]>;

  ngOnInit(): void {
    this.emails$ = this.yogaService.getEmails();
  }

  addEmail() {
    this.router.navigate(['/admin-dashboard/email']);
  }

  onViewEditClick(emailId: string) {
    this.router.navigate(['/admin-dashboard/email', emailId]);
  }
}
