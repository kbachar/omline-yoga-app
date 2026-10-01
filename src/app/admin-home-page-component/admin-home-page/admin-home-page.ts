import { Component, inject, OnInit } from '@angular/core';
import { PageHeader } from '../../shared/page-header-component/page-header/page-header';
import { AuthService } from '../../services/auth-service';
import { ActivatedRoute } from '@angular/router';
import { YogaClassesService } from '../../services/yoga-classes-service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-admin-home-page',
  imports: [ AsyncPipe, PageHeader],
  templateUrl: './admin-home-page.html',
  styleUrl: './admin-home-page.css',
})
export class AdminHomePage  {
  private authService = inject(AuthService);
  adminName$ = this.authService.getUserName();
}
