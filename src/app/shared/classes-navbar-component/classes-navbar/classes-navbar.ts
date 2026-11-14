import { Component, inject, input, OnInit, output } from '@angular/core';
import { YogaClassesService } from '../../../services/yoga-classes-service';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { yogaStyles } from '../../yoga-class-details-component/yoga-class-details/yoga-styles-data';
import { YogaStyleDescription } from '../../yoga-style-description-data';
import { ActivatedRoute, Router } from '@angular/router';

type YogaStyleId = (typeof yogaStyles)[number] | 'all';

@Component({
  selector: 'app-classes-navbar',
  imports: [AsyncPipe],
  templateUrl: './classes-navbar.html',
  styleUrl: './classes-navbar.css',
})
export class ClassesNavbar implements OnInit {

  private route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private yogaService = inject(YogaClassesService);
  readonly yogaStyleId = input<YogaStyleId>();
  protected items!: Observable<YogaStyleDescription[]>;
  classesIds: string[] = [];

  ngOnInit(): void {
    this.classesIds = this.route.snapshot.queryParamMap
      .get('ids')
      ?.split(',')
      .filter(Boolean) ?? [];

      if (this.classesIds.length == 0) 
        this.classesIds = this.yogaService.getSelectedClasses();
    this.items = this.yogaService.getYogaStyles();
  }

  protected classesNavbarClick(page: YogaStyleId): void {
    this.yogaService.setSelectedClasses(this.classesIds);
    if (page == 'beyond')
      this.router.navigate(['/beyond-practice-page']);
    else if (page == 'teachers')
      this.router.navigate(['/our-teachers-page']);
    else if (page == 'events')
      this.router.navigate(['/events-board-page']);
    else {
      this.router.navigate(['/classes', page], {
        queryParams: { ids: this.classesIds.join(',') }
      });
    }
  }
}
