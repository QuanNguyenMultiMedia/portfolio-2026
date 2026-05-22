let mapDraggable;
    let mapOriginalWidth, mapOriginalHeight;
    let activeAnnotations = {}; 
    // let annotationBoxZIndex = 1000; // No longer needed

    // const MIN_SCALE = 1; // Moved to config.map.minScale
    // const MAX_SCALE = 7; // Moved to config.map.maxScale
    // const ZOOM_INCREMENT = 1.2; // Moved to config.map.zoomIncrement
    let currentScale = 5;

    const mapViewport = document.getElementById('map-viewport');
    const mapContainer = document.getElementById('map-container');
    const vietnamMap = document.getElementById('vietnam-map');
    // const connectingLineSVG = document.getElementById('connecting-line-svg'); // Already defined by ID
    const annotationBoxTemplate = document.getElementById('annotation-box'); 

    const dataPoints = [
        {
            id: 'redRiverDeltaFlood1971',
            x: 39.20, y: 18.76,
            title: "Lũ lụt Đồng bằng sông Hồng năm 1971",
            text: "Trận lũ lịch sử năm 1971 tại Đồng bằng sông Hồng là một trong những thảm họa thiên nhiên nghiêm trọng nhất thế kỷ 20 ở Việt Nam. Vỡ đê trên diện rộng đã khiến khoảng 100.000 người thiệt mạng. Sự kiện này phơi bày những yếu điểm trong hệ thống đê điều cũ và nhấn mạnh tầm quan trọng của việc quản lý rủi ro thiên tai tại một trong những vùng châu thổ đông dân và trọng yếu nhất, là vựa lúa của miền Bắc. Nguồn ảnh: Trung tâm lưu trữ Quốc gia II, ZingNews",
            image_info_url: "https://vi.wikipedia.org/wiki/L%C5%A9_l%E1%BB%A5t_mi%E1%BB%An_B%E1%BA%AFc_Vi%E1%BB%87t_Nam_n%C4%83m_1971", // General info link
            wikimedia_image_url: "images/songhong1971.webp" 
        },
        {
            id: 'typhoonLinda1997',
            x: 34.82, y: 86.71,
            title: "Bão Linda (1997)",
            text: "Bão Linda, đổ bộ vào Đồng bằng sông Cửu Long cuối năm 1997, là một tong những cơrn bão có sức tàn phá khủng khiếp nhất trong lịch sử khu vực. Với hơn 3.000 người chết và mất tích, cơn bão đã gây thiệt hại nặng nề cho các cộng đồng ven biển và ngành nông nghiệp, đặc biệt là các tỉnh Cà Mau, Bạc Liêu, Kiên Giang. Thảm họa này đã thúc đẩy các nỗ lực cải thiện hệ thống cảnh báo sớm và năng lực phòng chống thiên tai tại Việt Nam. Nguồn ảnh: Phóng sự của VTC14, từ VnExpress",
            image_info_url: "https://vi.wikipedia.org/wiki/B%C3%A3o_Linda_(1997)",
            wikimedia_image_url: "images/Screenshot 2025-05-15 190020.png"
        },
        {
            id: 'haiphongTyphoon1881',
            x: 41.69, y: 16.94,
            title: "Bão Hải Phòng (1881)",
            text: "Cơn bão năm 1881 tại Hải Phòng và vùng ven biển Bắc Bộ được ghi nhận là một trong những thảm họa thiên nhiên chết chóc nhất lịch sử thế giới. Nước biển dâng cao bất thường cùng với sức gió cực mạnh đã cướp đi sinh mạng của khoảng 300.000 người. Đây là một con số ước tính kinh hoàng, phản ánh quy mô tàn khốc của tự nhiên và những hạn chế rất lớn trong công tác phòng chống bão lụt thời kỳ đó. Không có ảnh hiện trường.",
            image_info_url: "https://vi.wikipedia.org/wiki/B%C3%A3o_H%E1%BA%A3i_Ph%C3%B2ng_(1881)",
            wikimedia_image_url: "images/1881_Haiphong_Typhoon_track.png"
        },
        {
            id: 'centralVnFloods_1999',
            x: 39.61, y: 35.42,
            title: "Lũ lụt miền Trung (Thừa Thiên Huế, 1999)",
            text: "Miền Trung Việt Nam thường xuyên phải hứng chịu các trận lũ lụt nghiêm trọng. Trận lũ lịch sử tháng 11 năm 1999 tại Thừa Thiên Huế và các tỉnh lân cận là một minh chứng đau lòng, với hơn 700 người thiệt mạng và thiệt hại vật chất khổng lồ. Thảm họa này cho thấy đặc điểm địa lý dễ bị tổn thương của khu vực trước mưa lớn kéo dài và sự cần thiết của các giải pháp dài hạn về quy hoạch, cơ sở hạ tầng chống lũ. Nguồn ảnh: Báo Nhân Dân",
            image_info_url: "https://vi.wikipedia.org/wiki/L%C5%A9_l%E1%BB%A5t_mi%E1%BB%An_Trung_Vi%E1%BB%87t_Nam_n%C4%83m_1999",
            wikimedia_image_url: "images/hue1999.webp"
        },
        {
            id: 'centralVnFloods_2020',
            x: 47.40, y: 50.05,
            title: "Lũ lụt miền Trung (2020)",
            text: "Năm 2020, miền Trung Việt Nam liên tiếp trải qua nhiều đợt mưa lũ lịch sử, kéo dài từ tháng 10 đến tháng 11, gây ra những hậu quả vô cùng nặng nề. Hơn 230 người chết và mất tích, hàng trăm ngàn ngôi nhà bị ngập sâu, tài sản và cơ sở hạ tầng bị tàn phá. Chuỗi thiên tai này một lần nữa nhấn mạnh tác động ngày càng gia tăng của biến đổi khí hậu và yêu cầu cấp bách về các biện pháp thích ứng, nâng cao khả năng chống chịu của cộng đồng. Nguồn ảnh: Báo Công an Thành phố Đà Nẵng",
            image_info_url: "https://vi.wikipedia.org/wiki/L%C5%A9_l%E1%BB%A5t_mi%E1%BB%An_Trung_Vi%E1%BB%87t_Nam_n%C4%83m_2020",
            wikimedia_image_url: "images/2c.jpg"
        },
        {
            id: 'typhoonYagi2024',
            x: 32.52, y: 13.56,
            title: "Bão Yagi và Lũ lụt (Tháng 9/2024)",
            text: "Đầu tháng 9 năm 2024, cơn bão Yagi, một trong những cơn bão mạnh nhất trong nhiều thập kỷ, đã đổ bộ vào miền Bắc Việt Nam. Bão gây ra mưa lớn trên diện rộng, dẫn đến lũ lụt và sạt lở đất nghiêm trọng, đặc biệt tại các tỉnh Lào Cai, Yên Bái, Phú Thọ. Hơn 300 người được báo cáo thiệt mạng hoặc mất tích. Thảm họa này là lời nhắc nhở nghiệt ngã về sức mạnh khó lường của tự nhiên và tầm quan trọng của công tác dự báo, sơ tán và chuẩn bị ứng phó. Nguồn ảnh: Wikimedia",
            image_info_url: "https://vi.wikipedia.org/wiki/B%C3%A3o_Yagi_(2024)", // General info link
            wikimedia_image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/2024_CIMSS_12W_Yagi_visible_infrared_satellite_loop.gif/640px-2024_CIMSS_12W_Yagi_visible_infrared_satellite_loop.gif"
        },
        {
            id: 'dongNaiTrainDisaster1982',
            x: 42.06, y: 75.37,
            title: "Tai nạn đường sắt Đồng Nai (1982)",
            text: "Vụ tai nạn đường sắt thảm khốc tại xã Bàu Hàm, huyện Thống Nhất, tỉnh Đồng Nai ngày 17 tháng 3 năm 1982 đã cướp đi sinh mạng của hơn 200 người và làm nhiều người khác bị thương. Đây là một trong những vụ tai nạn đường sắt nghiêm trọng nhất trong lịch sử Việt Nam, gióng lên hồi chuông cảnh tỉnh về các tiêu chuẩn an toàn, bảo trì cơ sở hạ tầng và quy trình vận hành trong ngành đường sắt. Nguồn ảnh: Wikipedia",
            image_info_url: "https://vi.wikipedia.org/wiki/Tai_n%E1%BA%A1n_t%C3%A0u_183_%281982%29", // News source, as specific wiki might be limited
            wikimedia_image_url: "images/Bàu_Cá_railway_station.jpg"
        },
        {
            id: 'hcmcItcFire2002',
            x: 41.50, y: 76.34,
            title: "Vụ cháy ITC Thành phố Hồ Chí Minh (2002)",
            text: "Vụ cháy Trung tâm Thương mại Quốc tế (ITC) tại TP. Hồ Chí Minh ngày 29 tháng 10 năm 2002 là một thảm họa kinh hoàng, khiến 60 người thiệt mạng và 70 người khác bị thương. Vụ việc đã phơi bày những thiếu sót nghiêm trọng trong công tác phòng cháy chữa cháy tại các tòa nhà cao tầng thời điểm đó và thúc đẩy việc rà soát, tăng cường các quy định an toàn PCCC trên cả nước, đặc biệt là cho các công trình phức hợp, tập trung đông người. Nguồn ảnh: Wikipedia",
            image_info_url: "https://vi.wikipedia.org/wiki/V%E1%BB%A5_h%E1%BB%8Fa_ho%E1%BA%A1n_ITC#:~:text=V%E1%BB%A5%20h%E1%BB%8Fa%20ho%E1%BA%A1n%20ITC%20(ITC,Minh%20v%C3%A0%20c%E1%BA%A3%20Vi%E1%BB%87t%20Nam.",
            wikimedia_image_url: "images/Cháy_ICT_2002.jpg"
        },
        {
            id: 'canThoBridgeCollapse2007',
            x: 37.92, y: 80.69,
            title: "Sập nhịp dẫn cầu Cần Thơ (2007)",
            text: "Sự cố sập hai nhịp dẫn cầu Cần Thơ (đang trong quá trình thi công) vào sáng ngày 26 tháng 9 năm 2007 đã gây ra cái chết thương tâm cho 55 công nhân và làm 80 người bị thương. Đây là một trong những tai nạn lao động xây dựng nghiêm trọng nhất tại Việt Nam, đặt ra nhiều câu hỏi về quy trình giám sát thi công, đảm bảo an toàn lao động và chất lượng công trình trong các dự án cơ sở hạ tầng quy mô lớn. Nguồn ảnh: Wikipedia",
            image_info_url: "https://vi.wikipedia.org/wiki/S%E1%BB%B1_c%E1%BB%91_s%E1%BA%ADp_nh%E1%BB%8Bp_d%E1%BA%ABn_c%E1%BA%A7u_C%E1%BA%A7n_Th%C6%A1",
            wikimedia_image_url: "images/CanThoBridgeCollapse2.jpg"
        },
        {
            id: 'sarsEpidemic2003',
            x: 38.67, y: 19.00,
            title: "Đại dịch SARS (2003)",
            text: "Năm 2003, Việt Nam là quốc gia đầu tiên bên ngoài Trung Quốc ghi nhận ca bệnh SARS và cũng là quốc gia đầu tiên trên thế giới khống chế thành công dịch bệnh nguy hiểm này. Với các biện pháp y tế công cộng quyết liệt và sự vào cuộc của cả hệ thống, Việt Nam chỉ ghi nhận 63 ca nhiễm và 5 ca tử vong. Thành công này được Tổ chức Y tế Thế giới (WHO) công nhận, trở thành bài học kinh nghiệm quý báu trong phòng chống dịch bệnh truyền nhiễm toàn cầu. Nguồn ảnh: Báo Tuổi Trẻ",
            image_info_url: "https://vi.wikipedia.org/wiki/D%E1%BB%8Bch_SARS_2002%E2%80%932004",
            wikimedia_image_url: "images/nguyen-thi-men-2-sars-read-only-16817792881291530519373.webp"
        }
    ];

    function initializeMapDraggable() {
        if (mapContainer) {
            mapDraggable = Draggable.create(mapContainer, {
                type: "x,y", 
                edgeResistance: config.map.draggable.edgeResistance, 
                bounds: mapViewport, 
                inertia: true, // Often a good default
                cursor: "grab", 
                activeCursor: "grabbing",
                onDrag: () => { updatePointsPosition(); updateAllConnectingLines(); },
                onThrowUpdate: () => { updatePointsPosition(); updateAllConnectingLines(); },
                onDragEnd: restrictMovement,
                onThrowComplete: restrictMovement,
                zIndexBoost: false
            })[0];
        } else { if (config.debug) console.error("Map container not found for Draggable init."); }
    }
    function setupMapEventListeners() {
        if (mapViewport) {
            mapViewport.addEventListener('wheel', (event) => {
                event.preventDefault();
                const rect = mapViewport.getBoundingClientRect();
                const mouseX = event.clientX - rect.left;
                const mouseY = event.clientY - rect.top;
                const currentTransform = gsap.getProperty(mapContainer, ["x", "y"]);
                const currentX = parseFloat(currentTransform.x) || 0;
                const currentY = parseFloat(currentTransform.y) || 0;
                const mouseOnMapX = (mouseX - currentX) / currentScale;
                const mouseOnMapY = (mouseY - currentY) / currentScale;
                let newScale = currentScale * (event.deltaY < 0 ? config.map.zoomIncrement : 1 / config.map.zoomIncrement);
                newScale = gsap.utils.clamp(config.map.minScale, config.map.maxScale, newScale);
                const newX = mouseX - mouseOnMapX * newScale;
                const newY = mouseY - mouseOnMapY * newScale;
                
                gsap.to(mapContainer, {
                    duration: config.map.zoomAnimationDuration, 
                    scale: newScale, x: newX, y: newY,
                    onUpdate: () => { updatePointsPosition(); updateAllConnectingLines(); },
                    onComplete: () => {
                        currentScale = newScale; // Ensure currentScale is updated after animation
                        restrictMovement();
                        if (mapDraggable && typeof mapDraggable.update === 'function') mapDraggable.update(true);
                        updateAllConnectingLines();
                    }
                });
                 // currentScale = newScale; // Update immediately for next wheel event logic, or rely on onComplete
            });
        } else { if (config.debug) console.error("Map viewport not found for wheel event."); }
    }

    function restrictMovement() {
        if (!mapContainer || !mapViewport || !mapOriginalWidth) return; 
        let currentX = gsap.getProperty(mapContainer, "x");
        let currentY = gsap.getProperty(mapContainer, "y");
        const mapScaledWidth = mapOriginalWidth * currentScale;
        const mapScaledHeight = mapOriginalHeight * currentScale;
        const viewportWidth = mapViewport.clientWidth;
        const viewportHeight = mapViewport.clientHeight;
        let targetX = currentX;
        let targetY = currentY;

        if (mapScaledWidth <= viewportWidth) { targetX = (viewportWidth - mapScaledWidth) / 2; }
        else { targetX = gsap.utils.clamp(viewportWidth - mapScaledWidth, 0, currentX); }
        if (mapScaledHeight <= viewportHeight) { targetY = (viewportHeight - mapScaledHeight) / 2; }
        else { targetY = gsap.utils.clamp(viewportHeight - mapScaledHeight, 0, currentY); }

        if (targetX !== currentX || targetY !== currentY) {
            gsap.to(mapContainer, {
                x: targetX, y: targetY, duration: config.map.boundsAnimationDuration,
                onUpdate: () => { updatePointsPosition(); updateAllConnectingLines(); }
            });
        }
    }
    
    // Add this towards the top of js/interactive_map.js if not already there,
