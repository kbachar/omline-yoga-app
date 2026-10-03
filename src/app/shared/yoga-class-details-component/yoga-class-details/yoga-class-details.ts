import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
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
import { AuthService } from '../../../services/auth-service';
import { CheckBox } from '../../check-box-component/check-box/check-box';
import { YogaTeacher } from '../../yoga-teacher-data';
import { FilterChange } from '../../filter-change-data';
import { DeleteMessage } from '../../delete-message-component/delete-message/delete-message';

const createEmptyYogaClass = (): YogaClassData => ({
  id: '',
  title: '',
  classLength: '',
  description: '',
  difficulty: '',
  videoLink: '',
  yogaStyle: '',
  approved: false,
  status: '',
  errorMessage: ''
});

@Component({
  selector: 'app-yoga-class-details',
  imports: [AsyncPipe, TextBox, PageHeader, YogaClassesFilter, TextArea, ToggleSetting, CheckBox, DeleteMessage],
  templateUrl: './yoga-class-details.html',
  styleUrl: './yoga-class-details.css',
})

export class YogaClassDetails implements OnInit, OnDestroy {
  yogaClass$: Observable<YogaClassData | undefined> | undefined;
  teacher$: Observable<YogaTeacher | undefined> | undefined;
  private teacherId = '';
  readonly yogaStyles = yogaStyles.filter((style) => style != 'beyond');
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
        //console.log(JSON.stringify(yogaClass))
        this.teacherId = yogaClass?.teacherId ?? this.auth.getUserID();
        if (yogaClass?.videoLink) {
          this.photoPreview.set(yogaClass?.videoLink)
          this.isAdmin.then((isAdmin) => {
            if (isAdmin) {
              this.headerText = 'class to approve - ';
              this.teacher$ = this.yogaService.getTeacher(yogaClass.teacherId);
            }
            else
              this.headerText = 'class page - ';
          });
        }
        else {
          this.photoPreview.set('')
          this.headerText = 'upload class '
        }
      })
    );
  }

  showDeleteClass() {
    this.isDeleteModalOpen.set(true);
  }

  ngOnDestroy(): void {
    this.revokePhotoPreviewUrl();
  }

  errorMessageChanged(message: string, yogaClass: YogaClassData) {
    yogaClass.errorMessage = message;
  }

  viewTeacher(teacherId: string) {
    this.router.navigate(['/admin-dashboard/teacher-profile', teacherId]);
  }

  sendEmail(teacher: YogaTeacher, yogaClass: YogaClassData) {
    if (yogaClass.approved == false)
      yogaClass.status = 'pending'

    this.router.navigate(['/admin-dashboard/email'], {
      queryParams: {
        title: 'class to approve - ' + yogaClass.title,
        content: yogaClass.description,
        recipient: teacher.email
      }
    });
  }

  onSelectVideo(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    if (!file.type.startsWith('video/') && !file.name.toLowerCase().endsWith('.mp4')) {
      alert('Please select a video');
      input.value = '';
      return;
    }

    this.revokePhotoPreviewUrl();
    this.photoFile = file;
    this.photoPreview.set(URL.createObjectURL(file));
  }
  
  async save(yogaClass: YogaClassData) {
    //console.log(this.photoFile)
    yogaClass.teacherId = this.teacherId;
    yogaClass.createDate = new Date();
    const isAdmin = await this.isAdmin;
    if (isAdmin && yogaClass.approved == false && yogaClass.errorMessage.length > 0)
      yogaClass.status = 'see remarks';
    else if (!isAdmin && yogaClass.id == '')
      yogaClass.status = 'waiting for approval'

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
      this.router.navigate(['/teacher-dashboard/teacher-classes', this.teacherId]);
    }
  }

  onTextValueChanged(yogaClass: YogaClassData, description: string) {
    yogaClass.description = description;
  }

  onChallengeFilterChange(yogaClass: YogaClassData, filterOption: FilterChange) {
    yogaClass.difficulty = filterOption.filterOption;
  }

  onDurationFilterChange(yogaClass: YogaClassData, filterOption: FilterChange) {
    yogaClass.classLength = filterOption.filterOption;
  }

  onYogaStylesFilterChange(yogaClass: YogaClassData, filterOption: FilterChange) {
    yogaClass.yogaStyle = filterOption.filterOption;
  }

  onTitleChange(yogaClass: YogaClassData, title: string) {
    yogaClass.title = title;
  }

  onApproveCheckChange(yogaClass: YogaClassData, approved: boolean) {
    yogaClass.approved = approved;
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
    this.revokePhotoPreviewUrl();
    this.photoPreview.set('');
    this.headerText = 'upload class ';
  }

  private revokePhotoPreviewUrl(): void {
    const previewUrl = this.photoPreview();
    if (previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
  }

}
