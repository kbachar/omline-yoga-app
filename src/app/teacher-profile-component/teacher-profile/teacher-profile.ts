import { Component, inject, OnInit, signal } from '@angular/core';
import { Teacher } from '../../shared/teacher-component/teacher/teacher';
import { YogaTeacher } from '../../shared/yoga-teacher-data';
import { map, Observable, switchMap, tap } from 'rxjs';
import { TextArea } from "../../shared/text-area-component/text-area/text-area";
import { YogaClassesService } from '../../services/yoga-classes-service';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PageHeader } from "../../shared/page-header-component/page-header/page-header";


@Component({
  selector: 'app-teacher-profile',
  imports: [Teacher, TextArea, AsyncPipe, PageHeader],
  templateUrl: './teacher-profile.html',
  styleUrl: './teacher-profile.css',
})
export class TeacherProfile implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private yogaService = inject(YogaClassesService);
  profile$!: Observable<YogaTeacher>;
  description$: string = '';
  photoFile: File | null = null;
  photoPreview = signal<string>('/assets/images/upload-photo.png');

  ngOnInit(): void {
    this.profile$ = this.route.paramMap.pipe(
      map((params) => params.get('teacherId') ?? undefined),
      switchMap((teacherId) => this.yogaService.getTeacher(teacherId)),
      tap((profile) => {
        this.description$ = profile.description;
        this.photoPreview.set(profile.photo);
        
      })
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

  async save(teacher: YogaTeacher): Promise<void> {
    const teacherToSave: YogaTeacher = {
      ...teacher,
      description: this.description$ || teacher.description || ''
    };

    await this.yogaService.saveTeacher(teacherToSave, this.photoFile);
  }
}
