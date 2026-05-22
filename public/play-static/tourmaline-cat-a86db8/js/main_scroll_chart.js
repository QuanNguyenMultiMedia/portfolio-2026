 // --- First script block's logic (Scroll Navigation) ---
 document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.scroll-section');
    const scrollUpBtn = document.getElementById('scroll-up-btn');
    const scrollDownBtn = document.getElementById('scroll-down-btn');
    let currentSectionIndexGlobal = 0;
    let isScrolling = false;

    const backgroundVideo = document.getElementById('background-video');
    if (backgroundVideo && config.site.defaultVideoSource) {
        backgroundVideo.src = config.site.defaultVideoSource;
    }


    function updateButtonStates() {
        scrollUpBtn.classList.toggle('disabled', currentSectionIndexGlobal === 0);
        scrollDownBtn.classList.toggle('disabled', currentSectionIndexGlobal === sections.length - 1);
    }

    function scrollToSection(index) {
        if (index >= 0 && index < sections.length && !isScrolling) {
            isScrolling = true;
            const htmlElement = document.documentElement; // The <html> element is typically the scroller
            const targetSection = sections[index];

            // Store the original computed scroll-snap-type
            const originalComputedSnapType = window.getComputedStyle(htmlElement).scrollSnapType;
            
            // Temporarily disable scroll-snap to allow GSAP full control over the scroll
            htmlElement.style.scrollSnapType = 'none'; 

            // Calculate the target scroll position (top of the target section)
            const targetScrollTop = targetSection.offsetTop;

            // Use GSAP to animate the scrollTop property of the html element
            gsap.to(htmlElement, { 
                duration: 0.8, // Duration of the scroll animation in seconds (adjust for desired speed)
                scrollTop: targetScrollTop,
                ease: "power2.inOut", // A common easing function for smooth start and end
                onComplete: () => {
                    // Restore scroll-snap-type after GSAP animation completes
                    if (originalComputedSnapType && originalComputedSnapType !== 'none') {
                         htmlElement.style.scrollSnapType = originalComputedSnapType;
                    } else {
                         // Fallback to the value from your stylesheet
                         htmlElement.style.scrollSnapType = 'y proximity'; 
                    }
                    isScrolling = false;
                }
            });
        }
    }

    scrollUpBtn.addEventListener('click', () => {
        if (currentSectionIndexGlobal > 0) {
            scrollToSection(currentSectionIndexGlobal - 1);
        }
    });

    scrollDownBtn.addEventListener('click', () => {
        if (currentSectionIndexGlobal < sections.length - 1) {
            scrollToSection(currentSectionIndexGlobal + 1);
        }
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const newIndex = Array.from(sections).indexOf(entry.target);
                currentSectionIndexGlobal = newIndex;
                updateButtonStates();
                if (entry.target.id !== 'section2') {
                    if (typeof activeAnnotations !== 'undefined' && Object.keys(activeAnnotations).length > 0) {
                        const openAnnotationIds = Object.keys(activeAnnotations);
                        for (const pointId of openAnnotationIds) {
                             if (typeof hideSingleAnnotation === 'function') hideSingleAnnotation(pointId);
                        }
                        // activeAnnotations should be empty now due to hideSingleAnnotation
                    }
                }
            }
        });
    }, { threshold: config.ui.sectionIntersectionThreshold });

    sections.forEach(section => observer.observe(section));

    window.addEventListener('keydown', (event) => {
        if (isScrolling) return;
        if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || document.activeElement.isContentEditable)) {
            return;
        }
        if (event.key === 'ArrowDown' || event.key === 'PageDown') {
            event.preventDefault();
            if (currentSectionIndexGlobal < sections.length - 1) {
                scrollToSection(currentSectionIndexGlobal + 1);
            }
        } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
            event.preventDefault();
            if (currentSectionIndexGlobal > 0) {
                scrollToSection(currentSectionIndexGlobal - 1);
            }
        }
    });
    updateButtonStates();
});

// --- Second script block's logic (Beeswarm Chart) ---
const svgElement = d3.select("#beeswarm-plot");
const tooltip = d3.select(".tooltip");
const sidePanel = d3.select("#side-panel");
const panelContent = d3.select("#panel-content");
const closePanelBtn = d3.select("#close-panel-btn");
const legendContainer = d3.select("#legend");
const loadingMessage = d3.select("#loading-message"); 
const chartContainerElement = d3.select("#chart-container");
const noDataMessageElement = d3.select("#no-data-message");

