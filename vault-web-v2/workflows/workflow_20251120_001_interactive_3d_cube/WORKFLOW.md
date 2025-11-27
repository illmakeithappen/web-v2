---
description: Recreate the animated 3D cube from BrowserBase's landing page
author: Claude
category: workflow
type: deploy
difficulty: advanced
references:
  - BrowserBase website screenshot showing colored cube animation
  - BrowserBase website screenshot showing hollow cube "Stealth" concept
context: |
  Building an interactive 3D cube as a React component portfolio piece. The cube consists of 8 subcubes
  representing different concepts, with unique animations for each when selected. Uses pure CSS 3D transforms
  for performance and broad browser compatibility.
title: Deploy Interactive 3D Concept Cube React Component
agent: claude code
model: claude-sonnet-4-5
created_date: 2025-11-20
last_modified: 2025-11-20
workflow_id: 20251120_143022_claude_workflow
status: not started yet
tools:
  - claude code (for generating React components and CSS)
  - react dev tools (for debugging component state)
  - chrome devtools (for animation performance profiling)
skills:
  - css-3d-cube-generator (for creating optimized 3D transform structures)
  - react-animation-orchestrator (for managing complex state-driven animations)
  - isometric-grid-builder (for generating perfect isometric backgrounds)
steps:
  - Initialize React Component Structure
  - Build Base Cube Architecture
  - Style Individual Subcubes
  - Create Isometric Grid Background
  - Implement Shadow System
  - Build Rotation Animation System
  - Add Interactive Concept Selector
  - Create Concept-Specific Visualizations
  - Optimize Performance
  - Add Responsive Behavior
  - Create Demo Page
estimated_time: 4-5 hours
total_steps: 11
---

# Interactive 3D Cube React Component

## Workflow Steps

### Step 1: Initialize React Component Structure

**Instruction:**
```text
Use Claude Code to generate a React component structure with: ConceptCube.jsx main component,
ConceptCube.css for styles, types.ts for TypeScript interfaces defining 8 concepts and cube
states. Request Claude include props for activeConcept, selectedConcept callback, animationSpeed,
and colorScheme options. Include hooks for managing 3D rotation state and animation timings.
```

**Deliverable:** _React component files with TypeScript types and organized folder structure ready_

**Uses:**
- Tools: Claude Code
- References: BrowserBase screenshots for concept structure

---

### Step 2: Build Base Cube Architecture

**Instruction:**
```text
Have Claude Code create the HTML structure for 8 subcubes within a container div using
transform-style: preserve-3d. Request proper nesting: scene > cube-container > 8 subcube
divs, each with 6 faces. Position subcubes in 2x2x2 grid formation using translateX/Y/Z.
Ensure each subcube has unique data-concept attribute for targeting animations.
```

**Deliverable:** _Complete 3D cube structure with 8 properly positioned subcubes in DOM_

**Uses:**
- Tools: Claude Code
- Skills: css-3d-cube-generator (if available)

---

### Step 3: Style Individual Subcubes

**Instruction:**
```text
Use Claude Code to style each subcube face with gradients matching BrowserBase aesthetic:
vibrant colors (green #8BC34A, blue #2196F3, yellow #FFC107, orange #FF9800, purple #9C27B0).
Request semi-transparent faces with backdrop-filter for depth. Apply proper backface-visibility
and transform origins. Reference the colored cube screenshot for exact color placement.
```

**Deliverable:** _Styled subcubes with proper colors, gradients, and 3D face positioning_

**Uses:**
- Tools: Claude Code
- References: BrowserBase colored cube screenshot

---

### Step 4: Create Isometric Grid Background

**Instruction:**
```text
Have Claude Code generate CSS for isometric grid using repeating linear gradients at 150deg
and 30deg angles. Request grid lines at 40px intervals with subtle gray (#e0e0e0) on white
background. Add perspective-origin adjustment to align grid with cube base. Include subtle
gradient fade at edges for depth effect using radial-gradient overlay.
```

**Deliverable:** _Isometric grid background perfectly aligned with cube perspective and shadow_

**Uses:**
- Tools: Claude Code
- Skills: isometric-grid-builder (if available)

---

### Step 5: Implement Shadow System

**Instruction:**
```text
Use Claude Code to create performant shadows using ::before pseudo-elements on a shadow
container div. Request transform: translateZ(-1px) scaleX(1.2) scaleY(0.8) for perspective-correct
shadow. Animate opacity not box-shadow for performance. Add blur filter and gradient opacity
for realistic ground shadow that responds to cube rotation angle.
```

**Deliverable:** _Dynamic shadow system that moves realistically with cube rotations_

**Uses:**
- Tools: Claude Code
- References: BrowserBase shadow effects

---

### Step 6: Build Rotation Animation System

**Instruction:**
```text
Have Claude Code create keyframe animations for continuous idle rotation using rotateX(25deg)
rotateY(45deg) base position. Request smooth transitions between rotation states using
cubic-bezier(0.4, 0.0, 0.2, 1) easing. Include rotation pause on hover and smooth resume.
Create rotation calculation function that finds shortest path between concept positions.
```

