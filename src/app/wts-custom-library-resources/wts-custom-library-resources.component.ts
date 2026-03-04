import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from "@ngx-translate/core";

interface ResourceLink {
	label: string;
	url: string;
	icon: string;
	translationKey: string;
}

@Component({
	selector: 'custom-wts-custom-library-resources',
	standalone: true,
	imports: [CommonModule,TranslateModule],
	templateUrl: './wts-custom-library-resources.component.html',
	styleUrl: './wts-custom-library-resources.component.scss'
})

export class WtsCustomLibraryResourcesComponent implements OnInit, OnDestroy {
	isOpen = false;
	
	@HostListener('document:click', ['$event'])
	onDocumentClick(event: MouseEvent): void {
		const target = event.target as HTMLElement;
		// Close menu if click is outside the component
		if (!target.closest('custom-wts-custom-library-resources')) {
			this.isOpen = false;
		}
	}

	ngOnInit(): void {
		// Component initialized
	}

	ngOnDestroy(): void {
		// Cleanup if needed
	}

	resources: ResourceLink[] = [
	{
		label: 'Digital Collections',
		url: 'https://repository.westernsem.edu/xmlui/home',
		icon: 'dspace',
		translationKey: 'fulldisplay.datasource.DSPACE'
	},
	{
		label: 'EBSCOhost',
		url: 'https://guides.westernsem.edu/ATLARDB',
		icon: 'ebscohost',
		translationKey: 'tabbedmenu.EBSCO.label'
	},
	{
		label: 'HWPEP Online Catalog',
		url: 'https://catx.hope.edu/hwpep',
		icon: 'hwpep',
		translationKey: 'nui.mainmenu.description.HWPEP'
	},
	{
		label: 'WorldCAT',
		url: 'https://guides.westernsem.edu/worldcat',
		icon: 'worldcat',
		translationKey: 'tabbedmenu.WorldCat.label'
	},
	{
		label: 'Atla Reciprocal Borrowing Program',
		url: 'https://www.atla.com/learning-engagement/reciprocal-borrowing/',
		icon: 'atla',
		translationKey: 'nui.customization.externalSearch.atlarb'
	},
	{
		label: 'Searching in Primo',
		url: 'https://guides.westernsem.edu/c.php?g=1501769&p=11222250#s-lg-box-wrapper-41514568',
		icon: 'faq',
		translationKey: 'nui.mainmenu.description.primoSearching'
	},
	{
		label: 'Email a librarian',
		url: 'https://westernsem.libwizard.com/f/emailalibrarian',
		icon: 'mail',
		translationKey: 'nui.mainmenu.description.contactForm'
	},
	{
		label: 'Schedule time with a librarian',
		url: 'https://scheduler.zoom.us/steve-michaels/30-minute-meeting?origin=col-westernsem.primo.exlibrisgroup.com',
		icon: 'calendar_month',
		translationKey: 'nui.mainmenu.description.ResearchHelp'
	}
	];
	
	toggleMenu(event: MouseEvent): void {
		event.stopPropagation(); // Prevent the document click handler from firing
		this.isOpen = !this.isOpen;
	}
	
	closeMenu(): void {
		this.isOpen = false;
	}
	
