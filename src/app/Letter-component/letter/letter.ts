import { Component, inject, OnInit } from '@angular/core';
import { PageHeader } from "../../shared/page-header-component/page-header/page-header";
import { ToggleSetting } from "../../shared/toggle-setting-component/toggle-setting/toggle-setting";
import { TextBox } from "../../shared/text-box-component/text-box/text-box";
import { TextArea } from "../../shared/text-area-component/text-area/text-area";
import { firstValueFrom, map, Observable, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { YogaClassesService } from '../../services/yoga-classes-service';
import { LetterData } from '../../shared/letter-data';
import { AsyncPipe, DatePipe } from '@angular/common';
import { SelectList } from "../../shared/select-list-component/select-list/select-list";
import { CheckBox } from '../../shared/check-box-component/check-box/check-box';
import { EmailData } from '../../shared/email-data';

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
  recipients: Array<{ name: string; email: string; date: Date; }> = [];


  private readonly defaultLetter: LetterData = {
    id: '',
    title: '',
    content: '',
    createdAt: new Date(),
    createdBy: '',
    updatedAt: new Date(),
    updatedBy: '',
    image: '',
    showLogo: false,
    sentTo: []
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
      })),
      tap((letter) => {
        //console.log('letter - ' + JSON.stringify(letter))
        if (letter.showLogo) 
          this.showLogo(letter.showLogo);
        else 
          this.logo = '';

        if (letter.image) 
          this.image$ = this.yogaService.getStorageFile(letter.image);

      })
    );

    this.images$ = this.yogaService.getStorageFiles();
  }

  showLogo(showLogo: boolean) {
    if (showLogo) this.logo = 'https://firebasestorage.googleapis.com/v0/b/yoga-app-a3585.firebasestorage.app/o/Files%2Fyoga-classes-logo.png?alt=media&token=1bbe7442-8bad-4092-95ba-ad371b663833';
    else this.logo = '';
  }

  titleChanged(letter: LetterData, title: string) {
    letter.title = title;
  }

  contentChanged(letter: LetterData, content: string) {
    letter.content = content;

  }

  OnSelectedOption(selectedOption: string, letter: LetterData) {
    this.image$ = this.yogaService.getStorageFile(selectedOption);
    letter.image = selectedOption;
  }

  addTeacher(checked: boolean, teacher: { name: string; email: string; }, letter: LetterData) {
    if (checked) {
      if (!this.recipients.some((recipient) => recipient.email === teacher.email)) {
        this.recipients.push({
          name: teacher.name,
          email: teacher.email,
          date: new Date(),
        });
      }
    } 
    else {
      this.recipients = this.recipients.filter(
        (recipient) => recipient.email !== teacher.email
      );
    }

  }

  backToLetters() {
    this.router.navigate(['/admin-dashboard/letters']);
  }

  async saveLetter(letter: LetterData) {
    letter.showLogo = this.logo != '';
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
      const email = {
        id: '',
        from: 'info@yoga-om-line.com',
        title: letter.title,
        content: letter.content,
        updatedAt: new Date(),
        updatedBy: '',
        read: false,
        recipients: this.recipients.map((recipient) => recipient.email),
      } satisfies EmailData;
      //console.log('letter.from - ' + letter.from)
      //console.log('email recipients- ' + JSON.stringify(letter.recipients))

      this.yogaService.sendEmail({
        ...email,
        content: htmlContent,
        // showLogo: this.logo !== '',
      }).then(() => {
        if (letter.sentTo == null)
          letter.sentTo = [];
        letter.sentTo = [...letter.sentTo, ...this.recipients];
        this.yogaService.saveLetter(letter).then(() => {
          this.yogaService.saveEmail(email).then(() => {
            this.backToLetters();
          });
        })
      });
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