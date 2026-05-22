const config = {
    debug: false, // General debug flag
    site: {
        defaultVideoSource: "8669752-uhd_2560_1440_30fps.mp4",
    },
    ui: {
        scrollLockTimeout: 750, // ms
        sectionIntersectionThreshold: 0.65, // For IntersectionObserver
        tooltip: {
            offsetX: 15, // px
            offsetY: 0,  // px (applied via transform translate Y-center)
            fadeInDuration: 0.25, // seconds
            fadeOutDuration: 0.25, // seconds
            scaleIn: 1.0,
            scaleOut: 0.95,
            htmlTemplate: (d) => `
                <strong>${d.eventName}</strong>
                <span>Năm: ${d.startYear}</span><br>
                <span>Số người chết: ${d.totalDeaths.toLocaleString()}</span><br>
                <span>Nhóm phụ: ${d.disasterSubgroup}</span><br>
                <span>Loại phụ: ${d.disasterSubtype}</span>
            `
        },
        sidePanel: {
            animationDuration: 0.35, // seconds
            width: 340,             // px
            hideOffset: 10,          // px
            openEase: "expo.out",
            closeEase: "expo.in",
            contentTemplate: (d) => `
                <h3>${d.eventName}</h3>
                <p><strong>Ngày bắt đầu:</strong> ${d.startDay || 'N/A'}/${d.startMonth || 'N/A'}/${d.startYear}</p>
                <p><strong>Ngày kết thúc:</strong> ${d.endDay || 'N/A'}/${d.endMonth || 'N/A'}/${d.endYear || 'N/A'}</p>
                <p><strong>Địa điểm:</strong> ${d.location || 'N/A'}</p>
                <hr>
                <p><strong>Nhóm:</strong> ${d.disasterGroup || 'N/A'}</p>
                <p><strong>Nhóm phụ:</strong> ${d.disasterSubgroup || 'N/A'}</p>
                <p><strong>Loại:</strong> ${d.disasterType || 'N/A'}</p>
                <p><strong>Loại phụ:</strong> ${d.disasterSubtype || 'N/A'}</p>
                <hr>
                <p><strong>Tổng số người chết:</strong> ${d.totalDeaths ? d.totalDeaths.toLocaleString() : 'N/A'}</p>
                <p><strong>Số bị thương:</strong> ${d.noInjured ? d.noInjured.toLocaleString() : 'N/A'}</p>
                <p><strong>Số bị ảnh hưởng:</strong> ${d.noAffected ? d.noAffected.toLocaleString() : 'N/A'}</p>
                <p><strong>Số người mất nhà cửa:</strong> ${d.noHomeless ? d.noHomeless.toLocaleString() : 'N/A'}</p>
                <p><strong>Tổng số ảnh hưởng:</strong> ${d.totalAffected ? d.totalAffected.toLocaleString() : 'N/A'}</p>
            `
        },
        responsiveBreakpoints: { // For JS-driven responsive logic if needed
            small: 480,
            medium: 768,
            large: 992
        }
    },
    map: {
        minScale: 1,
        maxScale: 7,
        zoomIncrement: 1.2,
        zoomAnimationDuration: 0.2, // seconds
        boundsAnimationDuration: 0.2, // seconds
        draggable: {
            edgeResistance: 0.75,
            // Add other Draggable options here if needed, e.g., inertia: true
        },
        points: { // These are mostly CSS, but if JS needs to know sizes:
            defaultWidth: 40, // px
            defaultHeight: 40, // px
            borderWidth: 2 //px
        }
    },
    annotation: {
        offsetX: 15, // px, from point to box (horizontal)
        offsetYRatio: 0.5, // for vertical centering relative to point (0.5 means middle)
        screenPadding: 10, // px, from window edges
        defaultWidth: 200, // px, fallback
        defaultHeight: 'auto', // px or 'auto', fallback for measurement
        minContentHeight: 150, // px, for scrollable area in modal body
        placeholderImageUrlPattern: "https://via.placeholder.com/350x150.png?text={title}", // {title} will be replaced
        imageAltPrefix: "Ảnh minh họa ",
        animation: {
            fadeInDuration: 0.35, // seconds
            fadeInEase: 'power2.out',
            fadeInStartScale: 0.9,
            fadeOutDuration: 0.2, // seconds
            fadeOutEndScale: 0.9,
            // refocusScale: 1.05, // No longer used due to toggle logic
            // refocusDuration: 0.1, // No longer used
        },
        line: {
            stroke: 'var(--color-text-secondary)', // Can be a direct color string too
            strokeWidth: 2.5,
            strokeDashArray: "4 2"
        }
    },
    chart: { // Beeswarm chart specific
        minHeight: 450, 
        aspectRatio: 0.5, 
        margin: { top: 40, right: 30, bottom: 50, left: 160 }, 
         responsiveMargins: { // Example for responsive chart margins
            small: { top: 30, right: 20, bottom: 40, left: 65 },
            medium: { top: 40, right: 25, bottom: 50, left: 80 }
        },
        xAxisLabel: "Năm",
        noDataMessageText: "Không có dữ liệu phù hợp. Bạn thử thay đổi bộ lọc nhé!"
    },
    scales: { // Beeswarm chart scales
        xScalePadding: 1.5, 
        rScaleMinRadius: 2, 
        rScaleMaxRadius: 30, 
        subtypeYScaleRangeMin: 0.05, 
        subtypeYScaleRangeMax: 0.95, 
        subtypeYScalePadding: 0.55, 
    },
    simulation: { // Beeswarm chart D3 simulation
        forceXStrength: 0.6, 
        forceYStrength: 0.2, 
        forceCollidePadding: 1.2, 
        forceCollideStrength: 0.7, 
        forceManyBodyStrength: 2.5, 
        alphaTargetInitial: 0.3, 
        alphaTargetFinal: 0, 
    },
    appearance: { // Beeswarm chart visual appearance
        circleStrokeColor: "var(--color-border)",
        circleStrokeWidth: 0.5, 
        circleOpacity: 0.8, 
        yAxisSubtypeLabelXOffset: -10, // Default, can be made responsive
        yAxisSubtypeLabelMaxLength: 25, 
        yAxisSubtypeLabelTruncSuffix: "...", 
        responsiveYAxisLabelOffsets: {
            small: -6,
            medium: -8
        }
    },
    animation: { // Beeswarm chart animations
        gsapCircleIntroDuration: 0.6, 
        gsapCircleIntroStagger: 0.01,
        transitionDuration: 500, // ms, for D3 transitions like axes
        shortTransitionDuration: 300 // ms
    },
    interaction: { // Beeswarm chart interactions
        circleHoverRadiusFactor: 1.25,
        circleHoverOpacity: 1.0, 
    },
    data: { // Data sources and defaults
        csvFilePath: 'disaster-in-vietnam_1900-to-2024.csv', 
        defaultDisasterSubtype: 'N/A',
        disasterGroupOrder: ['Natural', 'Technological', 'Biological'], 
    }
};