// though GSAP is likely global.
// const gsap = window.gsap;

// Existing variables like mapContainer, dataPoints etc. are assumed to be here.

function createMapPoints() {
    if (!mapContainer) {
        if (config.debug) console.error("Map container not found in createMapPoints.");
        return;
    }
    mapContainer.querySelectorAll('.map-point').forEach(p => p.remove()); // Clear existing points

    const pointElements = []; // Store created elements for animation

    dataPoints.forEach(pointData => {
        const pointElement = document.createElement('div');
        pointElement.classList.add('map-point');
        pointElement.classList.add('g-map-point'); // Add class for animation targeting
        pointElement.id = `map-point-${pointData.id}`;
        pointElement.dataset.pointId = pointData.id;
        
        // Store all data attributes
        Object.keys(pointData).forEach(key => {
            if (typeof pointData[key] === 'string' || typeof pointData[key] === 'number') {
                pointElement.dataset[key] = String(pointData[key]); // Ensure it's a string for dataset
            }
        });

        mapContainer.appendChild(pointElement);
        pointElement.addEventListener('click', (e) => {
            e.stopPropagation();
            handlePointClick(pointElement, pointData);
        });
        pointElements.push(pointElement);
    });

    updatePointsPosition(); // Position them correctly (they will be initially hidden by CSS via .g-map-point)

    // Sort points by their Y position (top to bottom)
    pointElements.sort((a, b) => {
        const yA = parseFloat(a.dataset.y); // Assumes 'data-y' stores the percentage
        const yB = parseFloat(b.dataset.y);
        if (isNaN(yA) || isNaN(yB)) return 0; 
        return yA - yB;
    });

    // GSAP master timeline for sequential appearance and pulse of all points
    const masterTl = gsap.timeline({
        delay: 0.2, // Delay the start of the whole sequence (e.g., after map is stable)
        // Uncomment and configure if you want this tied to Section 2 visibility:
    
        scrollTrigger: {
            trigger: "#section2", // Or mapViewport
            start: "top 70%",    // Start when map section is 70% in view
            toggleActions: "play none none none",
            once: true, // Ensure it only plays once
            // markers: config.debug, // For debugging ScrollTrigger
        }
    
    });

    // Inside createMapPoints, within the pointElements.forEach loop:

    pointElements.forEach((pointEl) => {
        const pointAppearAndPulseTl = gsap.timeline();
        
        pointAppearAndPulseTl
            .fromTo(pointEl,
                { scale: 0.3, opacity: 0 }, // Start small and invisible
                { 
                    scale: 1,
                    opacity: 0.9, // Appeared state opacity
                    duration: 0.3,
                    ease: "back.out(1.7)",
                }
            )
            // Big Pulse sequence
            .to(pointEl, { // Scale up
                scale: 10, // How big the pulse is
                opacity: 1,   // Full opacity at peak pulse
                duration: 0.4, // Duration to scale up
                ease: "power2.out",
            }, "-=0.1") // Overlap slightly with appearance end
            .to(pointEl, { // Scale back down
                scale: 1,
                opacity: 0.9, // Back to normal appeared opacity
                duration: 0.6, // Duration to scale down
                ease: "power2.in",
            });
            
            masterTl.add(pointAppearAndPulseTl, "= -1"); 
    });
}

