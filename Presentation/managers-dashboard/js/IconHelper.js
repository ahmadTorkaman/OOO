// Icon Helper - Lucide Icons Integration
// Provides consistent SVG icon rendering across the dashboard

export class IconHelper {
    // Icon mapping: emoji/symbol → Lucide icon name
    static iconMap = {
        // Financial
        '$': 'dollar-sign',
        '↑': 'trending-up',
        '↓': 'trending-down',
        '⊙': 'target',
        '▥': 'bar-chart',
        '⟳': 'refresh-cw',
        '◈': 'coins',

        // Operations
        '▦': 'layout',
        '↗': 'arrow-up-right',
        '⚠': 'alert-triangle',
        '▧': 'users',

        // Customer & Sales
        '☺': 'smile',
        '▽': 'funnel',
        '★': 'star',

        // Team & Tasks
        '◎': 'circle-dot',
        '!': 'alert-circle',
        '✓': 'check-circle',
        '✅': 'check-circle',
        '🔄': 'loader',
        '⏸️': 'pause-circle',
        '⏳': 'clock',

        // Strategic & Executive
        '◉': 'crosshair',
        '📊': 'bar-chart-2',
        '🎯': 'target',
        '📈': 'trending-up',
        '⚡': 'zap',
        '📅': 'calendar',

        // Executive Summary emojis
        '💰': 'dollar-sign',
        '⏱️': 'clock',
        '💵': 'wallet',
        '👥': 'users',

        // UI Controls
        '⚙': 'settings',
        '⋮': 'more-vertical',
        '×': 'x',
        '→': 'chevron-right',
        '←': 'chevron-left',
        '◆': 'diamond'
    };

    /**
     * Generate Lucide icon HTML
     * @param {string} iconNameOrEmoji - Lucide icon name or emoji to map
     * @param {string} className - Additional CSS classes
     * @param {number} size - Icon size in pixels (default: 16)
     * @returns {string} HTML string for icon
     */
    static icon(iconNameOrEmoji, className = '', size = 16) {
        // Check if it's an emoji that needs mapping
        const iconName = this.iconMap[iconNameOrEmoji] || iconNameOrEmoji;

        return `<i data-lucide="${iconName}" class="icon ${className}" style="width:${size}px;height:${size}px;"></i>`;
    }

    /**
     * Initialize all Lucide icons on the page
     * Call this after DOM updates to render icons
     */
    static createIcons() {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    /**
     * Get icon name from emoji/symbol
     * @param {string} emoji - Emoji or symbol
     * @returns {string} Lucide icon name
     */
    static getIconName(emoji) {
        return this.iconMap[emoji] || 'circle';
    }

    /**
     * Create widget icon HTML (for sidebar)
     * @param {string} iconName - Icon identifier
     * @returns {string} HTML for widget icon
     */
    static widgetIcon(iconName) {
        return this.icon(iconName, 'widget-icon-svg', 20);
    }

    /**
     * Create status icon (completed, in-progress, blocked, pending)
     * @param {string} status - Status type
     * @returns {string} HTML for status icon
     */
    static statusIcon(status) {
        const statusIcons = {
            'completed': 'check-circle',
            'in-progress': 'loader',
            'blocked': 'pause-circle',
            'pending': 'clock'
        };

        const iconName = statusIcons[status] || 'circle';
        return this.icon(iconName, `status-icon status-${status}`, 14);
    }

    /**
     * Create trend icon (up/down)
     * @param {boolean} isPositive - True for up, false for down
     * @returns {string} HTML for trend icon
     */
    static trendIcon(isPositive) {
        const iconName = isPositive ? 'trending-up' : 'trending-down';
        const className = isPositive ? 'trend-up' : 'trend-down';
        return this.icon(iconName, className, 16);
    }
}

// Make it globally available
window.IconHelper = IconHelper;
