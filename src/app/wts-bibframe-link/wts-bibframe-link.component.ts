import {
	Component,
	Input,
	OnChanges,
	OnDestroy
} from '@angular/core';
import {
	Meta
} from '@angular/platform-browser';

@Component({
	selector: 'custom-wts-bibframe-link',
	standalone: true,
	imports: [],
	template: ''
})
export class WtsBibframeLinkComponent implements OnChanges, OnDestroy {
	@Input() hostComponent!: any;

	private bibframeElement: HTMLElement | null = null;
	private rdaElement: HTMLElement | null = null;

	constructor(private meta: Meta) {}

	ngOnChanges(): void {
		this.removeLinks();
		const pnx = this.hostComponent?.searchResult?.pnx;
		const mmsId = pnx?.display?.mms?.[0];
		const instCode = '01COL_WTS';

		if (!instCode || !mmsId || pnx?.control?.sourceid !== 'alma') return;

		const baseUrl = `https://open-na.hosted.exlibrisgroup.com/alma/${instCode}`;
		this.bibframeElement = this.meta.addTag({
			rel: 'alternate',
			type: 'application/rdf+xml',
			profile: 'https://id.loc.gov/ontologies/bibframe/',
			href: `${baseUrl}/bf/entity/instance/${mmsId}`
		});
		this.rdaElement = this.meta.addTag({
			rel: 'alternate',
			type: 'application/rdf+xml',
			profile: 'https://rdaregistry.info/Elements/',
			href: `${baseUrl}/rda/entity/manifestation/${mmsId}`
		});

		console.log('bibframeElement:', this.bibframeElement);
		console.log('rdaElement:', this.rdaElement);
	}

	ngOnDestroy(): void {
		this.removeLinks();
	}

	private removeLinks(): void {
		this.bibframeElement?.remove();
		this.rdaElement?.remove();
		this.bibframeElement = null;
		this.rdaElement = null;
	}
}