import { Component, output } from '@angular/core';

@Component({
  selector: 'app-teacher-complete-register',
  imports: [],
  templateUrl: './teacher-complete-register.html',
  styleUrl: './teacher-complete-register.css',
})
export class TeacherCompleteRegister {
  readonly updateProfileRequested = output<void>();

  protected updateProfile() {
    this.updateProfileRequested.emit();
  }
}
