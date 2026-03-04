import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: 'custom-wts-report-record',
  standalone: true,
  imports: [CommonModule,TranslateModule],
  templateUrl: './wts-report-record.component.html',
  styleUrl: './wts-report-record.component.scss'
})
export class WtsReportRecordComponent implements OnInit {
  @Input() hostComponent!: any;
  
  titleSpaced = '';
  recordErrorLink = '';

  ngOnInit() {
	// console.log('WtsReportRecordComponent ngOnInit:' + this.hostComponent); // Debug: Log component and inspect the hostComponent input for troubleshooting or checking
    
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
	//console.log(this.recordErrorLink);
  }
}
