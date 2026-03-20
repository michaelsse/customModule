import { Component, OnInit, OnDestroy, HostListener, ElementRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";

interface ExternalLink {
	label: string;
	url: string;
	icon: string;
	translationKey: string;
}

interface QuerySegment {
	field: string;
	operator: string;
	term: string;
}

@Component({
	selector: "custom-external-search",
	standalone: true,
	imports: [CommonModule, TranslateModule],
	templateUrl: "./external-search.component.html",
	styleUrl: "./external-search.component.scss",
})
export class ExternalSearchComponent implements OnInit, OnDestroy {
	isOpen = false;
	hasQuery = false;
	isBrowseSearch = false; // Track if this is a browse search
	externalLinks: ExternalLink[] = [];
	constructor(private el: ElementRef) {}

	@HostListener("document:click", ["$event"])
	onDocumentClick(event: MouseEvent): void {
		const target = event.target as HTMLElement;
		if (!target.closest("custom-external-search")) {
			this.isOpen = false;
		}
	}
	
	@HostListener("keydown", ["$event"])
	onKeydown(event: KeyboardEvent): void {
		if (!this.isOpen && event.key === "Enter" || event.key === " ") {
			// Handled natively by the button — no action needed
			return;
		}

		if (!this.isOpen) return;

		const items = Array.from(
			(this.el.nativeElement as Element).querySelectorAll('[role="menuitem"]')
		) as HTMLElement[];
		const focused = document.activeElement as HTMLElement;
		const index = items.indexOf(focused);

		switch (event.key) {
			case "Escape":
				this.isOpen = false;
				// Return focus to trigger button
				this.el.nativeElement.querySelector("button")?.focus();
				event.preventDefault();
				break;

			case "ArrowDown":
				event.preventDefault();
				if (index === -1 || index === items.length - 1) {
					items[0]?.focus();
				} else {
					items[index + 1]?.focus();
				}
				break;

			case "ArrowUp":
				event.preventDefault();
				if (index <= 0) {
					items[items.length - 1]?.focus();
				} else {
					items[index - 1]?.focus();
				}
				break;

			case "Home":
				event.preventDefault();
				items[0]?.focus();
				break;

			case "End":
				event.preventDefault();
				items[items.length - 1]?.focus();
				break;

			case "Tab":
				// Close menu when tabbing away
				this.isOpen = false;
				break;
		}
	}

	ngOnInit(): void {
		this.checkWindowLocation();
	}

	// MODIFIED: To handle both advanced (comma-separated segments) and basic (single-term) queries.
	private checkWindowLocation(): void {
		const urlParams = new URLSearchParams(window.location.search);
		const query = urlParams.get("query"); // Get the single string value for 'query'
		const fnParam = urlParams.get("fn"); // Check for fn parameter

		// Check if this is a browse search
		if (fnParam === "BrowseSearch") {
			this.isBrowseSearch = true;
			this.hasQuery = false;
			this.externalLinks = [];
			return; // Exit early, don't process the query
		}
		
		if (query) {
			this.hasQuery = true;
			let queriesArray: string[];

			// Check if this is an advanced query by looking for the pattern "field,operator,term"
			// Advanced queries have at least 2 commas and typically contain semicolons or field names at start
			const isAdvancedQuery = this.isAdvancedQueryFormat(query);

			if (isAdvancedQuery) {
				// Advanced multi-part query string (segments separated by ';')
				queriesArray = query
					.split(";")
					.filter((segment) => segment.trim() !== "");
			} else {
				// Basic, single-term query - safely decode once, then it will be encoded when building URLs
				const decodedQuery = this.safeDecodeURIComponent(query.trim());
				queriesArray = [`any,contains,${decodedQuery}`];
			}

			if (queriesArray.length > 0) {
				this.buildExternalLinks(queriesArray);
			} else {
				this.hasQuery = false;
				this.externalLinks = [];
			}
		} else {
			this.hasQuery = false;
			this.externalLinks = [];
		}
	}

	ngOnDestroy(): void {}

	// Helper to safely decode URI components, avoiding errors with malformed sequences
	private safeDecodeURIComponent(str: string): string {
		try {
			return decodeURIComponent(str);
		} catch (e) {
			// If decoding fails (malformed URI), return the original string
			console.warn('Failed to decode URI component:', str, e);
			return str;
		}
	}

	// Helper to determine if query string is in advanced format
	private isAdvancedQueryFormat(query: string): boolean {
		// Advanced queries have the pattern: "field,operator,term" with known field names
		const knownFields = ['any', 'title', 'creator', 'sub', 'issn', 'isbn'];

		// 1. Check if query contains semicolons (strong indicator of advanced multi-segment format)
		if (query.includes(';')) {
			return true;
		}

		// 2. Check for the strict "knownField,searchType,term" pattern
		const parts = query.split(',');
		
		// An advanced query must have at least 3 comma-separated parts (field, type, term)
		if (parts.length >= 3) {
			const potentialField = parts[0].trim().toLowerCase();
			
			// Must start with a known field
			if (knownFields.includes(potentialField)) {
				// This is a single advanced segment like 'title,exact,My Title'
				return true;
			}
		}

		// If it doesn't contain a semicolon AND doesn't strictly follow the
		// 'knownField,type,term' pattern, treat it as a basic single-term query.
		return false;
	}

	toggleMenu(event: MouseEvent): void {
		event.stopPropagation();
		this.isOpen = !this.isOpen;
		
		if (this.isOpen) {
			// Wait for Angular to render the menu items before focusing
			setTimeout(() => {
				const first = (this.el.nativeElement as Element).querySelector('[role="menuitem"]') as HTMLElement | null;
first?.focus();
				first?.focus();
			});
		}
	}

	closeMenu(): void {
		this.isOpen = false;
	}

	private buildExternalLinks(queries: string[]): void {
		const segments = this.parseQueries(queries);

		this.externalLinks = [
			{
				label: "ATLA Database",
				url: this.buildAtlaUrl(segments),
				icon: "ebscohost",
				translationKey: "nui.customization.externalSearch.atla",
			},
			{
				label: "Google Scholar",
				url: this.buildGoogleScholarUrl(segments),
				icon: "gscholar",
				translationKey: "nui.customization.externalSearch.scholar",
			},
			{
				label: "Herrick District Library",
				url: this.buildHerrickUrl(segments),
				icon: "local_library",
				translationKey: "nui.customization.externalSearch.herrick",
			},
			{
				label: "Hope College Primo",
				url: this.buildHopePrimoUrl(segments),
				icon: "hopec",
				translationKey: "nui.customization.externalSearch.hopePrimo",
			},
			{
				label: "HWPEP Catalog",
				url: this.buildHwpepUrl(segments),
				icon: "hwpep",
				translationKey: "nui.customization.externalSearch.hwpep",
			},
			{
				label: "WorldCat",
				url: this.buildWorldCatUrl(segments),
				icon: "worldcat",
				translationKey: "nui.customization.externalSearch.worldcat",
			}
		];
	}

	private limitSegmentsByWordCount(segments: QuerySegment[], maxWords: number): QuerySegment[] {
		const limitedSegments: QuerySegment[] = [];
		let wordCount = 0;
		
		for (const seg of segments) {
			const words = seg.term.split(/\s+/).length;
			if (wordCount + words <= maxWords) {
				limitedSegments.push(seg);
				wordCount += words;
			} else {
				console.log(`Stopped at ${limitedSegments.length} segments due to ${maxWords} word limit`);
				break;
			}
		}
		
		return limitedSegments.length > 0 ? limitedSegments : [segments[0]]; // At least include first segment
	}

	private parseQueries(queries: string[]): QuerySegment[] {
		const segments: QuerySegment[] = [];

		// console.log("Parsing queries:", queries); // Removed console.log

		queries.forEach((query) => {
			const parts = query.split(',');
			
			// A segment must have at least the Field, Type, and Term (3 parts)
			if (parts.length < 3) {
				return; 
			}

			const field = parts[0].trim(); // e.g., 'any'
			// parts[1] is searchType (contains, exact, etc.) - we skip this for now

			// 1. Assume everything from the third part (index 2) onwards is the term/operator
			let rawTermParts = parts.slice(2); 

			// 2. Check if the very last part is a valid boolean operator
			let operator = "AND";
			const potentialOp = rawTermParts[rawTermParts.length - 1]?.trim().toUpperCase();
			
			if (potentialOp === "AND" || potentialOp === "OR" || potentialOp === "NOT") {
				operator = potentialOp;
				// Remove the operator from the term parts array
				rawTermParts = rawTermParts.slice(0, -1); 
			}

			// 3. Join the remaining parts to form the full term (including any internal commas)
			const rawTerm = rawTermParts.join(',');
			
			// 4. Decode and clean the final term
			const term = this.safeDecodeURIComponent(rawTerm.trim());

			if (term.length > 0) {
				segments.push({
					field: field,
					operator: operator,
					term: term,
				});
				// console.log(`Segment ${segments.length}:`, { field, operator, term }); // Removed console.log
			}
		});

		// console.log("Final parsed segments:", segments); // Removed console.log
		return segments;
	}

	// Helper method to safely encode search terms for URLs
	private encodeSearchTerm(term: string): string {
		return encodeURIComponent(term);
	}

	private buildHopePrimoUrl(segments: QuerySegment[]): string {
		const base =
		"https://col-hope.primo.exlibrisgroup.com/nde/search?vid=01COL_HOPE:NDE&facet=tlevel,include,available_p&tab=Everything&search_scope=MyInst_and_CI";
		
		// Get the original query parameter from the current URL
		const urlParams = new URLSearchParams(window.location.search);
		const originalQuery = urlParams.get("query");
		const originalMode = urlParams.get("mode") || "simple";
		
		// If we have an original query, append it directly to the base
		if (originalQuery) {
			return `${base}&mode=${originalMode}&query=${originalQuery}`;
		}
		
		// Fallback: if no original query exists, build from segments (existing logic)
		const queryParams = segments
		.map((seg) => {
			return `query=${seg.field},contains,${this.encodeSearchTerm(seg.term)},${seg.operator}`;
		})
		.join("&");
		
		return `${base}&${queryParams}`;
	}

	private buildAtlaUrl(segments: QuerySegment[]): string {
		const base =
			"https://login.westernsem.idm.oclc.org/login?url=https://search.ebscohost.com/login.aspx?direct=true&db=lsdar&db=rvh&db=oah&type=1&searchMode=And&site=ehost-live&scope=site";

		const queryParts = segments
			.map((seg, index) => {
				const prefix = this.mapFieldToAtla(seg.field);
				// Use the operator from the PREVIOUS segment (except for first segment)
				const operator = index > 0 ? `+${segments[index - 1].operator}+` : "";
				return `${operator}${prefix}+${this.encodeSearchTerm(seg.term).replace(/%20/g, "+")}`;
			})
			.join("");

		return `${base}&bquery=${queryParts}`;
	}

	private buildWorldCatUrl(segments: QuerySegment[]): string {
		const base = 'https://westerntheolseminary.on.worldcat.org/search?&databaseList=143,233,2013,638,283&scope=0&clusterResults=false&se=nodgr&sd=desc&qt=sort_nodgr_desc';
		
		// WorldCat has a 40 word limit
		const limitedSegments = this.limitSegmentsByWordCount(segments, 40);
		
		const queryParts = limitedSegments.map((seg, index) => {
			const prefix = this.mapFieldToWorldCat(seg.field);
			// Use the operator from the PREVIOUS segment (except for first segment)
			const operator = index > 0 ? `%20${limitedSegments[index - 1].operator}%20%20` : '';
			return `${operator}${prefix}:${this.encodeSearchTerm(seg.term)}`;
		}).join('');
		
		return `${base}&queryString=${queryParts}`;
	}

	private buildHerrickUrl(segments: QuerySegment[]): string {
		const base = 'https://herrickdl.bibliocommons.com/v2/search?searchType=bl&suppress=true';
		
		// Build the query first to check length
		let url = base;
		let queryParts = '';
		
		for (let i = 0; i < segments.length; i++) {
			const seg = segments[i];
			const prefix = this.mapFieldToHerrick(seg.field);
			const operator = i > 0 ? `+${segments[i - 1].operator}%20` : '';
			const part = `${operator}${prefix}%3A(${this.encodeSearchTerm(seg.term)})`;
			
			const testUrl = `${url}&query=(${queryParts}${part}+AND)`;
			
			// Herrick has a 900 character limit
			if (testUrl.length > 900) {
				console.log(`Herrick URL truncated at segment ${i} due to 900 char limit`);
				break;
			}
			
			queryParts += part;
		}
		
		return `${url}&query=(${queryParts})`;
	}

	private buildHwpepUrl(segments: QuerySegment[]): string {
		const base = 'https://catx.hope.edu/hwpep/Search/Results';
		
		// HWPEP advanced search format: 
		// join=AND&lookfor0[]=term1&type0[]=Field1&lookfor0[]=term2&type0[]=Field2&bool0[]=AND
		
		if (segments.length === 0) {
			return `${base}?type=AllFields&lookfor=`;
		}
		
		// For single segment, use simple format
		if (segments.length === 1) {
			const fieldType = this.mapFieldToHwpep(segments[0].field);
			return `${base}?type=${fieldType}&lookfor=${this.encodeSearchTerm(segments[0].term)}`;
		}
		
		// For multiple segments, use advanced format
		let url = `${base}?join=AND`;
		
		segments.forEach((seg, index) => {
			const fieldType = this.mapFieldToHwpep(seg.field);
			url += `&lookfor${index}[]=${this.encodeSearchTerm(seg.term)}`;
			url += `&type${index}[]=${fieldType}`;
			
			// Add boolean operator (except for last segment)
			if (index < segments.length - 1) {
				url += `&bool${index}[]=${seg.operator}`;
			}
		});
		
		// Add standard params
		url += `&illustration=-1&daterange[]=publishDate&publishDatefrom=&publishDateto=`;
		
		return url;
	}

	private buildGoogleScholarUrl(segments: QuerySegment[]): string {
		const base = "https://scholar.google.com/scholar";

		const queryTerms = segments
			.map((seg, index) => {
				// Use the operator from the PREVIOUS segment (except for first segment)
				const operator = index > 0 ? ` ${segments[index - 1].operator} ` : "";
				return `${operator}${seg.term}`;
			})
			.join("");

		return `${base}?q=${encodeURIComponent(queryTerms)}`;
	}

	private mapFieldToAtla(field: string): string {
		const mapping: { [key: string]: string } = {
			any: "TX",
			title: "TI",
			creator: "AU",
			sub: "SU",
			issn: "IS",
			isbn: "IB",
		};
		return mapping[field] || "TX";
	}

	private mapFieldToWorldCat(field: string): string {
		const mapping: { [key: string]: string } = {
			any: "kw",
			title: "ti",
			creator: "au",
			sub: "su",
			issn: "n2",
			isbn: "bn",
		};
		return mapping[field] || "kw";
	}

	private mapFieldToHerrick(field: string): string {
		const mapping: { [key: string]: string } = {
			any: "anywhere",
			title: "title",
			creator: "contributor",
			sub: "subject",
			isbn: "identifier",
		};
		return mapping[field] || "anywhere";
	}
	
	private mapFieldToHwpep(field: string): string {
		const mapping: { [key: string]: string } = {
			any: 'AllFields',
			title: 'Title',
			creator: 'Author',
			sub: 'Subject',
			issn: 'ISN',
			isbn: 'ISN'
		};
		return mapping[field] || 'AllFields';
	}

	getIconPath(iconName: string): string {
		const icons: { [key: string]: string } = {
			hopec:
				"M23.6 16.6 15.8 6l-1.4-2A3 3 0 0 0 9.9 4L.6 16.2c-.7.9-.8 2.2-.4 3.1a3 3 0 0 0 2.6 1.8h18.5c.5 0 .9-.1 1.3-.4.3-.2.7-.5.9-.9.6-.9.7-2.3 0-3.2m-6.2-5.9-.5.3v-.6h.4c.7.1 1 .9 1.2 1.5v.5c-.3.1-.6 0-.8 0l-.4-.6.5-.3a2 2 0 0 0-.4-.8M5.4 20.4h-3C1.6 20.2 1 19.6.8 19c-.3-.7-.2-1.7.3-2.2l1.7-2.3.4 1c-.7.9-1.4 1.8-1 3 .4 1.5 2 1.8 3.2 2zm-.8-3V17l.2-.1c.2-.9-.2-1.7 0-2.5 0-.2.4-.5 0-.7l-.3.2c-.4.3-1 0-1.4.2V14l7.4-9.7c.5-.6 1.3-.8 2-.6.6.1 1.1.4 1.5 1l4 5.5c-.4-.3-.7-.5-1.2-.4-.3 0-.5.4-.6.7v.7l-.2.2L14.8 9v-.1c0-.2 0-.5-.3-.5l-.7-1.6-.2-.5-.1-.1-.7-1.5-.1-.4c-.3 0-.7.1-.9.4 0 .1 0 .3.2.4l.5 1.5c0 .2 0 .4.2.6l.7 1.8c0 .2 0 .5.2.6l1 2.5-8.7 4.7-1.3.6m5.2.3c-1 .4-2.2.4-3.2.2L9.8 16a6 6 0 0 0 0 1.7M23 19.1c-.2.5-.7 1-1.2 1.2l-1.1.2H6.3v-.1c1.4-.3 2.6-.7 3.9-1.2.1.4.4.8.8 1h.2a7.8 7.8 0 0 0 3.3-3c.3-.4.8-.6 1-1v-.4l-.5.2c-1.3.4-2.4-.6-3.8-.3l-1.1.2L15 13l1.2 2.6.2.5h.1l.8 1.8.2.4.7 1.4.1.4c.4 0 .7-.2 1-.4l-.3-.4-.5-1.3c.1-.2 0-.4-.1-.6h-.1l-.7-1.8-.1-.5h-.1l-1-2.8s.2-.2.3-.1c.4.5.9 1 1.6.9.3 0 .6-.4.6-.7.1-.4 0-.8-.1-1.2l4.2 5.7c.3.6.4 1.5.1 2.2",
			ebscohost:
				"M15.27 5.173c0 2.857-3.27 5.173-3.27 5.173S8.731 8.03 8.731 5.173 12 0 12 0s3.269 2.316 3.269 5.173zM15.27 18.827C15.27 21.684 12 24 12 24s-3.269-2.316-3.269-5.173 3.27-5.172 3.27-5.172 3.268 2.316 3.268 5.172zM18.827 15.27c-2.856 0-5.172-3.27-5.172-3.27s2.316-3.269 5.172-3.269S24 12.001 24 12.001s-2.316 3.268-5.173 3.268zM5.173 15.27C2.316 15.27 0 12 0 12s2.316-3.269 5.173-3.269 5.173 3.27 5.173 3.27-2.316 3.268-5.173 3.268zM16.765 3.054h4.238v4.238h-4.238zM2.997 3.054h4.238v4.238H2.997zM16.765 16.708h4.238v4.239h-4.238zM2.997 16.708h4.238v4.239H2.997z",
			worldcat:
				"M11.7 15c.5-.6 1.4-.7 2-.2.6.5.7 1.5.2 2.1 0 0-.8 1-1.4 1.4-3.7 3.4-7.2 1.8-9.2.5C2.3 18.3.5 17 .5 17c-.6-.5-.7-1.4-.2-2a1.4 1.4 0 0 1 2-.3s1.7 1.3 2.5 1.8c1.3.6 3.5 2 6-.4l.9-1m3.6-2.7a1.5 1.5 0 0 1 .4-2.1c.7-.5 1.6-.2 2 .5l.9 1.8c1.8 4.7-.8 7.6-2.6 9.2-.7.7-2.6 2-2.6 2a1.4 1.4 0 0 1-2-.4c-.4-.7-.2-1.6.4-2 0 0 1.8-1.3 2.5-2 1-1 3-2.7 1.6-5.8l-.6-1.2M13.9 8A1.4 1.4 0 0 1 12 6.9c-.2-.8.3-1.6 1-1.9l2-.2c4.9-.4 6.8 3 7.7 5.3l1 3.2c.3.8-.2 1.6-1 1.8-.7.2-1.5-.2-1.7-1l-1-3c-.6-1.4-1.6-3.8-4.9-3.4-.9.1-1.3.3-1.3.3M9.5 8c0 .9-.8 1.5-1.6 1.4-.8 0-1.4-.7-1.3-1.6l.3-2C8.2 1 12 .2 14.3 0h3.3c.8.1 1.4.8 1.4 1.6-.1.9-.8 1.5-1.6 1.4h-3c-1.5.2-4 .4-4.7 3.7l-.2 1.4M8 12.4c.7.3 1.1 1.2.8 2-.3.7-1.1 1-1.9.8l-1.7-1c-4.2-2.7-3.7-6.6-3.2-9l1-3.3C3.4 1.2 4.2.8 5 1.1c.7.3 1 1.2.8 2 0 0-.8 2-1 3-.2 1.4-.8 4 2.1 5.7l1.2.6",
			local_library:
				"M12 11.55C9.64 9.35 6.48 8 3 8v11c3.48 0 6.64 1.35 9 3.55 2.36-2.19 5.52-3.55 9-3.55V8c-3.48 0-6.64 1.35-9 3.55zM12 8c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z",
			hwpep:
				"M4.3 15.5V7.1l2-1c1.6-.7 2-.9 2.1-.8l-2 18.6H4.3ZM7.6 24v-.3A16209.8 16209.8 0 0 1 9.4 5v-.2l.7-.3.7-.3v2a5886.5 5886.5 0 0 0-.5 17.2v.6H7.5Zm4.2-6.9V3.6l1-.4 1-.5v.1a15874.6 15874.6 0 0 1 1.4 21v.2h-3.5ZM17 23a2489 2489 0 0 0-2-20.7L19.5 0v24h-2.5z",
			gscholar:
				'M18.308 13.985s0 .004.005.004c.43.91.674 1.926.674 2.999a6.994 6.994 0 1 1-13.315-2.994 6.821 6.821 0 0 1 .965-1.5 6.98 6.98 0 0 1 5.358-2.496c1.573 0 3.025.52 4.196 1.4a7.174 7.174 0 0 1 1.864 2.1c.094.159.178.327.258.491zm1.236-.881a8.493 8.493 0 0 0-15.109 0L0 9.496 11.99 0l11.99 9.496-4.436 3.612Z" style="stroke-width:1',
		};
		return icons[iconName] || icons["database"];
	}
}