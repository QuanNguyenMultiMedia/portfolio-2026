let simulation;
let g; // Main group for chart elements
let xAxisG, yAxisSubtypeGroupG; // Groups for axes
let isInitialRender = true;
let globalRScale, globalColorScale; // Scales that depend on the full dataset

function initializeChartBase(svgElementRef) {
    if (!g || g.empty() || (g.node && !g.node().parentNode)) {
        svgElementRef.selectAll("g").remove(); // Clear any old groups

        g = svgElementRef.append("g").attr("class", "main-chart-group");
        xAxisG = g.append("g").attr("class", "x-axis");
        yAxisSubtypeGroupG = g.append("g").attr("class", "y-axis-subtypes-group");
    }
}


function renderPlot(plotData, currentFilters, svgElementRef, tooltipRef, legendContainerRef) {
    initializeChartBase(svgElementRef); // Ensure base SVG structure is ready

    legendContainerRef.selectAll("*").remove(); // Clear legend for redraw

    const chartContainerDiv = document.getElementById('chart-container');
    let currentContainerWidth = chartContainerDiv.clientWidth;

    let currentMargin = { ...config.chart.margin };
    let currentYAxisLabelOffset = config.appearance.yAxisSubtypeLabelXOffset;

    // Adjust margins for smaller screens
    if (currentContainerWidth < 768) {
        currentMargin.left = 80;
        currentYAxisLabelOffset = -8;
    }
    if (currentContainerWidth < 480) {
        currentMargin.left = 65;
        currentYAxisLabelOffset = -6;
        currentMargin.bottom = 40;
        currentMargin.top = 30;
    }

    const calculatedHeight = Math.max(config.chart.minHeight, currentContainerWidth * config.chart.aspectRatio);
    const width = currentContainerWidth - currentMargin.left - currentMargin.right;
    const height = calculatedHeight - currentMargin.top - currentMargin.bottom;

    svgElementRef.attr("viewBox", `0 0 ${currentContainerWidth} ${calculatedHeight}`);
    g.attr("transform", `translate(${currentMargin.left},${currentMargin.top})`);

    // Scales
    const xScale = d3.scaleLinear()
        .domain([currentFilters.startYear - config.scales.xScalePadding, currentFilters.endYear + config.scales.xScalePadding])
        .range([0, width]);

    const rScale = globalRScale; // Use globally defined rScale
    const colorScale = globalColorScale; // Use globally defined colorScale

    // Determine Y-axis subtype order based on config and filtered data
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
    const uniqueSubtypesForScale = Array.from(new Set(orderedSubtypes.filter(st => currentFilters.subtypes.has(st))));

    const subtypeYScale = d3.scalePoint()
        .domain(uniqueSubtypesForScale.length > 0 ? uniqueSubtypesForScale : ["No Subtypes Selected"])
        .range([height * config.scales.subtypeYScaleRangeMin, height * config.scales.subtypeYScaleRangeMax])
        .padding(config.scales.subtypeYScalePadding);

    // X-Axis
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d")).ticks(Math.max(3, Math.floor(width / 100)));
    xAxisG.attr("transform", `translate(0,${height})`)
        .transition().duration(500)
        .call(xAxis);

    let xAxisLabel = xAxisG.select(".axis-label");
    if (xAxisLabel.empty()) {
        xAxisLabel = xAxisG.append("text").attr("class", "axis-label");
    }
    xAxisLabel
        .attr("x", width / 2)
        .attr("y", currentMargin.bottom - 10)
        .attr("text-anchor", "middle")
        .text("Year");

    // Y-Axis Subtype Lines and Labels
    yAxisSubtypeGroupG.selectAll("*").remove(); // Clear previous for redraw to handle dynamic subtypes
    if (uniqueSubtypesForScale.length > 0 && uniqueSubtypesForScale[0] !== "No Subtypes Selected") {
        yAxisSubtypeGroupG.selectAll(".y-axis-subtype-line")
            .data(uniqueSubtypesForScale)
            .enter().append("line")
            .attr("class", "y-axis-subtype-line")
            .attr("x1", 0)
            .attr("y1", d => subtypeYScale(d) || 0)
            .attr("x2", width)
            .attr("y2", d => subtypeYScale(d) || 0);

        yAxisSubtypeGroupG.selectAll(".y-axis-subtype-label")
            .data(uniqueSubtypesForScale)
            .enter().append("text")
            .attr("class", "y-axis-subtype-label")
            .attr("x", currentYAxisLabelOffset)
            .attr("y", d => subtypeYScale(d) || 0)
            .text(d => {
                const labelText = d.length > config.appearance.yAxisSubtypeLabelMaxLength
                    ? d.substring(0, config.appearance.yAxisSubtypeLabelMaxLength - config.appearance.yAxisSubtypeLabelTruncSuffix.length) + config.appearance.yAxisSubtypeLabelTruncSuffix
                    : d;
                return labelText;
            });
    }


    // Prepare nodes data, preserving positions if nodes already exist in simulation
    const currentSimNodesMap = new Map((simulation ? simulation.nodes() : []).map(node => [node.id, node]));
    const nodesData = plotData.map(d_new => {
        const existingNodeState = currentSimNodesMap.get(d_new.id);
        if (existingNodeState) {
            return { ...d_new, x: existingNodeState.x, y: existingNodeState.y, vx: existingNodeState.vx, vy: existingNodeState.vy };
        }
        // For new nodes, initialize position near their target for smoother entry
        return { ...d_new, x: xScale(d_new.startYear), y: subtypeYScale(d_new.disasterSubtype) || height / 2 };
    });


    // Simulation Setup
    if (!simulation) {
        simulation = d3.forceSimulation()
            .on("tick", ticked);
    }

    simulation
        .nodes(nodesData) // Important to update nodes
        .force("x", d3.forceX(d => xScale(d.startYear)).strength(config.simulation.forceXStrength))
        .force("y", d3.forceY(d => subtypeYScale(d.disasterSubtype) || height / 2).strength(config.simulation.forceYStrength))
        .force("collide", d3.forceCollide(d => rScale(d.totalDeaths) + config.simulation.forceCollidePadding).strength(config.simulation.forceCollideStrength))
        .force("manyBody", d3.forceManyBody().strength(config.simulation.forceManyBodyStrength));


    // Circles (Data Join, Enter, Update, Exit)
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
        .attr("cx", d => d.x ) // Use initial/preserved x
        .attr("cy", d => d.y ) // Use initial/preserved y
        .attr("r", 0) // Start with radius 0 for entry animation
        .style("opacity", 0) // Start with opacity 0
        .call(drag(simulation))
        .on("mouseover", function (event, d) {
            d3.select(this).raise();
            gsap.to(this, {
                r: rScale(d.totalDeaths) * config.interaction.circleHoverRadiusFactor,
                opacity: config.interaction.circleHoverOpacity,
                duration: 0.15
            });
            tooltipRef.style("opacity", 1)
                .style("transform", `translate(15px, -50%) scale(1)`)
                .html(`
                    <strong>${d.eventName}</strong>
                    <span>Year: ${d.startYear}</span><br>
                    <span>Deaths: ${d.totalDeaths.toLocaleString()}</span><br>
                    <span>Subgroup: ${d.disasterSubgroup}</span><br>
                    <span>Subtype: ${d.disasterSubtype}</span>
                `);
        })
        .on("mousemove", function (event) {
            tooltipRef.style("left", (event.pageX + 15) + "px")
                .style("top", (event.pageY) + "px");
        })
        .on("mouseout", function (event, d) {
            gsap.to(this, {
                r: rScale(d.totalDeaths),
                opacity: config.appearance.circleOpacity,
                duration: 0.15
            });
            tooltipRef.style("opacity", 0).style("transform", "translate(15px, -50%) scale(0.95)");
        })
        .on("click", function (event, d) {
            populateSidePanel(d); // This function is in ui.js, ensure it's accessible
            openSidePanel();    // This function is in ui.js
        });

    circles = circlesEnter.merge(circles);

    // Animate circles to their target radius and opacity
    circles.transition().duration(config.animation.gsapCircleIntroDuration)
        .attr("r", d => rScale(d.totalDeaths))
        .style("opacity", config.appearance.circleOpacity)
        .attr("fill", d => colorScale(d.disasterSubgroup)); // Update color in case it changes

    // GSAP animation for initial render or for new circles entering
    const enterNodes = circlesEnter.nodes();
    if (enterNodes.length > 0) {
         gsap.to(enterNodes, {
            r: d => rScale(d.totalDeaths), // Target radius
            opacity: config.appearance.circleOpacity, // Target opacity
            duration: config.animation.gsapCircleIntroDuration,
            ease: "power1.out",
            stagger: {
                each: config.animation.gsapCircleIntroStagger,
                from: "random"
            },
        });
    }


    // Restart simulation
    simulation.alpha(config.simulation.alphaTargetInitial).restart();
    if (isInitialRender) {
        isInitialRender = false;
         // Longer alpha for initial layout if needed, then cool down
        // setTimeout(() => simulation.alphaTarget(config.simulation.alphaTargetFinal), 2000);
    } else {
        // For updates, a short burst of activity is usually enough
        // setTimeout(() => simulation.alphaTarget(config.simulation.alphaTargetFinal), 500);
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
                r: rScale(d.totalDeaths) * 1.1, // Slightly larger when dragging
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

    // Legend
    const legendSubgroups = globalColorScale.domain();
    legendSubgroups.forEach(subgroup => {
        const legendItem = legendContainerRef.append("div").attr("class", "legend-item");
        legendItem.append("div")
            .attr("class", "legend-color-box")
            .style("background-color", globalColorScale(subgroup));
        legendItem.append("span").text(subgroup);
    });
}

function setupGlobalScales(data) {
    const maxDeathsGlobal = d3.max(data, d => d.totalDeaths);
    globalRScale = d3.scaleSqrt()
        .domain([0, maxDeathsGlobal || 1]) // Ensure domain doesn't start/end with NaN/0 if maxDeaths is 0
        .range([config.scales.rScaleMinRadius, config.scales.rScaleMaxRadius]);

    const uniqueDisasterSubgroupsGlobal = Array.from(new Set(data.map(d => d.disasterSubgroup))).sort();
    globalColorScale = d3.scaleOrdinal(d3.schemeTableau10) // Or any other D3 color scheme
        .domain(uniqueDisasterSubgroupsGlobal);
}