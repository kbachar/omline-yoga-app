import { Component, effect, inject, input, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Auth, authState } from '@angular/fire/auth';
import { YogaTeacher } from '../../yoga-teacher-data';
import { TextBox } from "../../text-box-component/text-box/text-box";
import { SelectList } from "../../select-list-component/select-list/select-list";
import { yogaStyles } from "../../yoga-class-details-component/yoga-class-details/yoga-styles-data";
import { AuthService } from '../../../services/auth-service';

const DEFAULT_TEACHER: YogaTeacher = {
  fullName: '',
  yogaStyle: [],
  email: '',
  website: '',
  country: '',
  teacherID: '',
  status: '',
  photo: '',
  description: ''
};

@Component({
  selector: 'app-teacher',
  imports: [TextBox, SelectList],
  templateUrl: './teacher.html',
  styleUrl: './teacher.css',
})

export class Teacher {
  private readonly auth = inject(Auth);
  readonly profileData = input<YogaTeacher>(DEFAULT_TEACHER);
  readonly teacherPassword = input<string | ''>('');
  readonly teacherDataChange = output<YogaTeacher>();
  readonly passwordChange = output<string>();
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

  private authService = inject(AuthService);

  uid$ = this.authService.getUserID();
  profile$ = this.authService.getUserProfile(this.uid$)

  form = input.required<YogaTeacher>();

  protected handlePassword() {
    this.isPasswordVisible.update((visible) => !visible);
  }

  protected passwordIconSrc(): string {
    return this.isPasswordVisible()
      ? '/assets/images/show-password.png'
      : '/assets/images/hide-password.png';
  }
}

