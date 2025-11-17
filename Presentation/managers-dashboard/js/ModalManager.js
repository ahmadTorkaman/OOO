// Modal Manager - Handles all modal dialogs
export class ModalManager {
    constructor(dashboard) {
        this.dashboard = dashboard;
        this.init();
    }

    init() {
        this.setupTaskModal();
        this.setupCustomizationModal();
    }

    setupTaskModal() {
        const modal = document.getElementById('taskModal');
        const closeModal = document.getElementById('closeModal');
        const cancelTask = document.getElementById('cancelTask');
        const saveTask = document.getElementById('saveTask');

        if (closeModal) {
            closeModal.addEventListener('click', () => {
                modal.style.display = 'none';
                this.clearTaskForm();
            });
        }

        if (cancelTask) {
            cancelTask.addEventListener('click', () => {
                modal.style.display = 'none';
                this.clearTaskForm();
            });
        }

        if (saveTask) {
            saveTask.addEventListener('click', () => {
                this.saveTask();
            });
        }

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                this.clearTaskForm();
            }
        });
    }

    setupCustomizationModal() {
        // Create customization modal dynamically
        const modal = document.createElement('div');
        modal.id = 'customizationModal';
        modal.className = 'modal-overlay';
        modal.style.display = 'none';
        modal.innerHTML = `
            <div class="modal panel">
                <div class="modal-header">
                    <h3 id="customizationModalTitle">Customize Widget</h3>
                    <button class="btn-close" id="closeCustomizationModal">×</button>
                </div>
                <div class="modal-body" id="customizationModalBody">
                    <!-- Content will be injected dynamically -->
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" id="cancelCustomization">Cancel</button>
                    <button class="btn-primary" id="saveCustomization">Save Changes</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Event listeners
        document.getElementById('closeCustomizationModal').addEventListener('click', () => {
            this.hideCustomizationModal();
        });

        document.getElementById('cancelCustomization').addEventListener('click', () => {
            this.hideCustomizationModal();
        });

        document.getElementById('saveCustomization').addEventListener('click', () => {
            this.saveCustomization();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideCustomizationModal();
            }
        });
    }

    showTaskModal(widgetId = null) {
        this.currentWidgetId = widgetId;
        const modal = document.getElementById('taskModal');
        const title = document.getElementById('modalTitle');

        if (widgetId) {
            title.textContent = 'Add Task';
        } else {
            title.textContent = 'Create New Task';
        }

        modal.style.display = 'flex';
    }

    clearTaskForm() {
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskDescription').value = '';
        document.getElementById('taskAssignee').value = '';
        document.getElementById('taskPriority').value = 'medium';
        document.getElementById('taskDueDate').value = '';
        this.currentWidgetId = null;
    }

    saveTask() {
        const title = document.getElementById('taskTitle').value.trim();
        const description = document.getElementById('taskDescription').value.trim();
        const assignee = document.getElementById('taskAssignee').value;
        const priority = document.getElementById('taskPriority').value;
        const dueDate = document.getElementById('taskDueDate').value;

        if (!title) {
            this.showNotification('Please enter a task title', 'error');
            return;
        }

        const taskData = {
            title,
            description,
            assignee,
            priority,
            dueDate
        };

        if (this.currentWidgetId) {
            // Add to specific task manager widget
            this.dashboard.widgetManager.addTask(this.currentWidgetId, taskData);
        } else {
            // Add to dashboard tasks array
            this.dashboard.tasks.push({
                id: Date.now(),
                ...taskData,
                completed: false,
                createdAt: new Date().toISOString()
            });
        }

        document.getElementById('taskModal').style.display = 'none';
        this.clearTaskForm();
        this.showNotification('Task created successfully!', 'success');
    }

    showCustomizationModal(widget) {
        this.currentCustomizationWidget = widget;
        const modal = document.getElementById('customizationModal');
        const title = document.getElementById('customizationModalTitle');
        const body = document.getElementById('customizationModalBody');

        const widgetConfig = this.dashboard.widgetManager.getWidgetConfig(widget.type);
        title.textContent = `Customize ${widgetConfig.title}`;

        // Generate customization form based on widget type
        body.innerHTML = this.getCustomizationForm(widget);

        modal.style.display = 'flex';
    }

    getCustomizationForm(widget) {
        const forms = {
            'team-capacity': (w) => `
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="showPercentage" ${w.config.showPercentage ? 'checked' : ''}>
                        Show percentage values on bars
                    </label>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="highlightOver100" ${w.config.highlightOver100 ? 'checked' : ''}>
                        Highlight teams over 100% capacity
                    </label>
                </div>
            `,
            'delivery-trends': (w) => `
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="showTarget" ${w.config.showTarget ? 'checked' : ''}>
                        Show target line on chart
                    </label>
                </div>
                <div class="form-group">
                    <label>Time Frame</label>
                    <select id="timeframe" class="form-select">
                        <option value="4weeks" ${w.config.timeframe === '4weeks' ? 'selected' : ''}>4 Weeks</option>
                        <option value="12weeks" ${w.config.timeframe === '12weeks' ? 'selected' : ''}>12 Weeks</option>
                        <option value="6months" ${w.config.timeframe === '6months' ? 'selected' : ''}>6 Months</option>
                        <option value="1year" ${w.config.timeframe === '1year' ? 'selected' : ''}>1 Year</option>
                    </select>
                </div>
            `,
            'strategic-goals': (w) => `
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="showProgress" ${w.config.showProgress ? 'checked' : ''}>
                        Show progress percentage
                    </label>
                </div>
                <div class="form-group">
                    <label>Sort By</label>
                    <select id="sortBy" class="form-select">
                        <option value="priority" ${w.config.sortBy === 'priority' ? 'selected' : ''}>Priority</option>
                        <option value="progress" ${w.config.sortBy === 'progress' ? 'selected' : ''}>Progress</option>
                        <option value="name" ${w.config.sortBy === 'name' ? 'selected' : ''}>Name</option>
                    </select>
                </div>
            `,
            'task-manager': (w) => `
                <div class="form-group">
                    <label>Default View</label>
                    <select id="view" class="form-select">
                        <option value="list" ${w.config.view === 'list' ? 'selected' : ''}>List View</option>
                        <option value="compact" ${w.config.view === 'compact' ? 'selected' : ''}>Compact View</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Default Sort</label>
                    <select id="sortBy" class="form-select">
                        <option value="dueDate" ${w.config.sortBy === 'dueDate' ? 'selected' : ''}>Due Date</option>
                        <option value="priority" ${w.config.sortBy === 'priority' ? 'selected' : ''}>Priority</option>
                        <option value="created" ${w.config.sortBy === 'created' ? 'selected' : ''}>Created Date</option>
                    </select>
                </div>
            `
        };

        const formFn = forms[widget.type];
        return formFn ? formFn(widget) : '<p>No customization options available for this widget.</p>';
    }

    saveCustomization() {
        if (!this.currentCustomizationWidget) return;

        const widget = this.currentCustomizationWidget;
        const newConfig = {};

        // Extract values based on widget type
        if (widget.type === 'team-capacity') {
            newConfig.showPercentage = document.getElementById('showPercentage')?.checked || false;
            newConfig.highlightOver100 = document.getElementById('highlightOver100')?.checked || false;
        } else if (widget.type === 'delivery-trends') {
            newConfig.showTarget = document.getElementById('showTarget')?.checked || false;
            newConfig.timeframe = document.getElementById('timeframe')?.value || '12weeks';
        } else if (widget.type === 'strategic-goals') {
            newConfig.showProgress = document.getElementById('showProgress')?.checked || false;
            newConfig.sortBy = document.getElementById('sortBy')?.value || 'priority';
        } else if (widget.type === 'task-manager') {
            newConfig.view = document.getElementById('view')?.value || 'list';
            newConfig.sortBy = document.getElementById('sortBy')?.value || 'dueDate';
        }

        // Update widget config
        widget.config = { ...widget.config, ...newConfig };

        // Refresh the widget
        this.dashboard.widgetManager.refreshWidget(widget.id);

        this.hideCustomizationModal();
        this.showNotification('Widget customization saved!', 'success');
    }

    hideCustomizationModal() {
        const modal = document.getElementById('customizationModal');
        modal.style.display = 'none';
        this.currentCustomizationWidget = null;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}