const subtypeFilterContainer = document.getElementById('subtype-filter-container');
const toggleSubtypesCheckbox = document.getElementById('toggle-subtypes');

const yearStartSlider = document.getElementById('year-start-slider');
const yearEndSlider = document.getElementById('year-end-slider');
const yearStartLabel = document.getElementById('year-start-label');
const yearEndLabel = document.getElementById('year-end-label');
const resetFiltersBtn = document.getElementById('reset-filters-btn');

const minDeathsSlider = document.getElementById('min-deaths-slider');
const minDeathsLabel = document.getElementById('min-deaths-label');
const minDeathsSliderMinLabel = document.getElementById('min-deaths-slider-min-label');
const minDeathsSliderMaxLabel = document.getElementById('min-deaths-slider-max-label');

const minAffectedSlider = document.getElementById('min-affected-slider');
const minAffectedLabel = document.getElementById('min-affected-label');
const minAffectedSliderMinLabel = document.getElementById('min-affected-slider-min-label');
const minAffectedSliderMaxLabel = document.getElementById('min-affected-slider-max-label');
const MyCustomColors = ["#A79277", "#D1BB9E", "#EAD8C0", "#7D7463", "#A0937D", "#B08968"]
let originalData = [];
let currentFilters = {
    subtypes: new Set(),
    minDeaths: 0,
    minAffected: 0,
    startYear: null,
    endYear: null,
};
let globalRScale, globalColorScale; 

let simulation;
let g; 
let xAxisG, yAxisSubtypeGroupG; 
let isInitialRender = true; 

sidePanel
    .style("width", `${config.ui.sidePanel.width}px`)
    .style("right", `-${config.ui.sidePanel.width + config.ui.sidePanel.hideOffset}px`);

