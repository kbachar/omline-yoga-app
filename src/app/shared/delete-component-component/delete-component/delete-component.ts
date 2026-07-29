import { Component, signal } from '@angular/core';
import { DeleteMessage } from '../../delete-message-component/delete-message/delete-message';

@Component({
  selector: 'app-delete-component',
  imports: [DeleteMessage],
  templateUrl: './delete-component.html',
  styleUrl: './delete-component.css',
})
export class DeleteComponent {
  
  protected readonly isDeleteModalOpen = signal(false);
  
  showDeleteClass() {
      this.isDeleteModalOpen.set(true);
  
    }

    async deleteClass(remove: boolean) {
    this.isDeleteModalOpen.set(false);


  }
  
}
