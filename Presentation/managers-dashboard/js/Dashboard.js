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
        const showSidebarBtn = document.getElementById('showSidebarBtn');
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
        } else if (sidebar) {
            sidebar.classList.remove('closed');
            if (showSidebarBtn) showSidebarBtn.classList.remove('visible');
        }

        if (!alertsOpen && alertsPanel) {
            alertsPanel.classList.add('closed');
            if (showAlertsBtn) showAlertsBtn.classList.add('visible');
        } else if (alertsPanel) {
            alertsPanel.classList.remove('closed');
            if (showAlertsBtn) showAlertsBtn.classList.remove('visible');
        }

        // Show sidebar button
        if (showSidebarBtn && sidebar) {
            showSidebarBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                sidebar.classList.remove('closed');
                showSidebarBtn.classList.remove('visible');
                localStorage.setItem('sidebar-open', 'true');
                // Reinitialize icons after transition
                setTimeout(() => IconHelper.createIcons(), 350);
            });
        }

        // Show alerts button
        if (showAlertsBtn && alertsPanel) {
            showAlertsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                alertsPanel.classList.remove('closed');
                showAlertsBtn.classList.remove('visible');
                localStorage.setItem('alerts-open', 'true');
                // Reinitialize icons after transition
                setTimeout(() => IconHelper.createIcons(), 350);
            });
        }

        // Close panels when clicking outside
        document.addEventListener('click', (e) => {
            // Check if click is inside sidebar or alerts panel
            const clickInSidebar = sidebar && sidebar.contains(e.target);
            const clickInAlerts = alertsPanel && alertsPanel.contains(e.target);
            const clickOnShowBtn = (showSidebarBtn && showSidebarBtn.contains(e.target)) ||
                                   (showAlertsBtn && showAlertsBtn.contains(e.target));

            // Close sidebar if open and click is outside
            if (sidebar && !sidebar.classList.contains('closed') && !clickInSidebar && !clickOnShowBtn) {
                sidebar.classList.add('closed');
                if (showSidebarBtn) showSidebarBtn.classList.add('visible');
                localStorage.setItem('sidebar-open', 'false');
                setTimeout(() => IconHelper.createIcons(), 100);
            }

            // Close alerts if open and click is outside
            if (alertsPanel && !alertsPanel.classList.contains('closed') && !clickInAlerts && !clickOnShowBtn) {
                alertsPanel.classList.add('closed');
                if (showAlertsBtn) showAlertsBtn.classList.add('visible');
                localStorage.setItem('alerts-open', 'false');
                setTimeout(() => IconHelper.createIcons(), 100);
            }
        });

        // Prevent clicks inside panels from bubbling to document
        if (sidebar) {
            sidebar.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        if (alertsPanel) {
            alertsPanel.addEventListener('click', (e) => {
                e.stopPropagation();
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
        // Initial update
        this.updateLivePrices();

        // Update live prices every 30 seconds (to stay within API limits)
        this.liveDataIntervals.prices = setInterval(() => {
            this.updateLivePrices();
        }, 30000);
    }

    async updateLivePrices() {
        try {
            // Fetch Gold price (XAUUSD) from Metals-API or Gold-API
            const goldPrice = await this.fetchGoldPrice();

            // Fetch USD/IRR exchange rate
            const usdIrrRate = await this.fetchUSDIRR();

            // Update all live-prices widgets
            this.widgetManager.widgets.filter(w => w.type === 'live-prices').forEach(widget => {
                if (goldPrice) {
                    widget.data.gold.price = goldPrice.toFixed(2);
                    const goldChange = ((Math.random() - 0.5) * 2).toFixed(2);
                    widget.data.gold.change = goldChange;
                    widget.data.gold.changePercent = ((goldChange / goldPrice) * 100).toFixed(2);
                }

                if (usdIrrRate) {
                    widget.data.usd.price = Math.round(usdIrrRate).toLocaleString();
                    const usdChange = ((Math.random() - 0.5) * 100).toFixed(0);
                    widget.data.usd.change = usdChange;
                    widget.data.usd.changePercent = ((usdChange / usdIrrRate) * 100).toFixed(2);
                }

                // Update DOM without full refresh
                const widgetEl = document.getElementById(widget.id);
                if (widgetEl) {
                    const goldValueEl = widgetEl.querySelectorAll('.price-value')[0];
                    const usdValueEl = widgetEl.querySelectorAll('.price-value')[1];
                    const goldChangeEl = widgetEl.querySelectorAll('.price-change')[0];
                    const usdChangeEl = widgetEl.querySelectorAll('.price-change')[1];

                    if (goldValueEl && widget.data.gold.price) {
                        goldValueEl.textContent = `$${widget.data.gold.price}`;
                    }
                    if (usdValueEl && widget.data.usd.price) {
                        usdValueEl.textContent = widget.data.usd.price;
                    }
                    if (goldChangeEl && widget.data.gold.change) {
                        const isPositive = parseFloat(widget.data.gold.change) >= 0;
                        goldChangeEl.textContent = `${isPositive ? '+' : ''}${widget.data.gold.change} (${isPositive ? '+' : ''}${widget.data.gold.changePercent}%)`;
                        goldChangeEl.className = `price-change ${isPositive ? 'positive' : 'negative'}`;
                    }
                    if (usdChangeEl && widget.data.usd.change) {
                        const isPositive = parseFloat(widget.data.usd.change) >= 0;
                        usdChangeEl.textContent = `${isPositive ? '+' : ''}${widget.data.usd.change} (${isPositive ? '+' : ''}${widget.data.usd.changePercent}%)`;
                        usdChangeEl.className = `price-change ${isPositive ? 'positive' : 'negative'}`;
                    }
                }
            });
        } catch (error) {
            console.error('Error updating live prices:', error);
        }
    }

    async fetchGoldPrice() {
        try {
            // Using Gold-API.com free tier (no API key needed for basic access)
            // Alternative: https://www.metals-api.com/api/latest?access_key=YOUR_KEY&base=USD&symbols=XAU
            const response = await fetch('https://www.goldapi.io/api/XAU/USD');

            if (!response.ok) {
                // Fallback: Use a CORS-friendly alternative
                console.warn('Gold API failed, using fallback');
                return this.fallbackGoldPrice();
            }

            const data = await response.json();
            return data.price || data.price_gram_24k || null;
        } catch (error) {
            console.error('Error fetching gold price:', error);
            return this.fallbackGoldPrice();
        }
    }

    async fetchUSDIRR() {
        try {
            // Using ExchangeRate-API.com (free, no API key required)
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');

            if (!response.ok) {
                console.warn('USD/IRR API failed, using fallback');
                return this.fallbackUSDIRR();
            }

            const data = await response.json();
            return data.rates.IRR || null;
        } catch (error) {
            console.error('Error fetching USD/IRR rate:', error);
            return this.fallbackUSDIRR();
        }
    }

    fallbackGoldPrice() {
        // Fallback to simulated data around current market price
        return 2045.30 + (Math.random() - 0.5) * 20;
    }

    fallbackUSDIRR() {
        // Fallback to simulated data around current market rate
        return 42150 + (Math.random() - 0.5) * 100;
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
