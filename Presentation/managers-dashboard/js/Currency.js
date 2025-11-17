// Currency Module - Handles currency conversion between USD and IRR

export class Currency {
    constructor() {
        this.currentCurrency = localStorage.getItem('dashboard-currency') || 'USD';
        this.usdToIrrRate = 1125000; // Current exchange rate

        // Set initial data attribute for CSS styling
        document.documentElement.setAttribute('data-currency', this.currentCurrency);
    }

    getCurrency() {
        return this.currentCurrency;
    }

    setCurrency(currency) {
        if (currency !== 'USD' && currency !== 'IRR') {
            console.warn(`Unsupported currency: ${currency}`);
            return;
        }

        this.currentCurrency = currency;
        localStorage.setItem('dashboard-currency', currency);

        // Set data attribute for CSS styling
        document.documentElement.setAttribute('data-currency', currency);

        // Dispatch currency change event
        window.dispatchEvent(new CustomEvent('currencyChanged', { detail: { currency } }));
    }

    setExchangeRate(rate) {
        this.usdToIrrRate = rate;
    }

    getExchangeRate() {
        return this.usdToIrrRate;
    }

    format(amount, options = {}) {
        const { skipSymbol = false, decimals = null } = options;

        if (this.currentCurrency === 'USD') {
            const formatted = decimals !== null
                ? amount.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : amount.toLocaleString('en-US');
            return skipSymbol ? formatted : `$${formatted}`;
        } else {
            // Convert to IRR
            const irrAmount = amount * this.usdToIrrRate;
            const formatted = Math.round(irrAmount).toLocaleString('fa-IR');
            return skipSymbol ? formatted : `${formatted} ریال`;
        }
    }

    getSymbol() {
        return this.currentCurrency === 'USD' ? '$' : 'ریال';
    }

    // Format large numbers with K/M suffixes for compact display
    formatCompact(amount) {
        if (this.currentCurrency === 'USD') {
            if (amount >= 1000000) {
                return `$${(amount / 1000000).toFixed(1)}M`;
            } else if (amount >= 1000) {
                return `$${(amount / 1000).toFixed(0)}K`;
            }
            return `$${amount.toLocaleString()}`;
        } else {
            const irrAmount = amount * this.usdToIrrRate;
            if (irrAmount >= 1000000000) {
                return `${(irrAmount / 1000000000).toFixed(1)} میلیارد ریال`;
            } else if (irrAmount >= 1000000) {
                return `${Math.round(irrAmount / 1000000)} میلیون ریال`;
            }
            return `${Math.round(irrAmount).toLocaleString('fa-IR')} ریال`;
        }
    }
}

// Create singleton instance
export const currency = new Currency();
