# Implementation Plan - Swipe-Based Navigation & Page Transitions

Add smooth swipe gestures (left/right) to navigate between project pages and implement seamless transitions between projects.

## Proposed Changes

### [Core Component]

#### [MODIFY] [script.js](file:///Users/andrea/StudioProjects/Portfolio-Website/script.js)
- **Project Sequence Mapping**:
    - Define the order of projects (Dune -> LifeAid -> Revvo -> Boghylde -> Cove -> Panel -> Deskscape -> Weeding Fork -> Jet -> Verge -> Swirl).
    - Map the current file name to its index in the sequence.
- **Swipe Detection**:
    - Implement `touchstart` and `touchend` event listeners.
    - Calculate the horizontal delta (dX) to determine swipe direction.
    - If swipe threshold is met, navigate to the `next` or `previous` project.
- **Smooth Page Transitions**:
    - Use a CSS-based entrance/exit animation (e.g., fade-out on exit, fade-in on load).
    - Add a "loading" state class to the body during navigation.

#### [MODIFY] [style.css](file:///Users/andrea/StudioProjects/Portfolio-Website/style.css)
- Add global page transition styles:
    - `.page-transition-overlay`: A full-screen element that handles the color/fade between pages.
    - `@keyframes fadeOut` and `@keyframes fadeIn`.
- Ensure transition classes are applied to the `body`.

## Verification Plan

### Manual Verification
- Open any project page (e.g., `revvo.html`).
- Swipe left on a mobile device or browser emulator to move to the next project (**Boghylde**).
- Swipe right to move to the previous project (**LifeAid**).
- Verify the transition feels "smooth" (no harsh white flicker).
- Check that navigation works across both `Product/` and `Furniture/` subdirectories correctly.
