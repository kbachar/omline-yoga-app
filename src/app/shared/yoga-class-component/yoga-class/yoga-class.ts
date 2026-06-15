import { Component, inject, input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { YogaClassesService } from '../../../services/yoga-classes-service';
import { YogaClassData } from '../../yoga-class-data';

@Component({
  selector: 'app-yoga-class',
  imports: [],
  templateUrl: './yoga-class.html',
  styleUrl: './yoga-class.css',
})
export class YogaClass implements OnInit {

  private yogaService = inject(YogaClassesService);
readonly classData = input.required<YogaClassData>();
readonly descriptionWidth = input<number>();
  ngOnInit(): void {
  }

}
