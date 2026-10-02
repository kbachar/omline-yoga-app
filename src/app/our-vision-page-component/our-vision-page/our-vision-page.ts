import { Component } from '@angular/core';
import { MainHeader } from '../../shared/main-header-component/main-header/main-header';
import { ClassesNavbar } from '../../shared/classes-navbar-component/classes-navbar/classes-navbar';

@Component({
  selector: 'app-our-vision-page',
  imports: [MainHeader, ClassesNavbar],
  templateUrl: './our-vision-page.html',
  styleUrl: './our-vision-page.css',
})
export class OurVisionPage {}
