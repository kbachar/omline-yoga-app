import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { YogaClassData, YogaClassesService } from '../../services/yoga-classes-service';
import { yogaStyles } from '../../shared/yoga-class-details-component/yoga-class-details/yoga-styles-data';
import { YogaClass } from "../../shared/yoga-class-component/yoga-class/yoga-class";
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MainHeader } from '../../shared/main-header-component/main-header/main-header';
import { ClassesNavbar } from '../../shared/classes-navbar-component/classes-navbar/classes-navbar';
import { MessageComponent } from '../../shared/message-component-component/message-component/message-component';

type YogaStyleId = (typeof yogaStyles)[number] | 'all';

@Component({
  selector: 'app-selected-classes',
  imports: [YogaClass, AsyncPipe, MainHeader, ClassesNavbar, MessageComponent],
  templateUrl: './selected-classes.html',
  styleUrl: './selected-classes.css',
})
export class SelectedClasses implements OnInit {
  private yogaService = inject(YogaClassesService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  selectedClasses$!: Observable<YogaClassData[]>;
  suggestedClasses$!: Observable<YogaClassData[]>;
  protected isBackHovered = false;
  readonly yogaStyleId = signal<YogaStyleId>('all');
  protected readonly isDeleteModalOpen = signal(false);

  ngOnInit(): void {
    this.yogaStyleId.set(
      (this.route.snapshot.queryParamMap.get('page') as YogaStyleId | null) ?? 'all'
    );

    const classesIds = this.yogaService.getSelectedClasses();
    this.selectedClasses$ = this.yogaService.getClassByIDs(classesIds);
    this.suggestedClasses$ = this.yogaService.getFilteredClasses('all', null);
  } 

   messageClick(remove: boolean) {
    this.isDeleteModalOpen.set(false);

    if (remove == true) {
      this.yogaService.setSelectedClasses([]);
      this.selectedClasses$ = this.yogaService.getClassByIDs([]);
    }
  }

  removeClass(yogaClass: YogaClassData) {
    let classesIds = this.yogaService.getSelectedClasses();
    
    classesIds = classesIds.filter((id) => id !== yogaClass.id);
    this.yogaService.setSelectedClasses(classesIds);
    this.selectedClasses$ = this.yogaService.getClassByIDs(classesIds);
  }

  addClass(suggestedClass: YogaClassData) {
    let classesIds = this.yogaService.getSelectedClasses();
    if (classesIds.includes(suggestedClass.id)) {
      return;
    }

    classesIds.push(suggestedClass.id);
    this.yogaService.setSelectedClasses(classesIds);
    this.selectedClasses$ = this.yogaService.getClassByIDs(classesIds);
  }

  removeAllClasses() {
    this.isDeleteModalOpen.set(true);
  }
  
  async back() {
    const page = await this.yogaStyleId();
    this.router.navigate(['/classes', page]);
  }

}
