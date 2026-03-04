// Code copied from https://github.com/unl-libraries/primo-nde-customization/tree/main/src/app/hathi-trust-availability
import { Component, inject, Input, OnInit } from '@angular/core';
import { createFeatureSelector, createSelector, Store } from '@ngrx/store';
import { Observable,map,of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { WtsHathiTrustService } from '../wts-hathi-trust.service';
interface FullDisplayState {
  selectedRecordId: string | null;
}
 
interface SearchState {
  entities: { [key: string]: any };
}

const selectFullDisplay = createFeatureSelector<FullDisplayState>('full-display');
const selectSearchState = createFeatureSelector<SearchState>('Search');
//Next, we create a selector to access the entities:
const selectSearchEntities = createSelector(
	selectSearchState,
	state => state.entities
);
const selectFullDisplayRecordId = createSelector(selectFullDisplay,  state => state.selectedRecordId);
//We can now combine both selectors to get the full record (including the pnx):
const selectFullDisplayRecord = createSelector(
	selectFullDisplayRecordId,
	selectSearchEntities,
	(recordId, searchEntities) => recordId ? searchEntities[recordId] : null 
);
	
export const selectListviewRecord = (recordId: string) =>
  createSelector(
	selectSearchEntities,
		entities => entities[recordId]
	);

@Component({
	selector: 'custom-wts-hathi-trust-availability',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './wts-hathi-trust-availability.component.html',
	styleUrl: './wts-hathi-trust-availability.component.scss'
})
export class WtsHathiTrustAvailabilityComponent implements OnInit {
	@Input() private hostComponent!: any; //needed for retrieving data from the record
	record$: Observable<any> | undefined;
	public store = inject(Store);

	
	oclc: string | undefined;
	fullTextLink: string | boolean=false;
	hathiTrustLookupUrl: string | undefined;
	online: boolean = false;
	isFullRecord: boolean = false;

	entityID: string = 'https://shib.unl.edu/idp/shibboleth';
	hideOnline = true;
	hideIfJournal = false;
	ignoreCopyright = false;;
	
	constructor(private hathiTrust: WtsHathiTrustService) { }
	
	ngOnInit() {
			
		this.record$ = this.store.select(selectFullDisplayRecord); 	//only works when actually viewing the full record	
		this.record$.subscribe((record) => {
			if (record){				
				this.isFullRecord = true;	
				this.updateHathiTrustAvailability(record);
			 }
			 else{
				this.isFullRecord = false;
			 }
		});	
		//console.debug(this.isFullRecord);
		if (!this.isFullRecord){
			//use the hostComponent with the selectListviewRecord instead if we are not viewing a full record
			this.record$ = this.store.select(selectListviewRecord(this.hostComponent?.searchResult?.pnx?.control?.recordid[0]));
			this.record$.subscribe((record) => {
				this.updateHathiTrustAvailability(record);						  
			});	
		}	
				
	}
	
	updateHathiTrustAvailability = (record: any):  Observable<string> | boolean=>{
		this.fullTextLink = false;
		if (this.hideIfJournal && this.isJournal(record)){
				return false;
		}	
		
		if (this.hideOnline && this.isOnline(record)){
			return false;
		}
		if (this.ignoreCopyright && !this.isAvailable(record)){
			this.ignoreCopyright = false;
		}
		//console.debug("Record:",record);
		if (record?.pnx?.addata?.oclcid){
			var hathiTrustIds = (record?.pnx?.addata?.oclcid || []).filter(this.isOclcNum).map((id: string) => {
				return 'oclc:'+id.toLowerCase().replace('(ocolc)','');
			});
		}
		if (hathiTrustIds && (hathiTrustIds.length > 0)) {
			if (this.ignoreCopyright){
				this.hathiTrust.findRecord(hathiTrustIds).subscribe((url) => {
						if (url) this.fullTextLink = this.entityID ?  url + '?signon=swle:'+ this.entityID : url;
						else this.fullTextLink = false;
					}
				);
			}
			else{
				this.hathiTrust.findFullViewRecord(hathiTrustIds).subscribe((url) => {
					if (url) this.fullTextLink = this.entityID ?  url + '?signon=swle:'+ this.entityID : url;
					else this.fullTextLink = false;
				});
				
			}
		} 
		return false;
	} 
	
	isJournal = (record: any): boolean =>{
		//console.debug("Checking record content type");
		if (record && record.pnx){
			if (record.pnx.display && record.pnx.display.type) {
			    var contentType = record.pnx.display.type[0].trim().toLowerCase();
				//console.debug("Content type:",contentType);
		       if (contentType?.indexOf('journal') > -1) {
			         return true;
		       }
		     }
		} 	
		return false;
	}
	
	isOnline = (record: any): boolean =>{
		//console.debug("Checking online status");
		if (record && record.pnx && record.pnx.delivery) {console.debug(record.pnx);}
		return false;
	}
	
	isAvailable = (record: any): boolean =>{
		//console.debug("Checking availability");
		return false;
	}
	
	isOclcNum = (value: string): any =>{
		//console.debug("checking status of oclcnum");
		return value.match(/^(\(ocolc\))?\d+$/i);
	}
}
