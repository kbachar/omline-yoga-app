import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { YogaClassesService } from '../../services/yoga-classes-service';
import { EmailData } from '../../shared/email-data';
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

    protected email$!: Observable<EmailData>;

    ngOnInit(): void {
        this.email$ = this.route.paramMap.pipe(
            map((params) => params.get('emailID') ?? ''),
            switchMap((emailId) => this.yogaService.getEmail(emailId)),
            switchMap(async (email) => {
                if (!email) {
                    throw new Error('Email not found');
                }


                if (email.read == false) {
                    await this.yogaService.saveEmail({
                        ...email,
                        read: true,
                    });
                }
                return email;
            })
        );
    }

    contentChanged(email: EmailData, content: string) {
        email.content = content;
    }

    async reply(email: EmailData) {
        email.recipients = [email.from];

        const bodyHtml = this.escapeHtml(email.content)
            .replace(/\\r\\n/g, '<br>')
            .replace(/\\n/g, '<br>')
            .replace(/\r?\n/g, '<br>');
        const htmlContent = [
            '<div style="max-width: 750px; margin: 0 auto; font-family: Arial, sans-serif; color: #333; line-height: 1.6;">',
            `<h1 style="margin: 0 0 24px; font-size: 28px; color: #333;">${this.escapeHtml(email.title)}</h1>`,
            `<div>${bodyHtml}</div>`,
            '</div>',
        ].join('');

        await this.yogaService.sendEmail({
            ...email,
            content: htmlContent,
        });

        email.id = '';
        email.read = true;
        email.from = "support@yoga-om-line.com",

        await this.yogaService.saveEmail(email);
        await this.backToEmails();
    }

    protected async backToEmails(): Promise<void> {
        this.router.navigate(['/admin-dashboard/emails']);
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
