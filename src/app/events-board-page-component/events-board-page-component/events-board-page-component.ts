import { Component } from '@angular/core';
import { MainHeader } from '../../shared/main-header-component/main-header/main-header';
import { ClassesNavbar } from '../../shared/classes-navbar-component/classes-navbar/classes-navbar';

@Component({
  selector: 'app-events-board-page-component',
  imports: [MainHeader, ClassesNavbar],
  templateUrl: './events-board-page-component.html',
  styleUrl: './events-board-page-component.css',
})
export class EventsBoardPageComponent {}