// Make sure initializeMap calls createMapPoints, and the rest of your
// interactive_map.js (updatePointsPosition, handlePointClick, etc.) remains.
// The DOMContentLoaded listener at the end should correctly call initializeMap.
    
    function updatePointsPosition() {
        if (!mapOriginalWidth || !mapOriginalHeight || !mapContainer) return;
        const points = mapContainer.querySelectorAll('.map-point');
        points.forEach(pointElement => {
            const originalXPercent = parseFloat(pointElement.dataset.x);
            const originalYPercent = parseFloat(pointElement.dataset.y);
            if (isNaN(originalXPercent) || isNaN(originalYPercent)) return;
            const xPos = (originalXPercent / 100) * mapOriginalWidth;
            const yPos = (originalYPercent / 100) * mapOriginalHeight;
            gsap.set(pointElement, { left: xPos + 'px', top: yPos + 'px' });
        });
    }
    
    function handlePointClick(clickedPointElement, pointData) {
    const pointId = pointData.id;

    if (activeAnnotations[pointId]) {
        hideSingleAnnotation(pointId);
        return;
    }

    const openAnnotationIds = Object.keys(activeAnnotations);
    for (const existingId of openAnnotationIds) {
        hideSingleAnnotation(existingId);
    }

    if (!annotationBoxTemplate) {
        if (config.debug) console.error("Annotation box template not found!");
        return;
    }
    const newBox = annotationBoxTemplate.cloneNode(true);
    newBox.id = `annotation-box-${pointId}`;

    newBox.style.position = 'fixed';
    newBox.style.display = 'block';
    newBox.style.visibility = 'hidden';
    newBox.style.opacity = '1';
    newBox.style.transform = 'scale(1)';
    newBox.style.left = '-9999px';
    newBox.style.top = '-9999px';
    newBox.classList.remove('visible');

    document.body.appendChild(newBox);

    const titleEl = newBox.querySelector('.modal-title');
    const textEl = newBox.querySelector('#annotation-text');
    const imageEl = newBox.querySelector('#annotation-image');
    const linkEl = newBox.querySelector('#annotation-image-link');
    const closeBtn = newBox.querySelector('.button-close');

    if (titleEl) titleEl.textContent = pointData.title;
    if (textEl) textEl.textContent = pointData.text;

    if (imageEl) {
        if (pointData.wikimedia_image_url) {
            imageEl.src = pointData.wikimedia_image_url;
            imageEl.alt = (config.annotation.imageAltPrefix || "Ảnh minh họa ") + pointData.title;
        } else {
            imageEl.src = config.annotation.placeholderImageUrlPattern.replace('{title}', encodeURIComponent(pointData.title));
            imageEl.alt = (config.annotation.imageAltPrefix || "Ảnh minh họa ") + pointData.title + " (ảnh tạm)";
        }
        imageEl.onerror = function() {
            // FIX: Remove the onerror handler to prevent a feedback loop
            this.onerror = null;
            this.src = config.annotation.placeholderImageUrlPattern.replace('{title}', encodeURIComponent(pointData.title) + ' (Error)');
            this.alt = (config.annotation.imageAltPrefix || "Ảnh minh họa ") + pointData.title + " (Lỗi khi tải hình)";
        };
    }

    if (linkEl) {
        if (pointData.image_info_url && pointData.image_info_url !== "null" && pointData.image_info_url.trim() !== "") {
            linkEl.href = pointData.image_info_url;
            linkEl.style.display = 'block';
            linkEl.textContent = "Xem thêm thông tin"; // Vietnamese text for the link
        } else {
            linkEl.style.display = 'none';
        }
    }

    let boxWidth = newBox.offsetWidth;
    let boxHeight = newBox.offsetHeight;

    if (!boxWidth || boxWidth < 50) {
        newBox.style.width = `${config.annotation.defaultWidth}px`;
        boxWidth = newBox.offsetWidth || config.annotation.defaultWidth;
    }
    if (!boxHeight || boxHeight < 50) {
        if (config.annotation.defaultHeight !== 'auto') {
            newBox.style.height = `${config.annotation.defaultHeight}px`;
        } else {
            newBox.style.height = 'auto';
        }
        boxHeight = newBox.offsetHeight || (config.annotation.defaultHeight === 'auto' ? 200 : parseInt(config.annotation.defaultHeight));
    }

    const pointRect = clickedPointElement.getBoundingClientRect();
    let initialX = pointRect.right + config.annotation.offsetX;
    let initialY = pointRect.top + (pointRect.height * config.annotation.offsetYRatio) - (boxHeight * config.annotation.offsetYRatio);

    const padding = config.annotation.screenPadding;
    initialX = Math.max(padding, Math.min(initialX, window.innerWidth - boxWidth - padding));
    initialY = Math.max(padding, Math.min(initialY, window.innerHeight - boxHeight - padding));

    gsap.fromTo(newBox, {
        opacity: 0,
        scale: config.annotation.animation.fadeInStartScale,
        left: initialX,
        top: initialY,
        visibility: 'hidden'
    }, {
        left: initialX,
        top: initialY,
        opacity: 1,
        scale: 1,
        visibility: 'visible',
        duration: config.annotation.animation.fadeInDuration,
        ease: config.annotation.animation.fadeInEase,
        onStart: () => {
            newBox.classList.add('visible');
        },
    });

    if (closeBtn) {
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            hideSingleAnnotation(pointId);
        };
    }

    const lineSvg = document.getElementById('connecting-line-svg');
    if (!lineSvg) {
        if (config.debug) console.error("Connecting line SVG container not found.");
        return;
    }

    const newLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    newLine.setAttribute('id', `connecting-line-${pointId}`);
    newLine.setAttribute('stroke', config.annotation.line.stroke);
    newLine.setAttribute('stroke-width', String(config.annotation.line.strokeWidth));
    newLine.setAttribute('stroke-dasharray', config.annotation.line.strokeDashArray);
    newLine.style.display = 'none';
    lineSvg.appendChild(newLine);

    activeAnnotations[pointId] = {
        boxElement: newBox,
        lineElement: newLine,
        pointElement: clickedPointElement,
        pointData: pointData,
    };
    updateSingleConnectingLine(pointId);
}
    
    function hideSingleAnnotation(pointId) {
        if (activeAnnotations[pointId]) {
            const annotation = activeAnnotations[pointId];
            // Draggable kill removed
            gsap.to(annotation.boxElement, {
                opacity: 0, 
                scale: config.annotation.animation.fadeOutEndScale, 
                visibility: 'hidden',
                duration: config.annotation.animation.fadeOutDuration, 
                onComplete: () => {
                    if (annotation.boxElement) annotation.boxElement.remove();
                }
            });
            if (annotation.lineElement) annotation.lineElement.remove(); 
            delete activeAnnotations[pointId]; 
        }
    }

    function updateSingleConnectingLine(pointId) {
        const annotation = activeAnnotations[pointId];
        if (!annotation || !annotation.pointElement || !annotation.boxElement || !annotation.lineElement) return;
        
        const pointRect = annotation.pointElement.getBoundingClientRect();
        const boxRect = annotation.boxElement.getBoundingClientRect(); 
        
        if (annotation.boxElement.style.opacity === "0" || annotation.boxElement.style.visibility === 'hidden' || (boxRect.width === 0 && boxRect.height === 0)) {
            annotation.lineElement.style.display = 'none';
            return;
        }

        const x1 = pointRect.left + pointRect.width / 2;
        const y1 = pointRect.top + pointRect.height / 2;
        
        let x2 = boxRect.left; 
        if ( (boxRect.left + boxRect.width / 2) < x1 ) { 
             x2 = boxRect.right; 
        } 
        let y2 = boxRect.top + boxRect.height / 2; 
        
        const verticalThreshold = boxRect.width / 2;
        if (Math.abs(x1 - (boxRect.left + boxRect.width/2)) < verticalThreshold) { 
            x2 = boxRect.left + boxRect.width / 2; 
            if (y1 < boxRect.top) { y2 = boxRect.top; } 
            else if (y1 > boxRect.bottom) { y2 = boxRect.bottom; }
        }

        gsap.set(annotation.lineElement, { attr: { x1, y1, x2, y2 } });
        annotation.lineElement.style.display = 'block';
    }

    function updateAllConnectingLines() {
        for (const pointId in activeAnnotations) {
            if (activeAnnotations.hasOwnProperty(pointId)) {
                updateSingleConnectingLine(pointId);
            }
        }
    }
    
    function initializeMap() {
    if (!vietnamMap || !mapContainer || !mapViewport) {
        if (config.debug) console.error("Map elements missing for initialization.");
        return;
    }
    // Ensure the image is loaded and has dimensions
    if (!vietnamMap.complete || vietnamMap.naturalWidth === 0 || vietnamMap.naturalHeight === 0) {
        if (vietnamMap.complete && (vietnamMap.naturalWidth === 0 || vietnamMap.naturalHeight === 0)) {
            if (mapViewport) mapViewport.innerHTML = "<p style='text-align:center; padding:20px;'>Error: Map image loaded with zero dimensions.</p>";
        } else {
            if (config.debug) console.warn("Map image not yet complete during initializeMap call. Deferring or relying on onload.");
        }
        return;
    }

    mapOriginalWidth = vietnamMap.naturalWidth;
    mapOriginalHeight = vietnamMap.naturalHeight;

    if (!mapOriginalWidth || !mapOriginalHeight) {
         if (mapViewport) mapViewport.innerHTML = "<p style='text-align:center; padding:20px;'>Error: Invalid map image dimensions after load.</p>";
         return;
    }

    const viewportWidth = mapViewport.clientWidth;
    const viewportHeight = mapViewport.clientHeight;

    // Additional check for valid viewport dimensions
    if (viewportWidth === 0 || viewportHeight === 0) {
        if (config.debug) console.warn("Map viewport has zero width or height during initialization.");
        // Optionally, you could try to re-initialize after a short delay or on resize
        return;
    }

    // Calculate scale to fit the entire map within the viewport
    const scaleX = viewportWidth / mapOriginalWidth;
    const scaleY = viewportHeight / mapOriginalHeight;
    const fitScale = Math.min(scaleX, scaleY);

    // Update currentScale to this fitScale for the initial view
    currentScale = fitScale;

    // IMPORTANT: Adjust config.map.minScale to allow zooming relative to the new fitScale.
    config.map.minScale = fitScale;

    // Calculate position to center the scaled map
    const scaledMapWidth = mapOriginalWidth * currentScale;
    const scaledMapHeight = mapOriginalHeight * currentScale;

    const initialX = (viewportWidth - scaledMapWidth) / 2;
    const initialY = (viewportHeight - scaledMapHeight) / 2;

    gsap.set(mapContainer, {
        x: initialX,
        y: initialY,
        scale: currentScale,
        width: mapOriginalWidth,
        height: mapOriginalHeight,
        transformOrigin: "0 0"
    });
    gsap.set(vietnamMap, { width: "100%", height: "100%" });

    createMapPoints(); // Create points after map is sized and positioned
    restrictMovement(); // Apply initial bounds restriction

    if (mapDraggable && typeof mapDraggable.enable === 'function') {
        mapDraggable.enable();
        if (typeof mapDraggable.update === 'function') mapDraggable.update(true);
    } else {
        initializeMapDraggable();
        if (mapDraggable && typeof mapDraggable.enable === 'function') {
            mapDraggable.enable();
            if (typeof mapDraggable.update === 'function') mapDraggable.update(true);
        }
    }
    updatePointsPosition();
    updateAllConnectingLines();
}


