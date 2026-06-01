import { Component, output, signal } from '@angular/core';

export interface TeacherFormData {
  fullName: string;
  yogaStyle: string;
  email: string;
  website: string;
  country: string;
  message: string;
}

@Component({
  selector: 'app-teacher',
  imports: [],
  templateUrl: './teacher.html',
  styleUrl: './teacher.css',
})
export class Teacher {
  readonly teacherDataChange = output<TeacherFormData>();

  protected readonly form = signal<TeacherFormData>({
    fullName: '',
    yogaStyle: '',
    email: '',
    website: '',
    country: '',
    message: '',
  });

  protected onFieldInput(field: keyof TeacherFormData, event: Event): void {
    const value = (event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).value;

    this.form.update((current) => ({
      ...current,
      [field]: value.trim(),
    }));

    this.teacherDataChange.emit(this.form());
  }
}
