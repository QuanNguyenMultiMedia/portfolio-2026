// DOM Element Selections
const uiElements = {
    svgElement: d3.select("#beeswarm-plot"),
    tooltip: d3.select(".tooltip"),
    sidePanel: d3.select("#side-panel"),
    panelContent: d3.select("#panel-content"),
    closePanelBtn: d3.select("#close-panel-btn"),
    legendContainer: d3.select("#legend"),
    loadingMessage: d3.select("#loading-message"),
    chartContainerElement: d3.select("#chart-container"),
    noDataMessageElement: d3.select("#no-data-message"),

    subtypeFilterContainer: document.getElementById('subtype-filter-container'),
    toggleSubtypesCheckbox: document.getElementById('toggle-subtypes'),

    yearStartSlider: document.getElementById('year-start-slider'),
    yearEndSlider: document.getElementById('year-end-slider'),
    yearStartLabel: document.getElementById('year-start-label'),
    yearEndLabel: document.getElementById('year-end-label'),
    resetFiltersBtn: document.getElementById('reset-filters-btn'),

    minDeathsSlider: document.getElementById('min-deaths-slider'),
    minDeathsLabel: document.getElementById('min-deaths-label'),
    minDeathsSliderMinLabel: document.getElementById('min-deaths-slider-min-label'),
    minDeathsSliderMaxLabel: document.getElementById('min-deaths-slider-max-label'),

    minAffectedSlider: document.getElementById('min-affected-slider'),
    minAffectedLabel: document.getElementById('min-affected-label'),
    minAffectedSliderMinLabel: document.getElementById('min-affected-slider-min-label'),
    minAffectedSliderMaxLabel: document.getElementById('min-affected-slider-max-label'),
};

function setupSidePanel() {
    uiElements.sidePanel
        .style("width", `${config.interaction.sidePanelWidth}px`)
        .style("right", `-${config.interaction.sidePanelWidth + config.interaction.sidePanelHideOffset}px`);

    uiElements.closePanelBtn.on("click", () => {
        gsap.to("#side-panel", {
            right: `-${config.interaction.sidePanelWidth + config.interaction.sidePanelHideOffset}px`,
            duration: config.animation.sidePanelAnimationDuration,
            ease: "expo.in"
        });
    });
}

function populateSidePanel(d) {
    uiElements.panelContent.html(`
        <h3>${d.eventName}</h3>
        <p><strong>Start Date:</strong> ${d.startDay || 'N/A'}/${d.startMonth || 'N/A'}/${d.startYear}</p>
        <p><strong>End Date:</strong> ${d.endDay || 'N/A'}/${d.endMonth || 'N/A'}/${d.endYear || 'N/A'}</p>
        <p><strong>Location:</strong> ${d.location || 'N/A'}</p>
        <hr>
        <p><strong>Disaster Group:</strong> ${d.disasterGroup || 'N/A'}</p>
        <p><strong>Subgroup:</strong> ${d.disasterSubgroup || 'N/A'}</p>
        <p><strong>Type:</strong> ${d.disasterType || 'N/A'}</p>
        <p><strong>Subtype:</strong> ${d.disasterSubtype || 'N/A'}</p>
        <hr>
        <p><strong>Total Deaths:</strong> ${d.totalDeaths ? d.totalDeaths.toLocaleString() : 'N/A'}</p>
        <p><strong>No. Injured:</strong> ${d.noInjured ? d.noInjured.toLocaleString() : 'N/A'}</p>
        <p><strong>No. Affected:</strong> ${d.noAffected ? d.noAffected.toLocaleString() : 'N/A'}</p>
        <p><strong>No. Homeless:</strong> ${d.noHomeless ? d.noHomeless.toLocaleString() : 'N/A'}</p>
        <p><strong>Total Affected:</strong> ${d.totalAffected ? d.totalAffected.toLocaleString() : 'N/A'}</p>
    `);
}

function openSidePanel() {
    gsap.to("#side-panel", {
        right: 0,
        duration: config.animation.sidePanelAnimationDuration,
        ease: "expo.out"
    });
}


