/* ================================================== */
/*   Clean up DOIs entered as URLs on citationLinker  */
/* ================================================== */
(function() {
	const DOI_URL_PATTERN = /^https?:\/\/(dx\.)?doi\.org\/10\./i;

	function stripToPath(value) {
		const trimmed = value.trim();
		if (!DOI_URL_PATTERN.test(trimmed)) {
			return trimmed;
		}
		try {
			const url = new URL(trimmed);
			return url.pathname.replace(/^\//, '');
		} catch {
			return trimmed;
		}
	}

	function applyStrip(input) {
		const stripped = stripToPath(input.value);
		if (stripped !== input.value) {
			const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
				window.HTMLInputElement.prototype, 'value'
			).set;
			nativeInputValueSetter.call(input, stripped);
			input.dispatchEvent(new Event('input', {
				bubbles: true
			}));
		}
	}

	function attachDoiStripper(input) {
		if (input.dataset.doiStripperAttached) return;
		input.dataset.doiStripperAttached = 'true';

		input.addEventListener('blur', () => applyStrip(input));
		input.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') applyStrip(input);
		});
	}

	function findAndAttach() {
		// querySelectorAll catches every DOI field present in the DOM at once
		document.querySelectorAll('[data-qa="citationLinker.doi"]').forEach(wrapper => {
			const input = wrapper.querySelector('input[type="text"]');
			if (input) attachDoiStripper(input);
		});
	}

	const observer = new MutationObserver(() => findAndAttach());
	observer.observe(document.body, {
		childList: true,
		subtree: true
	});

	findAndAttach();
})();