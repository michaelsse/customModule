import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Observable, map } from "rxjs";
import { Store, select } from "@ngrx/store";
import { TranslateModule } from "@ngx-translate/core";

// Define a type for the fine object for clarity (optional, but good practice)
interface Fine {
	fineType: string;
	// ... other properties
}

@Component({
	selector: "custom-wts-pay-fine-link",
	standalone: true,
	imports: [CommonModule,TranslateModule],
	templateUrl: "./wts-pay-fine-link.component.html",
	styleUrl: "./wts-pay-fine-link.component.scss",
})
export class WtsPayFineLinkComponent implements OnInit {
	// Observable to hold the boolean result
	hasActiveFines$!: Observable<boolean>;

	// Inject the Store
	constructor(private store: Store<any>) {} // Use 'any' if the full state type is unknown

	ngOnInit(): void {
		// 1. Select the finesList from the global state (based on your observation)
		// You might need a specific selector, but 'select' can also use string paths.
		// Replace 'account' and 'finesList' with the actual feature/property names
		// that expose the fines array in your state.
		this.hasActiveFines$ = this.store.pipe(
			select("account", "finesList"), // Adjust this path as needed
			map((finesArray: Fine[] | null) => {
				// Log the array received for debugging
				console.log("Store Fines Array:", finesArray);

				if (Array.isArray(finesArray) && finesArray.length > 0) {
					// Check if ANY fine in the array has a status of 'ACTIVE'
					return finesArray.some((fine) => fine.fineType === "ACTIVE");
				}
				return false;
			}),
		);

		console.log("WtsPayFineLinkComponent Initialized (using Store).");
	}

	// The getter is no longer needed/used, as the logic is in the Observable pipe.
	// We rely entirely on the async pipe in the template.
}