	getIconPath(iconName: string): string {
		const icons: { [key: string]: string } = {
			'atla': 'M21.5 15.5v-1.2h-1.9a1 1 0 0 0-.2.7c0 .2 0 .4.2.6.1.2.4.3.6.3.5 0 .8 0 1.3-.4zm2.5 1.3h-2.5v-.7l-2 .8H19l-.8-.4c-.2-.4-.4-.8-.4-1.2 0-.3.1-.5.3-.8.2-.3.4-.5.8-.7h2.5v-.6c0-.9-.4-1.3-1.3-1.3l-1.4.4-1-.4 3-1c.6 0 1.2.1 1.6.4.4.4.6.9.6 1.5v3.3l1 .3v.4m-7.6 0H13v-.4l1-.3V8.7l-1-.4V8l2-.7h.4v8.9l1 .3v.4m-6.9.1c-.4 0-.8-.2-1-.4-.3-.4-.4-.9-.4-1.5v-4.2H6.9v-.5L9 9.4h.5v.9h2v.5h-2v4.3c0 .5.3.8.9.8.1 0 .6 0 1-.3l.4.5-2.3.8m-5.8-1.4v-1.2H1.8l-.2.3v.4c0 .2 0 .4.2.6.1.2.4.3.6.3.5 0 .8 0 1.3-.4zm2.5 1.3H3.7v-.7l-2 .8h-.4l-.8-.4c-.2-.4-.4-.8-.4-1.2 0-.3.1-.5.3-.8.2-.3.4-.5.8-.7h2.5v-.6c0-.9-.4-1.3-1.3-1.3l-1.4.4-1-.4 3-1c.6 0 1.2.1 1.6.4.4.4.6.9.6 1.5v3.3l1 .3v.4',
			'dspace': 'M13.2 15.3H13.6v-.1h.1l.1-.1h.1l.4-.8V9.6c0-.3-.2-.6-.4-.7v-.1h-.2v-.1H13.2v-.1h-2.1c-2.4 0-3.9-2-3.9-4.5V1.8C7.3.8 6.5 0 5.6 0H1.7C.7 0 0 .8 0 1.8v4.4C0 7.2.8 8 1.7 8h2C6 8 8 9.5 8 12c0 2.5-2 4-4.2 4H1.7c-1 0-1.7.8-1.7 1.8v4.4c0 1 .8 1.8 1.7 1.8h3.9c1 0 1.7-.8 1.7-1.8v-2.4c0-2.5 1.5-4.5 3.9-4.5h2zm8.3-12.7A8 8 0 0 0 15.6 0H12v4.6h3.6a4 4 0 0 1 3 1.2c.6.8 1.1 1.9 1.1 3v6.3c0 1.2-.5 2.3-1.2 3a4 4 0 0 1-2.9 1.3H12V24h3.6a8 8 0 0 0 6-2.6A9.1 9.1 0 0 0 24 15V9c0-2.5-1-4.7-2.5-6.3z',
			'worldcat': 'M11.7 15c.5-.6 1.4-.7 2-.2.6.5.7 1.5.2 2.1 0 0-.8 1-1.4 1.4-3.7 3.4-7.2 1.8-9.2.5C2.3 18.3.5 17 .5 17c-.6-.5-.7-1.4-.2-2a1.4 1.4 0 0 1 2-.3s1.7 1.3 2.5 1.8c1.3.6 3.5 2 6-.4l.9-1m3.6-2.7a1.5 1.5 0 0 1 .4-2.1c.7-.5 1.6-.2 2 .5l.9 1.8c1.8 4.7-.8 7.6-2.6 9.2-.7.7-2.6 2-2.6 2a1.4 1.4 0 0 1-2-.4c-.4-.7-.2-1.6.4-2 0 0 1.8-1.3 2.5-2 1-1 3-2.7 1.6-5.8l-.6-1.2M13.9 8A1.4 1.4 0 0 1 12 6.9c-.2-.8.3-1.6 1-1.9l2-.2c4.9-.4 6.8 3 7.7 5.3l1 3.2c.3.8-.2 1.6-1 1.8-.7.2-1.5-.2-1.7-1l-1-3c-.6-1.4-1.6-3.8-4.9-3.4-.9.1-1.3.3-1.3.3M9.5 8c0 .9-.8 1.5-1.6 1.4-.8 0-1.4-.7-1.3-1.6l.3-2C8.2 1 12 .2 14.3 0h3.3c.8.1 1.4.8 1.4 1.6-.1.9-.8 1.5-1.6 1.4h-3c-1.5.2-4 .4-4.7 3.7l-.2 1.4M8 12.4c.7.3 1.1 1.2.8 2-.3.7-1.1 1-1.9.8l-1.7-1c-4.2-2.7-3.7-6.6-3.2-9l1-3.3C3.4 1.2 4.2.8 5 1.1c.7.3 1 1.2.8 2 0 0-.8 2-1 3-.2 1.4-.8 4 2.1 5.7l1.2.6',
			'ebscohost': 'M15.27 5.173c0 2.857-3.27 5.173-3.27 5.173S8.731 8.03 8.731 5.173 12 0 12 0s3.269 2.316 3.269 5.173zM15.27 18.827C15.27 21.684 12 24 12 24s-3.269-2.316-3.269-5.173 3.27-5.172 3.27-5.172 3.268 2.316 3.268 5.172zM18.827 15.27c-2.856 0-5.172-3.27-5.172-3.27s2.316-3.269 5.172-3.269S24 12.001 24 12.001s-2.316 3.268-5.173 3.268zM5.173 15.27C2.316 15.27 0 12 0 12s2.316-3.269 5.173-3.269 5.173 3.27 5.173 3.27-2.316 3.268-5.173 3.268zM16.765 3.054h4.238v4.238h-4.238zM2.997 3.054h4.238v4.238H2.997zM16.765 16.708h4.238v4.239h-4.238zM2.997 16.708h4.238v4.239H2.997z',
			'hwpep': 'M4.3 15.5V7.1l2-1c1.6-.7 2-.9 2.1-.8l-2 18.6H4.3ZM7.6 24v-.3A16209.8 16209.8 0 0 1 9.4 5v-.2l.7-.3.7-.3v2a5886.5 5886.5 0 0 0-.5 17.2v.6H7.5Zm4.2-6.9V3.6l1-.4 1-.5v.1a15874.6 15874.6 0 0 1 1.4 21v.2h-3.5ZM17 23a2489 2489 0 0 0-2-20.7L19.5 0v24h-2.5z',
			'faq':'M18,15H6L2,19V3A1,1 0 0,1 3,2H18A1,1 0 0,1 19,3V14A1,1 0 0,1 18,15M23,9V23L19,19H8A1,1 0 0,1 7,18V17H21V8H22A1,1 0 0,1 23,9M8.19,4C7.32,4 6.62,4.2 6.08,4.59C5.56,5 5.3,5.57 5.31,6.36L5.32,6.39H7.25C7.26,6.09 7.35,5.86 7.53,5.7C7.71,5.55 7.93,5.47 8.19,5.47C8.5,5.47 8.76,5.57 8.94,5.75C9.12,5.94 9.2,6.2 9.2,6.5C9.2,6.82 9.13,7.09 8.97,7.32C8.83,7.55 8.62,7.75 8.36,7.91C7.85,8.25 7.5,8.55 7.31,8.82C7.11,9.08 7,9.5 7,10H9C9,9.69 9.04,9.44 9.13,9.26C9.22,9.08 9.39,8.9 9.64,8.74C10.09,8.5 10.46,8.21 10.75,7.81C11.04,7.41 11.19,7 11.19,6.5C11.19,5.74 10.92,5.13 10.38,4.68C9.85,4.23 9.12,4 8.19,4M7,11V13H9V11H7M13,13H15V11H13V13M13,4V10H15V4H13Z',
			'mail': 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
			'calendar_month': 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z'
		};
		return icons[iconName] || icons['menu_book'];
	}
}