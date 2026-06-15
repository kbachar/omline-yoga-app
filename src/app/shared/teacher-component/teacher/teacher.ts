import { Component, effect, inject, input, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Auth, authState } from '@angular/fire/auth';
import { TeacherFormData } from '../../teacher-form-data';
import { TextBox } from "../../text-box-component/text-box/text-box";
import { SelectList } from "../../select-list-component/select-list/select-list";
import { YogaClassesFilter } from "../../yoga-classes-filter-component/yoga-classes-filter/yoga-classes-filter";
import { yogaStyles } from "../../yoga-class-details-component/yoga-class-details/yoga-styles-data";

@Component({
  selector: 'app-teacher',
  imports: [ TextBox, SelectList, YogaClassesFilter],
  templateUrl: './teacher.html',
  styleUrl: './teacher.css',
})

export class Teacher {
  private readonly auth = inject(Auth);
  readonly profileData = input<TeacherFormData | null>(null);
  readonly teacherDataChange = output<TeacherFormData>();
  protected readonly isPasswordVisible = signal(false);
  protected readonly user = toSignal(authState(this.auth), {

    initialValue: null
  });

  readonly yogaStyles = yogaStyles;

  countries = [
    'Australia',
    'Brazil',
    'Canada',
    'Germany',
    'France',
    'United Kingdom',
    'Israel',
    'India',
    'Japan',
    'United States',
    'Other'
  ];


  protected readonly form = signal<TeacherFormData>({
    fullName: '',
    yogaStyle: '',
    email: '',
    website: '',
    country: '',
    password: '',
    teacherID: ''
  });

  constructor() {
    effect(() => {
      const profileData = this.profileData();

      if (!profileData) {
        return;
      }

      this.form.set({ ...profileData });
    });
  }

  protected onFieldInput(field: keyof TeacherFormData, event: Event): void {
    const value = (event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).value;

    this.form.update((current) => ({
      ...current,
      [field]: value.trim(),
    }));

    this.teacherDataChange.emit(this.form());
  }

  protected handlePassword() {
    this.isPasswordVisible.update((visible) => !visible);
  }

  protected passwordIconSrc(): string {
    return this.isPasswordVisible()
      ? '/assets/images/show-password.png'
      : '/assets/images/hide-password.png';
  }
}

