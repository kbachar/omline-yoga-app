import { Component, input, output } from '@angular/core';
import { YogaClassData } from '../../yoga-class-data';
import { ViewEditButton } from '../../view-edit-button-component/view-edit-button/view-edit-button';

@Component({
  selector: 'app-yoga-class',
  imports: [ViewEditButton],
  templateUrl: './yoga-class.html',
  styleUrl: './yoga-class.css',
})
export class YogaClass {

  readonly classData = input.required<YogaClassData>();
  readonly descriptionWidth = input<number>();
  readonly descriptionHeight = input<number>();
  readonly showClassLength = input<boolean>();
  readonly showViewEdit = input<boolean>();
  readonly viewEditClick = output<void>();

  viewEditButtonClick() {
    this.viewEditClick.emit();
  }
}
