import { Component } from '@angular/core';
import { TranslateModule } from "@ngx-translate/core";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'custom-wts-offensive-materials-statement',
  standalone: true,
  imports: [TranslateModule, MatButtonModule, MatIconModule],
  templateUrl: './wts-offensive-materials-statement.component.html',
  styleUrl: './wts-offensive-materials-statement.component.scss'
})
export class WtsOffensiveMaterialsStatementComponent {
}
