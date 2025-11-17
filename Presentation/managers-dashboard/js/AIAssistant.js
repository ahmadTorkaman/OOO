// AI Assistant Module - Claude-style chat interface
import { IconHelper } from './IconHelper.js';
import { translator } from './i18n.js';

export class AIAssistant {
    constructor(dashboard) {
        this.dashboard = dashboard;
        this.isOpen = false;
        this.conversationState = 'initial';
        this.messages = [];
        this.currentChartConfig = null;

        this.init();
    }

    init() {
        this.createFloatingButton();
        this.createChatPanel();
        this.setupEventListeners();
        this.loadConversationScript();
    }

    createFloatingButton() {
        const button = document.createElement('button');
        button.id = 'ai-assistant-btn';
        button.className = 'ai-assistant-floating-btn';
        button.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
        `;
        button.title = 'AI Assistant';
        document.body.appendChild(button);
    }

    createChatPanel() {
        const panel = document.createElement('div');
        panel.id = 'ai-chat-panel';
        panel.className = 'ai-chat-panel closed';
        panel.innerHTML = `
            <div class="ai-chat-header">
                <div class="ai-chat-header-content">
                    <div class="ai-avatar">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                            <line x1="9" y1="9" x2="9.01" y2="9"></line>
                            <line x1="15" y1="9" x2="15.01" y2="9"></line>
                        </svg>
                    </div>
                    <div class="ai-chat-title">
                        <h3>Claude Assistant</h3>
                        <span class="ai-status">Ready to help</span>
                    </div>
                </div>
                <button class="ai-close-btn" id="ai-close-btn">
                    <i data-lucide="x" class="icon"></i>
                </button>
            </div>
            <div class="ai-chat-messages" id="ai-chat-messages">
                <div class="ai-welcome-message">
                    <p>👋 Hi! I'm Claude, your AI assistant.</p>
                    <p>I can help you analyze your dashboard data and create custom charts.</p>
                    <div class="ai-suggestions">
                        <button class="ai-suggestion-chip" data-action="create-chart">📊 Create custom chart</button>
                        <button class="ai-suggestion-chip" data-action="analyze-data">📈 Analyze dashboard data</button>
                    </div>
                </div>
            </div>
            <div class="ai-chat-input-container">
                <textarea
                    id="ai-chat-input"
                    class="ai-chat-input"
                    placeholder="Ask me anything..."
                    rows="1"
                ></textarea>
                <button id="ai-send-btn" class="ai-send-btn">
                    <i data-lucide="send" class="icon"></i>
                </button>
            </div>
        `;
        document.body.appendChild(panel);
    }

    setupEventListeners() {
        const floatingBtn = document.getElementById('ai-assistant-btn');
        const closeBtn = document.getElementById('ai-close-btn');
        const sendBtn = document.getElementById('ai-send-btn');
        const input = document.getElementById('ai-chat-input');
        const panel = document.getElementById('ai-chat-panel');

        floatingBtn.addEventListener('click', () => this.toggleChat());
        closeBtn.addEventListener('click', () => this.toggleChat());
        sendBtn.addEventListener('click', () => this.sendMessage());

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        input.addEventListener('input', () => {
            input.style.height = 'auto';
            input.style.height = Math.min(input.scrollHeight, 120) + 'px';
        });

        // Suggestion chips
        panel.addEventListener('click', (e) => {
            if (e.target.classList.contains('ai-suggestion-chip')) {
                const action = e.target.dataset.action;
                this.handleSuggestion(action);
            }
            if (e.target.classList.contains('ai-option-btn')) {
                const option = e.target.dataset.option;
                this.handleOptionClick(option);
            }
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const panel = document.getElementById('ai-chat-panel');
        const button = document.getElementById('ai-assistant-btn');

        if (this.isOpen) {
            panel.classList.remove('closed');
            button.classList.add('hidden');
            setTimeout(() => IconHelper.createIcons(), 100);
        } else {
            panel.classList.add('closed');
            button.classList.remove('hidden');
        }
    }

    updateLanguage() {
        // Update AI Assistant title and status
        const titleEl = document.querySelector('.ai-chat-title h3');
        const statusEl = document.querySelector('.ai-status');
        const inputEl = document.getElementById('ai-chat-input');
        const button = document.getElementById('ai-assistant-btn');

        if (titleEl) titleEl.textContent = translator.t('ai-assistant');
        if (statusEl) statusEl.textContent = translator.getLanguage() === 'fa' ? 'آماده کمک' : 'Ready to help';
        if (inputEl) inputEl.placeholder = translator.t('ai-type-message');
        if (button) button.title = translator.t('ai-assistant');

        // Re-render welcome message if it's still visible
        const welcomeMsg = document.querySelector('.ai-welcome-message');
        if (welcomeMsg) {
            welcomeMsg.innerHTML = `
                <p>👋 ${translator.getLanguage() === 'fa' ? 'سلام! من کلود، دستیار هوش مصنوعی شما هستم.' : 'Hi! I\'m Claude, your AI assistant.'}</p>
                <p>${translator.getLanguage() === 'fa' ? 'می‌توانم به شما در تحلیل داده‌های پیشخوان و ایجاد نمودارهای سفارشی کمک کنم.' : 'I can help you analyze your dashboard data and create custom charts.'}</p>
                <div class="ai-suggestions">
                    <button class="ai-suggestion-chip" data-action="create-chart">📊 ${translator.t('ai-option-chart')}</button>
                    <button class="ai-suggestion-chip" data-action="analyze-data">📈 ${translator.t('ai-option-analysis')}</button>
                </div>
            `;
        }
    }

    sendMessage() {
        const input = document.getElementById('ai-chat-input');
        const text = input.value.trim();

        if (!text) return;

        this.addUserMessage(text);
        input.value = '';
        input.style.height = 'auto';

        // Process message based on conversation state
        this.processUserInput(text);
    }

    handleSuggestion(action) {
        if (action === 'create-chart') {
            this.startChartCreation();
        } else if (action === 'analyze-data') {
            this.addUserMessage('Analyze dashboard data');
            this.showAnalysis();
        }
    }

    startChartCreation() {
        this.addUserMessage('Create a chart showing monthly revenue by product category');
        this.conversationState = 'chart-type-selection';

        setTimeout(() => {
            this.showTypingIndicator();
            setTimeout(() => {
                this.hideTypingIndicator();
                this.addAssistantMessage(
                    `I'll help you create a custom revenue chart. Let me gather some details:

📊 **Chart Type Options:**
Which would you prefer?`,
                    [
                        { label: 'Bar Chart (compare categories)', value: 'bar' },
                        { label: 'Line Chart (show trends over time)', value: 'line' },
                        { label: 'Stacked Bar (breakdown by subcategories) ✓ Recommended', value: 'stacked-bar' },
                        { label: 'Area Chart (cumulative view)', value: 'area' }
                    ]
                );
            }, 1500);
        }, 500);
    }

    handleOptionClick(option) {
        if (this.conversationState === 'chart-type-selection') {
            this.addUserMessage(option === 'stacked-bar' ? 'Stacked Bar' : option);
            this.conversationState = 'chart-config';
            this.currentChartConfig = { type: option };

            setTimeout(() => {
                this.showThinkingIndicator();
                setTimeout(() => {
                    this.hideThinkingIndicator();
                    this.showChartConfiguration();
                }, 2000);
            }, 500);
        } else if (this.conversationState === 'chart-config') {
            this.handleConfigOption(option);
        } else if (this.conversationState === 'chart-preview') {
            this.handlePreviewAction(option);
        } else if (this.conversationState === 'comparison-type') {
            this.handleComparisonType(option);
        } else if (this.conversationState === 'comparison-preview') {
            this.handleComparisonAction(option);
        }
    }

    showChartConfiguration() {
        this.addAssistantMessage(
            `Perfect! Stacked bar chart for revenue breakdown. Let me configure it:

**Data Detected:**
✓ Revenue data from your Financial widgets
✓ Time range: Last 6 months (Jan-Jun 2025)
✓ Product categories: Cabinets, Hardware, Services, Custom Work

**Chart Configuration:**
- **Colors:** Auto-assigned by category
- **Time Period:** Monthly
- **Show Values:** On hover
- **Include Total Line:** Yes/No?

Should I use your company brand colors or Chart.js defaults?`,
            [
                { label: 'Company brand colors + Show totals', value: 'company-colors' },
                { label: 'Chart.js defaults', value: 'default-colors' }
            ]
        );
    }

    handleConfigOption(option) {
        if (option === 'company-colors') {
            this.addUserMessage('Company brand colors + Show totals');
            this.conversationState = 'chart-preview';
            this.currentChartConfig.colors = 'company';
            this.currentChartConfig.showTotals = true;

            setTimeout(() => {
                this.showTypingIndicator();
                setTimeout(() => {
                    this.hideTypingIndicator();
                    this.showChartPreview();
                }, 1500);
            }, 500);
        }
    }

    showChartPreview() {
        const previewHTML = `
            <div class="ai-chart-preview">
                <div class="chart-preview-container">
                    <canvas id="ai-preview-chart-1"></canvas>
                </div>
            </div>
        `;

        this.addAssistantMessage(
            `Excellent! Here's your preview:

${previewHTML}

📊 **Monthly Revenue by Product Category**
- 6 months of data (Jan-Jun 2025)
- Stacked bars showing category breakdown
- Total revenue line overlaid
- Company colors applied

**Insights I noticed:**
- Total revenue trending upward (+12% over period)
- Cabinet sales are your largest category (58%)
- Services revenue grew 25% in Q2

Would you like to:`,
            [
                { label: '✅ Add to dashboard', value: 'add-to-dashboard' },
                { label: '🎨 Adjust styling', value: 'adjust-styling' },
                { label: '📊 Change chart type', value: 'change-type' },
                { label: '📥 Export as PNG', value: 'export' }
            ]
        );

        // Render preview chart
        setTimeout(() => this.renderPreviewChart('ai-preview-chart-1'), 100);
    }

    renderPreviewChart(canvasId) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        const data = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Cabinets',
                    data: [280, 310, 295, 320, 340, 350],
                    backgroundColor: 'rgba(124, 140, 251, 0.8)',
                },
                {
                    label: 'Hardware',
                    data: [75, 82, 78, 85, 88, 92],
                    backgroundColor: 'rgba(78, 205, 196, 0.8)',
                },
                {
                    label: 'Services',
                    data: [95, 105, 112, 125, 140, 155],
                    backgroundColor: 'rgba(255, 107, 107, 0.8)',
                },
                {
                    label: 'Custom Work',
                    data: [60, 65, 58, 70, 72, 75],
                    backgroundColor: 'rgba(255, 195, 18, 0.8)',
                }
            ]
        };

        new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    },
                    title: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true
                    }
                }
            }
        });
    }

    handlePreviewAction(action) {
        if (action === 'add-to-dashboard') {
            this.addUserMessage('Add to dashboard');
            this.addChartToDashboard('revenue-by-category');

            setTimeout(() => {
                this.showTypingIndicator();
                setTimeout(() => {
                    this.hideTypingIndicator();
                    this.conversationState = 'comparison-suggestion';
                    this.addAssistantMessage(
                        `✓ Chart added successfully!

I've placed it in your Financial section. The chart will auto-update with new revenue data monthly.

[Chart widget appears on dashboard with smooth animation]

Would you like me to create another chart to compare this data?`,
                        [
                            { label: '📊 Yes, show actual vs targets', value: 'comparison-yes' },
                            { label: '❌ No, thanks', value: 'comparison-no' }
                        ]
                    );
                }, 1200);
            }, 500);
        }
    }

    addChartToDashboard(chartType) {
        if (chartType === 'revenue-by-category') {
            // Create a custom chart widget
            this.dashboard.widgetManager.addCustomChartWidget({
                title: 'Monthly Revenue by Category',
                chartType: 'stacked-bar',
                data: this.getRevenueByCategory(),
                icon: 'bar-chart-2'
            });
        } else if (chartType === 'actual-vs-target') {
            this.dashboard.widgetManager.addCustomChartWidget({
                title: 'Actual vs Target Revenue',
                chartType: 'grouped-bar',
                data: this.getActualVsTarget(),
                icon: 'target'
            });
        }
    }

    getRevenueByCategory() {
        return {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Cabinets',
                    data: [280, 310, 295, 320, 340, 350],
                    backgroundColor: 'rgba(124, 140, 251, 0.8)',
                },
                {
                    label: 'Hardware',
                    data: [75, 82, 78, 85, 88, 92],
                    backgroundColor: 'rgba(78, 205, 196, 0.8)',
                },
                {
                    label: 'Services',
                    data: [95, 105, 112, 125, 140, 155],
                    backgroundColor: 'rgba(255, 107, 107, 0.8)',
                },
                {
                    label: 'Custom Work',
                    data: [60, 65, 58, 70, 72, 75],
                    backgroundColor: 'rgba(255, 195, 18, 0.8)',
                }
            ]
        };
    }

    getActualVsTarget() {
        return {
            labels: ['Cabinets', 'Hardware', 'Services', 'Custom Work'],
            datasets: [
                {
                    label: 'Actual Revenue',
                    data: [450, 125, 180, 95],
                    backgroundColor: 'rgba(124, 140, 251, 0.8)',
                    borderColor: 'rgba(124, 140, 251, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Target Revenue',
                    data: [420, 150, 165, 110],
                    backgroundColor: 'rgba(200, 200, 200, 0.3)',
                    borderColor: 'rgba(150, 150, 150, 1)',
                    borderWidth: 2,
                    borderDash: [5, 5]
                }
            ]
        };
    }

    processUserInput(text) {
        const lowerText = text.toLowerCase();

        if (this.conversationState === 'comparison-suggestion') {
            if (lowerText.includes('yes') || lowerText.includes('actual') || lowerText.includes('target')) {
                this.handleComparisonRequest();
            }
        }
    }

    handleComparisonRequest() {
        this.addUserMessage('Now show me actual revenue vs our targets for each product');
        this.conversationState = 'comparison-type';

        setTimeout(() => {
            this.showThinkingIndicator();
            setTimeout(() => {
                this.hideThinkingIndicator();
                this.addAssistantMessage(
                    `Excellent idea! Performance vs targets is crucial. Let me create a comparison chart for you.

**Data Sources:**
✓ Actual revenue (from your existing data)
✓ Revenue targets (from Strategic Goals widget)
✓ Product categories: Cabinets, Hardware, Services, Custom Work

**Chart Type for Comparison:**
I recommend Grouped Bars for clear visual comparison. Proceed?`,
                    [
                        { label: '✅ Yes, grouped bars', value: 'grouped-bar' },
                        { label: '📊 Show other options', value: 'other-options' }
                    ]
                );
            }, 1800);
        }, 500);
    }

    handleComparisonType(option) {
        if (option === 'grouped-bar') {
            this.addUserMessage('Yes, grouped bars');
            this.conversationState = 'comparison-preview';

            setTimeout(() => {
                this.showTypingIndicator();
                setTimeout(() => {
                    this.hideTypingIndicator();
                    this.showComparisonPreview();
                }, 1500);
            }, 500);
        }
    }

    showComparisonPreview() {
        const previewHTML = `
            <div class="ai-chart-preview">
                <div class="chart-preview-container">
                    <canvas id="ai-preview-chart-2"></canvas>
                </div>
            </div>
        `;

        this.addAssistantMessage(
            `Creating your performance comparison chart...

**Configuration:**
- X-axis: Product categories
- Y-axis: Revenue ($K)
- **Blue bars:** Actual revenue
- **Gray bars (outlined):** Target revenue
- **Labels:** Show variance percentage above bars

${previewHTML}

📊 **Actual vs Target Revenue by Product**

**Performance Summary:**
✅ Cabinets: $450K actual vs $420K target (+7% 🎯)
✅ Services: $180K actual vs $165K target (+9% 🎯)
⚠️ Hardware: $125K actual vs $150K target (-17% ⚠️)
⚠️ Custom Work: $95K actual vs $110K target (-14% ⚠️)

**Key Insights:**
- 2 categories exceeding targets (50%)
- Hardware underperforming by $25K
- Overall: 98% of total targets achieved

**Recommendations:**
💡 Investigate hardware sales decline
💡 Boost marketing for custom work
💡 Leverage strong cabinet performance

Would you like to:`,
            [
                { label: '✅ Add to dashboard', value: 'add-comparison' },
                { label: '📊 Add drill-down details', value: 'drill-down' },
                { label: '📧 Share with sales team', value: 'share' },
                { label: '🔔 Set alert for underperformers', value: 'alert' }
            ]
        );

        setTimeout(() => this.renderComparisonChart('ai-preview-chart-2'), 100);
    }

    renderComparisonChart(canvasId) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        const data = this.getActualVsTarget();

        new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    },
                    title: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        stacked: false,
                    },
                    y: {
                        stacked: false,
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value + 'K';
                            }
                        }
                    }
                }
            }
        });
    }

    handleComparisonAction(action) {
        if (action === 'add-comparison') {
            this.addUserMessage('Add to dashboard');
            this.addChartToDashboard('actual-vs-target');

            setTimeout(() => {
                this.showTypingIndicator();
                setTimeout(() => {
                    this.hideTypingIndicator();
                    this.addAssistantMessage(
                        `✓ Comparison chart added!

Both charts are now on your dashboard and will update automatically:
- Monthly Revenue by Category (tracks distribution)
- Actual vs Target Revenue (monitors performance)

**Pro Tip:** Click any bar in either chart to see detailed breakdown, or click the widget gear icon to customize update frequency.

Is there anything else you'd like me to analyze or create?`
                    );
                    this.conversationState = 'complete';
                }, 1200);
            }, 500);
        }
    }

    addUserMessage(text) {
        const messagesContainer = document.getElementById('ai-chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'ai-message user-message';
        messageDiv.innerHTML = `
            <div class="message-content">${this.escapeHtml(text)}</div>
        `;
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addAssistantMessage(text, options = null) {
        const messagesContainer = document.getElementById('ai-chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'ai-message assistant-message';

        let optionsHTML = '';
        if (options) {
            optionsHTML = '<div class="ai-options">' +
                options.map(opt =>
                    `<button class="ai-option-btn" data-option="${opt.value}">${opt.label}</button>`
                ).join('') +
                '</div>';
        }

        messageDiv.innerHTML = `
            <div class="message-avatar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg>
            </div>
            <div class="message-content">${this.formatMessage(text)}${optionsHTML}</div>
        `;
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();

        setTimeout(() => IconHelper.createIcons(), 100);
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('ai-chat-messages');
        const indicator = document.createElement('div');
        indicator.className = 'ai-message assistant-message typing-indicator';
        indicator.id = 'typing-indicator';
        indicator.innerHTML = `
            <div class="message-avatar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg>
            </div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(indicator);
        this.scrollToBottom();
    }

    showThinkingIndicator() {
        const messagesContainer = document.getElementById('ai-chat-messages');
        const indicator = document.createElement('div');
        indicator.className = 'ai-message assistant-message thinking-indicator';
        indicator.id = 'typing-indicator';
        indicator.innerHTML = `
            <div class="message-avatar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg>
            </div>
            <div class="message-content">
                <div class="thinking-animation">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                    </svg>
                    <span>Thinking...</span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(indicator);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }

    hideThinkingIndicator() {
        this.hideTypingIndicator();
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('ai-chat-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    formatMessage(text) {
        // Convert markdown-style formatting
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    loadConversationScript() {
        // Pre-scripted conversation is handled by state machine above
    }

    showAnalysis() {
        setTimeout(() => {
            this.showTypingIndicator();
            setTimeout(() => {
                this.hideTypingIndicator();
                this.addAssistantMessage(
                    `I've analyzed your current dashboard. Here's what I found:

📊 **Financial Health:**
- Cash runway: 42 days (⚠️ needs attention)
- Revenue trending up +12%
- AR collection needed: $120K

⚙️ **Operations:**
- Team at 112% capacity
- Delivery delays: 7 days vs 5 target
- Order #4782 blocking pipeline

📈 **Sales Performance:**
- 2/4 categories exceeding targets
- Top customer: TechCorp ($180K)
- Pipeline value: $450K

💡 **Recommended Actions:**
1. Address Order #4782 urgently
2. Hire temporary production help
3. Accelerate AR collections
4. Review hardware sales strategy

Would you like me to create charts for any of these areas?`
                );
            }, 2000);
        }, 500);
    }
}

// Make it globally available
window.AIAssistant = AIAssistant;
