import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from "@ngx-translate/core";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
  selector: 'custom-wts-report-record',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './wts-report-record.component.html',
  styleUrl: './wts-report-record.component.scss'
})
export class WtsReportRecordComponent implements OnInit {
  @Input() hostComponent!: any;
  
  titleSpaced = '';
  recordErrorLink = '';

  ngOnInit() {
	const baseUrl = 'https://westernsem.libwizard.com/f/problem?'

    const pnx = this.hostComponent?.searchResult?.pnx;
	
	const title = pnx?.display?.title[0];
	const titleSpaced = title.replace(/ /g, '+');
	
	if (pnx?.control?.sourceid === 'alma') {
		this.recordErrorLink = baseUrl + '3110228=' + pnx?.display?.mms[0] + '&3110243=' + titleSpaced;
	}
	else {
		this.recordErrorLink = baseUrl + '3111712=' + pnx?.control?.recordid[0] + '&3110243=' + titleSpaced;
	}
  }
}
