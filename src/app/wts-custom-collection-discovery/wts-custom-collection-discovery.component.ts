import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'custom-wts-custom-collection-discovery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wts-custom-collection-discovery.component.html',
  styleUrl: './wts-custom-collection-discovery.component.scss'
})
export class WtsCustomCollectionDiscoveryComponent implements OnChanges {
  @Input() hostComponent!: any;
  
  pubDate = '';
  author = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['hostComponent'] && this.hostComponent) {
      this.extractPnxData();
    }
  }

  private extractPnxData(): void {
    // Try multiple possible paths to pnx
    let pnx = this.hostComponent?.item?.pnx;
    
    if (!pnx) {
      console.warn('PNX data not found');
      return;
    }
    
    // Extract author with fallback
    this.author = pnx?.addata?.au?.[0] || '';
    if (this.author) {
      console.log('Author extracted');
    } else {
      console.log('Author not found');
    }
    
    // Extract publication date with fallback
    this.pubDate = pnx?.display?.creationdate?.[0] || '';
    if (this.pubDate) {
      console.log('PubDate extracted');
    } else {
      console.log('PubDate not found');
    }
  }
}