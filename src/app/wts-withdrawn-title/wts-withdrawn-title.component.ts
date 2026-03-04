import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: 'custom-wts-withdrawn-title',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './wts-withdrawn-title.component.html',
  styleUrl: './wts-withdrawn-title.component.scss'
})
export class WtsWithdrawnTitleComponent implements OnInit {
  @Input() hostComponent!: any;
  
  pubWithdrawn: string = '';
  isWithdrawn: boolean = false;
  
  ngOnInit(): void {
    const pnx = this.hostComponent?.searchResult?.pnx;
    
    try {
      this.pubWithdrawn = pnx?.display?.lds09?.[0] || '';
    } catch (e) {
      this.pubWithdrawn = '';
    }
    this.isWithdrawn = !!this.pubWithdrawn;
  }
}