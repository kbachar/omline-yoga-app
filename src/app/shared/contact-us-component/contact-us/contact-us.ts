import { Component, inject, signal } from '@angular/core';
import { MainHeader } from '../../main-header-component/main-header/main-header';
import { ClassesNavbar } from '../../classes-navbar-component/classes-navbar/classes-navbar';
import { TextBox } from '../../text-box-component/text-box/text-box';
import { TextArea } from '../../text-area-component/text-area/text-area';
import { YogaClassesService } from '../../../services/yoga-classes-service';
import { EmailData } from '../../email-data';

@Component({
  selector: 'app-contact-us',
  imports: [MainHeader, ClassesNavbar, TextBox, TextArea],
  templateUrl: './contact-us.html',
  styleUrl: './contact-us.css',
})
export class ContactUs {
  private yogaService = inject(YogaClassesService);
  readonly name = signal<string>('');
  readonly email = signal<string>('');
  readonly message = signal<string>('');
  readonly messageSent = signal(false);

  nameChanged(name: string) {
    this.messageSent.set(false);
    this.name.set(name);
  }

  emailChanged(email: string) {
    this.messageSent.set(false);
    this.email.set(email);
  }

  messageChanged(message: string) {
    this.messageSent.set(false);
    this.message.set(message);
  }

  async sendMessage() {
    if (!this.name().trim() || !this.email().trim() || !this.message().trim()) {
      return;
    }

    const email = {
            id: '',
            from: this.email(),
            title: 'Contact Us',
            content: this.message(),
            updatedAt: new Date(),
            updatedBy: '',
            read: false,
            recipients: ['info@yoga-om-line.com'],
          } satisfies EmailData;
          
    await this.yogaService.saveEmail(email);
    this.messageSent.set(true);
    this.name.set('');
    this.email.set('');
    this.message.set('');
  }

}
