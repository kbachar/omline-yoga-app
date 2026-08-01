import { Component } from '@angular/core';
import { PageHeader } from "../../shared/page-header-component/page-header/page-header";
import { ToggleSetting } from "../../shared/toggle-setting-component/toggle-setting/toggle-setting";

@Component({
  selector: 'app-letter',
  imports: [PageHeader, ToggleSetting],
  templateUrl: './letter.html',
  styleUrl: './letter.css',
})
export class Letter {}
