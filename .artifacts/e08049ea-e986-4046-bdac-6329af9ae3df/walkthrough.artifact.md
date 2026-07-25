# Walkthrough - Swipe Navigation & Smooth Page Transitions

I have implemented a mobile-first swipe navigation system and high-end page transitions to allow users to move seamlessly between your projects.

## Changes Made

### 1. Page Transitions (style.css)
- **Entrance Animation**: Every project page now fades in gracefully over 0.8s when loaded.
- **Exit Animation**: When navigating between projects (via swipe or links), the page will fade out over 0.6s before the next one loads, preventing a harsh white flash.

### 2. Swipe Navigation (script.js)
- **Intuitive Gestures**:
    - **Swipe Left**: Move to the next project in the sequence.
    - **Swipe Right**: Move to the previous project.
- **Project Sequence**: I've mapped the order of your projects (Dune -> LifeAid -> Revvo -> Boghylde -> Cove -> Panel -> Deskscape -> Weeding Fork -> Jet -> Verge -> Swirl).
- **Cross-Directory Support**: The navigation logic handles moving between the `Product/` and `Furniture/` folders automatically.
- **Scroll Buffer**: Swipes require a 100px movement, preventing accidental triggers during vertical scrolling.

### 3. Optimization
- **Active State Locking**: Interaction is disabled during the exit animation to ensure a smooth hand-off to the next page.
- **Path Normalization**: The script correctly identifies the current project regardless of how the file was opened (local vs server).

## Verification Results
- **Smoothness**: The 0.6s/0.8s timing creates a cinematic transition effect.
- **Accuracy**: Tested navigation from **Revvo** (Product) to **Boghylde** (Furniture) to ensure folder jumps work correctly.
- **Mobile Fidelity**: Gestures are highly responsive on touch screens.

> [!TIP]
> This navigation style makes your portfolio feel more like a native app. You can now "swipe through" your work without going back to the home page every time.
