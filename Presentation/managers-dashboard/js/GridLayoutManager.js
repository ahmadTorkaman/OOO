// Apple-Style Grid Layout Manager
// Manages widget positioning, resizing, collision detection, and iOS-style push behavior

import { IconHelper } from './IconHelper.js';

export class GridLayoutManager {
    constructor(dashboard) {
        this.dashboard = dashboard;
        this.gridContainer = document.getElementById('dashboard-grid');

        // Grid configuration
        this.config = {
            cellSize: 150,      // 150px × 150px cells
            gap: 12,            // 12px gap between cells
            minCols: 4,         // Minimum columns
            maxCols: 12,        // Maximum columns
            rowHeight: 150      // Row height matches cell size
        };

        // Widget metadata - defines size constraints and resizable flags
        this.widgetMetadata = {
            'todays-focus': {
                minW: 2, minH: 2, maxW: 4, maxH: 3,
                defaultW: 2, defaultH: 2,
                resizable: true
            },
            'executive-summary': {
                minW: 2, minH: 2, maxW: 6, maxH: 4,
                defaultW: 3, defaultH: 2,
                resizable: true
            },
            'task-manager': {
                minW: 2, minH: 2, maxW: 4, maxH: 4,
                defaultW: 2, defaultH: 3,
                resizable: true
            },
            'project-manager': {
                minW: 2, minH: 2, maxW: 4, maxH: 4,
                defaultW: 2, defaultH: 3,
                resizable: true
            },
            'cash-flow': {
                minW: 2, minH: 2, maxW: 4, maxH: 3,
                defaultW: 2, defaultH: 2,
                resizable: true
            },
            'live-prices': {
                minW: 1, minH: 2, maxW: 2, maxH: 3,
                defaultW: 1, defaultH: 2,
                resizable: true
            },
            'order-pipeline': {
                minW: 2, minH: 2, maxW: 5, maxH: 4,
                defaultW: 3, defaultH: 2,
                resizable: true
            },
            'strategic-goals': {
                minW: 2, minH: 2, maxW: 4, maxH: 4,
                defaultW: 2, defaultH: 3,
                resizable: true
            },
            'revenue-target': {
                minW: 2, minH: 2, maxW: 4, maxH: 3,
                defaultW: 2, defaultH: 2,
                resizable: true
            },
            'profit-product': {
                minW: 2, minH: 2, maxW: 4, maxH: 3,
                defaultW: 2, defaultH: 2,
                resizable: true
            },
            'accounts-receivable': {
                minW: 2, minH: 2, maxW: 4, maxH: 3,
                defaultW: 2, defaultH: 2,
                resizable: true
            },
            'delivery-trends': {
                minW: 2, minH: 2, maxW: 4, maxH: 3,
                defaultW: 2, defaultH: 2,
                resizable: true
            },
            'bottleneck-map': {
                minW: 2, minH: 2, maxW: 4, maxH: 3,
                defaultW: 2, defaultH: 2,
                resizable: true
            },
            'team-capacity': {
                minW: 2, minH: 2, maxW: 3, maxH: 3,
                defaultW: 2, defaultH: 2,
                resizable: true
            },
            'customer-health': {
                minW: 2, minH: 2, maxW: 3, maxH: 3,
                defaultW: 2, defaultH: 2,
                resizable: true
            },
            'sales-pipeline': {
                minW: 2, minH: 2, maxW: 4, maxH: 3,
                defaultW: 2, defaultH: 2,
                resizable: true
            },
            'top-customers': {
                minW: 2, minH: 2, maxW: 3, maxH: 3,
                defaultW: 2, defaultH: 2,
                resizable: true
            },
            'team-scorecard': {
                minW: 2, minH: 2, maxW: 4, maxH: 3,
                defaultW: 2, defaultH: 2,
                resizable: true
            },
            'overdue-tasks': {
                minW: 1, minH: 2, maxW: 3, maxH: 4,
                defaultW: 2, defaultH: 2,
                resizable: true
            },
            'custom-chart': {
                minW: 2, minH: 2, maxW: 6, maxH: 4,
                defaultW: 3, defaultH: 3,
                resizable: true
            }
        };

        // Layout state
        this.layout = []; // Array of {id, type, x, y, w, h}
        this.selectedWidget = null;
        this.isDragging = false;
        this.isResizing = false;
        this.dragStartPos = null;
        this.resizeStartData = null;

        // Calculate grid dimensions
        this.calculateGridDimensions();

        // Initialize
        this.init();
    }

