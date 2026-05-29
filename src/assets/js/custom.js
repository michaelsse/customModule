/* ================================== */
/*   Function to add HTML Meta Tags   */
/* ================================== */

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

/* ================================== */
/*   Function to add Header  Links    */
/* ================================== */

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
/* ============================================================= */
/*   Helper to check if a script with given src already exists   */
/* ============================================================= */
function isScriptLoaded(url) {
	return Array.from(document.scripts).some(script => script.src === url);
}

/* ======================================================================== */
/*   Wrap everything in an immediately invoked function expression (IIFE)   */
/* ======================================================================== */
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
	const almaHoursUrl = JS_BASE_PATH + "alma_hours_widget.js";
	const discoveryShowcaseJsUrl = JS_BASE_PATH + "discovery-showcase.bundled.js";
	const nicheAcademyLoaderUrl = JS_BASE_PATH + "nicheAcademyLoader.min.js";
	const primoDoiCleanupUrl = JS_BASE_PATH + "primoDoiCleanup.min.js";
	const userwayUrl = "https://cdn.userway.org/widget.js";
	const userwayAccount = "dDGBItJNUw"; // ← replace with your actual ID


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

	// Load Primo Discovery Showcase Widget Script
	if (!isScriptLoaded(discoveryShowcaseJsUrl)) {
		const discoveryShowcaseJs = document.createElement("script");
		discoveryShowcaseJs.src = discoveryShowcaseJsUrl;
		discoveryShowcaseJs.type = 'module';
		discoveryShowcaseJs.onload = () => console.log("Primo Discovery Showcase Script loaded.");
		discoveryShowcaseJs.onerror = () => console.error("Failed to load Primo Discovery Showcase Script.");
		document.head.appendChild(discoveryShowcaseJs);
	} else {
		console.log("Primo Discovery Showcase Script already loaded.");
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
	
	// Load Primo DOI Cleanup Script
	if (!isScriptLoaded(primoDoiCleanupUrl)) {
		const primoDoiCleanupScript = document.createElement("script");
		primoDoiCleanupScript.src = primoDoiCleanupUrl;
		primoDoiCleanupScript.async = true;
		primoDoiCleanupScript.onload = () => console.log("Primo DOI Cleanup Script loaded.");
		primoDoiCleanupScript.onerror = () => console.error("Failed to load Primo DOI Cleanup Script.");
		document.head.appendChild(primoDoiCleanupScript);
	} else {
		console.log("Primo DOI Cleanup Script already loaded.");
	}

	// Load Niche Academy Loader Script
	if (!isScriptLoaded(nicheAcademyLoaderUrl)) {
		const nicheAcademyLoaderScript = document.createElement("script");
		nicheAcademyLoaderScript.src = nicheAcademyLoaderUrl;
		nicheAcademyLoaderScript.async = true;
		nicheAcademyLoaderScript.onload = () => console.log("Niche Academy Loader Script loaded.");
		nicheAcademyLoaderScript.onerror = () => console.error("Failed to load Niche Academy Loader Script.");
		document.head.appendChild(nicheAcademyLoaderScript);
	} else {
		console.log("Niche Academy Loader Script already loaded.");
	}
})();
