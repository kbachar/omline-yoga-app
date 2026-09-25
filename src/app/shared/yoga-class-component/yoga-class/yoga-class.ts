import { Component, input } from '@angular/core';
import { YogaClassData } from '../../yoga-class-data';

@Component({
  selector: 'app-yoga-class',
  imports: [],
  templateUrl: './yoga-class.html',
  styleUrl: './yoga-class.css',
})
export class YogaClass {

  readonly classData = input.required<YogaClassData>();
  readonly descriptionWidth = input<number>();
  readonly showClassLength = input<boolean>();

}
