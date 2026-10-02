import { Component, inject, input, OnInit, output } from '@angular/core';
import { YogaClassesService } from '../../../services/yoga-classes-service';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { yogaStyles } from '../../yoga-class-details-component/yoga-class-details/yoga-styles-data';
import { YogaStyleDescription } from '../../yoga-style-description-data';
import { Router } from '@angular/router';

type YogaStyleId = (typeof yogaStyles)[number] | 'all';

@Component({
  selector: 'app-classes-navbar',
  imports: [AsyncPipe],
  templateUrl: './classes-navbar.html',
  styleUrl: './classes-navbar.css',
})
export class ClassesNavbar implements OnInit {

  private readonly router = inject(Router);
  private yogaService = inject(YogaClassesService);
  readonly yogaStyleId = input<YogaStyleId>();
  readonly onClassesNavbarClick = output<YogaStyleId>();
  protected items!: Observable<YogaStyleDescription[]>;

  ngOnInit(): void {
    this.items = this.yogaService.getYogaStyles();
  }


  protected classesNavbarClick(page: YogaStyleId): void {
    console.log('page is ' + page)

    if (page != 'beyond') {
      this.router.navigate(['/classes' + page]);
      this.onClassesNavbarClick.emit(page);
    }
    else
      this.router.navigate(['/beyond-practice-page']);
  }
}
