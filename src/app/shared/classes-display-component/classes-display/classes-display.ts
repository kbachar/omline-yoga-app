import { Component, input, output } from '@angular/core';
import { YogaClassData } from '../../yoga-class-data';
import { YogaClass } from '../../yoga-class-component/yoga-class/yoga-class';

@Component({
  selector: 'app-classes-display',
  imports: [YogaClass],
  templateUrl: './classes-display.html',
  styleUrl: './classes-display.css',
})
export class ClassesDisplay {
  readonly classes = input<YogaClassData[]>();
  readonly selectedClasses = input<YogaClassData[]>([]);
  readonly showTeacherName = input<boolean>(true);
  readonly showAddToList = input<boolean>(true);
  readonly descriptionHeight = input<number>();
  readonly showClassLength = input<boolean>(false);
  
  public selectedClassChanged = output<{ yogaClass: YogaClassData; checked: boolean }>();

  protected isClassSelected(yogaClass: YogaClassData): boolean {
    return this.selectedClasses().some((selected) => selected.id === yogaClass.id);
  }

  protected addSelectedClass(yogaClass: YogaClassData): void {
    const selectedClasses = this.selectedClasses();
    const isAlreadySelected = selectedClasses.some((selected) => selected.id === yogaClass.id);
    this.selectedClassChanged.emit({
      yogaClass,
      checked: !isAlreadySelected,
    });
  }
}
