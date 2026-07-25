import { Component, inject, OnInit, signal } from '@angular/core';
import { Teacher } from '../../shared/teacher-component/teacher/teacher';
import { YogaTeacher } from '../../shared/yoga-teacher-data';
import { combineLatest, map, Observable, shareReplay, switchMap, tap } from 'rxjs';
import { TextArea } from "../../shared/text-area-component/text-area/text-area";
import { YogaClassesService } from '../../services/yoga-classes-service';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeader } from "../../shared/page-header-component/page-header/page-header";
import { AuthService } from '../../services/auth-service';
import { CheckBox } from '../../shared/check-box-component/check-box/check-box';


@Component({
  selector: 'app-teacher-profile',
  imports: [Teacher, TextArea, AsyncPipe, PageHeader, CheckBox],
  templateUrl: './teacher-profile.html',
  styleUrl: './teacher-profile.css',
})

export class TeacherProfile implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private yogaService = inject(YogaClassesService);
  private authService = inject(AuthService);

  profile$!: Observable<YogaTeacher>;
  description$: string = '';
  photoFile: File | null = null;
  photoPreview = signal<string>('/assets/images/upload-photo.png');
  role$ = this.authService.getUserRole();
  headerText$!: Observable<string>;
  isAdmin$ = this.authService.isAdmin();

  ngOnInit(): void {
    this.profile$ = this.route.paramMap.pipe(
      map((params) => params.get('teacherId') ?? undefined),
      switchMap((teacherId) => this.yogaService.getTeacher(teacherId)),
      tap((profile) => {
        this.description$ = profile.description;
        this.photoPreview.set(profile.photo);
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    this.headerText$ = combineLatest([this.role$, this.profile$]).pipe(
      map(([userRole, profile]) =>
        userRole === 'admin' ? (profile.fullName || 'My profile') : 'My profile'
      )
    );

  }


  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    console.log(file.type)

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      input.value = '';
      return;
    }

    this.photoFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreview.set(reader.result as string);
    };

    reader.readAsDataURL(file);
  }

  onTeacherDescriptionChange(description: string) {
    this.description$ = description;
  }

  onApproveCheckChange(teacher: YogaTeacher, approved: boolean) {
    teacher.approved = approved;
    if (approved == true)
      teacher.status = 'approved';
    else
      teacher.status = 'pending';

  }

  async save(teacher: YogaTeacher): Promise<void> {
    const teacherToSave: YogaTeacher = {
      ...teacher,
      description: this.description$ || teacher.description || ''
    };



    await this.yogaService.saveTeacher(teacherToSave, this.photoFile);

    this.isAdmin$.then((isAdmin) => {
      if (isAdmin)
        this.router.navigate(['/admin-dashboard/teachers']);

    })
  }

  back() {
    this.router.navigate(['/admin-dashboard/teachers']);

  }
}
