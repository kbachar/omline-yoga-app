import { Component, inject } from '@angular/core';
import { MainHeader } from '../../shared/main-header-component/main-header/main-header';
import { ClassesNavbar } from '../../shared/classes-navbar-component/classes-navbar/classes-navbar';
import { Observable } from 'rxjs';
import { YogaStyleDescription } from '../../shared/yoga-style-description-data';
import { YogaClassesService } from '../../services/yoga-classes-service';
import { AsyncPipe } from '@angular/common';
import { HeaderPageComponent } from '../../header-page-component/header-page-component/header-page-component';

@Component({
  selector: 'app-events-board-page-component',
  imports: [MainHeader, ClassesNavbar, AsyncPipe, HeaderPageComponent],
  templateUrl: './events-board-page-component.html',
  styleUrl: './events-board-page-component.css',
})
export class EventsBoardPageComponent {
    private yogaService = inject(YogaClassesService);
    yogaStyle$: Observable<YogaStyleDescription> = this.yogaService.getYogaStyle("beyond");
  
}
