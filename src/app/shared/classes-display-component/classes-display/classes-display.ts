import { Component, input, signal } from '@angular/core';
import { YogaClassData } from '../../yoga-class-data';
import { YogaClass } from '../../yoga-class-component/yoga-class/yoga-class';

@Component({
  selector: 'app-classes-display',
  imports: [YogaClass],
  templateUrl: './classes-display.html',
  styleUrl: './classes-display.css',
})
export class ClassesDisplay {
  protected selectedClasses = signal<YogaClassData[]>([]);
  readonly classes = input<YogaClassData[]>();
  
  protected isClassSelected(yogaClass: YogaClassData): boolean {
    return this.selectedClasses().some((selected) => selected.id === yogaClass.id);
  }

  protected addSelectedClass(yogaClass: YogaClassData): void {
    const selectedClasses = this.selectedClasses();
    const isAlreadySelected = selectedClasses.some((selected) => selected.id === yogaClass.id);
    if (isAlreadySelected) {
      this.selectedClasses.set(selectedClasses.filter((selected) => selected.id !== yogaClass.id));
      return;
    }

  this.selectedClasses.set([...selectedClasses, yogaClass]);
  }
    clearSelectedClasses() {
    this.selectedClasses.set([]);
  }
}
