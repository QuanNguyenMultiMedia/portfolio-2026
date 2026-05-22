document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('beeswarmCanvas');
    const ctx = canvas.getContext('2d');
    const tooltip = document.getElementById('tooltip');
    const slider = document.getElementById('categorySlider');
    const sliderValueDisplay = document.getElementById('sliderValue');
    const chartTitleElement = document.getElementById('chart-title');

    // --- Configuration ---
    // ... (Keep existing configuration: width, height, margins, colors, etc.) ...
    const width = 950;
    const height = 650;
    const margin = { top: 30, right: 150, bottom: 60, left: 100 };
    const legendX = width - margin.right + 20;
    const legendY = margin.top + 20;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const pointRadius = 4;
    const pointPadding = 1;
    const simulationIterations = 180;
    const allCategoryNames = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Omega'];
    const allCategoryColors = { /* ... Keep colors ... */
        'Alpha':   'rgba(31, 119, 180, 0.8)', 'Beta':    'rgba(255, 127, 14, 0.8)',
        'Gamma':   'rgba(44, 160, 44, 0.8)',  'Delta':   'rgba(214, 39, 40, 0.8)',
        'Epsilon': 'rgba(148, 103, 189, 0.8)', 'Zeta':    'rgba(140, 86, 75, 0.8)',
        'Omega':   'rgba(227, 119, 194, 0.8)'
    };
    const hoverColor = 'rgba(255, 217, 47, 1)';
    const axisColor = '#999', labelColor = '#444', gridColor = '#e8e8e8', titleColor = '#333', legendColor = '#555';

    canvas.width = width;
    canvas.height = height;
    chartTitleElement.style.maxWidth = `${width}px`;

    // --- Hardcoded Data ---
    const initialData = [
        // Year 2017 (currentYear - 8 if current is 2025)
        { id: 'p01', year: 2017, category: 'Alpha', value: 10 },
        { id: 'p02', year: 2017, category: 'Beta', value: 15 },
        { id: 'p03', year: 2017, category: 'Omega', value: 20 },
        { id: 'p04', year: 2017, category: 'Alpha', value: 12 },
        // Year 2018
        { id: 'p05', year: 2018, category: 'Alpha', value: 22 },
        { id: 'p06', year: 2018, category: 'Beta', value: 28 },
        { id: 'p07', year: 2018, category: 'Beta', value: 30 },
        { id: 'p08', year: 2018, category: 'Delta', value: 35 },
        { id: 'p09', year: 2018, category: 'Zeta', value: 18 },
        // Year 2019
        { id: 'p10', year: 2019, category: 'Delta', value: 40 },
        { id: 'p11', year: 2019, category: 'Delta', value: 42 },
        { id: 'p12', year: 2019, category: 'Alpha', value: 33 },
        { id: 'p13', year: 2019, category: 'Gamma', value: 25 },
        // Year 2020
        { id: 'p14', year: 2020, category: 'Gamma', value: 38 },
        { id: 'p15', year: 2020, category: 'Gamma', value: 40 },
        { id: 'p16', year: 2020, category: 'Epsilon', value: 50 },
        { id: 'p17', year: 2020, category: 'Beta', value: 45 },
        { id: 'p18', year: 2020, category: 'Alpha', value: 42 },
        // Year 2021
        { id: 'p19', year: 2021, category: 'Epsilon', value: 60 },
        { id: 'p20', year: 2021, category: 'Epsilon', value: 62 },
        { id: 'p21', year: 2021, category: 'Zeta', value: 48 },
        { id: 'p22', year: 2021, category: 'Gamma', value: 55 },
        // Year 2022
        { id: 'p23', year: 2022, category: 'Gamma', value: 65 },
        { id: 'p24', year: 2022, category: 'Alpha', value: 58 },
        { id: 'p25', year: 2022, category: 'Beta', value: 55 },
        { id: 'p26', year: 2022, category: 'Zeta', value: 60 },
        // Year 2023
        { id: 'p27', year: 2023, category: 'Zeta', value: 70 },
        { id: 'p28', year: 2023, category: 'Gamma', value: 75 },
        { id: 'p29', year: 2023, category: 'Alpha', value: 72 },
        { id: 'p30', year: 2023, category: 'Epsilon', value: 80 },
        // Year 2024
        { id: 'p31', year: 2024, category: 'Alpha', value: 85 },
        { id: 'p32', year: 2024, category: 'Gamma', value: 90 },
        { id: 'p33', year: 2024, category: 'Zeta', value: 88 },
        { id: 'p34', year: 2024, category: 'Beta', value: 82 },
        { id: 'p35', year: 2024, category: 'Delta', value: 80 },
        // Add a few more scattered points
        { id: 'p36', year: 2019, category: 'Omega', value: 28 },
        { id: 'p37', year: 2021, category: 'Alpha', value: 55 },
        { id: 'p38', year: 2022, category: 'Delta', value: 62 },
        { id: 'p39', year: 2017, category: 'Gamma', value: 8 },
        { id: 'p40', year: 2023, category: 'Beta', value: 70 },
    ];
    console.log(`Using hardcoded initialData with ${initialData.length} points.`);

    // --- Hardcoded Year Range ---
    const minYear = 2017;
    const maxYear = 2024;
    const allYears = [...new Set(initialData.map(d => d.year))].sort((a, b) => a - b); // Still useful for ticks
    console.log(`Hardcoded year range: ${minYear} - ${maxYear}`);

    // --- Scales (Using hardcoded range) ---
    const xScale = {
        min: minYear - 0.5, // Apply padding
        max: maxYear + 0.5,
        scale(year) {
            const numericYear = Number(year);
            // Safety check for NaN or zero range
            if (isNaN(numericYear) || this.max === this.min) {
                return margin.left;
            }
            return margin.left + (numericYear - this.min) / (this.max - this.min) * innerWidth;
        }
    };
    console.log(`xScale configured with range: ${xScale.min} to ${xScale.max}`);


    // --- State ---
    let points = [];
    let hoveredPoint = null;
    let animationFrameId = null;

    // --- Layout Algorithm ---
    // (Keep the exact same calculateLayout function as before)
    function calculateLayout(currentData, activeCategories, categoryYMap) {
        if (!currentData || currentData.length === 0) { points = []; return; }
        console.log(`Calculating layout for ${currentData.length} points.`);

        points = currentData.map(d => {
             const scaledX = xScale.scale(d.year);
             // DEBUG: Check scaled X right away
             // if (isNaN(scaledX)) { console.warn("NaN X scale for:", d); }
             return {
                 id: d.id, data: d, year: d.year, category: d.category,
                 targetX: scaledX, targetY: categoryYMap[d.category],
                 x: scaledX + (Math.random() - 0.5) * 5,
                 y: categoryYMap[d.category] + (Math.random() - 0.5) * innerHeight * 0.1,
                 radius: pointRadius, color: allCategoryColors[d.category] || 'grey'
             };
         }).filter(p => !isNaN(p.targetX) && !isNaN(p.targetY)); // Filter out NaNs

         if(points.length !== currentData.length) {
             console.warn(`Filtered out ${currentData.length - points.length} points due to NaN coords.`);
         }

        const activeCategoryHeight = innerHeight / activeCategories.length;

        // Simulation Loop (keep identical logic)
        for (let i = 0; i < simulationIterations; ++i) {
            for (let j = 0; j < points.length; ++j) {
                const p1 = points[j];
                if (!p1 || isNaN(p1.x) || isNaN(p1.y)) continue;
                p1.y += (p1.targetY - p1.y) * 0.05; // Pull towards target Y
                for (let k = j + 1; k < points.length; ++k) {
                    const p2 = points[k];
                    if (!p2 || isNaN(p2.x) || isNaN(p2.y)) continue;
                    const dx = p1.x - p2.x; const dy = p1.y - p2.y;
                    const distanceSq = dx * dx + dy * dy;
                    const minDistance = p1.radius + p2.radius + pointPadding;
                    const minDistanceSq = minDistance * minDistance;
                    if (distanceSq < minDistanceSq && distanceSq > 0.001) {
                        const distance = Math.sqrt(distanceSq); const overlap = minDistance - distance;
                        const angle = Math.atan2(dy, dx);
                        const moveX = (overlap / 1.9) * Math.cos(angle); const moveY = (overlap / 1.9) * Math.sin(angle);
                        if (!isNaN(moveX) && !isNaN(moveY)) {
                            p1.x += moveX; p1.y += moveY; p2.x -= moveX; p2.y -= moveY;
                        }
                    }
                }
                p1.y = Math.max(margin.top + p1.radius, Math.min(height - margin.bottom - p1.radius, p1.y)); // Clamp Y
                p1.x = Math.max(margin.left + p1.radius, Math.min(width - margin.right - p1.radius, p1.x)); // Clamp X
                 if (isNaN(p1.x) || isNaN(p1.y)) { console.warn("NaN coordinate detected during simulation for point", p1.id); } // Check inside loop
            }
        }
        console.log(`Layout finished. Final point count: ${points.length}`);
    }

    // --- Drawing Functions ---
    // (Keep the exact same drawAxes, drawCategoryBands, drawPoints, drawLegend functions)
    function drawAxes(activeCategories, categoryYMap) { /* ... */ }
    function drawCategoryBands(activeCategories, categoryYMap) { /* ... */ }
    function drawPoints() {
         console.log(`Attempting to draw ${points ? points.length : 0} points.`); // DEBUG
         if (!points || points.length === 0) return;

         ctx.globalAlpha = 0.9;
         points.forEach(p => {
             if (isNaN(p.x) || isNaN(p.y) || isNaN(p.radius) || p.radius <= 0) {
                  // console.warn("Skipping draw for invalid point:", p); // Optional log
                  return;
              }
             ctx.beginPath();
             ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
             const isHovered = hoveredPoint && hoveredPoint.id === p.id;
             ctx.fillStyle = isHovered ? hoverColor : p.color;
             ctx.fill();
             if (isHovered) { ctx.strokeStyle = 'rgba(0,0,0,0.7)'; ctx.lineWidth = 1; ctx.stroke(); }
         });
         ctx.globalAlpha = 1.0;
     }
    function drawLegend(activeCategories) { /* ... */ }

    // --- Main Orchestration Function ---
    // (Keep the exact same drawChart function)
    function drawChart(numCategoriesToShow) {
        console.log(`--- Drawing chart for ${numCategoriesToShow} categories (Hardcoded Data) ---`);
        const activeCategories = allCategoryNames.slice(0, numCategoriesToShow);
        // Filter the hardcoded data
        const filteredData = initialData.filter(d => activeCategories.includes(d.category));
        console.log(`Filtered data count: ${filteredData.length}`);

        // Recalculate Y Map
        const categoryYMap = {};
        const numActive = Math.max(1, activeCategories.length);
        const activeCategoryHeight = innerHeight / numActive;
        activeCategories.forEach((cat, i) => {
            categoryYMap[cat] = margin.top + activeCategoryHeight * (i + 0.5);
        });

        // Calculate layout
        calculateLayout(filteredData, activeCategories, categoryYMap);

        // Draw
        ctx.clearRect(0, 0, width, height);
        drawCategoryBands(activeCategories, categoryYMap);
        drawAxes(activeCategories, categoryYMap);
        drawPoints(); // <<< The important call
        drawLegend(activeCategories);

        hoveredPoint = null;
        tooltip.style.opacity = '0';
    }

    // --- Interactivity ---
    // (Keep the exact same getMousePos, handleMouseMove, handleMouseOut functions)
    function getMousePos(canvasEl, evt) { /* ... */ }
    function handleMouseMove(event) { /* ... */ }
    function handleMouseOut() { /* ... */ }


    // --- Slider Event Listener ---
    // (Keep the exact same slider listener)
     slider.addEventListener('input', (event) => {
         const numCategories = parseInt(event.target.value);
         sliderValueDisplay.textContent = numCategories;
         drawChart(numCategories);
     });


    // --- Initialization ---
    console.log("Initializing chart with hardcoded data...");
    // generateData(); // NO LONGER NEEDED
    drawChart(parseInt(slider.value)); // Initial draw using hardcoded data

    // Add mouse listeners
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseout', handleMouseOut);
    console.log("Chart initialization complete.");

});