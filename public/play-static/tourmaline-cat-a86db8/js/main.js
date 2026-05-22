let originalData = [];
let currentFilters = {
    subtypes: new Set(),
    minDeaths: 0,
    minAffected: 0,
    startYear: null,
    endYear: null,
};

function processRow(d) {
    const totalDeaths = +d['Total Deaths'];
    const startYear = +d['Start Year'];

    return {
        id: d['Our World In Data ID'] || `event-${Math.random().toString(16).slice(2)}`, // Ensure unique ID
        eventName: d['Event Name'] || 'Unknown Event',
        disasterGroup: d['Disaster Group'] || 'Unknown Group',
        disasterSubgroup: d['Disaster Subgroup'],
        disasterType: d['Disaster Type'],
        disasterSubtype: d['Disaster Subtype'] || config.data.defaultDisasterSubtype,
        country: d['Country'],
        location: d['Location'],
        startYear: startYear,
        startMonth: +d['Start Month'],
        startDay: +d['Start Day'],
        endYear: +d['End Year'],
        endMonth: +d['End Month'],
        endDay: +d['End Day'],
        totalDeaths: isNaN(totalDeaths) ? 0 : totalDeaths,
        noInjured: +d['No. Injured'] || 0,
        noAffected: +d['No. Affected'] || 0,
        noHomeless: +d['No. Homeless'] || 0,
        totalAffected: +d['Total Affected'] || 0,
    };
}

function applyFiltersAndRedraw() {
    const filteredData = originalData.filter(d => {
        const matchesSubtype = currentFilters.subtypes.has(d.disasterSubtype);
        const matchesDeaths = currentFilters.minDeaths === null || d.totalDeaths >= currentFilters.minDeaths;
        const matchesAffected = currentFilters.minAffected === null || d.totalAffected >= currentFilters.minAffected;
        const matchesYear = d.startYear >= currentFilters.startYear && d.startYear <= currentFilters.endYear;
        return matchesSubtype && matchesDeaths && matchesAffected && matchesYear;
    });

    if (filteredData.length === 0) {
        showNoDataMessage(); // From ui.js
    } else {
        hideNoDataMessage(); // From ui.js
        renderPlot(filteredData, currentFilters, uiElements.svgElement, uiElements.tooltip, uiElements.legendContainer); // From chart.js
    }
}

// Debounced version of applyFiltersAndRedraw for resize events
const debouncedRedraw = debounce(applyFiltersAndRedraw, 200); // debounce is in ui.js

// Initial Data Load and Setup
showLoadingMessage("Loading data..."); // from ui.js

d3.csv(config.data.csvFilePath, processRow)
    .then(loadedData => {
        originalData = loadedData.filter(d => d !== null && d.startYear); // Filter out any potentially null rows from processRow

        if (originalData.length > 0) {
            setupGlobalScales(originalData); // from chart.js - sets up rScale and colorScale
            populateFilters(originalData, currentFilters, applyFiltersAndRedraw); // from ui.js
            hideLoadingMessage(); // from ui.js
            showChartContainer(); // from ui.js
            applyFiltersAndRedraw(); // Initial render
        } else {
            showLoadingMessage(`No valid data found in '${config.data.csvFilePath}'.`);
            alert(`No valid data found in '${config.data.csvFilePath}'. Please check the file and its contents.`);
        }
    })
    .catch(error => {
        console.error("Error loading or parsing CSV file:", error);
        showLoadingMessage(`Error loading data. Check console.`);
        alert(`Could not load data. Check console and the file path: ${config.data.csvFilePath}`);
    });


window.addEventListener('resize', () => {
    // Only redraw if chart is visible and data is loaded
    if (uiElements.chartContainerElement.style("display") === "block" && originalData.length > 0) {
        debouncedRedraw();
    }
});