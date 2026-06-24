import { Component, Input, DoCheck, OnDestroy } from '@angular/core';

@Component({
  selector: 'custom-wts-bibframe-link',
  standalone: true,
  imports: [],
  template: ''
})
export class WtsBibframeLinkComponent implements DoCheck, OnDestroy {
  @Input() hostComponent!: any;

  private currentMmsId: string | null | undefined = undefined;

  ngDoCheck(): void {
    const pnx = this.hostComponent?.searchResult?.pnx;
    const mmsId = pnx?.display?.mms?.[0] ?? null;
    const isAlma = pnx?.control?.sourceid === 'alma';
    const effectiveId = isAlma ? mmsId : null;

    if (effectiveId === this.currentMmsId) return;

    this.currentMmsId = effectiveId;
    this.removeLinks();

    if (!effectiveId) return;

    const baseUrl = 'https://open-na.hosted.exlibrisgroup.com/alma/01COL_WTS';
    this.createLink(`${baseUrl}/bf/entity/instance/${effectiveId}`, 'http://id.loc.gov/ontologies/bibframe/');
    this.createLink(`${baseUrl}/rda/entity/manifestation/${effectiveId}`, 'http://rdaregistry.info/Elements/');
  }

  ngOnDestroy(): void {
    this.removeLinks();
  }

  private createLink(href: string, profile: string): void {
    const el = document.createElement('link');
    el.setAttribute('rel', 'alternate');
    el.setAttribute('type', 'application/rdf+xml');
    el.setAttribute('profile', profile);
    el.setAttribute('href', href);
    el.setAttribute('data-wts-bibframe', 'true');
    document.head.appendChild(el);
  }

  private removeLinks(): void {
    document.querySelectorAll('link[data-wts-bibframe="true"]').forEach(el => el.remove());
  }
}