// OZONE Manager Dashboard - Interactive JavaScript
// Handles widget management, drag-and-drop, data visualization, and task management

class ManagerDashboard {
    constructor() {
        this.widgets = [];
        this.tasks = [];
        this.projects = [];
        this.charts = {};
        this.liveDataIntervals = {};

        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupDragAndDrop();
        this.setupModals();
        this.loadDefaultWidgets();
        this.startLiveDataUpdates();
        this.setupEventListeners();
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
            this.addWidget(widgetType);
        });
    }

    // ===== WIDGET MANAGEMENT =====
    addWidget(type) {
        const widgetId = `widget-${Date.now()}`;
        const widget = {
            id: widgetId,
            type: type,
            data: this.getWidgetData(type)
        };

        this.widgets.push(widget);
        this.renderWidget(widget);
    }

    renderWidget(widget) {
        const dashboardGrid = document.getElementById('dashboard-grid');
        const widgetEl = document.createElement('div');
        widgetEl.className = 'widget-container fade-in';
        widgetEl.id = widget.id;
        widgetEl.dataset.type = widget.type;

        const widgetConfig = this.getWidgetConfig(widget.type);

        widgetEl.innerHTML = `
            <div class="widget-header">
                <div class="widget-title">
                    <span class="widget-icon">${widgetConfig.icon}</span>
                    ${widgetConfig.title}
                </div>
                <div class="widget-controls">
                    <button class="widget-btn refresh" title="Refresh" onclick="dashboard.refreshWidget('${widget.id}')">↻</button>
                    <button class="widget-btn delete" title="Remove" onclick="dashboard.removeWidget('${widget.id}')">×</button>
                </div>
            </div>
            <div class="widget-body" id="${widget.id}-body">
                ${this.renderWidgetBody(widget)}
            </div>
        `;

        dashboardGrid.appendChild(widgetEl);

        // Initialize charts if needed
        if (widgetConfig.hasChart) {
            setTimeout(() => this.initializeChart(widget), 100);
        }
    }

    getWidgetConfig(type) {
        const configs = {
            'cash-flow': { title: 'Cash Flow & Runway', icon: '$', hasChart: true },
            'revenue-target': { title: 'Revenue vs Target', icon: '⊙', hasChart: true },
            'profit-product': { title: 'Profit by Product', icon: '▥', hasChart: true },
            'accounts-receivable': { title: 'Accounts Receivable', icon: '⟳', hasChart: true },
            'live-prices': { title: 'Live Market Prices', icon: '◈', hasChart: true },
            'order-pipeline': { title: 'Order Pipeline', icon: '▦', hasChart: false },
            'delivery-trends': { title: 'Delivery Time Trends', icon: '↗', hasChart: true },
            'bottleneck-map': { title: 'Bottleneck Heatmap', icon: '⚠', hasChart: false },
            'team-capacity': { title: 'Team Capacity', icon: '▧', hasChart: true },
            'customer-health': { title: 'Customer Health Score', icon: '☺', hasChart: true },
            'sales-pipeline': { title: 'Sales Pipeline', icon: '▽', hasChart: true },
            'top-customers': { title: 'Top Customers', icon: '★', hasChart: false },
            'team-scorecard': { title: 'Team Performance', icon: '◎', hasChart: false },
            'overdue-tasks': { title: 'Overdue Tasks', icon: '!', hasChart: false },
            'strategic-goals': { title: 'Strategic Goals Q4 2024', icon: '◉', hasChart: false }
        };
        return configs[type] || { title: 'Widget', icon: '◆', hasChart: false };
    }

    renderWidgetBody(widget) {
        switch(widget.type) {
            case 'cash-flow':
                return this.renderCashFlowWidget(widget.data);
            case 'revenue-target':
                return this.renderRevenueTargetWidget(widget.data);
            case 'profit-product':
                return this.renderProfitProductWidget(widget.data);
            case 'accounts-receivable':
                return this.renderARWidget(widget.data);
            case 'live-prices':
                return this.renderLivePricesWidget(widget.data);
            case 'order-pipeline':
                return this.renderOrderPipelineWidget(widget.data);
            case 'delivery-trends':
                return this.renderDeliveryTrendsWidget(widget.data);
            case 'team-capacity':
                return this.renderTeamCapacityWidget(widget.data);
            case 'customer-health':
                return this.renderCustomerHealthWidget(widget.data);
            case 'sales-pipeline':
                return this.renderSalesPipelineWidget(widget.data);
            case 'top-customers':
                return this.renderTopCustomersWidget(widget.data);
            case 'team-scorecard':
                return this.renderTeamScorecardWidget(widget.data);
            case 'overdue-tasks':
                return this.renderOverdueTasksWidget(widget.data);
            case 'strategic-goals':
                return this.renderStrategicGoalsWidget(widget.data);
            case 'bottleneck-map':
                return this.renderBottleneckWidget(widget.data);
            default:
                return '<p>Widget content</p>';
        }
    }

    // ===== WIDGET RENDERERS =====

    renderCashFlowWidget(data) {
        return `
            <div class="kpi-card">
                <div class="kpi-label">Current Cash Balance</div>
                <div class="kpi-value">$${data.balance.toLocaleString()}</div>
                <div class="kpi-trend ${data.trend >= 0 ? 'positive' : 'negative'}">
                    ${data.trend >= 0 ? '↗' : '↘'} ${Math.abs(data.trend)}% from last month
                </div>
                <div class="kpi-label" style="margin-top: 12px;">Runway: ${data.runway} days</div>
            </div>
            <canvas id="chart-${data.chartId}" class="chart-container"></canvas>
        `;
    }

    renderRevenueTargetWidget(data) {
        return `
            <div class="kpi-card">
                <div class="kpi-label">Monthly Revenue</div>
                <div class="kpi-value">$${data.actual.toLocaleString()}</div>
                <div class="kpi-label">Target: $${data.target.toLocaleString()} (${data.percentage}%)</div>
                <div class="kpi-trend ${data.onTrack ? 'positive' : 'negative'}">
                    ${data.onTrack ? 'On Track' : 'Behind'}
                </div>
            </div>
            <canvas id="chart-${data.chartId}" class="chart-container"></canvas>
        `;
    }

    renderProfitProductWidget(data) {
        return `<canvas id="chart-${data.chartId}" class="chart-container" style="height: 220px;"></canvas>`;
    }

    renderARWidget(data) {
        return `
            <div class="kpi-card">
                <div class="kpi-label">Total AR</div>
                <div class="kpi-value">$${data.total.toLocaleString()}</div>
                <div class="kpi-label" style="color: #e74c3c;">Overdue: $${data.overdue.toLocaleString()}</div>
            </div>
            <canvas id="chart-${data.chartId}" class="chart-container"></canvas>
        `;
    }

    renderLivePricesWidget(data) {
        return `
            <div class="price-cards">
                <div class="price-card">
                    <div class="price-label">Gold (oz)</div>
                    <div class="price-value">$${data.gold.price}</div>
                    <div class="price-change ${data.gold.change >= 0 ? 'up' : 'down'}">
                        ${data.gold.change >= 0 ? '↑' : '↓'} ${Math.abs(data.gold.change)}% (24h)
                    </div>
                    <canvas id="chart-gold" class="price-chart"></canvas>
                </div>
                <div class="price-card">
                    <div class="price-label">USD to IRR</div>
                    <div class="price-value">${data.usd.price}</div>
                    <div class="price-change ${data.usd.change >= 0 ? 'up' : 'down'}">
                        ${data.usd.change >= 0 ? '↑' : '↓'} ${Math.abs(data.usd.change)}% (24h)
                    </div>
                    <canvas id="chart-usd" class="price-chart"></canvas>
                </div>
            </div>
        `;
    }

    renderOrderPipelineWidget(data) {
        return `
            <div class="pipeline-stages">
                ${data.stages.map(stage => `
                    <div class="pipeline-stage">
                        <span class="stage-indicator ${stage.color}"></span>
                        <span class="stage-label">${stage.label}</span>
                        <span class="stage-count">${stage.count}</span>
                        <span class="stage-percentage">(${stage.percentage}%)</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderDeliveryTrendsWidget(data) {
        return `
            <div class="kpi-card">
                <div class="kpi-label">Average Delivery Time</div>
                <div class="kpi-value">${data.current} days</div>
                <div class="kpi-label">Target: ${data.target} days</div>
            </div>
            <canvas id="chart-${data.chartId}" class="chart-container"></canvas>
        `;
    }

    renderTeamCapacityWidget(data) {
        return `<canvas id="chart-${data.chartId}" class="chart-container" style="height: 220px;"></canvas>`;
    }

    renderCustomerHealthWidget(data) {
        return `<canvas id="chart-${data.chartId}" class="chart-container" style="height: 220px;"></canvas>`;
    }

    renderSalesPipelineWidget(data) {
        return `<canvas id="chart-${data.chartId}" class="chart-container" style="height: 220px;"></canvas>`;
    }

    renderTopCustomersWidget(data) {
        return `
            <table class="widget-table">
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Revenue</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.customers.map(c => `
                        <tr>
                            <td>${c.name}</td>
                            <td>$${c.revenue.toLocaleString()}</td>
                            <td><span class="status-badge ${c.status}">${c.statusText}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    renderTeamScorecardWidget(data) {
        return `
            <table class="widget-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Tasks</th>
                        <th>Rating</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.team.map(m => `
                        <tr>
                            <td>${m.name}</td>
                            <td>${m.tasks}</td>
                            <td>${m.rating}</td>
                            <td><span class="status-badge ${m.status}">${m.statusText}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    renderOverdueTasksWidget(data) {
        return `
            <div class="pipeline-stages">
                ${data.departments.map(dept => `
                    <div class="pipeline-stage">
                        <span class="stage-label">${dept.name}</span>
                        <span class="stage-count">${dept.count} tasks</span>
                        <span class="stage-percentage">(avg ${dept.avgDays}d late)</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderStrategicGoalsWidget(data) {
        return data.goals.map(goal => `
            <div class="progress-bar-container">
                <div class="progress-label">
                    <span>${goal.name}</span>
                    <span>${goal.progress}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${goal.progress}%"></div>
                </div>
                <div class="kpi-label" style="font-size: 11px; margin-top: 4px;">${goal.status}</div>
            </div>
        `).join('');
    }

    renderBottleneckWidget(data) {
        return `
            <div class="pipeline-stages">
                ${data.processes.map(proc => `
                    <div class="pipeline-stage" style="border-left: 3px solid ${proc.severity === 'high' ? '#e74c3c' : proc.severity === 'medium' ? '#f39c12' : '#27ae60'}">
                        <span class="stage-label">${proc.name}</span>
                        <span class="stage-count">${proc.time} days</span>
                        <span class="stage-percentage">${proc.status}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // ===== WIDGET DATA =====
    getWidgetData(type) {
        const chartId = `${type}-${Date.now()}`;

        const dataMap = {
            'cash-flow': {
                balance: 245000,
                trend: -12,
                runway: 45,
                chartId: chartId
            },
            'revenue-target': {
                actual: 1700000,
                target: 2000000,
                percentage: 85,
                onTrack: true,
                chartId: chartId
            },
            'profit-product': {
                chartId: chartId,
                products: ['Custom Furniture', 'Standard Tables', 'Chairs', 'Accessories'],
                margins: [42, 18, -3, 28]
            },
            'accounts-receivable': {
                total: 340000,
                overdue: 120000,
                chartId: chartId
            },
            'live-prices': {
                gold: { price: '2,045.30', change: 0.8 },
                usd: { price: '42,150', change: 0.2 }
            },
            'order-pipeline': {
                stages: [
                    { label: 'On Track', count: 45, percentage: 67, color: 'green' },
                    { label: 'At Risk', count: 15, percentage: 22, color: 'yellow' },
                    { label: 'Overdue', count: 8, percentage: 11, color: 'red' },
                    { label: 'Blocked', count: 3, percentage: 4, color: 'gray' }
                ]
            },
            'delivery-trends': {
                current: 12,
                target: 10,
                chartId: chartId
            },
            'team-capacity': {
                chartId: chartId,
                teams: ['Design', 'Production', 'QC', 'Logistics'],
                utilization: [85, 112, 45, 78]
            },
            'customer-health': {
                chartId: chartId,
                segments: ['Happy (NPS 9-10)', 'Neutral (NPS 7-8)', 'Unhappy (NPS 0-6)'],
                percentages: [72, 19, 9]
            },
            'sales-pipeline': {
                chartId: chartId,
                stages: ['Leads', 'Proposals', 'Negotiation', 'Closing'],
                values: [2300000, 890000, 340000, 180000]
            },
            'top-customers': {
                customers: [
                    { name: 'Client A', revenue: 450000, status: 'success', statusText: 'Active' },
                    { name: 'Client B', revenue: 320000, status: 'warning', statusText: 'At Risk' },
                    { name: 'Client C', revenue: 280000, status: 'success', statusText: 'Active' }
                ]
            },
            'team-scorecard': {
                team: [
                    { name: 'Sarah', tasks: 12, rating: '4.8', status: 'success', statusText: 'On Track' },
                    { name: 'Mike', tasks: 8, rating: '4.9', status: 'success', statusText: 'On Track' },
                    { name: 'John', tasks: 3, rating: '3.2', status: 'warning', statusText: 'Needs Support' },
                    { name: 'Alex', tasks: 5, rating: '4.1', status: 'danger', statusText: 'Overdue' }
                ]
            },
            'overdue-tasks': {
                departments: [
                    { name: 'Engineering', count: 8, avgDays: 5 },
                    { name: 'Admin', count: 14, avgDays: 12 },
                    { name: 'Design', count: 3, avgDays: 2 },
                    { name: 'Production', count: 2, avgDays: 1 }
                ]
            },
            'strategic-goals': {
                goals: [
                    { name: 'Increase Revenue to $2M', progress: 85, status: '30 days left' },
                    { name: 'Reduce Delivery Time to 10 Days', progress: 80, status: 'Behind' },
                    { name: 'Hire 5 New Team Members', progress: 60, status: 'On track' },
                    { name: 'Launch New Product Line', progress: 70, status: 'At risk' },
                    { name: 'Reduce Operating Costs by 15%', progress: 73, status: 'Trending well' }
                ]
            },
            'bottleneck-map': {
                processes: [
                    { name: 'Design', time: 2, status: 'Good', severity: 'low' },
                    { name: 'Approval', time: 5, status: 'Bottleneck', severity: 'high' },
                    { name: 'Production', time: 6, status: 'Good', severity: 'low' },
                    { name: 'QC', time: 1, status: 'Good', severity: 'low' },
                    { name: 'Shipping', time: 3, status: 'Good', severity: 'low' }
                ]
            }
        };

        return dataMap[type] || {};
    }

    // ===== CHART INITIALIZATION =====
    initializeChart(widget) {
        const ctx = document.getElementById(`chart-${widget.data.chartId}`);
        if (!ctx) return;

        let chartConfig;

        switch(widget.type) {
            case 'cash-flow':
                chartConfig = {
                    type: 'line',
                    data: {
                        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                        datasets: [{
                            label: 'Cash Flow',
                            data: [45000, -120000, 80000, -30000],
                            borderColor: '#7c8cfb',
                            backgroundColor: 'rgba(124, 140, 251, 0.1)',
                            tension: 0.4
                        }]
                    },
                    options: this.getChartOptions()
                };
                break;

            case 'revenue-target':
                chartConfig = {
                    type: 'doughnut',
                    data: {
                        labels: ['Achieved', 'Remaining'],
                        datasets: [{
                            data: [widget.data.actual, widget.data.target - widget.data.actual],
                            backgroundColor: ['#7c8cfb', 'rgba(255,255,255,0.1)']
                        }]
                    },
                    options: this.getChartOptions(true)
                };
                break;

            case 'profit-product':
                chartConfig = {
                    type: 'bar',
                    data: {
                        labels: widget.data.products,
                        datasets: [{
                            label: 'Margin %',
                            data: widget.data.margins,
                            backgroundColor: widget.data.margins.map(m => m < 0 ? '#e74c3c' : m < 20 ? '#f39c12' : '#27ae60')
                        }]
                    },
                    options: { ...this.getChartOptions(), indexAxis: 'y' }
                };
                break;

            case 'accounts-receivable':
                chartConfig = {
                    type: 'doughnut',
                    data: {
                        labels: ['Current', '30 days', '60 days', '90+ days'],
                        datasets: [{
                            data: [220000, 60000, 40000, 20000],
                            backgroundColor: ['#27ae60', '#f39c12', '#e67e22', '#e74c3c']
                        }]
                    },
                    options: this.getChartOptions(true)
                };
                break;

            case 'delivery-trends':
                chartConfig = {
                    type: 'line',
                    data: {
                        labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'],
                        datasets: [{
                            label: 'Delivery Time',
                            data: [10, 10, 11, 10, 11, 11, 12, 11, 12, 12, 13, 12],
                            borderColor: '#7c8cfb',
                            tension: 0.4
                        }]
                    },
                    options: this.getChartOptions()
                };
                break;

            case 'team-capacity':
                chartConfig = {
                    type: 'bar',
                    data: {
                        labels: widget.data.teams,
                        datasets: [{
                            label: 'Utilization %',
                            data: widget.data.utilization,
                            backgroundColor: widget.data.utilization.map(u => u > 100 ? '#e74c3c' : u < 50 ? '#f39c12' : '#27ae60')
                        }]
                    },
                    options: { ...this.getChartOptions(), indexAxis: 'y' }
                };
                break;

            case 'customer-health':
                chartConfig = {
                    type: 'pie',
                    data: {
                        labels: widget.data.segments,
                        datasets: [{
                            data: widget.data.percentages,
                            backgroundColor: ['#27ae60', '#f39c12', '#e74c3c']
                        }]
                    },
                    options: this.getChartOptions(true)
                };
                break;

            case 'sales-pipeline':
                chartConfig = {
                    type: 'bar',
                    data: {
                        labels: widget.data.stages,
                        datasets: [{
                            label: 'Pipeline Value',
                            data: widget.data.values,
                            backgroundColor: '#7c8cfb'
                        }]
                    },
                    options: this.getChartOptions()
                };
                break;

            default:
                return;
        }

        this.charts[widget.data.chartId] = new Chart(ctx, chartConfig);
    }

    getChartOptions(isDoughnut = false) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: isDoughnut,
                    labels: {
                        color: '#e6e8ee',
                        font: { size: 11 }
                    }
                }
            },
            scales: isDoughnut ? {} : {
                x: {
                    ticks: { color: '#a5adbf', font: { size: 10 } },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                },
                y: {
                    ticks: { color: '#a5adbf', font: { size: 10 } },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                }
            }
        };
    }

    // ===== WIDGET ACTIONS =====
    removeWidget(widgetId) {
        const widgetEl = document.getElementById(widgetId);
        if (widgetEl) {
            widgetEl.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                widgetEl.remove();
                this.widgets = this.widgets.filter(w => w.id !== widgetId);
            }, 300);
        }
    }

    refreshWidget(widgetId) {
        const widget = this.widgets.find(w => w.id === widgetId);
        if (widget) {
            widget.data = this.getWidgetData(widget.type);
            const bodyEl = document.getElementById(`${widgetId}-body`);
            if (bodyEl) {
                bodyEl.innerHTML = this.renderWidgetBody(widget);
                if (this.getWidgetConfig(widget.type).hasChart) {
                    setTimeout(() => this.initializeChart(widget), 100);
                }
            }
        }
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
        this.widgets.filter(w => w.type === 'live-prices').forEach(widget => {
            const goldEl = document.querySelector(`#${widget.id} .price-value`);
            if (goldEl) {
                widget.data.gold.price = goldPrice.toLocaleString();
                widget.data.usd.price = usdPrice.toLocaleString();
                this.refreshWidget(widget.id);
            }
        });
    }

    // ===== MODAL MANAGEMENT =====
    setupModals() {
        const modal = document.getElementById('taskModal');
        const createTaskBtn = document.getElementById('createTaskBtn');
        const createProjectBtn = document.getElementById('createProjectBtn');
        const closeModal = document.getElementById('closeModal');
        const cancelTask = document.getElementById('cancelTask');
        const saveTask = document.getElementById('saveTask');

        createTaskBtn.addEventListener('click', () => {
            document.getElementById('modalTitle').textContent = 'Create New Task';
            modal.style.display = 'flex';
        });

        createProjectBtn.addEventListener('click', () => {
            document.getElementById('modalTitle').textContent = 'Create New Project';
            modal.style.display = 'flex';
        });

        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
            this.clearTaskForm();
        });

        cancelTask.addEventListener('click', () => {
            modal.style.display = 'none';
            this.clearTaskForm();
        });

        saveTask.addEventListener('click', () => {
            this.saveTaskOrProject();
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                this.clearTaskForm();
            }
        });
    }

    clearTaskForm() {
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskDescription').value = '';
        document.getElementById('taskAssignee').value = '';
        document.getElementById('taskPriority').value = 'medium';
        document.getElementById('taskDueDate').value = '';
    }

    saveTaskOrProject() {
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const assignee = document.getElementById('taskAssignee').value;
        const priority = document.getElementById('taskPriority').value;
        const dueDate = document.getElementById('taskDueDate').value;

        if (!title) {
            alert('Please enter a title');
            return;
        }

        const task = {
            id: Date.now(),
            title,
            description,
            assignee,
            priority,
            dueDate,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        console.log('Task created:', task);

        // Close modal and clear form
        document.getElementById('taskModal').style.display = 'none';
        this.clearTaskForm();

        // Show success notification
        this.showNotification('Task created successfully!');
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // ===== DEFAULT WIDGETS =====
    loadDefaultWidgets() {
        // Load some default widgets
        setTimeout(() => {
            this.addWidget('cash-flow');
            this.addWidget('revenue-target');
            this.addWidget('live-prices');
            this.addWidget('order-pipeline');
            this.addWidget('strategic-goals');
            this.addWidget('team-capacity');
        }, 100);
    }

    // ===== EVENT LISTENERS =====
    setupEventListeners() {
        // Sidebar toggle for mobile
        const toggleSidebar = document.getElementById('toggleSidebar');
        const sidebar = document.getElementById('widget-sidebar');

        toggleSidebar.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
}

// Initialize dashboard
const dashboard = new ManagerDashboard();

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
@keyframes fadeOut {
    from { opacity: 1; transform: scale(1); }
    to { opacity: 0; transform: scale(0.9); }
}
`;
document.head.appendChild(style);
