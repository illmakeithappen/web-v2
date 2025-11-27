# Archived Pages

This directory contains React page components that were removed from active use in the gitthub.org application.

## Archived Date
October 7, 2025

## Reason for Archival
These components had no active routes defined in `App.jsx` and were not being imported or used anywhere in the application. They were archived to reduce codebase clutter and maintenance burden.

## Archived Components

### 1. CourseLibrary.jsx
- **Original Purpose:** Course library browsing interface
- **Status:** No route defined, never imported
- **Can be restored by:** Creating a route in `App.jsx` and adding navigation link

### 2. DesignPlayground.jsx
- **Original Purpose:** Design/prototyping playground with navigation tabs
- **Status:** No route defined, never imported
- **Note:** Contains interesting tab switching and navigation patterns that may be useful for reference

## How to Restore
If you need to restore any of these components:

1. Move the component file back to `frontend/src/pages/`
2. Add a route in `frontend/src/App.jsx`:
   ```jsx
   <Route path="/your-path" element={<YourComponent />} />
   ```
3. Import the component at the top of `App.jsx`
4. Optionally add a navigation link in `frontend/src/components/Header.jsx`

## Related Documentation
See `CLAUDE.md` section "Critical Issues & Technical Debt" for the full codebase audit that led to this archival.
