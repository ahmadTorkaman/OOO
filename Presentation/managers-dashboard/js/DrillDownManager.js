// Drill Down Manager - Handles detailed views for widgets
export class DrillDownManager {
    constructor(dashboard) {
        this.dashboard = dashboard;
        this.setupPanel();
    }

    setupPanel() {
        // Create drill-down panel
        const panel = document.createElement('div');
        panel.id = 'drillDownPanel';
        panel.className = 'drill-down-panel';
        panel.style.display = 'none';
        panel.innerHTML = `
            <div class="drill-down-header">
                <h3 id="drillDownTitle">Details</h3>
                <button class="btn-close" id="closeDrillDown">×</button>
            </div>
            <div class="drill-down-body" id="drillDownBody">
                <!-- Content will be injected -->
            </div>
        `;
        document.body.appendChild(panel);

        // Event listeners
        document.getElementById('closeDrillDown').addEventListener('click', () => {
            this.hide();
        });

        // Close on outside click
        panel.addEventListener('click', (e) => {
            if (e.target === panel) {
                this.hide();
            }
        });
    }

    show(widgetId, widgetType, itemId = null) {
        const panel = document.getElementById('drillDownPanel');
        const title = document.getElementById('drillDownTitle');
        const body = document.getElementById('drillDownBody');

        const widgetConfig = this.dashboard.widgetManager.getWidgetConfig(widgetType);
        title.textContent = `${widgetConfig.title} - Details`;

        // Generate detailed content
        body.innerHTML = this.getDetailedView(widgetType, itemId);

        panel.style.display = 'flex';
        setTimeout(() => panel.classList.add('open'), 10);
    }

    hide() {
        const panel = document.getElementById('drillDownPanel');
        panel.classList.remove('open');
        setTimeout(() => {
            panel.style.display = 'none';
        }, 300);
    }

