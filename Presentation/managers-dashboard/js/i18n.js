// Internationalization (i18n) Module
// Supports English and Farsi (Persian) languages

export class i18n {
    constructor() {
        this.currentLanguage = localStorage.getItem('dashboard-language') || 'en';
        this.translations = {
            en: {
                // General UI
                'language': 'Language',
                'english': 'English',
                'farsi': 'فارسی',
                'dashboard': 'Manager Dashboard',
                'loading': 'Loading...',
                'save': 'Save',
                'cancel': 'Cancel',
                'close': 'Close',
                'delete': 'Delete',
                'edit': 'Edit',
                'add': 'Add',
                'refresh': 'Refresh',
                'customize': 'Customize',
                'remove': 'Remove',
                'today': 'Today',
                'week': 'This Week',
                'month': 'This Month',
                'all': 'All',

                // Panels
                'show-alerts': 'Show Alerts',
                'show-widgets': 'Show Widget Library',
                'alerts-panel': 'Alerts & Notifications',
                'widgets-panel': 'Available Widgets',
                'no-alerts': 'No new alerts',

                // Widget Categories
                'financial': 'Financial',
                'operational': 'Operational',
                'sales': 'Sales & Marketing',
                'executive': 'Executive',
                'strategic': 'Strategic',

                // Widget Titles
                'cash-flow': 'Cash Flow & Runway',
                'revenue-target': 'Revenue vs Target',
                'profit-product': 'Profit by Product',
                'accounts-receivable': 'Accounts Receivable',
                'live-prices': 'Live Market Prices',
                'order-pipeline': 'Order Pipeline',
                'delivery-trends': 'Delivery Time Trends',
                'bottleneck-map': 'Bottleneck Heatmap',
                'team-capacity': 'Team Capacity',
                'customer-health': 'Customer Health Score',
                'sales-pipeline': 'Sales Pipeline',
                'top-customers': 'Top Customers',
                'team-scorecard': 'Team Performance',
                'overdue-tasks': 'Overdue Tasks',
                'strategic-goals': 'Strategic Goals Q4 2024',
                'task-manager': 'My Tasks',
                'project-manager': 'Active Projects',
                'todays-focus': "Today's Focus",
                'executive-summary': 'Executive Summary',
                'custom-chart': 'Custom Chart',

                // Financial Metrics
                'current-cash-balance': 'Current Cash Balance',
                'runway': 'Runway',
                'days': 'days',
                'monthly-revenue': 'Monthly Revenue',
                'target': 'Target',
                'on-track': 'On Track',
                'behind': 'Behind',
                'total-ar': 'Total AR',
                'overdue': 'Overdue',
                'from-last-month': 'from last month',

                // Market Prices
                'gold-oz': 'Gold (oz)',
                'usd-to-irr': 'USD to IRR',
                '24h': '24h',

                // Pipeline & Status
                'on-track-status': 'On Track',
                'at-risk': 'At Risk',
                'overdue-status': 'Overdue',
                'blocked': 'Blocked',
                'active': 'Active',
                'pending': 'Pending',
                'completed': 'Completed',
                'in-progress': 'In Progress',
                'behind-schedule': 'Behind Schedule',

                // Delivery
                'average-delivery-time': 'Average Delivery Time',

                // Team
                'utilization': 'Utilization',
                'tasks': 'Tasks',
                'rating': 'Rating',
                'status': 'Status',
                'needs-support': 'Needs Support',

                // Customer
                'customer': 'Customer',
                'revenue': 'Revenue',
                'happy': 'Happy',
                'neutral': 'Neutral',
                'unhappy': 'Unhappy',

                // Projects
                'progress': 'Progress',
                'checkpoints': 'Checkpoints',

                // Tasks
                'no-tasks': 'No tasks yet. Create one below!',
                'add-task': 'Add Task',
                'filter-all': 'All',
                'filter-today': 'Today',
                'filter-week': 'This Week',
                'due-today': 'Today',
                'due-tomorrow': 'Tomorrow',
                'due-yesterday': 'Yesterday',
                'days-ago': 'days ago',
                'in-days': 'In',
                'priority': 'Priority',
                'urgent': 'Urgent',
                'high': 'High',
                'medium': 'Medium',
                'low': 'Low',

                // Today's Focus
                'top-priorities': 'Top Priorities',
                'urgent-decisions': 'Urgent Decisions',
                'todays-meetings': "Today's Meetings",

                // Executive Summary
                'revenue-metric': 'Revenue',
                'delivery-metric': 'Delivery',
                'cash-metric': 'Cash',
                'team-metric': 'Team',
                'revenue-detail': 'On Track (85% of target)',
                'delivery-detail': 'Behind Target (+2 days)',
                'cash-detail': 'Warning (45 days runway)',
                'team-detail': 'Performing Well (4.6/5)',

                // Chart Labels
                'leads': 'Leads',
                'proposals': 'Proposals',
                'negotiation': 'Negotiation',
                'closing': 'Closing',
                'week': 'Week',
                'current': 'Current',
                'stage': 'Stage',
                'count': 'Count',

                // AI Assistant
                'ai-assistant': 'AI Assistant',
                'ai-greeting': 'Hello! I\'m your AI assistant. I can help you create custom charts and visualizations for your dashboard.',
                'ai-ask-help': 'What would you like to create?',
                'ai-option-chart': 'Create a custom chart',
                'ai-option-analysis': 'Analyze my data',
                'ai-option-insights': 'Show me insights',
                'ai-chart-type-question': 'I\'ll help you create a custom revenue chart. What type of chart would you like?',
                'ai-bar-chart': 'Bar Chart (compare categories)',
                'ai-stacked-bar': 'Stacked Bar (breakdown) ✓ Recommended',
                'ai-line-chart': 'Line Chart (trends over time)',
                'ai-pie-chart': 'Pie Chart (proportions)',
                'ai-thinking': 'Thinking...',
                'ai-creating-preview': 'Perfect! Let me create a preview for you...',
                'ai-preview-ready': 'Here\'s a preview of your Monthly Revenue by Category chart:',
                'ai-add-to-dashboard': 'Add to Dashboard',
                'ai-modify-chart': 'Modify Chart',
                'ai-chart-added': 'Great! I\'ve added the chart to your dashboard. Would you like to create another chart?',
                'ai-yes-another': 'Yes, create another chart',
                'ai-no-thanks': 'No, thank you',
                'ai-comparison-question': 'What would you like to compare?',
                'ai-actual-vs-target': 'Revenue: Actual vs Target ✓ Recommended',
                'ai-comparison-preview': 'Here\'s your Actual vs Target comparison chart:',
                'ai-all-done': 'Perfect! Both charts have been added to your dashboard. Is there anything else I can help you with?',
                'ai-type-message': 'Type a message...',

                // Months
                'january': 'January',
                'february': 'February',
                'march': 'March',
                'april': 'April',
                'may': 'May',
                'june': 'June',
                'july': 'July',
                'august': 'August',
                'september': 'September',
                'october': 'October',
                'november': 'November',
                'december': 'December',

                // Chart Titles (Custom)
                'monthly-revenue-by-category': 'Monthly Revenue by Category',
                'revenue-actual-vs-target': 'Revenue: Actual vs Target',

                // Categories
                'furniture': 'Custom Furniture',
                'tables': 'Standard Tables',
                'chairs': 'Chairs',
                'accessories': 'Accessories',
                'actual': 'Actual',
                'target-label': 'Target'
            },

            fa: {
                // General UI
                'language': 'زبان',
                'english': 'English',
                'farsi': 'فارسی',
                'dashboard': 'پیشخوان مدیریت',
                'loading': 'در حال بارگذاری...',
                'save': 'ذخیره',
                'cancel': 'لغو',
                'close': 'بستن',
                'delete': 'حذف',
                'edit': 'ویرایش',
                'add': 'افزودن',
                'refresh': 'بروزرسانی',
                'customize': 'سفارشی‌سازی',
                'remove': 'حذف',
                'today': 'امروز',
                'week': 'این هفته',
                'month': 'این ماه',
                'all': 'همه',

                // Panels
                'show-alerts': 'نمایش هشدارها',
                'show-widgets': 'نمایش کتابخانه ابزارک‌ها',
                'alerts-panel': 'هشدارها و اعلان‌ها',
                'widgets-panel': 'ابزارک‌های موجود',
                'no-alerts': 'هشدار جدیدی وجود ندارد',

                // Widget Categories
                'financial': 'مالی',
                'operational': 'عملیاتی',
                'sales': 'فروش و بازاریابی',
                'executive': 'مدیریت ارشد',
                'strategic': 'استراتژیک',

                // Widget Titles
                'cash-flow': 'جریان نقدی و مدت ماندگاری',
                'revenue-target': 'درآمد در مقابل هدف',
                'profit-product': 'سود به تفکیک محصول',
                'accounts-receivable': 'حساب‌های دریافتنی',
                'live-prices': 'قیمت‌های لحظه‌ای بازار',
                'order-pipeline': 'خط تولید سفارشات',
                'delivery-trends': 'روند زمان تحویل',
                'bottleneck-map': 'نقشه گلوگاه‌ها',
                'team-capacity': 'ظرفیت تیم',
                'customer-health': 'امتیاز سلامت مشتری',
                'sales-pipeline': 'قیف فروش',
                'top-customers': 'مشتریان برتر',
                'team-scorecard': 'عملکرد تیم',
                'overdue-tasks': 'وظایف عقب‌افتاده',
                'strategic-goals': 'اهداف استراتژیک فصل چهارم ۲۰۲۴',
                'task-manager': 'وظایف من',
                'project-manager': 'پروژه‌های فعال',
                'todays-focus': 'تمرکز امروز',
                'executive-summary': 'خلاصه مدیریتی',
                'custom-chart': 'نمودار سفارشی',

                // Financial Metrics
                'current-cash-balance': 'موجودی نقدی فعلی',
                'runway': 'مدت ماندگاری',
                'days': 'روز',
                'monthly-revenue': 'درآمد ماهانه',
                'target': 'هدف',
                'on-track': 'در مسیر',
                'behind': 'عقب‌تر از برنامه',
                'total-ar': 'مجموع حساب‌های دریافتنی',
                'overdue': 'سررسید گذشته',
                'from-last-month': 'نسبت به ماه گذشته',

                // Market Prices
                'gold-oz': 'طلا (اونس)',
                'usd-to-irr': 'دلار به ریال',
                '24h': '۲۴ ساعت',

                // Pipeline & Status
                'on-track-status': 'در مسیر',
                'at-risk': 'در معرض خطر',
                'overdue-status': 'سررسید گذشته',
                'blocked': 'مسدود',
                'active': 'فعال',
                'pending': 'در انتظار',
                'completed': 'تکمیل شده',
                'in-progress': 'در حال انجام',
                'behind-schedule': 'عقب‌تر از برنامه',

                // Delivery
                'average-delivery-time': 'میانگین زمان تحویل',

                // Team
                'utilization': 'بهره‌وری',
                'tasks': 'وظایف',
                'rating': 'امتیاز',
                'status': 'وضعیت',
                'needs-support': 'نیازمند پشتیبانی',

                // Customer
                'customer': 'مشتری',
                'revenue': 'درآمد',
                'happy': 'راضی (NPS ۹-۱۰)',
                'neutral': 'خنثی (NPS ۷-۸)',
                'unhappy': 'ناراضی (NPS ۰-۶)',

                // Projects
                'progress': 'پیشرفت',
                'checkpoints': 'نقاط بررسی',

                // Tasks
                'no-tasks': 'وظیفه‌ای وجود ندارد. یکی ایجاد کنید!',
                'add-task': 'افزودن وظیفه',
                'filter-all': 'همه',
                'filter-today': 'امروز',
                'filter-week': 'این هفته',
                'due-today': 'امروز',
                'due-tomorrow': 'فردا',
                'due-yesterday': 'دیروز',
                'days-ago': 'روز پیش',
                'in-days': 'تا',
                'priority': 'اولویت',
                'urgent': 'فوری',
                'high': 'بالا',
                'medium': 'متوسط',
                'low': 'پایین',

                // Today's Focus
                'top-priorities': 'اولویت‌های اصلی',
                'urgent-decisions': 'تصمیمات فوری',
                'todays-meetings': 'جلسات امروز',

                // Executive Summary
                'revenue-metric': 'درآمد',
                'delivery-metric': 'تحویل',
                'cash-metric': 'نقدینگی',
                'team-metric': 'تیم',
                'revenue-detail': 'در مسیر (۸۵٪ از هدف)',
                'delivery-detail': 'عقب‌تر از هدف (+۲ روز)',
                'cash-detail': 'هشدار (۴۵ روز ماندگاری)',
                'team-detail': 'عملکرد خوب (۴.۶/۵)',

                // Chart Labels
                'leads': 'سرنخ‌ها',
                'proposals': 'پیشنهادها',
                'negotiation': 'مذاکره',
                'closing': 'بستن قرارداد',
                'week': 'هفته',
                'current': 'فعلی',
                'stage': 'مرحله',
                'count': 'تعداد',

                // AI Assistant
                'ai-assistant': 'دستیار هوش مصنوعی',
                'ai-greeting': 'سلام! من دستیار هوش مصنوعی شما هستم. می‌توانم به شما در ایجاد نمودارها و تجسم‌های سفارشی برای پیشخوان کمک کنم.',
                'ai-ask-help': 'چه کاری می‌خواهید انجام دهید؟',
                'ai-option-chart': 'ایجاد نمودار سفارشی',
                'ai-option-analysis': 'تحلیل داده‌های من',
                'ai-option-insights': 'نمایش بینش‌ها',
                'ai-chart-type-question': 'به شما کمک می‌کنم نمودار درآمد سفارشی بسازید. چه نوع نموداری می‌خواهید؟',
                'ai-bar-chart': 'نمودار میله‌ای (مقایسه دسته‌بندی‌ها)',
                'ai-stacked-bar': 'میله‌ای تودرتو (تفکیک) ✓ توصیه می‌شود',
                'ai-line-chart': 'نمودار خطی (روند در طول زمان)',
                'ai-pie-chart': 'نمودار دایره‌ای (نسبت‌ها)',
                'ai-thinking': 'در حال فکر کردن...',
                'ai-creating-preview': 'عالی! اجازه دهید پیش‌نمایشی برای شما ایجاد کنم...',
                'ai-preview-ready': 'این پیش‌نمایش نمودار درآمد ماهانه به تفکیک دسته‌بندی است:',
                'ai-add-to-dashboard': 'افزودن به پیشخوان',
                'ai-modify-chart': 'ویرایش نمودار',
                'ai-chart-added': 'عالی! نمودار را به پیشخوان شما اضافه کردم. می‌خواهید نمودار دیگری ایجاد کنید؟',
                'ai-yes-another': 'بله، نمودار دیگری بساز',
                'ai-no-thanks': 'نه، ممنون',
                'ai-comparison-question': 'چه چیزی را می‌خواهید مقایسه کنید؟',
                'ai-actual-vs-target': 'درآمد: واقعی در مقابل هدف ✓ توصیه می‌شود',
                'ai-comparison-preview': 'این نمودار مقایسه واقعی در مقابل هدف شماست:',
                'ai-all-done': 'عالی! هر دو نمودار به پیشخوان شما اضافه شدند. آیا کار دیگری هست که بتوانم کمکتان کنم؟',
                'ai-type-message': 'پیام بنویسید...',

                // Months
                'january': 'ژانویه',
                'february': 'فوریه',
                'march': 'مارس',
                'april': 'آوریل',
                'may': 'می',
                'june': 'ژوئن',
                'july': 'ژوئیه',
                'august': 'اوت',
                'september': 'سپتامبر',
                'october': 'اکتبر',
                'november': 'نوامبر',
                'december': 'دسامبر',

                // Chart Titles (Custom)
                'monthly-revenue-by-category': 'درآمد ماهانه به تفکیک دسته‌بندی',
                'revenue-actual-vs-target': 'درآمد: واقعی در مقابل هدف',

                // Categories
                'furniture': 'مبلمان سفارشی',
                'tables': 'میزهای استاندارد',
                'chairs': 'صندلی‌ها',
                'accessories': 'لوازم جانبی',
                'actual': 'واقعی',
                'target-label': 'هدف'
            }
        };
    }

    t(key) {
        return this.translations[this.currentLanguage][key] || key;
    }

    setLanguage(lang) {
        if (lang !== 'en' && lang !== 'fa') {
            console.warn(`Unsupported language: ${lang}`);
            return;
        }

        this.currentLanguage = lang;
        localStorage.setItem('dashboard-language', lang);

        // Update HTML dir and lang attributes
        document.documentElement.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', lang === 'fa' ? 'fa' : 'en');

        // Dispatch language change event
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    }

    getLanguage() {
        return this.currentLanguage;
    }

    isRTL() {
        return this.currentLanguage === 'fa';
    }
}

// Create singleton instance
export const translator = new i18n();
