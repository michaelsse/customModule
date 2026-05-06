function addMetaTagOnce(attributes) {
	// Check if a meta tag with the same name or property already exists
	const nameAttr = attributes.name;
	const propertyAttr = attributes.property;

	let exists = false;

	if (nameAttr) {
		exists = document.querySelector(`meta[name="${nameAttr}"]`) !== null;
	} else if (propertyAttr) {
		exists = document.querySelector(`meta[property="${propertyAttr}"]`) !== null;
	}

	// Only add if it doesn't exist
	if (!exists) {
		const meta = document.createElement("meta");
		for (const [key, value] of Object.entries(attributes)) {
			meta.setAttribute(key, value);
		}
		document.head.appendChild(meta);
	}
}

function addLinkOnce(attributes) {
	// Check if a link tag with the same rel and sizes already exists
	const relAttr = attributes.rel;
	const sizesAttr = attributes.sizes;

	let selector = `link[rel="${relAttr}"]`;
	if (sizesAttr) {
		selector = `link[rel="${relAttr}"][sizes="${sizesAttr}"]`;
	} else if (attributes.href) {
		// For links without sizes, check by href to avoid duplicates
		selector = `link[rel="${relAttr}"][href="${attributes.href}"]`;
	}

	const exists = document.querySelector(selector) !== null;

	// Only add if it doesn't exist
	if (!exists) {
		const link = document.createElement("link");
		for (const [key, value] of Object.entries(attributes)) {
			link.setAttribute(key, value);
		}
		document.head.appendChild(link);
	}
}

// Helper to check if a script with given src already exists
function isScriptLoaded(url) {
	return Array.from(document.scripts).some(script => script.src === url);
}

// Wrap everything in an immediately invoked function expression (IIFE)
(function() {
	// Configuration
	const PRIMO_VIEW_CODE = "01COL_WTS-WTS_2026";
	const GLOBAL_PATH = "./custom/" + PRIMO_VIEW_CODE + "/assets/";
	const CSS_BASE_PATH = GLOBAL_PATH + "css/";
	const ICON_BASE_PATH = GLOBAL_PATH + "icons/";
	const JS_BASE_PATH = GLOBAL_PATH + "js/";

	// Add all your meta tags
	addMetaTagOnce({
		content: "SKYPE_TOOLBAR_PARSER_COMPATIBLE",
		name: "SKYPE_TOOLBAR"
	});
	addMetaTagOnce({
		content: "telephone=no",
		name: "format-detection"
	});
	addMetaTagOnce({
		content: "42.7862; -86.1026",
		name: "geo.position"
	});
	addMetaTagOnce({
		content: "us",
		name: "geo.country"
	});
	addMetaTagOnce({
		content: "US-MI",
		name: "geo.region"
	});
	addMetaTagOnce({
		content: "Holland",
		name: "geo.placename"
	});
	addMetaTagOnce({
		name: "googlebot",
		content: "all"
	});
	addMetaTagOnce({
		name: "bingbot",
		content: "all"
	});
	addMetaTagOnce({
		name: "duckduckbot",
		content: "all"
	});

	// Add SVG favicon
	addLinkOnce({
		rel: "icon",
		type: "image/svg+xml",
		href: ICON_BASE_PATH + "favicon.svg"
	});
	
	// Add Apple Touch Icons
	addLinkOnce({
		rel: "apple-touch-icon",
		sizes: "152x152",
		href: ICON_BASE_PATH + "apple-icon-152x152.png"
	});
	addLinkOnce({
		rel: "apple-touch-icon",
		sizes: "180x180",
		href: ICON_BASE_PATH + "apple-icon-180x180.png"
	});
	
	// Add Async CSS file
	addLinkOnce({
		rel: "preload",
		href: CSS_BASE_PATH + "custom-async.css",
		as: "style",
		onload: "this.onload=null;this.rel='stylesheet'"
	});
	
	// Load External Javascripts
	const userwayUrl = "https://cdn.userway.org/widget.js";
	const userwayAccount = "dDGBItJNUw"; // ← replace with your actual ID
	const almaHoursUrl = JS_BASE_PATH + "alma_hours_widget.js";
	const nicheAcademyUrl = "https://cdn.nicheacademy.com/na_loader/v1.0.0";

	// Load UserWay widget with data-account
	if (!isScriptLoaded(userwayUrl)) {
		const widgetScript = document.createElement("script");
		widgetScript.src = userwayUrl;
		widgetScript.setAttribute("data-account", userwayAccount);
		widgetScript.async = true;
		widgetScript.onload = () => console.log("UserWay widget loaded.");
		widgetScript.onerror = () => console.error("Failed to load UserWay widget.");
		document.body.prepend(widgetScript);
	} else {
		console.log("UserWay widget already loaded.");
	}

	// Load Alma Hours Widget Script
	if (!isScriptLoaded(almaHoursUrl)) {
		const almaHoursScript = document.createElement("script");
		almaHoursScript.src = almaHoursUrl;
		almaHoursScript.async = true;
		almaHoursScript.onload = () => console.log("Alma Hours Widget Script loaded.");
		almaHoursScript.onerror = () => console.error("Failed to load Alma Hours Widget Script.");
		document.head.appendChild(almaHoursScript);
	} else {
		console.log("Alma Hours Widget Script already loaded.");
	}

	// Load Niche Academy
	if (!window.na) {
	  const queue = [];
	  const na = function () {
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
	// Listen for Angular router navigation completions
	window.addEventListener("popstate", reinitNicheAcademy);

	// Also hook Angular's router if accessible
	// This covers programmatic navigation (router.navigate)
	const _pushState = history.pushState;
	history.pushState = function (...args) {
	  _pushState.apply(history, args);
	  reinitNicheAcademy();
	};

	const _replaceState = history.replaceState;
	history.replaceState = function (...args) {
	  _replaceState.apply(history, args);
	  reinitNicheAcademy();
	};

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

		observer.observe(container, { childList: true });
		window._naObserver = observer; // Store reference for cleanup

		window.dispatchEvent(new Event("na-widget-reload"));
	  }, 300); // Adjust delay if Angular needs more time to render
	}

	// Run once on initial load
	document.addEventListener("DOMContentLoaded", reinitNicheAcademy);
})();