    init() {
        // Apply grid container styles
        this.applyGridStyles();

        // Wait for container to have dimensions
        setTimeout(() => {
            this.calculateGridDimensions();

            // Load saved layout or use default
            this.loadLayout();

            // Setup event listeners
            this.setupEventListeners();
        }, 100);

        // Setup window resize handler
        window.addEventListener('resize', () => this.handleWindowResize());
    }

    calculateGridDimensions() {
        // Use clientWidth instead of offsetWidth to exclude scrollbar
        const containerWidth = this.gridContainer.clientWidth;

        if (containerWidth === 0) {
            console.warn('Container width is 0, using default columns');
            this.cols = this.config.minCols;
            return;
        }

        // Account for container padding (gap on both sides)
        const availableWidth = containerWidth - (2 * this.config.gap);

        // Calculate how many columns fit
        // Formula: availableWidth = n*cellSize + (n-1)*gap
        // Solving for n: availableWidth = n*cellSize + n*gap - gap
        //                availableWidth + gap = n*(cellSize + gap)
        //                n = (availableWidth + gap) / (cellSize + gap)
        this.cols = Math.floor((availableWidth + this.config.gap) / (this.config.cellSize + this.config.gap));
        this.cols = Math.max(this.config.minCols, Math.min(this.config.maxCols, this.cols));

        console.log(`Grid calculated: ${this.cols} columns, container width: ${containerWidth}px, available: ${availableWidth}px`);
    }

    applyGridStyles() {
        // Remove CSS Grid, use absolute positioning
        this.gridContainer.style.position = 'relative';
        this.gridContainer.style.minHeight = '100vh';
        this.gridContainer.style.padding = `${this.config.gap}px`;
    }

    // ===== LAYOUT MANAGEMENT =====

    addWidget(widgetId, widgetType, position = null) {
        const metadata = this.widgetMetadata[widgetType];
        if (!metadata) {
            console.warn(`No metadata found for widget type: ${widgetType}`);
            return null;
        }

        // Ensure grid dimensions are calculated
        if (!this.cols || this.cols === 0) {
            console.warn('Grid dimensions not calculated yet, calculating now...');
            this.calculateGridDimensions();
            if (!this.cols || this.cols === 0) {
                console.error('Failed to calculate grid dimensions');
                return null;
            }
        }

        // Check if widget already exists in layout (from loaded layout)
        let existingItem = this.layout.find(item => item.id === widgetId);
        if (existingItem) {
            console.log(`Widget ${widgetId} already in layout from saved state`);
            return existingItem;
        }

        let finalPosition;
        if (position) {
            finalPosition = position;
        } else {
            // Find next available position
            finalPosition = this.findNextAvailablePosition(metadata.defaultW, metadata.defaultH);
            if (!finalPosition) {
                console.warn('No available position found for widget');
                return null;
            }
        }

        const layoutItem = {
            id: widgetId,
            type: widgetType,
            x: finalPosition.x,
            y: finalPosition.y,
            w: metadata.defaultW,
            h: metadata.defaultH
        };

        this.layout.push(layoutItem);
        console.log(`Added widget ${widgetId} to layout at (${finalPosition.x}, ${finalPosition.y}) size ${metadata.defaultW}x${metadata.defaultH}. Total widgets: ${this.layout.length}`);
        this.saveLayout();

        return layoutItem;
    }

    removeWidget(widgetId) {
        const index = this.layout.findIndex(item => item.id === widgetId);
        if (index !== -1) {
            this.layout.splice(index, 1);

            // iOS-style: compact upward after removal
            this.compactLayoutUpward();
            this.saveLayout();
        }
    }

