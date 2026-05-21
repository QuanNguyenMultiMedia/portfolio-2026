document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // --- Utility to split text for character/word animations ---
    // (More robust libraries like SplitText are Club GSAP, this is a basic version)
    function splitText(elementOrSelector, type = "chars") {
        const element = typeof elementOrSelector === 'string' ? document.querySelector(elementOrSelector) : elementOrSelector;
        if (!element) return [];

        const originalText = element.textContent;
        element.innerHTML = ''; // Clear existing content

        let parts = [];
        const words = originalText.split(/\s+/); // Split by space for words

        words.forEach((word, wordIndex) => {
            if (word.length === 0) return;
            
            if (type === "lines" && wordIndex > 0) { // Very basic line concept, not true line splitting
                 // For simplicity, we're treating each word as a line for this example if type is lines
            }

            const wordWrapper = document.createElement('span');
            wordWrapper.style.display = 'inline-block';
            wordWrapper.classList.add('g-word');

            if (type === "chars" || type === "wordsAndChars") {
                word.split('').forEach(char => {
                    const charSpan = document.createElement('span');
                    charSpan.textContent = char;
                    charSpan.style.display = 'inline-block';
                    charSpan.classList.add('g-char');
                    wordWrapper.appendChild(charSpan);
                    parts.push(charSpan);
                });
            } else { // "words" or "lines" (treating word as line content)
                wordWrapper.textContent = word;
                parts.push(wordWrapper);
            }
            element.appendChild(wordWrapper);
            if (wordIndex < words.length - 1) { // Add space between words
                element.appendChild(document.createTextNode(' '));
            }
        });
        return parts;
    }
    
    // --- General Scroll-Triggered Fade-In-Up Animation ---
    function fadeInUp(elements, staggerAmount = 0.1, customScrollTriggerOptions = {}) {
        const defaultScrollTriggerOptions = {
            // trigger: el, // Default trigger will be the element itself if not overridden
            start: 'top 85%', // Default start condition
            toggleActions: 'play none none none',

            
            // markers: config.debug, // Uncomment for debugging
        };
    
        gsap.utils.toArray(elements).forEach(el => {
            // Merge default options with custom ones. Custom options will override defaults.
            // Ensure 'trigger' defaults to 'el' if not specified in customScrollTriggerOptions.
            const finalScrollTriggerOptions = {
                ...defaultScrollTriggerOptions,
                trigger: el, // Default trigger is the element itself
                ...customScrollTriggerOptions // Spread custom options, potentially overriding trigger and start
            };
    
            gsap.fromTo(el, 
                { opacity: 0, y: 50 }, // Initial state: invisible and slightly down
                { 
                    opacity: 1, y: 0, // Final state: visible and in place
                    duration: 0.8, 
                    ease: 'power2.out',
                    // Apply stagger only if 'elements' is an array/collection with more than one item
                    stagger: (gsap.utils.toArray(elements).length > 1 && staggerAmount !== 0) ? staggerAmount : 0,
                    scrollTrigger: finalScrollTriggerOptions
                }
            );
        });
    }

    // --- Section 1: Hero Animations ---
    const section1Title = document.querySelector('.section1-title');
    const section1Subtitle = document.querySelector('.section1-subtitle');
    const scrollSuggestion = document.querySelector('.scroll-down-suggestion');

    if (section1Title) {
        const titleChars = splitText(section1Title, "chars");
        gsap.fromTo(titleChars, 
            { opacity: 0, y: '100%' },
            { 
                opacity: 1, 
                y: '0%', 
                duration: 0.8, 
                ease: 'power3.out', 
                stagger: 0.03,
                delay: 0.3 
            }
        );
    }

    if (section1Subtitle) {
        gsap.fromTo(section1Subtitle, 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.8 }
        );
    }
    
    if (scrollSuggestion) {
         gsap.fromTo(scrollSuggestion,
            { opacity: 0 },
            { opacity: 1, duration: 1, delay: 1.5, onStart: () => scrollSuggestion.style.display = 'block' }
        );
    }
    
    // Decorative Lines Animation (Section 1)
    const bgLines = document.querySelectorAll('.decorative-bg-lines svg line');
    if (bgLines.length > 0) {
        gsap.fromTo(bgLines,
            { strokeDasharray: "1000", strokeDashoffset: "1000" },
            { 
                strokeDashoffset: "0", 
                duration: 3, 
                ease: "power2.inOut", 
                stagger: 0.3,
                delay: 1,
                scrollTrigger: { // Only animate if section 1 is somewhat in view
                    trigger: "#section1",
                    start: "top center" 
                }
            }
        );
        // Subtle ongoing movement for middle lines
        gsap.to(".decorative-bg-lines .middle-line", {
            x: (i) => (i % 2 === 0 ? 5 : -5), // Alternate direction
            y: (i) => (i % 2 === 0 ? -5 : 5),
            repeat: -1,
            yoyo: true,
            duration: 10,
            ease: "sine.inOut",
            delay: 4
        });
    }


    // --- Section 2: Map Animations ---
    // --- Section 2: Map Animations ---
    const mapSubtitleBox = document.querySelector('.map-subtitle-box');
    if (mapSubtitleBox) {
        fadeInUp(mapSubtitleBox, 0, { // 0 for no stagger as it's a single element
            trigger: "#section2",      // Use #section2 as the trigger element
            start: "top 75%",          // Animation starts when the top of #section2 is 75% from the top of the viewport
                                       // This means 25% of the section is visible. Adjust as needed.
            // markers: config.debug,  // Optional: for debugging trigger points
        });
    }

    const mapTitleBox = document.querySelector('.section2-fixed-title');
    if (mapTitleBox) {
        fadeInUp(mapTitleBox, 0, { // 0 for no stagger as it's a single element
            trigger: "#section2",      // Use #section2 as the trigger element
            start: "top 75%",          // Animation starts when the top of #section2 is 75% from the top of the viewport
                                       // This means 25% of the section is visible. Adjust as needed.
            // markers: config.debug,  // Optional: for debugging trigger points
        });
    }

    // --- Section 3: Chart & Filters Animations ---
    const section3MainTitle = document.querySelector('#main-title');
    if (section3MainTitle) {
        // Custom animation for this prominent title
        gsap.fromTo(section3MainTitle, 
            { opacity: 0, y: 50, scale: 0.95 },
            { 
                opacity: 1, y: 0, scale: 1, duration: 1, ease: 'expo.out',
                scrollTrigger: {
                    trigger: section3MainTitle,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                }
            }
        );
    }

    const filterGroups = document.querySelectorAll('#controls-panel .control-group');
    if (filterGroups.length > 0) {
        fadeInUp(filterGroups, 0.15, '#controls-panel'); // Stagger groups, trigger on panel
    }
    
    const chartContainer = document.querySelector('#chart-container');
    if (chartContainer) {
         // This will make the chart (and its D3 intro animation) appear when it scrolls into view
        gsap.fromTo(chartContainer,
            { opacity: 0, y: 50 },
            {
                opacity: 1, y: 0, duration: 1, ease: 'power2.out',
                scrollTrigger: {
                    trigger: chartContainer,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                    onEnter: () => {
                        // If D3 chart has its own intro, ensure it plays now
                        // The D3 chart logic might already handle its intro.
                        // If you need to re-trigger D3 animations, you'd call a function here.
                        // For now, just revealing the container.
                    }
                }
            }
        );
    }


    // --- Section 4: Conclusion Animations ---
    const conclusionTitle = document.querySelector('#section4 .conclusion-content h2');
    if (conclusionTitle) {
         fadeInUp(conclusionTitle);
    }

    const conclusionParagraphs = document.querySelectorAll('#section4 .conclusion-content p');
    if (conclusionParagraphs.length > 0) {
        fadeInUp(conclusionParagraphs, 0.2, '#section4 .conclusion-content');
    }

    const creditsBox = document.querySelector('#section4 .credits-box');
    if (creditsBox) {
        fadeInUp(creditsBox);
    }

    // --- Enhancing Scroll Arrow Nav on hover (example) ---
    const scrollArrows = gsap.utils.toArray('.scroll-arrow-btn');
    scrollArrows.forEach(arrow => {
        const icon = arrow.innerHTML; // Store original icon
        const hoverTimeline = gsap.timeline({ paused: true });
        hoverTimeline.to(arrow, { scale: 1.15, duration: 0.2, ease: 'power1.inOut' })
                     .to(arrow, { backgroundColor: 'var(--color-accent-hover)', duration: 0.2 }, "<");

        arrow.addEventListener('mouseenter', () => {
            if (!arrow.classList.contains('disabled')) {
                hoverTimeline.play();
            }
        });
        arrow.addEventListener('mouseleave', () => {
            if (!arrow.classList.contains('disabled')) {
                hoverTimeline.reverse();
            }
        });
    });
    
    // --- Potentially animate map points entrance ---
    // This is more complex as map points are dynamically added/positioned by map logic.
    // Would require integration with interactive_map.js or a MutationObserver.
    // For now, we'll skip this direct animation of map points via this file.

    // --- Animate side panel appearance (if not already smooth from CSS/previous JS) ---
    // The side panel already uses GSAP for its open/close in main_scroll_chart.js.
    // We can leave that as is or refine its easing/duration in that file if needed.
    // Example: If you wanted to add a slight overshoot:
    // In main_scroll_chart.js, where side panel opens:
    // ease: "back.out(1.7)" instead of config.ui.sidePanel.openEase

    console.log("GSAP animations initialized.");
});