**Deliverable:** _Smooth continuous rotation with intelligent transitions between states_

**Uses:**
- Tools: Claude Code
- Skills: react-animation-orchestrator (if available)

---

### Step 7: Add Interactive Concept Selector

**Instruction:**
```text
Use Claude Code to implement concept selection logic with React state management. Request
click handlers that calculate target rotation angles for each concept, update activeConcept state,
and trigger transition animations. Include keyboard navigation (1-8 keys) for accessibility.
Add visual feedback with subcube highlighting during selection transition.
```

**Deliverable:** _Working concept selection with smooth transitions and accessibility support_

**Uses:**
- Tools: Claude Code, React Dev Tools

---

### Step 8: Create Concept-Specific Visualizations

**Instruction:**
```text
Have Claude Code build 8 unique concept animations: Stealth (hollow center via opacity:0),
Speed (rapid spin), Scale (size pulse), Security (lock formation), Performance (staggered wave),
Integration (orbit motion), Simplicity (minimal movement), Power (energy burst). Request each
animation use transform/opacity only. Reference "Stealth" screenshot for hollow cube effect.
```

*Note: This step would benefit from the css-3d-animation-patterns skill for reusable animations.*

**Deliverable:** _Eight distinct concept visualizations with smooth transitions and metaphorical animations_

**Uses:**
- Tools: Claude Code
- References: BrowserBase "Stealth" concept screenshot
- Skills: css-3d-animation-patterns (recommended)

---

### Step 9: Optimize Performance

**Instruction:**
```text
Use Claude Code to add will-change: transform to animated elements and contain: layout style
paint to cube container. Request GPU-accelerated properties only (transform, opacity). Remove
any properties causing 3D flattening (overflow, opacity on parent). Add requestAnimationFrame
throttling for interaction handlers. Test with Chrome DevTools Performance panel for 60fps.
```

**Deliverable:** _Optimized animations running at consistent 60fps with GPU acceleration_

**Uses:**
- Tools: Claude Code, Chrome DevTools

---

### Step 10: Add Responsive Behavior

**Instruction:**
```text
Have Claude Code implement CSS custom properties for cube scale based on viewport width.
Request touch event handlers for mobile swipe rotation using pointer events. Add reduced
motion media query support for accessibility. Include container queries for proper sizing
within different parent containers. Test on various viewport sizes.
```

**Deliverable:** _Fully responsive cube that scales and interacts properly on all devices_

**Uses:**
- Tools: Claude Code

---

### Step 11: Create Demo Page

**Instruction:**
```text
Use Claude Code to build showcase page with 8 concept cards matching BrowserBase design.
Request card grid layout with icon, title, and description for each concept. Include
click handlers connecting cards to cube animations. Add usage documentation as code
comments. Create README with props documentation and integration examples.
```

**Deliverable:** _Complete demo page with concept cards, working interactions, and documentation_

**Uses:**
- Tools: Claude Code
- References: BrowserBase feature card design

---

## Workflow Complete! 🎉

By completing this deploy workflow, you've accomplished:

- ✅ Fully functional React component with 8 interactive subcubes
- ✅ Smooth CSS 3D transforms with preserve-3d for nested cube structure
- ✅ Eight unique concept visualizations with metaphorical animations
- ✅ Performance-optimized animations running at 60fps with GPU acceleration
- ✅ Responsive design with touch support and accessibility features
- ✅ Isometric grid background with dynamic shadow system
- ✅ Complete demo page showcasing all concept interactions

**Your Interactive Component:** Ready to integrate into any React application as a stunning portfolio piece!

### Tips for Success

1. **Avoid 3D flattening properties:** Never use opacity < 1, overflow: hidden, or filter on parent containers
2. **Test in multiple browsers:** Safari handles preserve-3d differently than Chrome - test both
3. **Use transform-origin carefully:** Set it once on each subcube to avoid animation glitches
4. **Profile animations regularly:** Use Chrome DevTools Performance tab to catch frame drops early
5. **Keep shadows simple:** Animate opacity of shadow element, not the box-shadow property itself
6. **Batch DOM updates:** Use React.memo and useMemo to prevent unnecessary re-renders
7. **Consider prefers-reduced-motion:** Always provide fallback for users with motion sensitivity
8. **Document concept mappings:** Clearly label which subcube represents which concept for maintenance

### Next Steps After Workflow

1. **Add sound effects:** Consider subtle audio feedback for concept transitions
2. **Extend animation library:** Create more concept visualizations beyond the initial 8
3. **Build Storybook stories:** Document all component states and props in Storybook
4. **Create animation skills for reuse:**
   - **css-3d-cube-generator** (for quickly scaffolding 3D structures) - Say: "Help me create the css-3d-cube-generator skill"
   - **react-animation-orchestrator** (for managing complex state-driven animations) - Say: "Help me create the react-animation-orchestrator skill"
   - **isometric-grid-builder** (for generating perfect isometric backgrounds) - Say: "Help me create the isometric-grid-builder skill"
5. **Package as NPM module:** Publish your component for others to use in their projects