function populateFilters(originalData, currentFilters, applyFiltersAndRedrawCallback) {
    const allSubtypes = Array.from(new Set(originalData.map(d => d.disasterSubtype))).sort();
    uiElements.subtypeFilterContainer.innerHTML = ''; // Clear previous checkboxes
    allSubtypes.forEach(subtype => {
        currentFilters.subtypes.add(subtype); // Initially select all
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = subtype;
        checkbox.checked = true;
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                currentFilters.subtypes.add(subtype);
            } else {
                currentFilters.subtypes.delete(subtype);
            }
            applyFiltersAndRedrawCallback();
        });
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${subtype}`));
        uiElements.subtypeFilterContainer.appendChild(label);
    });

    uiElements.toggleSubtypesCheckbox.checked = true;
    uiElements.toggleSubtypesCheckbox.addEventListener('change', () => {
        const isChecked = uiElements.toggleSubtypesCheckbox.checked;
        const checkboxes = uiElements.subtypeFilterContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.checked = isChecked;
            if (isChecked) {
                currentFilters.subtypes.add(cb.value);
            } else {
                currentFilters.subtypes.delete(cb.value);
            }
        });
        applyFiltersAndRedrawCallback();
    });

    // Year Sliders
    const yearExtent = d3.extent(originalData, d => d.startYear);
    currentFilters.startYear = yearExtent[0];
    currentFilters.endYear = yearExtent[1];

    [uiElements.yearStartSlider, uiElements.yearEndSlider].forEach(slider => {
        slider.min = yearExtent[0];
        slider.max = yearExtent[1];
    });
    uiElements.yearStartSlider.value = yearExtent[0];
    uiElements.yearStartLabel.textContent = yearExtent[0];
    uiElements.yearEndSlider.value = yearExtent[1];
    uiElements.yearEndLabel.textContent = yearExtent[1];

    uiElements.yearStartSlider.addEventListener('input', () => {
        const startVal = parseInt(uiElements.yearStartSlider.value);
        const endVal = parseInt(uiElements.yearEndSlider.value);
        if (startVal > endVal) {
            uiElements.yearStartSlider.value = endVal;
            currentFilters.startYear = endVal;
        } else {
            currentFilters.startYear = startVal;
        }
        uiElements.yearStartLabel.textContent = currentFilters.startYear;
        applyFiltersAndRedrawCallback();
    });
    uiElements.yearEndSlider.addEventListener('input', () => {
        const startVal = parseInt(uiElements.yearStartSlider.value);
        const endVal = parseInt(uiElements.yearEndSlider.value);
        if (endVal < startVal) {
            uiElements.yearEndSlider.value = startVal;
            currentFilters.endYear = startVal;
        } else {
            currentFilters.endYear = endVal;
        }
        uiElements.yearEndLabel.textContent = currentFilters.endYear;
        applyFiltersAndRedrawCallback();
    });

    // Impact Sliders
    const maxDeaths = d3.max(originalData, d => d.totalDeaths) || 0;
    const maxAffected = d3.max(originalData, d => d.totalAffected) || 0;

    uiElements.minDeathsSlider.min = 0;
    uiElements.minDeathsSlider.max = maxDeaths;
    uiElements.minDeathsSlider.value = 0;
    uiElements.minDeathsLabel.textContent = "0";
    uiElements.minDeathsSliderMinLabel.textContent = "0";
    uiElements.minDeathsSliderMaxLabel.textContent = maxDeaths.toLocaleString();
    currentFilters.minDeaths = 0;

    uiElements.minDeathsSlider.addEventListener('input', () => {
        const value = parseInt(uiElements.minDeathsSlider.value);
        currentFilters.minDeaths = value;
        uiElements.minDeathsLabel.textContent = value.toLocaleString();
        applyFiltersAndRedrawCallback();
    });

    uiElements.minAffectedSlider.min = 0;
    uiElements.minAffectedSlider.max = maxAffected;
    uiElements.minAffectedSlider.value = 0;
    uiElements.minAffectedLabel.textContent = "0";
    uiElements.minAffectedSliderMinLabel.textContent = "0";
    uiElements.minAffectedSliderMaxLabel.textContent = maxAffected.toLocaleString();
    currentFilters.minAffected = 0;

    uiElements.minAffectedSlider.addEventListener('input', () => {
        const value = parseInt(uiElements.minAffectedSlider.value);
        currentFilters.minAffected = value;
        uiElements.minAffectedLabel.textContent = value.toLocaleString();
        applyFiltersAndRedrawCallback();
    });


    uiElements.resetFiltersBtn.addEventListener('click', () => {
        uiElements.subtypeFilterContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.checked = true;
            currentFilters.subtypes.add(cb.value);
        });
        uiElements.toggleSubtypesCheckbox.checked = true;

        uiElements.yearStartSlider.value = yearExtent[0];
        uiElements.yearEndSlider.value = yearExtent[1];
        uiElements.yearStartLabel.textContent = yearExtent[0];
        uiElements.yearEndLabel.textContent = yearExtent[1];
        currentFilters.startYear = yearExtent[0];
        currentFilters.endYear = yearExtent[1];

        uiElements.minDeathsSlider.value = 0;
        uiElements.minDeathsLabel.textContent = "0";
        currentFilters.minDeaths = 0;

        uiElements.minAffectedSlider.value = 0;
        uiElements.minAffectedLabel.textContent = "0";
        currentFilters.minAffected = 0;

        applyFiltersAndRedrawCallback();
    });
}

function showLoadingMessage(message) {
    uiElements.loadingMessage.text(message || "Loading...").style("display", "block");
    uiElements.chartContainerElement.style("display", "none");
}

function hideLoadingMessage() {
    uiElements.loadingMessage.style("display", "none");
}

function showNoDataMessage() {
    uiElements.noDataMessageElement.style("display", "block");
    uiElements.svgElement.selectAll(".event-circle").remove();
    uiElements.svgElement.select(".x-axis").selectAll("*").remove();
    uiElements.svgElement.select(".y-axis-subtypes-group").selectAll("*").remove();
    uiElements.legendContainer.selectAll("*").remove();
}

function hideNoDataMessage() {
    uiElements.noDataMessageElement.style("display", "none");
}

function showChartContainer() {
    uiElements.chartContainerElement.style("display", "block");
}

function debounce(func, delay) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

// Initialize UI components that don't depend on data
setupSidePanel();