# OZONE Manager's Dashboard

A customizable business intelligence dashboard with Apple-style grid layout for CEO/management level oversight.

## Features

### ✅ Completed

1. **Apple-Style Grid System** - Advanced widget layout management:
   - 150px × 150px grid cells with 12px gaps
   - iOS-style push behavior (widgets move others out of the way)
   - Drag-and-drop widget repositioning
   - Resize handles with min/max size constraints
   - Collision detection and automatic layout compaction
   - Real-time position calculations based on viewport width
   - LocalStorage persistence for layouts

2. **Lucide Icons Integration** - Professional SVG icons throughout:
   - IconHelper utility with 72+ icon mappings
   - Consistent icon rendering across all widgets
   - Status icons (completed, in-progress, blocked, pending)
   - Trend indicators (up/down with color coding)
   - Dynamic icon initialization after DOM updates

3. **Dark/Light Theme Toggle** - Working theme switcher in topbar with localStorage persistence

4. **Modular Architecture** - Clean separation of concerns:
   - `js/Dashboard.js` - Main controller
   - `js/WidgetManager.js` - Widget lifecycle and rendering
   - `js/ModalManager.js` - Modal dialogs (tasks, customization)
   - `js/DrillDownManager.js` - Detailed views and analytics
   - `js/GridLayoutManager.js` - Apple-style grid layout system
   - `js/IconHelper.js` - Icon rendering utility

5. **Widget System** (19 widgets across 6 categories):
   - **Executive**: Today's Focus, Executive Summary
   - **Financial**: Cash Flow, Revenue vs Target, Profit by Product, AR, Live Prices
   - **Operations**: Order Pipeline, Delivery Trends, Bottleneck Heatmap, Team Capacity
   - **Customer/Sales**: Customer Health, Sales Pipeline, Top Customers
   - **Team**: Team Scorecard, Overdue Tasks, Task Manager
   - **Strategic**: Strategic Goals, Project Manager

