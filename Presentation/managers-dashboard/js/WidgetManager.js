// Widget Manager - Handles widget lifecycle and rendering
import { IconHelper } from './IconHelper.js';
import { translator } from './i18n.js';

export class WidgetManager {
    constructor(dashboard) {
        this.dashboard = dashboard;
        this.widgets = [];
        this.charts = {};
    }

    addWidget(type, customConfig = null) {
        const widgetId = `widget-${Date.now()}`;
        const widget = {
            id: widgetId,
            type: type,
            data: this.getWidgetData(type),
            config: customConfig || this.getDefaultConfig(type)
        };

        this.widgets.push(widget);

        // Add to grid layout manager
        const layoutItem = this.dashboard.gridLayoutManager.addWidget(widgetId, type);
        if (!layoutItem) {
            console.warn('Could not add widget to grid layout');
            this.widgets.pop(); // Remove from widgets array
            return null;
        }

        this.renderWidget(widget);

        // Position widget according to grid layout - wait for DOM and chart render
        setTimeout(() => {
            const widgetEl = document.getElementById(widgetId);
            if (widgetEl) {
                this.dashboard.gridLayoutManager.positionWidget(widgetEl, layoutItem);
                console.log(`Positioned widget ${widgetId} at (${layoutItem.x}, ${layoutItem.y})`);
            }
        }, 250);

        return widget;
    }

    addCustomChartWidget(chartConfig) {
        const widgetId = `widget-${Date.now()}`;
        const chartId = `custom-${Date.now()}`;

        const widget = {
            id: widgetId,
            type: 'custom-chart',
            data: {
                chartId: chartId,
                customConfig: chartConfig
            },
            config: {}
        };

        this.widgets.push(widget);

        // Add to grid layout manager - custom charts are 3x3
        const layoutItem = this.dashboard.gridLayoutManager.addWidget(widgetId, 'custom-chart');
        if (!layoutItem) {
            console.warn('Could not add custom chart widget to grid layout');
            this.widgets.pop();
            return null;
        }

        this.renderWidget(widget);

        // Position widget according to grid layout - wait for DOM and chart render
        setTimeout(() => {
            const widgetEl = document.getElementById(widgetId);
            if (widgetEl) {
                this.dashboard.gridLayoutManager.positionWidget(widgetEl, layoutItem);
                console.log(`Positioned custom chart widget ${widgetId} at (${layoutItem.x}, ${layoutItem.y})`);
            }
        }, 250);

        return widget;
    }

    renderWidget(widget) {
        const dashboardGrid = document.getElementById('dashboard-grid');
        const widgetEl = document.createElement('div');
        widgetEl.className = 'widget fade-in';
        widgetEl.id = widget.id;
        widgetEl.dataset.type = widget.type;

        const widgetConfig = this.getWidgetConfig(widget.type);
        const hasCustomization = this.hasCustomization(widget.type);

        // Custom chart widgets use their config title
        const widgetTitle = widget.type === 'custom-chart' && widget.data.customConfig
            ? widget.data.customConfig.title
            : widgetConfig.title;

        widgetEl.innerHTML = `
            <div class="widget-header">
                <div class="widget-title">
                    ${IconHelper.widgetIcon(widgetConfig.icon)}
                    ${widgetTitle}
                </div>
                <div class="widget-controls">
                    ${hasCustomization ? `<button class="widget-btn customize" data-widget-id="${widget.id}" title="Customize">${this.getSettingsIcon()}</button>` : ''}
                    <button class="widget-btn refresh" data-widget-id="${widget.id}" title="Refresh">${this.getRefreshIcon()}</button>
                    <button class="widget-btn delete" data-widget-id="${widget.id}" title="Remove">${this.getCloseIcon()}</button>
                </div>
            </div>
            <div class="widget-body" id="${widget.id}-body">
                ${this.renderWidgetBody(widget)}
            </div>
        `;

        dashboardGrid.appendChild(widgetEl);

        // Setup event listeners for widget controls
        this.setupWidgetControls(widgetEl, widget.id);

        // Initialize Lucide icons
        setTimeout(() => IconHelper.createIcons(), 50);

        // Initialize charts if needed - with proper delay
        if (widgetConfig.hasChart) {
            setTimeout(() => this.initializeChart(widget), 200);
        }
    }

    hasCustomization(type) {
        return ['team-capacity', 'delivery-trends', 'strategic-goals', 'task-manager'].includes(type);
    }

