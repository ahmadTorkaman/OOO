// Main Dashboard Controller
import { WidgetManager } from './WidgetManager.js';
import { ModalManager } from './ModalManager.js';
import { DrillDownManager } from './DrillDownManager.js';
import { IconHelper } from './IconHelper.js';
import { GridLayoutManager } from './GridLayoutManager.js';

export class ManagerDashboard {
    constructor() {
        this.tasks = [];
        this.projects = [];
        this.liveDataIntervals = {};

        this.init();
    }

    init() {
        // Initialize managers
        this.gridLayoutManager = new GridLayoutManager(this);
        this.widgetManager = new WidgetManager(this);
        this.modalManager = new ModalManager(this);
        this.drillDownManager = new DrillDownManager(this);

        // Setup core functionality
        this.setupThemeToggle();
        this.setupDragAndDrop();
        this.setupSidebarToggle();
        this.setupQuickActions();
        this.loadDefaultWidgets();
        this.startLiveDataUpdates();
    }

    // ===== THEME TOGGLE =====
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const html = document.documentElement;

        // Check saved theme
        const savedTheme = localStorage.getItem('theme') || 'dark';
        if (savedTheme === 'light') {
            html.setAttribute('data-theme', 'light');
            themeToggle.checked = true;
        }

        themeToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                html.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            } else {
                html.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
            }
            console.log('Theme toggled to:', e.target.checked ? 'light' : 'dark');
        });
    }

    // ===== DRAG AND DROP =====
    setupDragAndDrop() {
        const widgetItems = document.querySelectorAll('.widget-item');
        const dashboardGrid = document.getElementById('dashboard-grid');

        widgetItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('widget-type', item.dataset.widgetType);
                e.dataTransfer.effectAllowed = 'copy';
            });
        });

        dashboardGrid.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        });

        dashboardGrid.addEventListener('drop', (e) => {
            e.preventDefault();
            const widgetType = e.dataTransfer.getData('widget-type');
            if (widgetType) {
                this.widgetManager.addWidget(widgetType);
            }
        });
    }

    // ===== SIDEBAR TOGGLE =====
    setupSidebarToggle() {
        const toggleLeftBtn = document.getElementById('toggleSidebarLeft');
        const showSidebarBtn = document.getElementById('showSidebarBtn');
        const toggleAlertsBtn = document.getElementById('toggleAlertsRight');
        const showAlertsBtn = document.getElementById('showAlertsBtn');
        const sidebar = document.getElementById('widget-sidebar');
        const alertsPanel = document.getElementById('alerts-sidebar');

        // Load saved panel states or default to closed
        const sidebarOpen = localStorage.getItem('sidebar-open') === 'true';
        const alertsOpen = localStorage.getItem('alerts-open') === 'true';

        // Initialize panel states
        if (!sidebarOpen && sidebar) {
            sidebar.classList.add('closed');
            if (showSidebarBtn) showSidebarBtn.classList.add('visible');
            if (toggleLeftBtn) toggleLeftBtn.classList.remove('visible');
        } else if (sidebar) {
            sidebar.classList.remove('closed');
            if (showSidebarBtn) showSidebarBtn.classList.remove('visible');
            if (toggleLeftBtn) toggleLeftBtn.classList.add('visible');
        }

        if (!alertsOpen && alertsPanel) {
            alertsPanel.classList.add('closed');
            if (showAlertsBtn) showAlertsBtn.classList.add('visible');
            if (toggleAlertsBtn) toggleAlertsBtn.classList.remove('visible');
        } else if (alertsPanel) {
            alertsPanel.classList.remove('closed');
            if (showAlertsBtn) showAlertsBtn.classList.remove('visible');
            if (toggleAlertsBtn) toggleAlertsBtn.classList.add('visible');
        }

        // Left sidebar toggle (hide)
        if (toggleLeftBtn && sidebar) {
            toggleLeftBtn.addEventListener('click', () => {
                sidebar.classList.add('closed');
                toggleLeftBtn.classList.remove('visible');
                if (showSidebarBtn) showSidebarBtn.classList.add('visible');
                localStorage.setItem('sidebar-open', 'false');
                // Reinitialize icons after transition
                setTimeout(() => IconHelper.createIcons(), 100);
            });
        }

        // Show sidebar button
        if (showSidebarBtn && sidebar) {
            showSidebarBtn.addEventListener('click', () => {
                sidebar.classList.remove('closed');
                showSidebarBtn.classList.remove('visible');
                if (toggleLeftBtn) toggleLeftBtn.classList.add('visible');
                localStorage.setItem('sidebar-open', 'true');
                // Reinitialize icons after transition
                setTimeout(() => IconHelper.createIcons(), 350);
            });
        }

        // Right alerts panel toggle (hide)
        if (toggleAlertsBtn && alertsPanel) {
            toggleAlertsBtn.addEventListener('click', () => {
                alertsPanel.classList.add('closed');
                toggleAlertsBtn.classList.remove('visible');
                if (showAlertsBtn) showAlertsBtn.classList.add('visible');
                localStorage.setItem('alerts-open', 'false');
                // Reinitialize icons after transition
                setTimeout(() => IconHelper.createIcons(), 100);
            });
        }

        // Show alerts button
        if (showAlertsBtn && alertsPanel) {
            showAlertsBtn.addEventListener('click', () => {
                alertsPanel.classList.remove('closed');
                showAlertsBtn.classList.remove('visible');
                if (toggleAlertsBtn) toggleAlertsBtn.classList.add('visible');
                localStorage.setItem('alerts-open', 'true');
                // Reinitialize icons after transition
                setTimeout(() => IconHelper.createIcons(), 350);
            });
        }
    }

    // ===== QUICK ACTIONS =====
    setupQuickActions() {
        const createTaskBtn = document.getElementById('createTaskBtn');
        const createProjectBtn = document.getElementById('createProjectBtn');

        if (createTaskBtn) {
            createTaskBtn.addEventListener('click', () => {
                this.modalManager.showTaskModal();
            });
        }

        if (createProjectBtn) {
            createProjectBtn.addEventListener('click', () => {
                this.modalManager.showTaskModal(); // Reuse task modal for now
            });
        }
    }

    // ===== DEFAULT WIDGETS =====
    loadDefaultWidgets() {
        // Check if we have a saved layout
        const hasSavedLayout = localStorage.getItem('dashboard-layout');

        if (hasSavedLayout) {
            console.log('Saved layout detected - clearing for fresh start');
            // For now, clear saved layouts since widget IDs are timestamp-based
            // TODO: Implement stable widget IDs for layout persistence
            localStorage.removeItem('dashboard-layout');
        }

        // Load default CEO dashboard widgets with proper delays
        const widgetsToLoad = [
            'todays-focus',
            'executive-summary',
            'task-manager',
            'project-manager',
            'cash-flow',
            'live-prices',
            'order-pipeline',
            'strategic-goals'
        ];

        widgetsToLoad.forEach((widgetType, index) => {
            setTimeout(() => {
                this.widgetManager.addWidget(widgetType);
            }, 200 + (index * 50));
        });

        // Initialize Lucide icons for sidebar after widgets are loaded
        setTimeout(() => {
            IconHelper.createIcons();
        }, 200 + (widgetsToLoad.length * 50) + 200);
    }

    // ===== LIVE DATA UPDATES =====
    startLiveDataUpdates() {
        // Update live prices every 5 seconds
        this.liveDataIntervals.prices = setInterval(() => {
            this.updateLivePrices();
        }, 5000);
    }

    updateLivePrices() {
        // Simulate API calls - replace with real API
        const goldPrice = (2045.30 + (Math.random() - 0.5) * 10).toFixed(2);
        const usdPrice = (42150 + (Math.random() - 0.5) * 50).toFixed(0);

        // Update all live-prices widgets
        this.widgetManager.widgets.filter(w => w.type === 'live-prices').forEach(widget => {
            widget.data.gold.price = parseFloat(goldPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            widget.data.usd.price = parseInt(usdPrice).toLocaleString();

            // Update DOM without full refresh
            const widgetEl = document.getElementById(widget.id);
            if (widgetEl) {
                const goldValueEl = widgetEl.querySelectorAll('.price-value')[0];
                const usdValueEl = widgetEl.querySelectorAll('.price-value')[1];

                if (goldValueEl) goldValueEl.textContent = `$${widget.data.gold.price}`;
                if (usdValueEl) usdValueEl.textContent = widget.data.usd.price;
            }
        });
    }
}

// Initialize dashboard when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.dashboard = new ManagerDashboard();
    });
} else {
    window.dashboard = new ManagerDashboard();
}

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
@keyframes fadeOut {
    from { opacity: 1; transform: scale(1); }
    to { opacity: 0; transform: scale(0.9); }
}
`;
document.head.appendChild(style);