6. **Default Dashboard Layout** - Presentation-optimized with 15+ visual widgets:
   - Executive overview (Executive Summary, Today's Focus)
   - Financial charts (Cash Flow, Revenue Target, Profit by Product, Live Prices)
   - Operations visualizations (Order Pipeline, Delivery Trends, Team Capacity)
   - Sales analytics (Sales Pipeline, Customer Health, Top Customers)
   - Strategic tracking (Goals, Projects, Team Scorecard)

7. **Widget Customization** - Gear icon on selected widgets:
   - Team Capacity: Toggle percentage display, highlight over-capacity
   - Delivery Trends: Show/hide target line, adjust timeframe
   - Strategic Goals: Toggle progress display, change sort order
   - Task Manager: View mode, default sorting

8. **Drill-Down Details** - Click any widget body to see detailed analytics:
   - Cash Flow → Weekly breakdown, upcoming expenses
   - Revenue Target → Product line breakdown, pace analysis
   - Accounts Receivable → Overdue invoices, collection actions
   - Order Pipeline → Orders by status with details
   - Executive Summary → Detailed metrics and recommendations
   - And more...

9. **Task Manager Widget** - Fully functional task management:
   - Filter by All/Today/This Week
   - Add, complete, and track tasks
   - Priority levels (Urgent/High/Medium/Low)
   - Due date tracking with overdue indicators

10. **Project Manager Widget** - Active project tracking:
   - Visual progress bars
   - Status badges (On Track, At Risk, Behind Schedule)
   - Checkpoint tracking (completed, in-progress, blocked, pending)
   - Expandable project details via drill-down

11. **Chart Rendering** - All Chart.js visualizations load correctly with proper timing

12. **Live Data Updates** - Real-time price data via external APIs:
   - Gold (XAUUSD) prices from GoldAPI.io
   - USD/IRR exchange rates from ExchangeRate-API
   - Updates every 30 seconds
   - Automatic fallback to simulated data if APIs fail
   - Display of price changes and percentages

13. **Full-Width Dashboard** - Maximized screen space for widgets with overlay panels

14. **iOS-Style Widget Arrangement** - Automatic layout compaction:
   - Widgets automatically rearrange when moved or resized
   - No overlaps possible - layout always valid
   - Smooth animations with 0.3s transitions
   - Upward compaction fills gaps automatically

## How to Use

### Running the Dashboard

```bash
cd managers-dashboard
python -m http.server 8080
```

Then open `http://localhost:8080/manager-dashboard.html`

### Working with Widgets

#### Adding Widgets
1. Currently: Widgets auto-load on page load (default CEO dashboard)
2. Future: Drag from sidebar (temporarily hidden)

#### Moving Widgets
1. Click and hold on widget header
2. Drag to desired position
3. Widget snaps to grid cells
4. Other widgets push out of the way automatically (iOS-style)

#### Resizing Widgets
1. Click on a widget to select it
2. Blue dots appear on corners and edges
3. Drag any handle to resize
4. Widget respects min/max size constraints
5. Adjacent widgets push away during resize

#### Removing Widgets
1. Click the X button in widget header
2. Widget fades out and is removed
3. Layout automatically compacts to fill gaps

### Customizing Widgets

1. Look for the gear icon in the widget header (select widgets only)
2. Click to open customization modal
3. Adjust settings and click "Save Changes"

### Viewing Details

1. Click on any widget body (highlighted on hover)
2. Drill-down panel slides in from the right
3. View detailed analytics, breakdowns, and recommendations

### Managing Tasks

1. Task Manager widget shows in default layout
2. Click "+ Add Task" button
3. Fill in title, description, assignee, priority, due date
4. Click tasks to mark complete/incomplete
5. Filter by time period

### Theme Toggle

Click the toggle switch in the topbar to switch between dark/light themes.

## Technical Details

### File Structure

```
managers-dashboard/
├── manager-dashboard.html     # Main HTML file
├── manager-dashboard.css      # Dashboard-specific styles (1975 lines)
├── styles.css                 # Shared Ozone design system
├── js/
│   ├── Dashboard.js           # Main controller (230 lines)
│   ├── WidgetManager.js       # Widget system (850+ lines)
│   ├── ModalManager.js        # Modal dialogs
│   ├── DrillDownManager.js    # Detailed views
│   ├── GridLayoutManager.js   # Apple-style grid (850+ lines)
│   └── IconHelper.js          # Icon utility (132 lines)
└── README.md                  # This file
```

### Grid System Architecture

**GridLayoutManager.js** implements a comprehensive grid layout system:

```javascript
{
  cellSize: 150,      // 150px × 150px cells
  gap: 12,            // 12px gap between cells
  minCols: 4,         // Minimum columns
  maxCols: 12         // Maximum columns
}
```

**Widget Metadata** - Each widget type has defined constraints:
```javascript
'todays-focus': {
  minW: 2, minH: 2,    // Minimum 2×2 cells
  maxW: 4, maxH: 3,    // Maximum 4×3 cells
  defaultW: 2, defaultH: 2,
  resizable: true
}
```

**Core Features:**
- **Collision Detection**: Rectangle intersection algorithm prevents overlaps
- **Push Behavior**: Queue-based algorithm calculates optimal push direction
- **Compaction**: Multi-pass upward compaction fills gaps
- **Persistence**: JSON serialization to localStorage
- **Responsive**: Auto-recalculates columns based on viewport width

### Dependencies

- **Chart.js** 4.4.0 - Data visualization
- **SortableJS** 1.15.0 - Drag & drop
- **Lucide Icons** (latest) - SVG icon library
- **Montserrat Font** - Typography

### External APIs (Free Tier)

- **GoldAPI.io** - Real-time gold spot prices (XAUUSD)
  - Endpoint: `https://www.goldapi.io/api/XAU/USD`
  - Free tier available (limited requests)
  - No API key required for basic access

- **ExchangeRate-API** - Live currency exchange rates
  - Endpoint: `https://api.exchangerate-api.com/v4/latest/USD`
  - Free tier with 1,500 requests/month
  - No API key required
  - Supports 160+ currencies including IRR

### Browser Compatibility

- Modern browsers with ES6 module support
- Tested on Chrome, Firefox, Edge
- Requires JavaScript enabled
- Minimum recommended resolution: 1366×768

## Grid System API

### GridLayoutManager Methods

```javascript
// Add widget to grid
addWidget(widgetId, widgetType, position = null)

// Remove widget and compact
removeWidget(widgetId)

// Check if position is available
isPositionAvailable(x, y, width, height, excludeId = null)

// Find next available position
findNextAvailablePosition(width, height)

// Push widgets with iOS-style behavior
pushWidgets(movingItem, targetX, targetY)

// Compact layout (fill gaps)
compactLayout()

// Position widget element in DOM
positionWidget(widgetEl, layoutItem)

// Save/load layout to/from localStorage
saveLayout()
loadLayout()

// Reset layout to default
resetLayout()
```

### Widget Metadata Format

```javascript
{
  minW: 2,           // Minimum width in grid cells
  minH: 2,           // Minimum height in grid cells
  maxW: 4,           // Maximum width in grid cells
  maxH: 3,           // Maximum height in grid cells
  defaultW: 2,       // Default width
  defaultH: 2,       // Default height
  resizable: true    // Can be resized by user
}
```

## Customization

### Adding New Widgets

1. Add widget metadata to `GridLayoutManager.widgetMetadata`:
```javascript
'my-widget': {
  minW: 2, minH: 2, maxW: 4, maxH: 4,
  defaultW: 2, defaultH: 2,
  resizable: true
}
```

2. Add widget config to `WidgetManager.getWidgetConfig()`:
```javascript
'my-widget': {
  title: 'My Widget',
  icon: 'bar-chart',
  hasChart: true,
  drillDown: true
}
```

3. Create renderer method in `WidgetManager`:
```javascript
renderMyWidget(data, widgetId) {
  return `<div>Widget content</div>`;
}
```

4. Add data generator in `WidgetManager.getWidgetData()`

5. Add chart config if needed in `getChartConfig()`

6. Add to HTML sidebar in `manager-dashboard.html` (currently hidden)

### Adding Drill-Down Views

1. Add view function in `DrillDownManager.getDetailedView()`
2. Ensure widget body has `clickable` class and `onclick` attribute

### Adding Customization Options

1. Add widget type to `ModalManager.getCustomizationForm()`
2. Handle config extraction in `ModalManager.saveCustomization()`
3. Add widget to `WidgetManager.hasCustomization()` array

### Adding Icons

1. Find Lucide icon name at https://lucide.dev
2. Add to `IconHelper.iconMap` if mapping from emoji:
```javascript
'💰': 'dollar-sign'
```
3. Use in code:
```javascript
IconHelper.icon('dollar-sign', 'custom-class', 16)
IconHelper.widgetIcon('bar-chart')
IconHelper.statusIcon('completed')
IconHelper.trendIcon(true) // true = up, false = down
```

## Current Status

### Completed (Phase 3)
- ✅ Apple-style grid layout system
- ✅ Drag-and-drop repositioning
- ✅ Resize handles with constraints
- ✅ iOS-style push behavior
- ✅ Collision detection
- ✅ Layout compaction
- ✅ Lucide Icons integration
- ✅ Full-width dashboard layout

### Temporarily Disabled
- ⏸️ Left sidebar (widget library)
- ⏸️ Right sidebar (alerts panel)
- ⏸️ Panel toggle buttons

These will be redesigned and re-enabled in a future update.

## Future Enhancements

- [ ] Restore sidebars with new design (slide-out drawers)
- [ ] Persistent layouts with stable widget IDs
- [ ] Backend API integration for real data
- [ ] Widget drag from sidebar to grid
- [ ] Multi-select widgets for bulk operations
- [ ] Keyboard shortcuts for grid navigation
- [ ] Grid overlay toggle (show/hide grid lines)
- [ ] Widget templates and presets
- [ ] Export dashboard layouts
- [ ] Import/share layouts between users
- [ ] Undo/redo for layout changes
- [ ] Widget animation improvements
- [ ] Mobile responsive grid (vertical stack)
- [ ] Export reports to PDF
- [ ] User authentication
- [ ] Real-time WebSocket data updates
- [ ] Widget sharing/templates

## Notes for Presentation

This is a **mockup dashboard** designed for presentation purposes. All data is simulated and hard-coded. To make it production-ready:

1. Replace `getWidgetData()` methods with API calls
2. Implement stable widget IDs for layout persistence
3. Add proper state management (Redux/Zustand)
4. Add data persistence layer
5. Connect to real business systems
6. Add error handling and loading states
7. Implement user authentication and permissions

## Troubleshooting

### Charts not loading
- Ensure Chart.js is loaded (check browser console)
- Verify canvas elements exist in DOM before initialization
- Delays are built in (200ms) to ensure DOM ready

### Theme not switching
- Check browser console for errors
- Verify `data-theme` attribute on `<html>` element
- Clear localStorage if needed: `localStorage.removeItem('theme')`

### Widgets overlapping
- Check browser console for grid calculation messages
- Verify container has width: `dashboard-grid.offsetWidth > 0`
- Clear localStorage: `localStorage.removeItem('dashboard-layout')`
- Refresh page to recalculate layout

### Grid not responsive
- Window resize triggers `handleWindowResize()`
- Check for console warnings about column calculations
- Ensure dashboard container has proper flex layout

### Debug Mode

Open browser console to see:
- Grid dimension calculations
- Widget position assignments
- Collision detection results
- Layout save/load operations

Example console output:
```
Grid calculated: 10 columns, container width: 1650px
Found available position (0, 0) for 2x2 widget. Current layout has 0 widgets
Added widget widget-123 to layout at (0, 0) size 2x2. Total widgets: 1
Positioned widget widget-123 at (0, 0)
```

## Performance Notes

- Grid calculations are O(n²) in worst case (collision detection)
- Push behavior uses queue-based algorithm (optimized)
- Layout persistence uses JSON serialization (fast)
- Widget positioning uses CSS transforms (GPU accelerated)
- Resize handles only render when widget is selected

## License

Part of the OZONE Cabinet BIM project.
