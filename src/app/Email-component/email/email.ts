import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, map, Observable, switchMap } from 'rxjs';
import { YogaClassesService } from '../../services/yoga-classes-service';
import { LetterData } from '../../shared/letter-date';
import { PageHeader } from '../../shared/page-header-component/page-header/page-header';
import { TextArea } from '../../shared/text-area-component/text-area/text-area';
import { TextBox } from '../../shared/text-box-component/text-box/text-box';

@Component({
    selector: 'app-email',
    imports: [AsyncPipe, PageHeader, TextArea, TextBox],
    templateUrl: './email.html',
    styleUrl: './email.css',
})
export class Email implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly yogaService = inject(YogaClassesService);

    protected email$!: Observable<LetterData>;

    ngOnInit(): void {
        this.email$ = this.route.paramMap.pipe(
            map((params) => params.get('emailID') ?? ''),
            switchMap((emailId) => this.yogaService.getEmail(emailId)),
            map((email) => ({
                id: email?.id ?? '',
                title: email?.title ?? '',
                content: email?.content ?? '',
                createdAt: email?.createdAt ?? new Date(),
                createdBy: email?.createdBy ?? '',
                updatedAt: email?.updatedAt ?? new Date(),
                updatedBy: email?.updatedBy ?? '',
                recipients: email?.recipients ?? [],
                sent: !!email?.sent,
                image: email?.image ?? '',
                showLogo: !!email?.showLogo,
                read: true
            }))
        );
    }

    contentChanged(email: LetterData, content: string) {
        email.content = content;
    }

    async reply(email: LetterData) {
        //console.log('email - ' + JSON.stringify(email))
        await this.yogaService.sendLetter({
        ...email,
        content: email.content,
        showLogo: false,
      });
    }

    protected async backToEmails(): Promise<void> {
          const email = await firstValueFrom(this.email$);
          await this.yogaService.saveEmail(email);
        this.router.navigate(['/admin-dashboard/emails']);
    }
}