    findNextAvailablePosition(width, height) {
        // Try to find the first available position (top-left priority)
        for (let y = 0; y < 100; y++) { // Arbitrary max rows
            for (let x = 0; x <= this.cols - width; x++) {
                if (this.isPositionAvailable(x, y, width, height)) {
                    console.log(`Found available position (${x}, ${y}) for ${width}x${height} widget. Current layout has ${this.layout.length} widgets`);
                    return { x, y };
                }
            }
        }
        console.warn(`No available position found for ${width}x${height} widget`);
        return null;
    }

    isPositionAvailable(x, y, width, height, excludeId = null) {
        // Check bounds
        if (x < 0 || x + width > this.cols || y < 0) {
            return false;
        }

        // Check collisions with other widgets
        for (const item of this.layout) {
            if (excludeId && item.id === excludeId) continue;

            if (this.checkCollision(
                x, y, width, height,
                item.x, item.y, item.w, item.h
            )) {
                return false;
            }
        }

        return true;
    }

    checkCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
        return !(
            x1 + w1 <= x2 ||
            x2 + w2 <= x1 ||
            y1 + h1 <= y2 ||
            y2 + h2 <= y1
        );
    }

    // ===== iOS-STYLE AUTOMATIC ARRANGEMENT =====

    /**
     * iOS-style widget placement algorithm
     * Simply places widget and moves any overlapping widgets down
     */
    placeWidgetWithAutoArrange(widgetId, targetX, targetY) {
        const widget = this.layout.find(item => item.id === widgetId);
        if (!widget) return false;

        // Set widget to target position
        widget.x = targetX;
        widget.y = targetY;

        // Move any overlapping widgets out of the way
        this.moveOverlappingWidgets(widget);

        // Compact everything upward (iOS behavior)
        this.compactLayoutUpward();

        return true;
    }

    /**
     * Moves widgets that overlap with the given widget
     * Finds next available position for each overlapping widget
     */
    moveOverlappingWidgets(movedWidget) {
        let hasChanges = true;
        let iterations = 0;
        const maxIterations = 20;

        while (hasChanges && iterations < maxIterations) {
            hasChanges = false;
            iterations++;

            for (const widget of this.layout) {
                if (widget.id === movedWidget.id) continue;

                // Check if this widget overlaps with the moved widget
                if (this.checkCollision(
                    widget.x, widget.y, widget.w, widget.h,
                    movedWidget.x, movedWidget.y, movedWidget.w, movedWidget.h
                )) {
                    // Move this widget down below the moved widget
                    widget.y = movedWidget.y + movedWidget.h;
                    hasChanges = true;

                    console.log(`Moved ${widget.id} down to avoid overlap with ${movedWidget.id}`);
                }
            }

            // Check for cascading overlaps
            for (let i = 0; i < this.layout.length; i++) {
                for (let j = i + 1; j < this.layout.length; j++) {
                    const w1 = this.layout[i];
                    const w2 = this.layout[j];

                    if (this.checkCollision(w1.x, w1.y, w1.w, w1.h, w2.x, w2.y, w2.w, w2.h)) {
                        // Move the lower one down
                        if (w2.y >= w1.y) {
                            w2.y = w1.y + w1.h;
                        } else {
                            w1.y = w2.y + w2.h;
                        }
                        hasChanges = true;
                    }
                }
            }
        }
    }

    /**
     * Compact layout upward - exactly like iOS
     * Each widget tries to move up as far as possible without overlapping
     */
    compactLayoutUpward() {
        let moved = true;
        let iterations = 0;
        const maxIterations = 30;

        while (moved && iterations < maxIterations) {
            moved = false;
            iterations++;

            // Sort widgets by Y position (top to bottom), then X (left to right)
            const sortedWidgets = [...this.layout].sort((a, b) => {
                if (a.y !== b.y) return a.y - b.y;
                return a.x - b.x;
            });

            for (const widget of sortedWidgets) {
                // Try to move widget up one cell at a time
                while (widget.y > 0) {
                    if (this.canPlaceAt(widget.x, widget.y - 1, widget.w, widget.h, widget.id)) {
                        widget.y--;
                        moved = true;
                    } else {
                        break;
                    }
                }
            }
        }

        console.log(`Layout compacted in ${iterations} iterations`);
    }

    /**
     * Check if a widget can be placed at a specific position
     */
    canPlaceAt(x, y, w, h, excludeId = null) {
        // Check bounds
        if (x < 0 || x + w > this.cols || y < 0) {
            return false;
        }

        // Check collisions with other widgets
        for (const widget of this.layout) {
            if (excludeId && widget.id === excludeId) continue;

            if (this.checkCollision(x, y, w, h, widget.x, widget.y, widget.w, widget.h)) {
                return false;
            }
        }

        return true;
    }

    // ===== DRAG AND DROP =====

    setupEventListeners() {
        this.gridContainer.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseup', (e) => this.handleMouseUp(e));

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.deselectWidget();
            }
        });
    }

    handleMouseDown(e) {
        // Ignore clicks on widget control buttons
        if (e.target.closest('.widget-btn')) {
            return;
        }

        // Check if clicking on widget
        const widgetEl = e.target.closest('.widget');
        if (!widgetEl) {
            this.deselectWidget();
            return;
        }

        const widgetId = widgetEl.id;
        const layoutItem = this.layout.find(item => item.id === widgetId);
        if (!layoutItem) return;

        // Check if clicking on resize handle
        if (e.target.closest('.resize-handle')) {
            this.startResize(widgetEl, layoutItem, e);
            return;
        }

        // Check if clicking on widget header (for dragging)
        if (e.target.closest('.widget-header')) {
            this.startDrag(widgetEl, layoutItem, e);
            return;
        }

        // Just select the widget
        this.selectWidget(widgetEl, layoutItem);
    }

    handleMouseMove(e) {
        if (this.isDragging) {
            this.updateDrag(e);
        } else if (this.isResizing) {
            this.updateResize(e);
        }
    }

    handleMouseUp(e) {
        if (this.isDragging) {
            this.endDrag(e);
        } else if (this.isResizing) {
            this.endResize(e);
        }
    }

    startDrag(widgetEl, layoutItem, e) {
        e.preventDefault();

        this.isDragging = true;
        this.selectedWidget = { element: widgetEl, layout: layoutItem };

        const rect = widgetEl.getBoundingClientRect();
        const containerRect = this.gridContainer.getBoundingClientRect();

        this.dragStartPos = {
            mouseX: e.clientX,
            mouseY: e.clientY,
            widgetX: layoutItem.x,
            widgetY: layoutItem.y,
            offsetX: e.clientX - rect.left,
            offsetY: e.clientY - rect.top
        };

        widgetEl.classList.add('dragging');
        widgetEl.style.zIndex = '1000';
        widgetEl.style.pointerEvents = 'none';

        // Create ghost preview
        this.createDragGhost(layoutItem);
    }

    updateDrag(e) {
        if (!this.selectedWidget) return;

        const { element, layout } = this.selectedWidget;
        const containerRect = this.gridContainer.getBoundingClientRect();

        // Calculate mouse position relative to container
        const mouseX = e.clientX - containerRect.left - this.dragStartPos.offsetX;
        const mouseY = e.clientY - containerRect.top - this.dragStartPos.offsetY;

        // Position element at mouse (with offset)
        element.style.left = `${mouseX}px`;
        element.style.top = `${mouseY}px`;
        element.style.transform = 'none';

        // Calculate grid position (account for container padding)
        // Formula: gridPos = round((mousePos - gap) / (cellSize + gap))
        const gridX = Math.round((mouseX - this.config.gap) / (this.config.cellSize + this.config.gap));
        const gridY = Math.round((mouseY - this.config.gap) / (this.config.cellSize + this.config.gap));

        // Clamp to grid bounds
        const clampedX = Math.max(0, Math.min(this.cols - layout.w, gridX));
        const clampedY = Math.max(0, gridY);

        // Update ghost position
        this.updateDragGhost(clampedX, clampedY);
    }

    endDrag(e) {
        if (!this.selectedWidget) return;

        const { element, layout } = this.selectedWidget;
        const containerRect = this.gridContainer.getBoundingClientRect();

        // Calculate final grid position (account for container padding)
        const mouseX = e.clientX - containerRect.left - this.dragStartPos.offsetX;
        const mouseY = e.clientY - containerRect.top - this.dragStartPos.offsetY;

        const gridX = Math.round((mouseX - this.config.gap) / (this.config.cellSize + this.config.gap));
        const gridY = Math.round((mouseY - this.config.gap) / (this.config.cellSize + this.config.gap));

        const clampedX = Math.max(0, Math.min(this.cols - layout.w, gridX));
        const clampedY = Math.max(0, gridY);

        // iOS-style placement: place widget and auto-arrange others
        this.placeWidgetWithAutoArrange(layout.id, clampedX, clampedY);

        // Save layout
        this.saveLayout();

        // Clean up
        element.classList.remove('dragging');
        element.style.zIndex = '';
        element.style.pointerEvents = '';
        this.removeDragGhost();

        // Re-render layout with animation
        this.renderLayout();

        this.isDragging = false;
        this.dragStartPos = null;
    }

    createDragGhost(layoutItem) {
        const ghost = document.createElement('div');
        ghost.id = 'drag-ghost';
        ghost.className = 'drag-ghost';
        ghost.style.position = 'absolute';
        ghost.style.border = '2px dashed rgba(0, 122, 255, 0.6)';
        ghost.style.backgroundColor = 'rgba(0, 122, 255, 0.1)';
        ghost.style.borderRadius = '12px';
        ghost.style.pointerEvents = 'none';
        ghost.style.zIndex = '999';
        ghost.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';

        this.gridContainer.appendChild(ghost);
        this.updateDragGhost(layoutItem.x, layoutItem.y);
    }

    updateDragGhost(x, y) {
        const ghost = document.getElementById('drag-ghost');
        if (!ghost || !this.selectedWidget) return;

        const { w, h } = this.selectedWidget.layout;
        const left = this.config.gap + (x * (this.config.cellSize + this.config.gap));
        const top = this.config.gap + (y * (this.config.cellSize + this.config.gap));
        const width = w * (this.config.cellSize + this.config.gap) - this.config.gap;
        const height = h * (this.config.rowHeight + this.config.gap) - this.config.gap;

        ghost.style.left = `${left}px`;
        ghost.style.top = `${top}px`;
        ghost.style.width = `${width}px`;
        ghost.style.height = `${height}px`;
    }

    removeDragGhost() {
        const ghost = document.getElementById('drag-ghost');
        if (ghost) ghost.remove();
    }

    // ===== RESIZE =====

    startResize(widgetEl, layoutItem, e) {
        e.preventDefault();
        e.stopPropagation();

        this.isResizing = true;
        this.selectedWidget = { element: widgetEl, layout: layoutItem };

        const handle = e.target.closest('.resize-handle');
        const direction = handle.dataset.direction;

        this.resizeStartData = {
            mouseX: e.clientX,
            mouseY: e.clientY,
            startX: layoutItem.x,
            startY: layoutItem.y,
            startW: layoutItem.w,
            startH: layoutItem.h,
            direction
        };

        widgetEl.classList.add('resizing');
        this.createResizeGhost(layoutItem);
    }

    updateResize(e) {
        if (!this.selectedWidget || !this.resizeStartData) return;

        const { layout } = this.selectedWidget;
        const { mouseX, mouseY, startX, startY, startW, startH, direction } = this.resizeStartData;

        const deltaX = e.clientX - mouseX;
        const deltaY = e.clientY - mouseY;

        // Convert pixel delta to grid cells
        const cellsX = Math.round(deltaX / (this.config.cellSize + this.config.gap));
        const cellsY = Math.round(deltaY / (this.config.cellSize + this.config.gap));

        const metadata = this.widgetMetadata[layout.type];
        let newX = startX;
        let newY = startY;
        let newW = startW;
        let newH = startH;

        // Calculate new dimensions based on direction
        if (direction.includes('e')) {
            newW = Math.max(metadata.minW, Math.min(metadata.maxW, startW + cellsX));
        }
        if (direction.includes('s')) {
            newH = Math.max(metadata.minH, Math.min(metadata.maxH, startH + cellsY));
        }
        if (direction.includes('w')) {
            const potentialW = startW - cellsX;
            if (potentialW >= metadata.minW && potentialW <= metadata.maxW) {
                newW = potentialW;
                newX = startX + cellsX;
            }
        }
        if (direction.includes('n')) {
            const potentialH = startH - cellsY;
            if (potentialH >= metadata.minH && potentialH <= metadata.maxH) {
                newH = potentialH;
                newY = startY + cellsY;
            }
        }

        // Clamp to grid bounds
        if (newX + newW > this.cols) {
            newW = this.cols - newX;
        }
        if (newX < 0) {
            newW += newX;
            newX = 0;
        }

        this.updateResizeGhost(newX, newY, newW, newH);
    }

    endResize(e) {
        if (!this.selectedWidget || !this.resizeStartData) return;

        const { element, layout } = this.selectedWidget;
        const ghost = document.getElementById('resize-ghost');

        if (ghost) {
            // Get final dimensions from ghost
            const finalX = parseInt(ghost.dataset.x);
            const finalY = parseInt(ghost.dataset.y);
            const finalW = parseInt(ghost.dataset.w);
            const finalH = parseInt(ghost.dataset.h);

            // Apply new dimensions
            layout.w = finalW;
            layout.h = finalH;

            // iOS-style placement: place resized widget and auto-arrange others
            this.placeWidgetWithAutoArrange(layout.id, finalX, finalY);

            // Save layout
            this.saveLayout();
        }

        // Clean up
        element.classList.remove('resizing');
        this.removeResizeGhost();

        // Re-render layout with animation
        this.renderLayout();

        this.isResizing = false;
        this.resizeStartData = null;
    }

    createResizeGhost(layoutItem) {
        const ghost = document.createElement('div');
        ghost.id = 'resize-ghost';
        ghost.className = 'resize-ghost';
        ghost.style.position = 'absolute';
        ghost.style.border = '2px dashed rgba(0, 200, 100, 0.6)';
        ghost.style.backgroundColor = 'rgba(0, 200, 100, 0.1)';
        ghost.style.borderRadius = '12px';
        ghost.style.pointerEvents = 'none';
        ghost.style.zIndex = '999';
        ghost.style.transition = 'all 0.1s ease-out';

        this.gridContainer.appendChild(ghost);
        this.updateResizeGhost(layoutItem.x, layoutItem.y, layoutItem.w, layoutItem.h);
    }

    updateResizeGhost(x, y, w, h) {
        const ghost = document.getElementById('resize-ghost');
        if (!ghost) return;

        const left = this.config.gap + (x * (this.config.cellSize + this.config.gap));
        const top = this.config.gap + (y * (this.config.cellSize + this.config.gap));
        const width = w * (this.config.cellSize + this.config.gap) - this.config.gap;
        const height = h * (this.config.rowHeight + this.config.gap) - this.config.gap;

        ghost.style.left = `${left}px`;
        ghost.style.top = `${top}px`;
        ghost.style.width = `${width}px`;
        ghost.style.height = `${height}px`;

        ghost.dataset.x = x;
        ghost.dataset.y = y;
        ghost.dataset.w = w;
        ghost.dataset.h = h;
    }

    removeResizeGhost() {
        const ghost = document.getElementById('resize-ghost');
        if (ghost) ghost.remove();
    }

    // ===== WIDGET SELECTION =====

    selectWidget(widgetEl, layoutItem) {
        // Deselect previous
        this.deselectWidget();

        // Select new
        this.selectedWidget = { element: widgetEl, layout: layoutItem };
        widgetEl.classList.add('selected');

        // Add resize handles if resizable
        const metadata = this.widgetMetadata[layoutItem.type];
        if (metadata && metadata.resizable) {
            this.addResizeHandles(widgetEl);
        }
    }

    deselectWidget() {
        if (this.selectedWidget) {
            this.selectedWidget.element.classList.remove('selected');
            this.removeResizeHandles(this.selectedWidget.element);
            this.selectedWidget = null;
        }
    }

    addResizeHandles(widgetEl) {
        const directions = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];

        directions.forEach(dir => {
            const handle = document.createElement('div');
            handle.className = `resize-handle resize-${dir}`;
            handle.dataset.direction = dir;
            widgetEl.appendChild(handle);
        });
    }

    removeResizeHandles(widgetEl) {
        const handles = widgetEl.querySelectorAll('.resize-handle');
        handles.forEach(handle => handle.remove());
    }

    // ===== RENDERING =====

    renderLayout() {
        // Position all widgets according to layout
        this.layout.forEach(item => {
            const widgetEl = document.getElementById(item.id);
            if (!widgetEl) return;

            this.positionWidget(widgetEl, item);
        });
    }

    positionWidget(widgetEl, layoutItem) {
        // Calculate position: account for container padding, then cell positions
        // Formula: position = gap + (gridPos * (cellSize + gap))
        const left = this.config.gap + (layoutItem.x * (this.config.cellSize + this.config.gap));
        const top = this.config.gap + (layoutItem.y * (this.config.cellSize + this.config.gap));

        // Calculate size: total space occupied minus the trailing gap
        // Formula: size = (cells * cellSize) + ((cells - 1) * gap)
        //              = (cells * (cellSize + gap)) - gap
        const width = layoutItem.w * (this.config.cellSize + this.config.gap) - this.config.gap;
        const height = layoutItem.h * (this.config.rowHeight + this.config.gap) - this.config.gap;

        widgetEl.style.position = 'absolute';
        widgetEl.style.left = `${left}px`;
        widgetEl.style.top = `${top}px`;
        widgetEl.style.width = `${width}px`;
        widgetEl.style.height = `${height}px`;
        widgetEl.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

        console.log(`Widget positioned at grid (${layoutItem.x}, ${layoutItem.y}) = ${left}px, ${top}px, size: ${width}px × ${height}px`);
    }

    // ===== WINDOW RESIZE =====

    handleWindowResize() {
        const oldCols = this.cols;
        this.calculateGridDimensions();

        if (this.cols !== oldCols) {
            // Adjust layout to new column count
            this.adjustLayoutToColumns();
            this.renderLayout();
        }
    }

    adjustLayoutToColumns() {
        // Ensure all widgets fit within new column count
        this.layout.forEach(item => {
            if (item.x + item.w > this.cols) {
                item.x = Math.max(0, this.cols - item.w);
            }
        });

        this.compactLayout();
    }

    // ===== PERSISTENCE =====

    saveLayout() {
        try {
            localStorage.setItem('dashboard-layout', JSON.stringify(this.layout));
            console.log('Layout saved to localStorage');
        } catch (error) {
            console.error('Failed to save layout:', error);
        }
    }

    loadLayout() {
        try {
            const saved = localStorage.getItem('dashboard-layout');
            if (saved) {
                this.layout = JSON.parse(saved);
                console.log('Layout loaded from localStorage');
                return true;
            }
        } catch (error) {
            console.error('Failed to load layout:', error);
        }
        return false;
    }

    resetLayout() {
        this.layout = [];
        localStorage.removeItem('dashboard-layout');
        console.log('Layout reset');
    }

    // ===== PUBLIC API =====

    getLayoutItem(widgetId) {
        return this.layout.find(item => item.id === widgetId);
    }

    updateWidgetPosition(widgetId, x, y) {
        const item = this.getLayoutItem(widgetId);
        if (item) {
            item.x = x;
            item.y = y;
            this.saveLayout();
            this.renderLayout();
        }
    }

    updateWidgetSize(widgetId, w, h) {
        const item = this.getLayoutItem(widgetId);
        if (item) {
            const metadata = this.widgetMetadata[item.type];
            item.w = Math.max(metadata.minW, Math.min(metadata.maxW, w));
            item.h = Math.max(metadata.minH, Math.min(metadata.maxH, h));
            this.saveLayout();
            this.renderLayout();
        }
    }
}

// Make it globally available
window.GridLayoutManager = GridLayoutManager;
