export function getCurrencySymbol(currencyCode) {
    const currencySymbols = {
        USD: "$",   // US Dollar
        EUR: "€",   // Euro
        GBP: "£",   // British Pound
        INR: "₹",   // Indian Rupee
        JPY: "¥",   // Japanese Yen
        CNY: "¥",   // Chinese Yuan
        AUD: "A$",  // Australian Dollar
        CAD: "C$",  // Canadian Dollar
        CHF: "CHF", // Swiss Franc
        NZD: "NZ$", // New Zealand Dollar
        SEK: "kr",  // Swedish Krona
        NOK: "kr",  // Norwegian Krone
        DKK: "kr",  // Danish Krone
        RUB: "₽",   // Russian Ruble
        ZAR: "R",   // South African Rand
        SAR: "﷼",  // Saudi Riyal
        AED: "د.إ",  // UAE Dirham
        PKR: "₨",   // Pakistani Rupee
        THB: "฿",   // Thai Baht
        SGD: "S$",  // Singapore Dollar
        MYR: "RM",  // Malaysian Ringgit
        HKD: "HK$", // Hong Kong Dollar
    };

    return currencySymbols[currencyCode.toUpperCase()] || currencyCode.toUpperCase();
}

