import { Component, inject, OnInit } from '@angular/core';
import { PageHeader } from "../../shared/page-header-component/page-header/page-header";
import { ToggleSetting } from "../../shared/toggle-setting-component/toggle-setting/toggle-setting";
import { TextBox } from "../../shared/text-box-component/text-box/text-box";
import { TextArea } from "../../shared/text-area-component/text-area/text-area";
import { map, Observable, switchMap, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { YogaClassesService } from '../../services/yoga-classes-service';
import { LetterData } from '../../shared/letter-date';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-letter',
  imports: [PageHeader, ToggleSetting, TextBox, TextArea, AsyncPipe],
  templateUrl: './letter.html',
  styleUrl: './letter.css',
})
export class Letter implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private yogaService = inject(YogaClassesService);
  
  logo = '';
  letter$!: Observable<LetterData | undefined>;

  ngOnInit() {
    this.letter$ = this.route.paramMap.pipe(
      map((params) => params.get('letterID') ?? ''),
      switchMap((id) => this.yogaService.getLetter(id))
    );
  }

  showLogo(showLogo: boolean) {
    if (showLogo) this.logo = '/assets/images/yoga-classes-logo.png';
    else this.logo = '';
  }

  updatePreview(text: string) {
    const previewContainer = document.querySelector('.preview-container');
    if (previewContainer) {
      previewContainer.textContent = text;
    }
  }
}