function processRow(d) {
    const totalDeaths = +d['Total Deaths'];
    const startYear = +d['Start Year'];
   
    return {
        id: d['Our World In Data ID'] || `event-${Math.random().toString(16).slice(2)}`,
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

d3.csv(config.data.csvFilePath, processRow)
    .then(loadedData => {
        originalData = loadedData.filter(d => d !== null && d.startYear);

        if (!g) {
            g = svgElement.append("g");
            xAxisG = g.append("g").attr("class", "x-axis"); 
            yAxisSubtypeGroupG = g.append("g").attr("class", "y-axis-subtypes-group"); 
        } 
        if (originalData.length > 0) {
            const maxDeathsGlobal = d3.max(originalData, d => d.totalDeaths);
            globalRScale = d3.scaleSqrt()
                .domain([0, maxDeathsGlobal || 1]) 
                .range([config.scales.rScaleMinRadius, config.scales.rScaleMaxRadius]);

            const uniqueDisasterSubgroupsGlobal = Array.from(new Set(originalData.map(d => d.disasterSubgroup))).sort();
            globalColorScale = d3.scaleOrdinal(d3.schemeTableau10) // Consider making scheme configurable
                .domain(uniqueDisasterSubgroupsGlobal)
                .range(MyCustomColors);

            populateFilters(); 
            loadingMessage.style("display", "none"); 
            chartContainerElement.style("display", "block"); 
            applyFiltersAndRedraw(); 
        } else {
            loadingMessage.text(`No valid data found in '${config.data.csvFilePath}'.`);
            chartContainerElement.style("display", "none"); 
            if (config.debug) alert(`No valid data found in '${config.data.csvFilePath}'. Please check the file and its contents.`);
        }
    })
    .catch(error => {
        console.error("Error loading or parsing CSV file:", error);
        loadingMessage.html(`Error loading data. Check console.`);
        if (config.debug) alert(`Could not load data. Check console.`);
    });

function populateFilters() {
    const allSubtypes = Array.from(new Set(originalData.map(d => d.disasterSubtype))).sort();
    subtypeFilterContainer.innerHTML = ''; 
    allSubtypes.forEach(subtype => {
        currentFilters.subtypes.add(subtype); 
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
            applyFiltersAndRedraw();
        });
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${subtype}`));
        subtypeFilterContainer.appendChild(label);
    });

    toggleSubtypesCheckbox.checked = true; 
    toggleSubtypesCheckbox.addEventListener('change', () => {
        const isChecked = toggleSubtypesCheckbox.checked;
        const checkboxes = subtypeFilterContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.checked = isChecked;
            if (isChecked) {
                currentFilters.subtypes.add(cb.value);
            } else {
                currentFilters.subtypes.delete(cb.value);
            }
        });
        applyFiltersAndRedraw();
    });

    const yearExtent = d3.extent(originalData, d => d.startYear);
    currentFilters.startYear = yearExtent[0];
    currentFilters.endYear = yearExtent[1];

    yearStartSlider.min = yearExtent[0];
    yearStartSlider.max = yearExtent[1];
    yearStartSlider.value = yearExtent[0];
    yearStartLabel.textContent = yearExtent[0];

    yearEndSlider.min = yearExtent[0];
    yearEndSlider.max = yearExtent[1];
    yearEndSlider.value = yearExtent[1];
    yearEndLabel.textContent = yearExtent[1];
    
    yearStartSlider.addEventListener('input', () => {
        const startVal = parseInt(yearStartSlider.value);
        const endVal = parseInt(yearEndSlider.value);
        if (startVal > endVal) {
            yearStartSlider.value = endVal; 
            currentFilters.startYear = endVal;
        } else {
            currentFilters.startYear = startVal;
        }
        yearStartLabel.textContent = currentFilters.startYear;
        applyFiltersAndRedraw(); 
    });
    yearEndSlider.addEventListener('input', () => {
        const startVal = parseInt(yearStartSlider.value);
        const endVal = parseInt(yearEndSlider.value);
        if (endVal < startVal) {
            yearEndSlider.value = startVal; 
            currentFilters.endYear = startVal;
        } else {
            currentFilters.endYear = endVal;
        }
        yearEndLabel.textContent = currentFilters.endYear;
        applyFiltersAndRedraw(); 
    });

    const maxDeaths = d3.max(originalData, d => d.totalDeaths) || 0;
    const maxAffected = d3.max(originalData, d => d.totalAffected) || 0;

    minDeathsSlider.min = 0;
    minDeathsSlider.max = maxDeaths;
    minDeathsSlider.value = 0;
    minDeathsLabel.textContent = "0";
    minDeathsSliderMinLabel.textContent = "0";
    minDeathsSliderMaxLabel.textContent = maxDeaths.toLocaleString();
    currentFilters.minDeaths = 0;

    minDeathsSlider.addEventListener('input', () => {
        const value = parseInt(minDeathsSlider.value);
        currentFilters.minDeaths = value;
        minDeathsLabel.textContent = value.toLocaleString();
        applyFiltersAndRedraw();
    });

    minAffectedSlider.min = 0;
    minAffectedSlider.max = maxAffected;
    minAffectedSlider.value = 0;
    minAffectedLabel.textContent = "0";
    minAffectedSliderMinLabel.textContent = "0";
    minAffectedSliderMaxLabel.textContent = maxAffected.toLocaleString();
    currentFilters.minAffected = 0;

    minAffectedSlider.addEventListener('input', () => {
        const value = parseInt(minAffectedSlider.value);
        currentFilters.minAffected = value;
        minAffectedLabel.textContent = value.toLocaleString();
        applyFiltersAndRedraw();
    });
    
    resetFiltersBtn.addEventListener('click', () => {
        subtypeFilterContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.checked = true;
            currentFilters.subtypes.add(cb.value);
        });
        toggleSubtypesCheckbox.checked = true;
        
        yearStartSlider.value = yearExtent[0];
        yearEndSlider.value = yearExtent[1];
        yearStartLabel.textContent = yearExtent[0];
        yearEndLabel.textContent = yearExtent[1];
        currentFilters.startYear = yearExtent[0];
        currentFilters.endYear = yearExtent[1];

        minDeathsSlider.value = 0;
        minDeathsLabel.textContent = "0";
        currentFilters.minDeaths = 0;

        minAffectedSlider.value = 0;
        minAffectedLabel.textContent = "0";
        currentFilters.minAffected = 0;
        
        applyFiltersAndRedraw();
    });
}

function applyFiltersAndRedraw() {
    const filteredData = originalData.filter(d => {
        const matchesSubtype = currentFilters.subtypes.has(d.disasterSubtype);
        const matchesDeaths = currentFilters.minDeaths === null || d.totalDeaths >= currentFilters.minDeaths;
        const matchesAffected = currentFilters.minAffected === null || d.totalAffected >= currentFilters.minAffected;
        const matchesYear = d.startYear >= currentFilters.startYear && d.startYear <= currentFilters.endYear;
        return matchesSubtype && matchesDeaths && matchesAffected && matchesYear;
    });
    noDataMessageElement.text(config.chart.noDataMessageText);
    if (filteredData.length === 0) {
        noDataMessageElement.style("display", "block");
        if (g) { 
            g.selectAll(".event-circle").remove(); 
            if (xAxisG) xAxisG.selectAll("*").remove(); 
            if (yAxisSubtypeGroupG) yAxisSubtypeGroupG.selectAll("*").remove(); 
        }
        legendContainer.selectAll("*").remove(); 
    } else {
        noDataMessageElement.style("display", "none");
        renderPlot(filteredData);
    }
}

function debounce(func, delay) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

function renderPlot(plotData) {
    if (!g || g.empty() || (g.node && !g.node().parentNode) ) { 
        svgElement.selectAll("g").remove(); 
        g = svgElement.append("g").attr("class", "main-chart-group");
        xAxisG = g.append("g").attr("class", "x-axis");
        yAxisSubtypeGroupG = g.append("g").attr("class", "y-axis-subtypes-group");
    }
    
    legendContainer.selectAll("*").remove(); 

    const chartContainerDiv = document.getElementById('chart-container'); 
    let currentContainerWidth = chartContainerDiv.clientWidth;
    
    let currentMargin = {...config.chart.margin};
    let currentYAxisLabelOffset = config.appearance.yAxisSubtypeLabelXOffset;

    if (currentContainerWidth < config.ui.responsiveBreakpoints.medium && config.chart.responsiveMargins.medium) { 
        currentMargin = {...currentMargin, ...config.chart.responsiveMargins.medium};
        currentYAxisLabelOffset = config.appearance.responsiveYAxisLabelOffsets.medium || currentYAxisLabelOffset;
    }
    if (currentContainerWidth < config.ui.responsiveBreakpoints.small && config.chart.responsiveMargins.small) { 
        currentMargin = {...currentMargin, ...config.chart.responsiveMargins.small};
        currentYAxisLabelOffset = config.appearance.responsiveYAxisLabelOffsets.small || currentYAxisLabelOffset;
    }

    const calculatedHeight = Math.max(config.chart.minHeight, currentContainerWidth * config.chart.aspectRatio);
    const width = currentContainerWidth - currentMargin.left - currentMargin.right;
    const height = calculatedHeight - currentMargin.top - currentMargin.bottom;
    
    svgElement.attr("viewBox", `0 0 ${currentContainerWidth} ${calculatedHeight}`);
    g.attr("transform", `translate(${currentMargin.left},${currentMargin.top})`);

    const xScale = d3.scaleLinear()
        .domain([currentFilters.startYear - config.scales.xScalePadding, currentFilters.endYear + config.scales.xScalePadding]) 
        .range([0, width]);

    const rScale = globalRScale;
    const colorScale = globalColorScale;

    let orderedSubtypes = [];
    const allDataGroupsInFiltered = Array.from(new Set(plotData.map(d => d.disasterGroup)));
    
    config.data.disasterGroupOrder.forEach(groupName => {
        if (allDataGroupsInFiltered.includes(groupName)) {
            const subtypesInGroup = plotData
                .filter(d => d.disasterGroup === groupName)
                .map(d => d.disasterSubtype);
            const uniqueSubtypesInGroup = Array.from(new Set(subtypesInGroup)).sort();
            orderedSubtypes.push(...uniqueSubtypesInGroup);
        }
    });
    const remainingGroups = allDataGroupsInFiltered
        .filter(gName => !config.data.disasterGroupOrder.includes(gName))
        .sort();
    remainingGroups.forEach(groupName => {
        const subtypesInGroup = plotData
            .filter(d => d.disasterGroup === groupName)
            .map(d => d.disasterSubtype);
        const uniqueSubtypesInGroup = Array.from(new Set(subtypesInGroup)).sort();
        orderedSubtypes.push(...uniqueSubtypesInGroup);
    });
    const uniqueSubtypesForScale = Array.from(new Set(orderedSubtypes.filter(st => currentFilters.subtypes.has(st) )));

    const subtypeYScale = d3.scalePoint()
        .domain(uniqueSubtypesForScale.length > 0 ? uniqueSubtypesForScale : ["No Subtypes Selected"]) 
        .range([height * config.scales.subtypeYScaleRangeMin, height * config.scales.subtypeYScaleRangeMax]) 
        .padding(config.scales.subtypeYScalePadding);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d")).ticks(Math.max(3, Math.floor(width / 100))); 
    xAxisG.attr("transform", `translate(0,${height})`)
        .transition().duration(config.animation.transitionDuration) 
        .call(xAxis);
    
    let xAxisLabel = xAxisG.select(".axis-label");
    if (xAxisLabel.empty()) {
        xAxisLabel = xAxisG.append("text").attr("class", "axis-label");
    }
    xAxisLabel
        .attr("x", width / 2)
        .attr("y", currentMargin.bottom - 10)
        .attr("text-anchor", "middle")
        .text(config.chart.xAxisLabel);
    
    if (uniqueSubtypesForScale.length > 0 && uniqueSubtypesForScale[0] !== "No Subtypes Selected") {
        const subtypeLines = yAxisSubtypeGroupG.selectAll(".y-axis-subtype-line")
            .data(uniqueSubtypesForScale, d => d); 
        subtypeLines.exit()
            .transition().duration(config.animation.shortTransitionDuration)
            .style("opacity", 0)
            .remove();
        subtypeLines.enter()
            .append("line")
            .attr("class", "y-axis-subtype-line")
            .attr("x1", 0)
            .attr("y1", d => subtypeYScale(d) || 0) 
            .attr("x2", width)
            .attr("y2", d => subtypeYScale(d) || 0)
            .style("opacity", 0)
            .merge(subtypeLines) 
            .transition().duration(config.animation.transitionDuration)
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", d => subtypeYScale(d) || 0)
            .attr("y2", d => subtypeYScale(d) || 0)
            .style("opacity", 1);

        const subtypeLabels = yAxisSubtypeGroupG.selectAll(".y-axis-subtype-label")
            .data(uniqueSubtypesForScale, d => d);
        subtypeLabels.exit()
            .transition().duration(config.animation.shortTransitionDuration)
            .style("opacity", 0)
            .remove();
        subtypeLabels.enter()
            .append("text")
            .attr("class", "y-axis-subtype-label")
            .attr("x", currentYAxisLabelOffset)
            .attr("y", d => subtypeYScale(d) || 0)
            .style("opacity", 0)
            .text(d => {
                const labelText = d.length > config.appearance.yAxisSubtypeLabelMaxLength 
                                ? d.substring(0, config.appearance.yAxisSubtypeLabelMaxLength - config.appearance.yAxisSubtypeLabelTruncSuffix.length) + config.appearance.yAxisSubtypeLabelTruncSuffix 
                                : d;
                return labelText;
            })
            .merge(subtypeLabels)
            .transition().duration(config.animation.transitionDuration)
            .attr("x", currentYAxisLabelOffset)
            .attr("y", d => subtypeYScale(d) || 0)
            .style("opacity", 1)
            .text(d => { 
                const labelText = d.length > config.appearance.yAxisSubtypeLabelMaxLength 
                                ? d.substring(0, config.appearance.yAxisSubtypeLabelMaxLength - config.appearance.yAxisSubtypeLabelTruncSuffix.length) + config.appearance.yAxisSubtypeLabelTruncSuffix 
                                : d;
                return labelText;
            });
    } else { // Clear y-axis subtype lines and labels if no subtypes selected
         yAxisSubtypeGroupG.selectAll(".y-axis-subtype-line").remove();
         yAxisSubtypeGroupG.selectAll(".y-axis-subtype-label").remove();
    }

    const currentSimNodesMap = new Map( (simulation ? simulation.nodes() : []).map(node => [node.id, node]) );
    const nodesData = plotData.map(d_new => {
        const existingNodeState = currentSimNodesMap.get(d_new.id);
        if (existingNodeState) {
            return { ...d_new, x: existingNodeState.x, y: existingNodeState.y, vx: existingNodeState.vx, vy: existingNodeState.vy };
        }
        return { ...d_new }; 
    }); 

    if (!simulation) { 
        simulation = d3.forceSimulation()
            .force("x", d3.forceX(d => xScale(d.startYear)).strength(config.simulation.forceXStrength))
            .force("y", d3.forceY(d => subtypeYScale(d.disasterSubtype) || height / 2).strength(config.simulation.forceYStrength))
            .force("collide", d3.forceCollide(d => rScale(d.totalDeaths) + config.simulation.forceCollidePadding).strength(config.simulation.forceCollideStrength))
            .force("manyBody", d3.forceManyBody().strength(config.simulation.forceManyBodyStrength))
            .on("tick", ticked);
    }

    simulation
        .force("x", d3.forceX(d => xScale(d.startYear)).strength(config.simulation.forceXStrength))
        .force("y", d3.forceY(d => subtypeYScale(d.disasterSubtype) || height / 2).strength(config.simulation.forceYStrength))
        .force("collide", d3.forceCollide(d => rScale(d.totalDeaths) + config.simulation.forceCollidePadding).strength(config.simulation.forceCollideStrength));
    simulation.nodes(nodesData);

    simulation = d3.forceSimulation(nodesData)
        .force("x", d3.forceX(d => xScale(d.startYear)).strength(config.simulation.forceXStrength)) 
        .force("y", d3.forceY(d => subtypeYScale(d.disasterSubtype) || height / 2).strength(config.simulation.forceYStrength)) 
        .force("collide", d3.forceCollide(d => rScale(d.totalDeaths) + config.simulation.forceCollidePadding).strength(config.simulation.forceCollideStrength)) 
        .force("manyBody", d3.forceManyBody().strength(config.simulation.forceManyBodyStrength)) 
        .on("tick", ticked);
    
    let circles = g.selectAll(".event-circle")
        .data(nodesData, d => d.id); 

    circles.exit()
        .transition().duration(config.animation.gsapCircleIntroDuration / 2) 
        .attr("r", 0)
        .style("opacity", 0)
        .remove();

    const circlesEnter = circles.enter().append("circle")
        .attr("class", "event-circle")
        .attr("fill", d => colorScale(d.disasterSubgroup))
        .style("stroke", config.appearance.circleStrokeColor)
        .style("stroke-width", config.appearance.circleStrokeWidth)
        .attr("cx", d => d.x || xScale(d.startYear)) 
        .attr("cy", d => d.y || (subtypeYScale(d.disasterSubtype) || height / 2))
        .attr("r", 0) 
        .style("opacity", 0) 
        .call(drag(simulation)) 
        .on("mouseover", function(event, d) { 
            d3.select(this).raise(); 
            gsap.to(this, { 
                r: rScale(d.totalDeaths) * config.interaction.circleHoverRadiusFactor,
                opacity: config.interaction.circleHoverOpacity, 
                duration: 0.15 
            });
            tooltip.style("opacity", 1)
                   .style("transform", `translate(${config.ui.tooltip.offsetX}px, -50%) scale(${config.ui.tooltip.scaleIn})`) 
                   .html(config.ui.tooltip.htmlTemplate(d));
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + config.ui.tooltip.offsetX) + "px") 
                   .style("top", (event.pageY + config.ui.tooltip.offsetY) + "px");
        })
        .on("mouseout", function(event, d) {
            gsap.to(this, { 
                r: rScale(d.totalDeaths),
                opacity: config.appearance.circleOpacity, 
                duration: 0.15 
            });
            tooltip.style("opacity", 0).style("transform", `translate(${config.ui.tooltip.offsetX}px, -50%) scale(${config.ui.tooltip.scaleOut})`);
        })
        .on("click", function(event, d) {
            populateSidePanel(d);
            gsap.to("#side-panel", { 
                right: 0, 
                duration: config.ui.sidePanel.animationDuration, 
                ease: config.ui.sidePanel.openEase 
            });
        });

    circles = circlesEnter.merge(circles);

    circles.transition().duration(config.animation.gsapCircleIntroDuration)
        .attr("r", d => rScale(d.totalDeaths))
        .style("opacity", config.appearance.circleOpacity)
        .attr("fill", d => colorScale(d.disasterSubgroup)); 
    
    gsap.to(circles.nodes(), { 
        duration: config.animation.gsapCircleIntroDuration,
        ease: "power1.out",
        stagger: {
            each: config.animation.gsapCircleIntroStagger,
            from: "random"
        },
        onStart: () => { if (simulation) simulation.alphaTarget(config.simulation.alphaTargetInitial).restart(); }, 
        onComplete: () => { if (simulation) simulation.alphaTarget(config.simulation.alphaTargetFinal); }
    });

    if (isInitialRender) {
        gsap.to(circlesEnter.nodes(), { 
            duration: config.animation.gsapCircleIntroDuration,
            ease: "power1.out",
            stagger: {
                each: config.animation.gsapCircleIntroStagger,
                from: "random"
            },
            onStart: () => { if (simulation) simulation.alpha(config.simulation.alphaTargetInitial).restart(); },
            onComplete: () => { 
                if (simulation) simulation.alpha(config.simulation.alphaTargetFinal);
                isInitialRender = false; 
            }
        });
    } else {
        if (simulation) simulation.alpha(config.simulation.alphaTargetInitial).restart();
    }

    function ticked() {
        circles
            .attr("cx", d => d.x = Math.max(rScale(d.totalDeaths), Math.min(width - rScale(d.totalDeaths), d.x))) 
            .attr("cy", d => d.y = Math.max(rScale(d.totalDeaths), Math.min(height - rScale(d.totalDeaths), d.y)));
    }
    
    function drag(simulationInstance) { 
        function dragstarted(event, d) {
            if (!event.active && simulationInstance) simulationInstance.alphaTarget(config.simulation.alphaTargetInitial).restart();
            d.fx = d.x; 
            d.fy = d.y; 
            d3.select(this).raise(); 
            gsap.to(this, { 
                r: rScale(d.totalDeaths) * 1.1, 
                opacity: config.interaction.circleHoverOpacity,
                duration: 0.1
            });
        }
        function dragged(event, d) {
            d.fx = event.x; 
            d.fy = event.y; 
        }
        function dragended(event, d) {
            if (!event.active && simulationInstance) simulationInstance.alphaTarget(config.simulation.alphaTargetFinal);
            d.fx = null; 
            d.fy = null; 
            gsap.to(this, { 
                r: rScale(d.totalDeaths),
                opacity: config.appearance.circleOpacity,
                duration: 0.2
            });
        }
        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    const legendSubgroups = globalColorScale.domain();
    legendSubgroups.forEach(subgroup => {
        const legendItem = legendContainer.append("div").attr("class", "legend-item");
        legendItem.append("div")
            .attr("class", "legend-color-box")
            .style("background-color", globalColorScale(subgroup)); 
        legendItem.append("span").text(subgroup);
    });

    let resizeTimer;
    window.onresize = () => { 
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const chartContainerStyle = window.getComputedStyle(chartContainerElement.node());
            if (chartContainerStyle.display === "block" && originalData.length > 0) { 
                 applyFiltersAndRedraw(); 
            }
            const mapViewportElement = document.getElementById('map-viewport');
            if (mapViewportElement && typeof mapOriginalWidth !== 'undefined' && mapOriginalWidth && typeof mapDraggable !== 'undefined' && mapDraggable) { 
                if (typeof mapDraggable.update === 'function') mapDraggable.update(true); 
                if (typeof restrictMovement === 'function') restrictMovement(); 
                if (typeof updateAllConnectingLines === 'function') updateAllConnectingLines(); 
            }
        }, 200); // Debounce resize
    };
    
}

function populateSidePanel(d) {
    panelContent.html(config.ui.sidePanel.contentTemplate(d));
}

closePanelBtn.on("click", () => {
    gsap.to("#side-panel", { 
        right: `-${config.ui.sidePanel.width + config.ui.sidePanel.hideOffset}px`, 
        duration: config.ui.sidePanel.animationDuration, 
        ease: config.ui.sidePanel.closeEase 
    });
});