import { Component, inject, OnInit, signal } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { YogaClassData } from '../../yoga-class-data';
import { YogaClassesService } from '../../../services/yoga-classes-service';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TextBox } from "../../text-box-component/text-box/text-box";
import { PageHeader } from "../../page-header-component/page-header/page-header";
import { challengeLevels, yogaStyles, durations } from './yoga-styles-data';
import { YogaClassesFilter } from "../../yoga-classes-filter-component/yoga-classes-filter/yoga-classes-filter";
import { TextArea } from "../../text-area-component/text-area/text-area";
import { ToggleSetting } from "../../toggle-setting-component/toggle-setting/toggle-setting";
import { DeleteClassMessage } from "../../../delete-class-message-component/delete-class-message/delete-class-message";
import { AuthService } from '../../../services/auth-service';
import { CheckBox } from '../../check-box-component/check-box/check-box';

const createEmptyYogaClass = (): YogaClassData => ({
  id: '',
  title: '',
  classLength: '',
  description: '',
  difficulty: '',
  videoLink: '',
  yogaStyle: '',
  approved: false
});

@Component({
  selector: 'app-yoga-class-details',
  imports: [AsyncPipe, DatePipe, TextBox, PageHeader, YogaClassesFilter, TextArea, ToggleSetting, DeleteClassMessage, CheckBox],
  templateUrl: './yoga-class-details.html',
  styleUrl: './yoga-class-details.css',
})

export class YogaClassDetails implements OnInit {
  yogaClass$: Observable<YogaClassData | undefined> | undefined;
  private teacherId = '';
  readonly yogaStyles = yogaStyles;
  readonly durations = durations;
  readonly challengeLevels = challengeLevels;
  protected readonly isDeleteModalOpen = signal(false);
  private yogaService = inject(YogaClassesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  photoFile: File | null = null;
  photoPreview = signal<string>('');
  headerText: string = '';
  isAdmin = this.auth.isAdmin();

  ngOnInit(): void {
    this.photoPreview.set('');
    this.yogaClass$ = this.route.paramMap.pipe(
      map(params => params.get('classID') ?? undefined),
      switchMap((classId) =>
        classId ? this.yogaService.getClassByID(classId) : of(createEmptyYogaClass())
      ),
      tap((yogaClass) => {

        this.teacherId = yogaClass?.teacherId ?? this.auth.getUserID();
        if (yogaClass?.videoLink) {
          this.photoPreview.set(yogaClass?.videoLink)
          this.headerText = 'class page - '
        }
        else {
          this.photoPreview.set('')
          this.headerText = 'upload class '
        }
      })
    );

  }

  onSelectVideo(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    if (!file.type.startsWith('video/')) {
      alert('Please select a video');
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

  uploadVideo() {

  }

  onTextValueChanged(yogaClass: YogaClassData, description: string) {
    yogaClass.description = description;
  }

  onChallengeFilterChange(yogaClass: YogaClassData, filterOption: string) {
    yogaClass.difficulty = filterOption;
  }

  onDurationFilterChange(yogaClass: YogaClassData, filterOption: string) {
    console.log('filterOption - ' + filterOption)
    yogaClass.classLength = filterOption;
  }

  onYogaStylesFilterChange(yogaClass: YogaClassData, filterOption: string) {
    console.log('filterOption - ' + filterOption)
    yogaClass.yogaStyle = filterOption;
  }

  onTitleChange(yogaClass: YogaClassData, title: string) {
    yogaClass.title = title;
  }

  onApproveCheckChange(yogaClass: YogaClassData, approved: boolean) {
    yogaClass.approved = approved;
  }

  showDeleteClass() {
    this.isDeleteModalOpen.set(true);

  }

  async save(yogaClass: YogaClassData) {

    yogaClass.teacherId = this.teacherId;
    yogaClass.createDate = new Date();

    await this.yogaService.saveClass(yogaClass, this.photoFile);
    this.resetYogaClassForm();

    this.isAdmin.then((isAdmin) => {
      if (isAdmin)
        this.router.navigate(['/admin-dashboard/videos']);
      else
        this.router.navigate(['/teacher-dashboard/teacher-classes', this.teacherId]);

    })

  }

  async deleteClass(yogaClass: YogaClassData, remove: boolean) {
    this.isDeleteModalOpen.set(false);

    if (remove == true) {
      await this.yogaService.deleteYogaClass(yogaClass)
    }

    this.router.navigate(['/teacher-dashboard/teacher-classes', this.teacherId]);

  }

  backToList() {
    this.isAdmin.then((isAdmin) => {
      if (isAdmin) {
        this.router.navigate(['/admin-dashboard/videos']);
      }
    })
    if (this.teacherId) {
      this.router.navigate(['/teacher-dashboard/teacher-classes', this.teacherId]);
      return;
    }

    this.router.navigate(['/teacher-dashboard']);

  }

  private resetYogaClassForm(): void {
    this.yogaClass$ = of(createEmptyYogaClass());
    this.photoFile = null;
    this.photoPreview.set('');
    this.headerText = 'upload class ';
  }

}
