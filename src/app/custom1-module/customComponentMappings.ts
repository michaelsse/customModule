import { ExternalSearchComponent } from '../external-search/external-search.component';
import { HathiTrustComponent } from '../hathi-trust/hathi-trust.component';
import { WtsCustomLibraryResourcesComponent } from '../wts-custom-library-resources/wts-custom-library-resources.component';
import { WtsOpenurlNoticeComponent } from '../wts-openurl-notice/wts-openurl-notice.component';
import { WtsPayFineLinkComponent } from '../wts-pay-fine-link/wts-pay-fine-link.component';
import { WtsOffensiveMaterialsStatementComponent } from '../wts-offensive-materials-statement/wts-offensive-materials-statement.component';
import { WtsReportRecordComponent } from '../wts-report-record/wts-report-record.component';
import { WtsWithdrawnTitleComponent } from '../wts-withdrawn-title/wts-withdrawn-title.component';
import { WtsZoteroInCitationComponent } from '../wts-zotero-in-citation/wts-zotero-in-citation.component';

// Define the map
export const selectorComponentMap = new Map<string, any>([
	['nde-search-bar-filters-before',ExternalSearchComponent],
	['nde-online-availability-before', HathiTrustComponent],
	['nde-user-panel-after',WtsCustomLibraryResourcesComponent],
	['nde-full-display-details-after',WtsOffensiveMaterialsStatementComponent],
	['nde-service-page-top',WtsOpenurlNoticeComponent],
	['nde-account-section-results-bottom',WtsPayFineLinkComponent],
	['nde-record-availability-bottom',WtsReportRecordComponent],
	['nde-record-availability-top',WtsWithdrawnTitleComponent],
	['nde-citation-action-after',WtsZoteroInCitationComponent],
]);
