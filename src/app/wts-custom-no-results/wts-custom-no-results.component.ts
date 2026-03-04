import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";

interface ExternalLink {
	label: string;
	url: string;
	translationKey: string;
}

interface QuerySegment {
	field: string;
	operator: string;
	term: string;
}

@Component({
	selector: 'custom-wts-custom-no-results',
	standalone: true,
	imports: [CommonModule, TranslateModule],
	templateUrl: './wts-custom-no-results.component.html',
	styleUrl: './wts-custom-no-results.component.scss'
})

export class WtsCustomNoResultsComponent implements OnInit, OnDestroy {
	isOpen = false;
	hasQuery = false;
	
	isBrowseSearch = false; // Track if this is a browse search
	externalLinks: ExternalLink[] = [];
	expandResultsUrl = '';
	showExpandResults = false;
	
	constructor() {}

	@HostListener("document:click", ["$event"])
	onDocumentClick(event: MouseEvent): void {
		const target = event.target as HTMLElement;
		if (!target.closest("custom-external-search")) {
			this.isOpen = false;
		}
	}

	ngOnInit(): void {
		this.checkWindowLocation();
		this.buildExpandResultsUrl();
	}
	
	private buildExpandResultsUrl(): void {
		const currentUrl = window.location.href;
		
		// Only show expand results if pcAvailability=true is NOT already in the URL
		if (!currentUrl.includes('pcAvailability=true')) {
			this.showExpandResults = true;
			const separator = currentUrl.includes('?') ? '&' : '?';
			this.expandResultsUrl = `${currentUrl}${separator}pcAvailability=true`;
		} else {
			this.showExpandResults = false;
		}
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
				translationKey: "nui.customization.externalSearch.atla",
			},
			{
				label: "Google Scholar",
				url: this.buildGoogleScholarUrl(segments),
				translationKey: "nui.customization.externalSearch.scholar",
			},
			{
				label: "Herrick District Library",
				url: this.buildHerrickUrl(segments),
				translationKey: "nui.customization.externalSearch.herrick",
			},
			{
				label: "Hope College Primo",
				url: this.buildHopePrimoUrl(segments),
				translationKey: "nui.customization.externalSearch.hopePrimo",
			},
			{
				label: "HWPEP Catalog",
				url: this.buildHwpepUrl(segments),
				translationKey: "nui.customization.externalSearch.hwpep",
			},
			{
				label: "WorldCat",
				url: this.buildWorldCatUrl(segments),
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
			"https://col-hope.primo.exlibrisgroup.com/discovery/search?vid=01COL_HOPE:HOPE&facet=tlevel,include,available_p&mode=advanced";

		// Hope Primo uses multiple query parameters
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
}