    setupWidgetControls(widgetEl, widgetId) {
        console.log(`Setting up controls for widget ${widgetId}`);

        // Customize button
        const customizeBtn = widgetEl.querySelector('.widget-btn.customize');
        if (customizeBtn) {
            console.log('Found customize button');
            customizeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Customize clicked for', widgetId);
                this.customizeWidget(widgetId);
            });
        }

        // Refresh button
        const refreshBtn = widgetEl.querySelector('.widget-btn.refresh');
        if (refreshBtn) {
            console.log('Found refresh button');
            refreshBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Refresh clicked for', widgetId);
                this.refreshWidget(widgetId);
            });
        }

        // Delete button
        const deleteBtn = widgetEl.querySelector('.widget-btn.delete');
        if (deleteBtn) {
            console.log('Found delete button');
            deleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Delete clicked for', widgetId);
                this.removeWidget(widgetId);
            });
        } else {
            console.warn('Delete button not found for', widgetId);
        }
    }

    getCloseIcon() {
        return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>`;
    }

    getRefreshIcon() {
        return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
        </svg>`;
    }

    getSettingsIcon() {
        return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 1v6m0 6v6m-6-6h6m6 0h6m-4.22-4.22l-4.24 4.24m0 4.24l4.24 4.24m-8.48 0l4.24-4.24m0-4.24l-4.24-4.24"></path>
        </svg>`;
    }

    customizeWidget(widgetId) {
        const widget = this.widgets.find(w => w.id === widgetId);
        if (!widget) return;

        this.dashboard.modalManager.showCustomizationModal(widget);
    }

    getWidgetConfig(type) {
        const configs = {
            'cash-flow': { title: translator.t('cash-flow'), icon: 'dollar-sign', hasChart: true, drillDown: true },
            'revenue-target': { title: translator.t('revenue-target'), icon: 'target', hasChart: true, drillDown: true },
            'profit-product': { title: translator.t('profit-product'), icon: 'bar-chart', hasChart: true, drillDown: true },
            'accounts-receivable': { title: translator.t('accounts-receivable'), icon: 'refresh-cw', hasChart: true, drillDown: true },
            'live-prices': { title: translator.t('live-prices'), icon: 'coins', hasChart: true, drillDown: false },
            'order-pipeline': { title: translator.t('order-pipeline'), icon: 'layout', hasChart: false, drillDown: true },
            'delivery-trends': { title: translator.t('delivery-trends'), icon: 'arrow-up-right', hasChart: true, drillDown: true },
            'bottleneck-map': { title: translator.t('bottleneck-map'), icon: 'alert-triangle', hasChart: false, drillDown: true },
            'team-capacity': { title: translator.t('team-capacity'), icon: 'users', hasChart: true, drillDown: true },
            'customer-health': { title: translator.t('customer-health'), icon: 'smile', hasChart: true, drillDown: true },
            'sales-pipeline': { title: translator.t('sales-pipeline'), icon: 'funnel', hasChart: true, drillDown: true },
            'top-customers': { title: translator.t('top-customers'), icon: 'star', hasChart: false, drillDown: true },
            'team-scorecard': { title: translator.t('team-scorecard'), icon: 'circle-dot', hasChart: false, drillDown: true },
            'overdue-tasks': { title: translator.t('overdue-tasks'), icon: 'alert-circle', hasChart: false, drillDown: true },
            'strategic-goals': { title: translator.t('strategic-goals'), icon: 'crosshair', hasChart: false, drillDown: true },
            'task-manager': { title: translator.t('task-manager'), icon: 'check-circle', hasChart: false, drillDown: true },
            'project-manager': { title: translator.t('project-manager'), icon: 'bar-chart-2', hasChart: false, drillDown: true },
            'todays-focus': { title: translator.t('todays-focus'), icon: 'target', hasChart: false, drillDown: false },
            'executive-summary': { title: translator.t('executive-summary'), icon: 'trending-up', hasChart: false, drillDown: true },
            'custom-chart': { title: translator.t('custom-chart'), icon: 'bar-chart-3', hasChart: true, drillDown: false }
        };
        return configs[type] || { title: 'Widget', icon: 'diamond', hasChart: false, drillDown: false };
    }

    getDefaultConfig(type) {
        const defaults = {
            'team-capacity': { showPercentage: true, highlightOver100: true },
            'delivery-trends': { showTarget: true, timeframe: '12weeks' },
            'strategic-goals': { showProgress: true, sortBy: 'priority' },
            'task-manager': { view: 'list', filter: 'all', sortBy: 'dueDate' }
        };
        return defaults[type] || {};
    }

    renderWidgetBody(widget) {
        const renderers = {
            'cash-flow': this.renderCashFlowWidget,
            'revenue-target': this.renderRevenueTargetWidget,
            'profit-product': this.renderProfitProductWidget,
            'accounts-receivable': this.renderARWidget,
            'live-prices': this.renderLivePricesWidget,
            'order-pipeline': this.renderOrderPipelineWidget,
            'delivery-trends': this.renderDeliveryTrendsWidget,
            'team-capacity': this.renderTeamCapacityWidget,
            'customer-health': this.renderCustomerHealthWidget,
            'sales-pipeline': this.renderSalesPipelineWidget,
            'top-customers': this.renderTopCustomersWidget,
            'team-scorecard': this.renderTeamScorecardWidget,
            'overdue-tasks': this.renderOverdueTasksWidget,
            'strategic-goals': this.renderStrategicGoalsWidget,
            'bottleneck-map': this.renderBottleneckWidget,
            'task-manager': this.renderTaskManagerWidget,
            'project-manager': this.renderProjectManagerWidget,
            'todays-focus': this.renderTodaysFocusWidget,
            'executive-summary': this.renderExecutiveSummaryWidget,
            'custom-chart': this.renderCustomChartWidget
        };

        const renderer = renderers[widget.type];
        return renderer ? renderer.call(this, widget.data, widget.id) : '<p>Widget content</p>';
    }

    // Widget Renderers
    renderCashFlowWidget(data, widgetId) {
        return `
            <div class="kpi-card clickable" onclick="dashboard.drillDownManager.show('${widgetId}', 'cash-flow')">
                <div class="kpi-label">${translator.t('current-cash-balance')}</div>
                <div class="kpi-value">$${data.balance.toLocaleString()}</div>
                <div class="kpi-trend ${data.trend >= 0 ? 'positive' : 'negative'}">
                    ${IconHelper.trendIcon(data.trend >= 0)} ${Math.abs(data.trend)}% ${translator.t('from-last-month')}
                </div>
                <div class="kpi-label" style="margin-top: 12px;">${translator.t('runway')}: ${data.runway} ${translator.t('days')}</div>
            </div>
            <canvas id="chart-${data.chartId}" class="chart-container"></canvas>
        `;
    }

    renderRevenueTargetWidget(data, widgetId) {
        return `
            <div class="kpi-card clickable" onclick="dashboard.drillDownManager.show('${widgetId}', 'revenue-target')">
                <div class="kpi-label">${translator.t('monthly-revenue')}</div>
                <div class="kpi-value">$${data.actual.toLocaleString()}</div>
                <div class="kpi-label">${translator.t('target')}: $${data.target.toLocaleString()} (${data.percentage}%)</div>
                <div class="kpi-trend ${data.onTrack ? 'positive' : 'negative'}">
                    ${data.onTrack ? translator.t('on-track') : translator.t('behind')}
                </div>
            </div>
            <canvas id="chart-${data.chartId}" class="chart-container"></canvas>
        `;
    }

    renderProfitProductWidget(data, widgetId) {
        return `<canvas id="chart-${data.chartId}" class="chart-container" style="height: 220px;"></canvas>`;
    }

    renderARWidget(data, widgetId) {
        return `
            <div class="kpi-card clickable" onclick="dashboard.drillDownManager.show('${widgetId}', 'accounts-receivable')">
                <div class="kpi-label">${translator.t('total-ar')}</div>
                <div class="kpi-value">$${data.total.toLocaleString()}</div>
                <div class="kpi-label" style="color: #e74c3c;">${translator.t('overdue')}: $${data.overdue.toLocaleString()}</div>
            </div>
            <canvas id="chart-${data.chartId}" class="chart-container"></canvas>
        `;
    }

    renderLivePricesWidget(data, widgetId) {
        return `
            <div class="price-cards">
                <div class="price-card">
                    <div class="price-label">${translator.t('gold-oz')}</div>
                    <div class="price-value" id="gold-price-${widgetId}">$${data.gold.price}</div>
                    <div class="price-change ${data.gold.change >= 0 ? 'up' : 'down'}" id="gold-change-${widgetId}">
                        ${IconHelper.trendIcon(data.gold.change >= 0)} ${Math.abs(data.gold.change)}% (${translator.t('24h')})
                    </div>
                    <canvas id="chart-gold-${widgetId}" class="price-sparkline"></canvas>
                </div>
                <div class="price-card">
                    <div class="price-label">${translator.t('usd-to-irr')}</div>
                    <div class="price-value" id="usd-price-${widgetId}">${data.usd.price}</div>
                    <div class="price-change ${data.usd.change >= 0 ? 'up' : 'down'}" id="usd-change-${widgetId}">
                        ${IconHelper.trendIcon(data.usd.change >= 0)} ${Math.abs(data.usd.change)}% (${translator.t('24h')})
                    </div>
                    <canvas id="chart-usd-${widgetId}" class="price-sparkline"></canvas>
                </div>
            </div>
        `;
    }

    renderOrderPipelineWidget(data, widgetId) {
        return `
            <div class="pipeline-stages clickable" onclick="dashboard.drillDownManager.show('${widgetId}', 'order-pipeline')">
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

    renderDeliveryTrendsWidget(data, widgetId) {
        return `
            <div class="kpi-card clickable" onclick="dashboard.drillDownManager.show('${widgetId}', 'delivery-trends')">
                <div class="kpi-label">${translator.t('average-delivery-time')}</div>
                <div class="kpi-value">${data.current} ${translator.t('days')}</div>
                <div class="kpi-label">${translator.t('target')}: ${data.target} ${translator.t('days')}</div>
            </div>
            <canvas id="chart-${data.chartId}" class="chart-container"></canvas>
        `;
    }

    renderTeamCapacityWidget(data, widgetId) {
        return `<canvas id="chart-${data.chartId}" class="chart-container" style="height: 220px;"></canvas>`;
    }

    renderCustomerHealthWidget(data, widgetId) {
        return `<canvas id="chart-${data.chartId}" class="chart-container" style="height: 220px;"></canvas>`;
    }

    renderSalesPipelineWidget(data, widgetId) {
        return `<canvas id="chart-${data.chartId}" class="chart-container" style="height: 220px;"></canvas>`;
    }

    renderTopCustomersWidget(data, widgetId) {
        return `
            <table class="widget-table clickable" onclick="dashboard.drillDownManager.show('${widgetId}', 'top-customers')">
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

    renderTeamScorecardWidget(data, widgetId) {
        return `
            <table class="widget-table clickable" onclick="dashboard.drillDownManager.show('${widgetId}', 'team-scorecard')">
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

    renderOverdueTasksWidget(data, widgetId) {
        return `
            <div class="pipeline-stages clickable" onclick="dashboard.drillDownManager.show('${widgetId}', 'overdue-tasks')">
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

    renderStrategicGoalsWidget(data, widgetId) {
        return data.goals.map(goal => `
            <div class="progress-bar-container clickable" onclick="dashboard.drillDownManager.show('${widgetId}', 'strategic-goals', ${goal.id || 0})">
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

    renderBottleneckWidget(data, widgetId) {
        return `
            <div class="pipeline-stages clickable" onclick="dashboard.drillDownManager.show('${widgetId}', 'bottleneck-map')">
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

    renderTaskManagerWidget(data, widgetId) {
        const tasks = data.tasks || [];
        const filter = data.filter || 'all';

        return `
            <div class="task-manager-widget">
                <div class="task-filters">
                    <button class="filter-btn ${filter === 'all' ? 'active' : ''}" onclick="dashboard.widgetManager.filterTasks('${widgetId}', 'all')">All</button>
                    <button class="filter-btn ${filter === 'today' ? 'active' : ''}" onclick="dashboard.widgetManager.filterTasks('${widgetId}', 'today')">Today</button>
                    <button class="filter-btn ${filter === 'week' ? 'active' : ''}" onclick="dashboard.widgetManager.filterTasks('${widgetId}', 'week')">This Week</button>
                </div>
                <div class="task-list">
                    ${tasks.length === 0 ? '<p class="no-tasks">No tasks yet. Create one below!</p>' :
                        tasks.map(task => `
                            <div class="task-item ${task.completed ? 'completed' : ''}" onclick="dashboard.widgetManager.toggleTask('${widgetId}', ${task.id})">
                                <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="event.stopPropagation(); dashboard.widgetManager.toggleTask('${widgetId}', ${task.id})">
                                <div class="task-content">
                                    <div class="task-title">${task.title}</div>
                                    <div class="task-meta">
                                        ${task.dueDate ? `<span class="task-due ${this.isOverdue(task.dueDate) ? 'overdue' : ''}">${this.formatDueDate(task.dueDate)}</span>` : ''}
                                        ${task.priority ? `<span class="task-priority priority-${task.priority}">${task.priority}</span>` : ''}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                </div>
                <button class="btn-primary btn-sm add-task-btn" onclick="dashboard.modalManager.showTaskModal('${widgetId}')">+ Add Task</button>
            </div>
        `;
    }

    isOverdue(dueDate) {
        return new Date(dueDate) < new Date();
    }

    formatDueDate(dueDate) {
        const date = new Date(dueDate);
        const today = new Date();
        const diff = Math.ceil((date - today) / (1000 * 60 * 60 * 24));

        if (diff === 0) return 'Today';
        if (diff === 1) return 'Tomorrow';
        if (diff === -1) return 'Yesterday';
        if (diff < 0) return `${Math.abs(diff)} days ago`;
        return `In ${diff} days`;
    }

    filterTasks(widgetId, filter) {
        const widget = this.widgets.find(w => w.id === widgetId);
        if (!widget) return;

        widget.data.filter = filter;
        this.refreshWidget(widgetId);
    }

    toggleTask(widgetId, taskId) {
        const widget = this.widgets.find(w => w.id === widgetId);
        if (!widget) return;

        const task = widget.data.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.refreshWidget(widgetId);
        }
    }

    addTask(widgetId, taskData) {
        const widget = this.widgets.find(w => w.id === widgetId);
        if (!widget) return;

        const task = {
            id: Date.now(),
            ...taskData,
            completed: false,
            createdAt: new Date().toISOString()
        };

        widget.data.tasks.push(task);
        this.refreshWidget(widgetId);
    }

    renderProjectManagerWidget(data, widgetId) {
        const projects = data.projects || [];

        return `
            <div class="project-manager-widget">
                ${projects.map(project => `
                    <div class="project-card ${project.status}" onclick="dashboard.drillDownManager.show('${widgetId}', 'project-manager', '${project.id}')">
                        <div class="project-header">
                            <h4 class="project-title">${project.name}</h4>
                            <span class="project-status-badge ${project.status}">${project.statusText}</span>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${project.progress}%"></div>
                            </div>
                            <span class="progress-label">${project.progress}%</span>
                        </div>
                        <div class="project-checkpoints">
                            ${project.checkpoints.slice(0, 3).map(cp => `
                                <div class="checkpoint-item ${cp.status}">
                                    ${IconHelper.statusIcon(cp.status)}
                                    <span class="checkpoint-name">${cp.name}</span>
                                </div>
                            `).join('')}
                            ${project.checkpoints.length > 3 ? `<div class="checkpoint-more">+ ${project.checkpoints.length - 3} more</div>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderTodaysFocusWidget(data, widgetId) {
        const focus = data;

        return `
            <div class="todays-focus-widget">
                <div class="focus-section">
                    <h4>${IconHelper.icon('target', '', 16)} Top Priorities</h4>
                    <ol class="priority-list">
                        ${focus.priorities.map(p => `<li class="priority-${p.urgency}">${p.text}</li>`).join('')}
                    </ol>
                </div>

                <div class="focus-section">
                    <h4>${IconHelper.icon('zap', '', 16)} Urgent Decisions</h4>
                    <ul class="decision-list">
                        ${focus.decisions.map(d => `
                            <li>
                                <strong>${d.title}</strong>
                                <span class="decision-deadline">${d.deadline}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <div class="focus-section">
                    <h4>${IconHelper.icon('calendar', '', 16)} Today's Meetings</h4>
                    <div class="meetings-list">
                        ${focus.meetings.map(m => `
                            <div class="meeting-item">
                                <span class="meeting-time">${m.time}</span>
                                <span class="meeting-title">${m.title}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="focus-metrics">
                    ${focus.metrics.map(metric => `
                        <div class="focus-metric">
                            <span class="metric-label">${metric.label}</span>
                            <span class="metric-value ${metric.status}">${metric.value}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderExecutiveSummaryWidget(data, widgetId) {
        return `
            <div class="executive-summary-widget clickable" onclick="dashboard.drillDownManager.show('${widgetId}', 'executive-summary')">
                ${data.metrics.map(metric => `
                    <div class="summary-metric ${metric.status}">
                        <div class="metric-icon">${IconHelper.icon(metric.icon, '', 32)}</div>
                        <div class="metric-info">
                            <div class="metric-title">${metric.title}</div>
                            <div class="metric-detail">${metric.detail}</div>
                        </div>
                        <div class="metric-status-indicator ${metric.status}"></div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderCustomChartWidget(data, widgetId) {
        return `<canvas id="chart-${data.chartId}" class="chart-container" style="height: 100%;"></canvas>`;
    }

    // Continued in next part...
    removeWidget(widgetId) {
        const widgetEl = document.getElementById(widgetId);
        if (widgetEl) {
            widgetEl.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                widgetEl.remove();
                this.widgets = this.widgets.filter(w => w.id !== widgetId);

                // Remove from grid layout manager
                this.dashboard.gridLayoutManager.removeWidget(widgetId);

                // Clean up chart if exists
                const widget = this.widgets.find(w => w.id === widgetId);
                if (widget && widget.data.chartId && this.charts[widget.data.chartId]) {
                    this.charts[widget.data.chartId].destroy();
                    delete this.charts[widget.data.chartId];
                }
            }, 300);
        }
    }

    refreshWidget(widgetId) {
        const widget = this.widgets.find(w => w.id === widgetId);
        if (widget) {
            // Don't regenerate data for task-manager, keep existing tasks
            if (widget.type !== 'task-manager') {
                widget.data = this.getWidgetData(widget.type);
            }

            const bodyEl = document.getElementById(`${widgetId}-body`);
            if (bodyEl) {
                bodyEl.innerHTML = this.renderWidgetBody(widget);
                if (this.getWidgetConfig(widget.type).hasChart) {
                    setTimeout(() => this.initializeChart(widget), 200);
                }
            }
        }
    }

    getWidgetData(type) {
        const chartId = `${type}-${Date.now()}`;
        const dataGenerators = {
            'cash-flow': () => ({
                balance: 245000,
                trend: -12,
                runway: 45,
                chartId: chartId
            }),
            'revenue-target': () => ({
                actual: 1700000,
                target: 2000000,
                percentage: 85,
                onTrack: true,
                chartId: chartId
            }),
            'profit-product': () => ({
                chartId: chartId,
                products: ['Custom Furniture', 'Standard Tables', 'Chairs', 'Accessories'],
                margins: [42, 18, -3, 28]
            }),
            'accounts-receivable': () => ({
                total: 340000,
                overdue: 120000,
                chartId: chartId
            }),
            'live-prices': () => ({
                gold: { price: '2,045.30', change: 0.8 },
                usd: { price: '42,150', change: 0.2 }
            }),
            'order-pipeline': () => ({
                stages: [
                    { label: 'On Track', count: 45, percentage: 67, color: 'green' },
                    { label: 'At Risk', count: 15, percentage: 22, color: 'yellow' },
                    { label: 'Overdue', count: 8, percentage: 11, color: 'red' },
                    { label: 'Blocked', count: 3, percentage: 4, color: 'gray' }
                ]
            }),
            'delivery-trends': () => ({
                current: 12,
                target: 10,
                chartId: chartId
            }),
            'team-capacity': () => ({
                chartId: chartId,
                teams: ['Design', 'Production', 'QC', 'Logistics'],
                utilization: [85, 112, 45, 78]
            }),
            'customer-health': () => ({
                chartId: chartId,
                segments: ['Happy (NPS 9-10)', 'Neutral (NPS 7-8)', 'Unhappy (NPS 0-6)'],
                percentages: [72, 19, 9]
            }),
            'sales-pipeline': () => ({
                chartId: chartId,
                stages: ['Leads', 'Proposals', 'Negotiation', 'Closing'],
                values: [2300000, 890000, 340000, 180000]
            }),
            'top-customers': () => ({
                customers: [
                    { name: 'Client A', revenue: 450000, status: 'success', statusText: 'Active' },
                    { name: 'Client B', revenue: 320000, status: 'warning', statusText: 'At Risk' },
                    { name: 'Client C', revenue: 280000, status: 'success', statusText: 'Active' }
                ]
            }),
            'team-scorecard': () => ({
                team: [
                    { name: 'Sarah', tasks: 12, rating: '4.8', status: 'success', statusText: 'On Track' },
                    { name: 'Mike', tasks: 8, rating: '4.9', status: 'success', statusText: 'On Track' },
                    { name: 'John', tasks: 3, rating: '3.2', status: 'warning', statusText: 'Needs Support' },
                    { name: 'Alex', tasks: 5, rating: '4.1', status: 'danger', statusText: 'Overdue' }
                ]
            }),
            'overdue-tasks': () => ({
                departments: [
                    { name: 'Engineering', count: 8, avgDays: 5 },
                    { name: 'Admin', count: 14, avgDays: 12 },
                    { name: 'Design', count: 3, avgDays: 2 },
                    { name: 'Production', count: 2, avgDays: 1 }
                ]
            }),
            'strategic-goals': () => ({
                goals: [
                    { id: 1, name: 'Increase Revenue to $2M', progress: 85, status: '30 days left' },
                    { id: 2, name: 'Reduce Delivery Time to 10 Days', progress: 80, status: 'Behind' },
                    { id: 3, name: 'Hire 5 New Team Members', progress: 60, status: 'On track' },
                    { id: 4, name: 'Launch New Product Line', progress: 70, status: 'At risk' },
                    { id: 5, name: 'Reduce Operating Costs by 15%', progress: 73, status: 'Trending well' }
                ]
            }),
            'bottleneck-map': () => ({
                processes: [
                    { name: 'Design', time: 2, status: 'Good', severity: 'low' },
                    { name: 'Approval', time: 5, status: 'Bottleneck', severity: 'high' },
                    { name: 'Production', time: 6, status: 'Good', severity: 'low' },
                    { name: 'QC', time: 1, status: 'Good', severity: 'low' },
                    { name: 'Shipping', time: 3, status: 'Good', severity: 'low' }
                ]
            }),
            'task-manager': () => ({
                tasks: [
                    { id: 1, title: 'Review Q4 board presentation deck', description: 'Final review before board meeting next week', priority: 'high', dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false, assignee: 'Self' },
                    { id: 2, title: 'Approve $2M equipment financing proposal', description: 'Review terms with CFO', priority: 'urgent', dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false, assignee: 'Self' },
                    { id: 3, title: 'Call with Client B - AR collection', description: '$45K outstanding for 92 days', priority: 'urgent', dueDate: new Date().toISOString().split('T')[0], completed: false, assignee: 'Self' },
                    { id: 4, title: 'Approve Tehran showroom final design', description: 'Architect waiting for approval', priority: 'high', dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false, assignee: 'Self' },
                    { id: 5, title: '1-on-1 with John (performance plan)', description: 'Discuss performance improvement', priority: 'medium', dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false, assignee: 'Self' },
                    { id: 6, title: "Approve Sarah's promotion to Lead Designer", description: 'HR waiting for final approval', priority: 'medium', dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false, assignee: 'Self' },
                    { id: 7, title: 'Review cash flow projections with CFO', description: 'Quarterly financial review', priority: 'high', dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false, assignee: 'Self' },
                    { id: 8, title: 'Sign quarterly financial statements', description: 'Auditor review complete', priority: 'medium', dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: true, assignee: 'Self' }
                ],
                filter: 'all'
            }),
            'project-manager': () => ({
                projects: [
                    {
                        id: 'proj-1',
                        name: 'Tehran Showroom Launch',
                        progress: 67,
                        status: 'at-risk',
                        statusText: 'At Risk',
                        checkpoints: [
                            { name: 'Site selection & lease', status: 'completed' },
                            { name: 'Architect finalized', status: 'completed' },
                            { name: 'Interior design', status: 'in-progress' },
                            { name: 'Permits pending', status: 'blocked' },
                            { name: 'Grand opening', status: 'pending' }
                        ]
                    },
                    {
                        id: 'proj-2',
                        name: 'New Product Line - Executive Desks',
                        progress: 85,
                        status: 'on-track',
                        statusText: 'On Track',
                        checkpoints: [
                            { name: 'Market research', status: 'completed' },
                            { name: 'Prototype design', status: 'completed' },
                            { name: 'Supplier contracts', status: 'completed' },
                            { name: 'First production run', status: 'in-progress' },
                            { name: 'Marketing campaign', status: 'pending' }
                        ]
                    },
                    {
                        id: 'proj-3',
                        name: 'ERP System Implementation',
                        progress: 40,
                        status: 'behind',
                        statusText: 'Behind Schedule',
                        checkpoints: [
                            { name: 'Vendor selection', status: 'completed' },
                            { name: 'Requirements gathering', status: 'completed' },
                            { name: 'Data migration (stalled - 3 weeks)', status: 'blocked' },
                            { name: 'Staff training', status: 'pending' },
                            { name: 'Go-live', status: 'pending' }
                        ]
                    }
                ]
            }),
            'todays-focus': () => ({
                priorities: [
                    { text: 'Approve $2M equipment financing by EOD', urgency: 'urgent' },
                    { text: 'Call Client B about $45K overdue payment', urgency: 'urgent' },
                    { text: 'Review & approve Tehran showroom design', urgency: 'high' }
                ],
                decisions: [
                    { title: 'Equipment financing terms', deadline: 'Today 5 PM' },
                    { title: 'Hire 2 production staff vs outsource', deadline: 'Tomorrow' },
                    { title: 'Approve cost reduction plan', deadline: 'This Week' }
                ],
                meetings: [
                    { time: '10:00 AM', title: 'Weekly exec team standup' },
                    { time: '2:00 PM', title: 'CFO - Cash flow review' },
                    { time: '4:00 PM', title: 'Sales pipeline review' }
                ],
                metrics: [
                    { label: 'Revenue', value: '$1.7M / $2M', status: 'warning' },
                    { label: 'Cash Runway', value: '45 days', status: 'danger' },
                    { label: 'Orders', value: '45 on track', status: 'success' }
                ]
            }),
            'executive-summary': () => ({
                metrics: [
                    { icon: 'dollar-sign', title: 'Revenue', detail: 'On Track (85% of target)', status: 'success' },
                    { icon: 'clock', title: 'Delivery', detail: 'Behind Target (+2 days)', status: 'danger' },
                    { icon: 'wallet', title: 'Cash', detail: 'Warning (45 days runway)', status: 'warning' },
                    { icon: 'users', title: 'Team', detail: 'Performing Well (4.6/5)', status: 'success' }
                ]
            })
        };

        const generator = dataGenerators[type];
        return generator ? generator() : {};
    }

    initializeChart(widget) {
        // Handle live-prices separately (has multiple sparkline charts)
        if (widget.type === 'live-prices') {
            this.initializeLivePriceCharts(widget);
            return;
        }

        const ctx = document.getElementById(`chart-${widget.data.chartId}`);
        if (!ctx) return;

        let chartConfig = this.getChartConfig(widget);
        if (!chartConfig) return;

        // Destroy existing chart if it exists
        if (this.charts[widget.data.chartId]) {
            this.charts[widget.data.chartId].destroy();
        }

        this.charts[widget.data.chartId] = new Chart(ctx, chartConfig);
    }

    initializeLivePriceCharts(widget) {
        const goldCtx = document.getElementById(`chart-gold-${widget.id}`);
        const usdCtx = document.getElementById(`chart-usd-${widget.id}`);

        // Generate 24 hours of price history (simulate)
        const generate24HData = (basePrice, volatility) => {
            const data = [];
            for (let i = 0; i < 24; i++) {
                data.push(basePrice + (Math.random() - 0.5) * volatility);
            }
            return data;
        };

        const goldSparklineConfig = {
            type: 'line',
            data: {
                labels: Array(24).fill(''),
                datasets: [{
                    data: generate24HData(2045, 20),
                    borderColor: widget.data.gold.change >= 0 ? '#27ae60' : '#e74c3c',
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 0,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                scales: {
                    x: { display: false },
                    y: { display: false }
                }
            }
        };

        const usdSparklineConfig = {
            type: 'line',
            data: {
                labels: Array(24).fill(''),
                datasets: [{
                    data: generate24HData(42150, 100),
                    borderColor: widget.data.usd.change >= 0 ? '#27ae60' : '#e74c3c',
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 0,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                scales: {
                    x: { display: false },
                    y: { display: false }
                }
            }
        };

        if (goldCtx) {
            this.charts[`gold-${widget.id}`] = new Chart(goldCtx, goldSparklineConfig);
        }

        if (usdCtx) {
            this.charts[`usd-${widget.id}`] = new Chart(usdCtx, usdSparklineConfig);
        }
    }

    getChartConfig(widget) {
        const configs = {
            'cash-flow': () => ({
                type: 'line',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [{
                        label: 'Cash Flow',
                        data: [45000, -120000, 80000, -30000],
                        borderColor: '#7c8cfb',
                        backgroundColor: 'rgba(124, 140, 251, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: this.getChartOptions()
            }),
            'revenue-target': () => ({
                type: 'doughnut',
                data: {
                    labels: ['Achieved', 'Remaining'],
                    datasets: [{
                        data: [widget.data.actual, widget.data.target - widget.data.actual],
                        backgroundColor: ['#7c8cfb', 'rgba(255,255,255,0.1)']
                    }]
                },
                options: this.getChartOptions(true)
            }),
            'profit-product': () => ({
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
            }),
            'accounts-receivable': () => ({
                type: 'doughnut',
                data: {
                    labels: ['Current', '30 days', '60 days', '90+ days'],
                    datasets: [{
                        data: [220000, 60000, 40000, 20000],
                        backgroundColor: ['#27ae60', '#f39c12', '#e67e22', '#e74c3c']
                    }]
                },
                options: this.getChartOptions(true)
            }),
            'delivery-trends': () => ({
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
            }),
            'team-capacity': () => ({
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
            }),
            'customer-health': () => ({
                type: 'pie',
                data: {
                    labels: widget.data.segments,
                    datasets: [{
                        data: widget.data.percentages,
                        backgroundColor: ['#27ae60', '#f39c12', '#e74c3c']
                    }]
                },
                options: this.getChartOptions(true)
            }),
            'sales-pipeline': () => ({
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
            }),
            'custom-chart': () => {
                if (!widget.data.customConfig) return null;

                const config = widget.data.customConfig;

                // Build chart config based on chartType
                if (config.chartType === 'stacked-bar') {
                    return {
                        type: 'bar',
                        data: config.data,
                        options: {
                            ...this.getChartOptions(),
                            plugins: {
                                ...this.getChartOptions().plugins,
                                legend: {
                                    display: true,
                                    labels: {
                                        color: '#e6e8ee',
                                        font: { size: 11 }
                                    }
                                }
                            },
                            scales: {
                                ...this.getChartOptions().scales,
                                x: {
                                    stacked: true,
                                    ticks: { color: '#a5adbf', font: { size: 10 } },
                                    grid: { color: 'rgba(255,255,255,0.05)' }
                                },
                                y: {
                                    stacked: true,
                                    ticks: { color: '#a5adbf', font: { size: 10 } },
                                    grid: { color: 'rgba(255,255,255,0.05)' }
                                }
                            }
                        }
                    };
                } else if (config.chartType === 'grouped-bar') {
                    return {
                        type: 'bar',
                        data: config.data,
                        options: {
                            ...this.getChartOptions(),
                            plugins: {
                                ...this.getChartOptions().plugins,
                                legend: {
                                    display: true,
                                    labels: {
                                        color: '#e6e8ee',
                                        font: { size: 11 }
                                    }
                                }
                            }
                        }
                    };
                }

                // Default fallback
                return {
                    type: 'bar',
                    data: config.data,
                    options: this.getChartOptions()
                };
            }
        };

        const configFn = configs[widget.type];
        return configFn ? configFn() : null;
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
}
