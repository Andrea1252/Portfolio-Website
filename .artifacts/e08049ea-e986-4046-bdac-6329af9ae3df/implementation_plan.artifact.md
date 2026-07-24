# Implementation Plan - Scroll-Triggered Vertical "Rolling" Carousel

Transform the current automatic Revvo carousel into a scroll-driven vertical "rolling" experience. As the user scrolls, the images will roll vertically, and the corresponding text label will bold in sync with the movement.

## Proposed Changes

### [Product Component]

#### [MODIFY] [revvo.html](file:///Users/andrea/StudioProjects/Portfolio-Website/Product/revvo.html)
- Wrap the `.rotating-carousel` content in a `.carousel-sticky-wrapper`.
- Restructure `.carousel-main` to contain a `.carousel-track` that holds all images vertically.

#### [MODIFY] [style.css](file:///Users/andrea/StudioProjects/Portfolio-Website/style.css)
- Set `.rotating-carousel` to a large height (e.g., `400vh`) to create a scrollable "track".
- Apply `position: sticky; top: 0; height: 100vh;` to `.carousel-sticky-wrapper`.
- Update `.carousel-main` to act as a "window" (`overflow: hidden`) for the rolling images.
- Style `.carousel-track` to stack images vertically and use `transition: transform` for smooth rolling (or direct scroll mapping).
- Update labels to be fixed/centered above the image window.

#### [MODIFY] [script.js](file:///Users/andrea/StudioProjects/Portfolio-Website/script.js)
- Remove the `setInterval` auto-rotation logic.
- Add a scroll listener (hooked into Lenis or standard `scroll`) that:
    - Calculates the progress (0 to 1) of the scroll within the `.rotating-carousel` section.
    - Maps that progress to the active slide index (0 to 4).
    - Updates the bolding of the `.carousel-label` elements.
    - Applies a `translateY` transform to the `.carousel-track` to "roll" the images vertically.

## Verification Plan

### Manual Verification
- Open `revvo.html` in a browser.
- Scroll down to the carousel section.
- Verify that the section "sticks" to the viewport.
- Confirm that as you continue scrolling, the images roll vertically and the text labels bold according to the visible image.
- Verify the transition is smooth and synced with the scroll speed.
- Test on mobile to ensure the sticky behavior and vertical rolling work as expected.