// Snippet 4: Modify the setupMapEventListeners function (specifically the wheel event)
function setupMapEventListeners() {
    if (mapViewport) {
        mapViewport.addEventListener('wheel', (event) => {
            event.preventDefault();

            // Get the live, current visual properties of the map container at the moment of the event
            const liveScale = gsap.getProperty(mapContainer, "scale");
            const liveX = gsap.getProperty(mapContainer, "x");
            const liveY = gsap.getProperty(mapContainer, "y");

            // Ensure live properties are numbers, default to 0 or 1 if not (though GSAP should return numbers)
            const safeLiveScale = typeof liveScale === 'number' ? liveScale : 1;
            const safeLiveX = typeof liveX === 'number' ? liveX : 0;
            const safeLiveY = typeof liveY === 'number' ? liveY : 0;

            const rect = mapViewport.getBoundingClientRect();
            const mouseX = event.clientX - rect.left; // Mouse position relative to viewport
            const mouseY = event.clientY - rect.top;

            // Calculate mouse position relative to the map's content, using live scale and position
            // This determines the point on the map that should stay under the mouse cursor
            const mouseOnMapX = (mouseX - safeLiveX) / safeLiveScale;
            const mouseOnMapY = (mouseY - safeLiveY) / safeLiveScale;

            // Calculate the new target scale based on the live scale
            let newScaleAttempt = safeLiveScale * (event.deltaY < 0 ? config.map.zoomIncrement : 1 / config.map.zoomIncrement);
            let newScale = gsap.utils.clamp(config.map.minScale, config.map.maxScale, newScaleAttempt);

            // If scale hasn't changed (e.g., already at min/max limit), do nothing
            if (newScale === safeLiveScale) {
                return;
            }

            // Calculate the new X and Y for the map container to keep the mouseOnMapX/Y point under the cursor
            const newX = mouseX - mouseOnMapX * newScale;
            const newY = mouseY - mouseOnMapY * newScale;

            // Update the global currentScale variable to the new target scale *immediately*.
            // This is crucial so that if another wheel event fires rapidly,
            // its calculations for its own target scale will be based on this *intended* newScale,
            // rather than a potentially stale value from before this event.
            currentScale = newScale;

            gsap.to(mapContainer, {
                duration: config.map.zoomAnimationDuration,
                scale: newScale,
                x: newX,
                y: newY,
                overwrite: true, // Crucial: ensures this animation overwrites any previous zoom animation on the same target
                onComplete: () => {
                    // currentScale is already up-to-date with the target newScale.
                    restrictMovement(); // Apply boundary restrictions
                    if (mapDraggable && typeof mapDraggable.update === 'function') {
                        mapDraggable.update(true); // Update Draggable's internal state
                    }
                    updatePointsPosition(); // Reposition map points based on the new scale/transform
                    updateAllConnectingLines(); // Redraw connecting lines
                }
            });
        });
    } else { if (config.debug) console.error("Map viewport not found for wheel event."); }
}


    
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof gsap !== 'undefined' && typeof Draggable !== 'undefined') {
            gsap.registerPlugin(Draggable); 
        } else {
            if(config.debug) console.error("GSAP or Draggable not loaded.");
            return;
        }

        initializeMapDraggable(); // Initialize map dragging capabilities first
        setupMapEventListeners(); // Then setup zoom listeners

        if (vietnamMap) {
            if (vietnamMap.complete && vietnamMap.naturalWidth > 0 && vietnamMap.naturalHeight > 0) {
                initializeMap();
            } else if (vietnamMap.complete && (vietnamMap.naturalWidth === 0 || vietnamMap.naturalHeight === 0)) {
                 if (mapViewport) mapViewport.innerHTML = "<p style='text-align:center; padding:20px;'>Error: Map image loaded with zero dimensions.</p>";
            } else {
                vietnamMap.onload = initializeMap;
            }
            vietnamMap.onerror = () => {
                if (mapViewport) mapViewport.innerHTML = "<p style='text-align:center; padding:20px;'>Error: Could not load map image.</p>";
            };
        } else {
            if(config.debug) console.error("Vietnam map element not found on DOMContentLoaded.");
        }
    });