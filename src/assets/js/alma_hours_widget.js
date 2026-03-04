/* ALMA HOURS WIDGET - Robust Vanilla JS */

const scriptPath = "https://repository.westernsem.edu/Alma-Hours-Widget/alma_hours_widget.php";

function loadAlmaWidget(widget) {
  if (!widget || widget.dataset.loaded) return;
  widget.dataset.loaded = "true";

  const inputLibrary = widget.getAttribute("data-library") || "";
  const inputTitle = widget.getAttribute("data-title") || "";
  const inputStartDate = widget.getAttribute("data-start-date") || "";
  const inputEndDate = widget.getAttribute("data-end-date") || "";
  const inputDateFormat = widget.getAttribute("data-date-format") || "";
  const inputTimeFormat = widget.getAttribute("data-time-format") || "";

  const params = new URLSearchParams({
    library: inputLibrary,
    from: inputStartDate,
    to: inputEndDate,
    date_format: inputDateFormat,
    time_format: inputTimeFormat
  });

  fetch(`${scriptPath}?${params.toString()}`)
    .then(response => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then(json => {
      const widgetDays = [];

      Object.entries(json).forEach(([date, day]) => {
        if (day.closed) {
          widgetDays.push(
            `<li class="alma_hours_row">
               <span class="alma_hours_row_date">${day.date}</span>
               <span class="alma_hours_row_closed">Closed</span>
             </li>`
          );
        } else if (day.open24hours) {
          widgetDays.push(
            `<li class="alma_hours_row">
               <span class="alma_hours_row_date">${day.date}</span>
               <span class="alma_hours_row_open24hours">Open 24 Hours</span>
             </li>`
          );
        } else {
          let hoursHtml = "";
          (day.hours || []).forEach((hours, index) => {
            const range = `<span class="alma_hours_row_open">${hours.open}</span>-<span class="alma_hours_row_close">${hours.close}</span>`;
            hoursHtml += (index > 0 ? ", " : "") + range;
          });
          widgetDays.push(
            `<li class="alma_hours_row">
               <span class="alma_hours_row_date">${day.date}</span>
               ${hoursHtml}
             </li>`
          );
        }
      });

      widget.innerHTML = `
        <div class="alma_hours_widget_title"><h4>${inputTitle}</h4></div>
        <ul class="alma_hours_list">${widgetDays.join("")}</ul>
      `;
      widget.style.display = "block";
    })
    .catch(error => {
      console.error("Alma Hours Widget Request Failed:", error);
      widget.innerHTML = `<div class="alma_hours_widget_error">Unable to load hours.</div>`;
    });
}

function initializeAllWidgets() {
  document.querySelectorAll(".alma_hours_widget").forEach(loadAlmaWidget);
}

// Run when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeAllWidgets);
} else {
  initializeAllWidgets();
}

// Watch for dynamically added widgets
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === 1) {
        if (node.classList.contains("alma_hours_widget")) loadAlmaWidget(node);
        node.querySelectorAll?.(".alma_hours_widget").forEach(loadAlmaWidget);
      }
    });
  });
});

observer.observe(document.body, { childList: true, subtree: true });