    getDetailedView(widgetType, itemId) {
        const views = {
            'cash-flow': () => `
                <div class="detail-section">
                    <h4>Cash Flow Breakdown</h4>
                    <table class="detail-table">
                        <thead>
                            <tr>
                                <th>Week</th>
                                <th>Inflow</th>
                                <th>Outflow</th>
                                <th>Net</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Week 1</td>
                                <td class="positive">$145,000</td>
                                <td class="negative">$100,000</td>
                                <td class="positive">$45,000</td>
                            </tr>
                            <tr>
                                <td>Week 2</td>
                                <td class="positive">$80,000</td>
                                <td class="negative">$200,000</td>
                                <td class="negative">-$120,000</td>
                            </tr>
                            <tr>
                                <td>Week 3</td>
                                <td class="positive">$180,000</td>
                                <td class="negative">$100,000</td>
                                <td class="positive">$80,000</td>
                            </tr>
                            <tr>
                                <td>Week 4</td>
                                <td class="positive">$120,000</td>
                                <td class="negative">$150,000</td>
                                <td class="negative">-$30,000</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="detail-section">
                    <h4>Upcoming Major Expenses</h4>
                    <ul class="detail-list">
                        <li>Payroll - $85,000 (in 5 days)</li>
                        <li>Supplier Payment - $45,000 (in 8 days)</li>
                        <li>Rent - $12,000 (in 12 days)</li>
                        <li>Equipment Lease - $8,500 (in 15 days)</li>
                    </ul>
                </div>
            `,
            'revenue-target': () => `
                <div class="detail-section">
                    <h4>Monthly Revenue Breakdown</h4>
                    <table class="detail-table">
                        <thead>
                            <tr>
                                <th>Product Line</th>
                                <th>Revenue</th>
                                <th>% of Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Custom Furniture</td>
                                <td>$850,000</td>
                                <td>50%</td>
                            </tr>
                            <tr>
                                <td>Standard Tables</td>
                                <td>$425,000</td>
                                <td>25%</td>
                            </tr>
                            <tr>
                                <td>Chairs</td>
                                <td>$255,000</td>
                                <td>15%</td>
                            </tr>
                            <tr>
                                <td>Accessories</td>
                                <td>$170,000</td>
                                <td>10%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="detail-section">
                    <h4>Projection to Target</h4>
                    <p>Current pace: <strong class="positive">$56,667/day</strong></p>
                    <p>Required pace: <strong>$60,000/day</strong></p>
                    <p>Days remaining: <strong>5 days</strong></p>
                    <p>Estimated shortfall: <strong class="negative">$16,665</strong></p>
                </div>
            `,
            'accounts-receivable': () => `
                <div class="detail-section">
                    <h4>Overdue Invoices (Priority Collection)</h4>
                    <table class="detail-table">
                        <thead>
                            <tr>
                                <th>Client</th>
                                <th>Invoice #</th>
                                <th>Amount</th>
                                <th>Days Overdue</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="urgent">
                                <td>Client B</td>
                                <td>#4782</td>
                                <td>$45,000</td>
                                <td>92 days</td>
                            </tr>
                            <tr class="urgent">
                                <td>Client E</td>
                                <td>#4801</td>
                                <td>$35,000</td>
                                <td>67 days</td>
                            </tr>
                            <tr class="warning">
                                <td>Client F</td>
                                <td>#4820</td>
                                <td>$28,000</td>
                                <td>45 days</td>
                            </tr>
                            <tr class="warning">
                                <td>Client A</td>
                                <td>#4835</td>
                                <td>$12,000</td>
                                <td>38 days</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="detail-section">
                    <h4>Collection Actions</h4>
                    <ul class="detail-list">
                        <li><strong>Immediate:</strong> Send final notice to Client B (#4782)</li>
                        <li><strong>This Week:</strong> Follow up call with Client E</li>
                        <li><strong>Monitor:</strong> 3 invoices approaching 30 days</li>
                    </ul>
                </div>
            `,
            'order-pipeline': () => `
                <div class="detail-section">
                    <h4>Orders by Status</h4>
                    <div class="status-grid">
                        <div class="status-card green">
                            <h5>On Track (45)</h5>
                            <ul class="detail-list compact">
                                <li>Order #5001 - Custom Desk Set (Ship in 3 days)</li>
                                <li>Order #5012 - Conference Table (Ship in 5 days)</li>
                                <li>Order #5023 - Office Chairs x50 (Ship in 7 days)</li>
                                <li>+ 42 more orders</li>
                            </ul>
                        </div>
                        <div class="status-card yellow">
                            <h5>At Risk (15)</h5>
                            <ul class="detail-list compact">
                                <li>Order #4987 - Delayed material delivery</li>
                                <li>Order #4992 - Design approval pending</li>
                                <li>Order #5005 - Production queue backup</li>
                                <li>+ 12 more orders</li>
                            </ul>
                        </div>
                        <div class="status-card red">
                            <h5>Overdue (8)</h5>
                            <ul class="detail-list compact">
                                <li>Order #4782 - 7 days overdue (Contact client)</li>
                                <li>Order #4801 - 5 days overdue (Quality issue)</li>
                                <li>Order #4820 - 3 days overdue (Shipping delay)</li>
                                <li>+ 5 more orders</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `,
            'delivery-trends': () => `
                <div class="detail-section">
                    <h4>Delivery Performance Analysis</h4>
                    <table class="detail-table">
                        <thead>
                            <tr>
                                <th>Period</th>
                                <th>Avg Days</th>
                                <th>Target</th>
                                <th>Variance</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>This Week</td>
                                <td>12</td>
                                <td>10</td>
                                <td class="negative">+2</td>
                            </tr>
                            <tr>
                                <td>Last Week</td>
                                <td>13</td>
                                <td>10</td>
                                <td class="negative">+3</td>
                            </tr>
                            <tr>
                                <td>2 Weeks Ago</td>
                                <td>11</td>
                                <td>10</td>
                                <td class="negative">+1</td>
                            </tr>
                            <tr>
                                <td>3 Weeks Ago</td>
                                <td>10</td>
                                <td>10</td>
                                <td class="positive">0</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="detail-section">
                    <h4>Bottleneck Analysis</h4>
                    <ul class="detail-list">
                        <li><strong>Approval Stage:</strong> Average 5 days (Target: 2 days)</li>
                        <li><strong>Production:</strong> Running at 112% capacity</li>
                        <li><strong>Recommendation:</strong> Hire 2 production staff or outsource</li>
                    </ul>
                </div>
            `,
            'team-scorecard': () => `
                <div class="detail-section">
                    <h4>Team Performance Details</h4>
                    <div class="team-detail-grid">
                        <div class="team-member-card">
                            <h5>Sarah - Designer</h5>
                            <p><strong>Rating:</strong> 4.8/5.0</p>
                            <p><strong>Active Tasks:</strong> 12</p>
                            <p><strong>Completed This Month:</strong> 48</p>
                            <p><strong>On-time Rate:</strong> 96%</p>
                            <p class="status-badge success">Top Performer</p>
                        </div>
                        <div class="team-member-card">
                            <h5>Mike - Designer</h5>
                            <p><strong>Rating:</strong> 4.9/5.0</p>
                            <p><strong>Active Tasks:</strong> 8</p>
                            <p><strong>Completed This Month:</strong> 52</p>
                            <p><strong>On-time Rate:</strong> 98%</p>
                            <p class="status-badge success">Top Performer</p>
                        </div>
                        <div class="team-member-card">
                            <h5>John - Designer</h5>
                            <p><strong>Rating:</strong> 3.2/5.0</p>
                            <p><strong>Active Tasks:</strong> 3</p>
                            <p><strong>Completed This Month:</strong> 18</p>
                            <p><strong>On-time Rate:</strong> 64%</p>
                            <p class="status-badge warning">Needs Support</p>
                        </div>
                        <div class="team-member-card">
                            <h5>Alex - Engineer</h5>
                            <p><strong>Rating:</strong> 4.1/5.0</p>
                            <p><strong>Active Tasks:</strong> 5</p>
                            <p><strong>Completed This Month:</strong> 32</p>
                            <p><strong>On-time Rate:</strong> 81%</p>
                            <p class="status-badge danger">Has Overdue Items</p>
                        </div>
                    </div>
                </div>
            `,
            'top-customers': () => `
                <div class="detail-section">
                    <h4>Top Customer Analysis</h4>
                    <div class="customer-detail-grid">
                        <div class="customer-card">
                            <h5>Client A</h5>
                            <p><strong>Total Revenue:</strong> $450,000</p>
                            <p><strong>Orders This Year:</strong> 24</p>
                            <p><strong>Avg Order Value:</strong> $18,750</p>
                            <p><strong>Last Order:</strong> 3 days ago</p>
                            <p><strong>Payment Terms:</strong> Net 30</p>
                            <p class="status-badge success">Active</p>
                        </div>
                        <div class="customer-card">
                            <h5>Client B</h5>
                            <p><strong>Total Revenue:</strong> $320,000</p>
                            <p><strong>Orders This Year:</strong> 18</p>
                            <p><strong>Avg Order Value:</strong> $17,778</p>
                            <p><strong>Last Order:</strong> 45 days ago</p>
                            <p><strong>Outstanding AR:</strong> $45,000 (92 days)</p>
                            <p class="status-badge warning">At Risk - Follow Up Needed</p>
                        </div>
                        <div class="customer-card">
                            <h5>Client C</h5>
                            <p><strong>Total Revenue:</strong> $280,000</p>
                            <p><strong>Orders This Year:</strong> 16</p>
                            <p><strong>Avg Order Value:</strong> $17,500</p>
                            <p><strong>Last Order:</strong> 12 days ago</p>
                            <p><strong>Payment Terms:</strong> Net 45</p>
                            <p class="status-badge success">Active</p>
                        </div>
                    </div>
                </div>
            `,
            'bottleneck-map': () => `
                <div class="detail-section">
                    <h4>Process Bottleneck Analysis</h4>
                    <div class="bottleneck-analysis">
                        <div class="process-detail">
                            <h5>🔴 Critical: Approval Stage</h5>
                            <p><strong>Average Time:</strong> 5 days</p>
                            <p><strong>Target:</strong> 2 days</p>
                            <p><strong>Impact:</strong> Delays 73% of projects</p>
                            <p><strong>Root Causes:</strong></p>
                            <ul>
                                <li>Single approver bottleneck (CEO only)</li>
                                <li>No clear escalation process</li>
                                <li>Approvals queued sequentially</li>
                            </ul>
                            <p><strong>Recommendations:</strong></p>
                            <ul>
                                <li>Delegate approval authority to managers</li>
                                <li>Implement parallel approval workflows</li>
                                <li>Set auto-approval thresholds for routine orders</li>
                            </ul>
                        </div>
                        <div class="process-detail">
                            <h5>🟢 Good: Design & QC</h5>
                            <p>These stages are performing well within targets.</p>
                        </div>
                    </div>
                </div>
            `,
            'strategic-goals': () => `
                <div class="detail-section">
                    <h4>Strategic Goals Progress</h4>
                    <div class="goals-detail">
                        <div class="goal-card">
                            <h5>Increase Revenue to $2M</h5>
                            <div class="progress-bar-container">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 85%"></div>
                                </div>
                            </div>
                            <p><strong>Progress:</strong> 85% ($1.7M / $2M)</p>
                            <p><strong>Time Left:</strong> 30 days</p>
                            <p><strong>Required Daily:</strong> $10,000/day</p>
                            <p><strong>Current Pace:</strong> $9,500/day</p>
                            <p class="status-badge warning">Slightly Behind - Push Needed</p>
                        </div>
                        <div class="goal-card">
                            <h5>Reduce Delivery Time to 10 Days</h5>
                            <div class="progress-bar-container">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 80%"></div>
                                </div>
                            </div>
                            <p><strong>Current Avg:</strong> 12 days</p>
                            <p><strong>Target:</strong> 10 days</p>
                            <p><strong>Gap:</strong> 2 days</p>
                            <p><strong>Action:</strong> See Bottleneck Analysis</p>
                            <p class="status-badge danger">Behind - Process Improvement Needed</p>
                        </div>
                    </div>
                </div>
            `,
            'overdue-tasks': () => `
                <div class="detail-section">
                    <h4>Overdue Tasks by Department</h4>
                    <div class="overdue-detail">
                        <div class="dept-card red">
                            <h5>Engineering (8 tasks)</h5>
                            <ul class="detail-list">
                                <li>CAD drawings for Order #5012 (5 days overdue)</li>
                                <li>Technical specifications review (4 days overdue)</li>
                                <li>Material sourcing analysis (3 days overdue)</li>
                                <li>+ 5 more tasks</li>
                            </ul>
                        </div>
                        <div class="dept-card red">
                            <h5>Admin (14 tasks)</h5>
                            <ul class="detail-list">
                                <li>Invoice processing (12 days overdue)</li>
                                <li>Client contract renewals (10 days overdue)</li>
                                <li>Expense report approvals (8 days overdue)</li>
                                <li>+ 11 more tasks</li>
                            </ul>
                            <p class="status-badge danger">Critical - Hire Admin Support</p>
                        </div>
                    </div>
                </div>
            `
        };

        const viewFn = views[widgetType];
        return viewFn ? viewFn() : '<p>No detailed information available.</p>';
    }
}
