import { Component } from '@angular/core';
import { MainHeader } from '../../shared/main-header-component/main-header/main-header';
import { ClassesNavbar } from '../../shared/classes-navbar-component/classes-navbar/classes-navbar';
import { HeaderPageComponent } from '../../header-page-component/header-page-component/header-page-component';

@Component({
  selector: 'app-events-board-page-component',
  imports: [MainHeader, ClassesNavbar, HeaderPageComponent],
  templateUrl: './events-board-page-component.html',
  styleUrl: './events-board-page-component.css',
})
export class EventsBoardPageComponent {}
