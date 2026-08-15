import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { PageHeader } from "../../shared/page-header-component/page-header/page-header";
import { ToggleSetting } from "../../shared/toggle-setting-component/toggle-setting/toggle-setting";
import { TextBox } from "../../shared/text-box-component/text-box/text-box";
import { TextArea } from "../../shared/text-area-component/text-area/text-area";
import { firstValueFrom, map, Observable, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { YogaClassesService } from '../../services/yoga-classes-service';
import { LetterData } from '../../shared/letter-date';
import { AsyncPipe, DatePipe } from '@angular/common';
import { SelectList } from "../../shared/select-list-component/select-list/select-list";
import { CheckBox } from '../../shared/check-box-component/check-box/check-box';

@Component({
  selector: 'app-letter',
  imports: [PageHeader, ToggleSetting, TextBox, TextArea, AsyncPipe, DatePipe, SelectList, CheckBox],
  templateUrl: './letter.html',
  styleUrl: './letter.css',
})
export class Letter implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private yogaService = inject(YogaClassesService);
  private readonly router = inject(Router);
  
  logo = '';
  letter$!: Observable<LetterData>;
  images$!: Observable<string[]>
  image$!: Observable<string>
  teacherNamesAndIds$!: Observable<Array<{ name: string; email: string }>>;
  recipients: Array<{ name: string; email: string; date: Date }> = [];

  private readonly defaultLetter: LetterData = {
    id: '',
    title: '',
    content: '',
    createdAt: new Date(),
    createdBy: '',
    updatedAt: new Date(),
    updatedBy: '',
    recipients: [],
    sent: false,
    image: '',
    showLogo: false
  };

  ngOnInit() {
    this.image$ = this.yogaService.getStorageFile('');
    this.teacherNamesAndIds$ = this.yogaService.getTeacherNamesAndIds();

    this.letter$ = this.route.paramMap.pipe(
      map((params) => params.get('letterID') ?? ''),
      switchMap((id) => this.yogaService.getLetter(id)),
      map((letter) => ({
        ...this.defaultLetter,
        ...letter,
        id: letter?.id ?? '',
        title: letter?.title ?? 'new letter',
        content: letter?.content ?? '',
        createdAt: letter?.createdAt ?? new Date(),
        createdBy: letter?.createdBy ?? '',
        updatedAt: letter?.updatedAt ?? new Date(),
        updatedBy: letter?.updatedBy ?? '',
        recipients: letter?.recipients ?? [],
        sent: !!letter?.sent,
        image: letter?.image ?? '',
        showLogo: !!letter?.showLogo,
      })),
      tap((letter) => {
        if (letter.showLogo) {
          this.showLogo(letter.showLogo);
        } else {
          this.logo = '';
        }

        this.recipients = [...letter.recipients];
        letter.recipients = [];

        if (letter.image) {
          this.image$ = this.yogaService.getStorageFile(letter.image);
        } else {
          this.image$ = this.yogaService.getStorageFile('');
        }
      })
    );

    this.images$ = this.yogaService.getStorageFiles();
  }

  showLogo(showLogo: boolean) {
    if (showLogo) this.logo = 'https://firebasestorage.googleapis.com/v0/b/yoga-app-a3585.firebasestorage.app/o/Files%2Fyoga-classes-logo.png?alt=media&token=1bbe7442-8bad-4092-95ba-ad371b663833';
    else this.logo = '';
  }

  updatePreview(text: string) {
    const previewContainer = document.querySelector('.preview-container');
    if (previewContainer) {
      previewContainer.textContent = text;
    }
  }

  OnSelectedOption(selectedOption: string, letter: LetterData) {
    this.image$ = this.yogaService.getStorageFile(selectedOption);
    letter.image = selectedOption;
  }

  addTeacher(checked: boolean, teacher: { name: string; email: string; }, letter: LetterData) {
    if (checked) {
      if (!letter.recipients.some((recipient) => recipient.email === teacher.email)) {
        letter.recipients.push({
          name: teacher.name,
          email: teacher.email,
          date: new Date(),
        });
      }
    } else {
      letter.recipients = letter.recipients.filter(
        (recipient) => recipient.email !== teacher.email
      );
    }

    console.log('letter.recipients - ' + JSON.stringify(letter.recipients))
  }

  backToLetters() {
    this.router.navigate(['/admin-dashboard/letters']);
  }

  async saveLetter(letter: LetterData) {
    letter.showLogo = this.logo != '';

    //console.log("letter - " + JSON.stringify(letter))

    await this.yogaService.saveLetter(letter);
    await this.router.navigate(['/admin-dashboard/letters']);
  }

  async sendMail(letter: LetterData) {
    const imageUrl = letter.image
      ? await firstValueFrom(this.yogaService.getStorageFile(letter.image))
      : '';
    
    const bodyHtml = this.escapeHtml(letter.content).replace(/\r?\n/g, '<br>');
    const htmlContent = [
      '<div style="max-width: 750px; margin: 0 auto; font-family: Arial, sans-serif; color: #333; line-height: 1.6;">',
      this.logo !== '' ? `<img src='${this.logo.trim()}' alt='' style='display: block; max-width: 100%; height: auto; margin: 0 auto 24px;'>` : '',
      `<h1 style="margin: 0 0 24px; font-size: 28px; color: #333;">${this.escapeHtml(letter.title)}</h1>`,
      `<div>${bodyHtml}</div>`,
      imageUrl ? `<img src='${imageUrl.trim()}' alt='' style='display: block; max-width: 100%; height: auto; margin-top: 24px;'>` : '',
      '</div>',
    ].join('');

    try {
      await this.yogaService.sendLetter({
        ...letter,
        content: htmlContent,
        showLogo: this.logo !== '',
      });

      const recipientsByEmail = new Map(
        [...this.recipients, ...letter.recipients].map((recipient) => [recipient.email, recipient])
      );
      letter.recipients = [...recipientsByEmail.values()];
      await this.saveLetter(letter);
    } catch (error) {
      console.error('Unable to send letter:', error);
    }
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}