// Load Niche Academy
{
	const nicheAcademyUrl = "https://cdn.nicheacademy.com/na_loader/v1.0.0";

	if (!window.na) {
		const queue = [];
		const na = function() {
			na.process ? na.process.apply(na, arguments) : queue.push(arguments);
		};
		na.queue = queue;
		na.t = Date.now();
		window.na = na;

		if (!isScriptLoaded(nicheAcademyUrl)) {
			const naScript = document.createElement("script");
			naScript.src = nicheAcademyUrl;
			naScript.async = true;
			naScript.crossOrigin = "anonymous";
			naScript.onload = () => console.log("Niche Academy loaded.");
			naScript.onerror = () => console.error("Failed to load Niche Academy.");

			const firstScript = document.getElementsByTagName("script")[0];
			if (firstScript?.parentNode) {
				firstScript.parentNode.insertBefore(naScript, firstScript);
			} else {
				document.head.appendChild(naScript); // Fallback
			}
		}

		na("init", "d5f047c7591c4f6d395752f842804d10");
		na("event", "pageload");
	} else {
		console.log("Niche Academy already loaded.");
	}

	// Niche Academy widgets on Full Item pages
	// Primo VE DOM watcher
	let naDebounce;
	
	const pageObserver = new MutationObserver(() => {
		clearTimeout(naDebounce);
		
		naDebounce = setTimeout(() => {
			const container =
            document.querySelector("#view-it-card-links");
			
			if (container) {
				console.log(
                "Primo change detected, reloading Niche Academy"
			);
			
            reinitNicheAcademy();
		}
	}, 750);
});

pageObserver.observe(document.body, {
    childList: true,
    subtree: true
});

	function reinitNicheAcademy() {
		// Give Angular time to finish rendering the new view
		setTimeout(() => {
			const container = document.querySelector("#view-it-card-links");

			if (!container) {
				console.warn("Niche Academy: #view-it-card-links not found on this page.");
				return;
			}

			// Disconnect previous observer before re-observing
			if (window._naObserver) {
				window._naObserver.disconnect();
			}

			const observer = new MutationObserver(() => {
				window.dispatchEvent(new Event("na-widget-reload"));
			});

			observer.observe(container, {
				childList: true
			});
			window._naObserver = observer; // Store reference for cleanup

			window.dispatchEvent(new Event("na-widget-reload"));
		}, 300); // Adjust delay if Angular needs more time to render
	}

	// Run once on initial load
	document.addEventListener("DOMContentLoaded", reinitNicheAcademy);
}

// Remove Modal DOM when closed
{
	const observer = new MutationObserver((mutations) => {
	  mutations.forEach(mutation => {

		// Case 1: modal was removed from the DOM entirely
		mutation.removedNodes.forEach(node => {
		  if (node.nodeType === 1 && (
			node.matches?.('.na.modal-na.lightboxNicheAcademy') ||
			node.querySelector?.('.na.modal-na.lightboxNicheAcademy')
		  )) {
			node.remove?.();
		  }
		});

		// Case 2: modal is hidden via a class or style change (e.g. display:none, visibility:hidden)
		if (mutation.type === 'attributes' && mutation.target.matches('.na.modal-na.lightboxNicheAcademy')) {
		  const el = mutation.target;
		  const style = window.getComputedStyle(el);
		  if (style.display === 'none' || style.visibility === 'hidden' || el.classList.contains('hidden')) {
			el.remove();
		  }
		}
	  });
	});

	observer.observe(document.body, {
	  childList: true,
	  subtree: true,
	  attributes: true,
	  attributeFilter: ['style', 'class']
	});
}

