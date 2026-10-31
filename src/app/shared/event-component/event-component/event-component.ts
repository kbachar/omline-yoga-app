import { Component, signal } from '@angular/core';
import { PageHeader } from '../../page-header-component/page-header/page-header';
import { TextBox } from '../../text-box-component/text-box/text-box';
import { TextArea } from '../../text-area-component/text-area/text-area';
import { EventData } from '../../event-data';
import { Observable, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-event-component',
  imports: [PageHeader, TextBox, TextArea, AsyncPipe],
  templateUrl: './event-component.html',
  styleUrl: './event-component.css',
})
export class EventComponent {
  photoFile: File | null = null;
  photoPreview = signal<string>('');

  event$: Observable<EventData> = of({
    id: '',
    eventName: '',
    location: '',
    date: new Date(),
    time: '',
    link: '',
    imageUrl: '',
    description: '',
    approved: false,
    status: 'draft',
    errorMessage: '',
  });

  eventNameChange(eventName: string, event: EventData) {
    event.eventName = eventName;
  }

  locationChange(location: string, event: EventData) {
    event.location = location;
  }

  eventDateChange(date: string, event: EventData) {
    //event.date = date;
  }

   eventTimeChange(time: string, event: EventData) {
    event.time = time;
  }

  eventLinkChange(link: string, event: EventData) {
    event.link = link;
  }

  descriptionChange(description: string, event: EventData) {
    event.description = description;
  }

  saveEvent(event: EventData) {
    console.log(JSON.stringify(event))
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
}
