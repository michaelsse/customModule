import { Component } from '@angular/core';
import { TranslateModule } from "@ngx-translate/core";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'custom-wts-zotero-in-citation',
  standalone: true,
  imports: [TranslateModule, MatButtonModule, MatIconModule],
  templateUrl: './wts-zotero-in-citation.component.html',
  styleUrl: './wts-zotero-in-citation.component.scss'
})

export class WtsZoteroInCitationComponent {

}
