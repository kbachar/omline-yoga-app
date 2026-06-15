import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { YogaClassData } from '../../yoga-class-data';
import { YogaClassesService } from '../../../services/yoga-classes-service';
import { map, Observable, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TextBox } from "../../text-box-component/text-box/text-box";
import { Filter } from "../../filter-component/filter/filter";

@Component({
  selector: 'app-yoga-class-details',
  imports: [AsyncPipe, TextBox ],
  templateUrl: './yoga-class-details.html',
  styleUrl: './yoga-class-details.css',
})
export class YogaClassDetails implements OnInit {
  yogaClass$: Observable<YogaClassData | undefined> | undefined;
    ngOnInit(): void {
    this.yogaClass$ = this.route.paramMap.pipe(
      map(params => params.get('classID') ?? undefined),
      switchMap(classId => this.yogaService.getClassByID(classId))
    );

    console.log(this.yogaClass$)
  }
  private yogaService = inject(YogaClassesService);
  private readonly route = inject(ActivatedRoute);

  

}
