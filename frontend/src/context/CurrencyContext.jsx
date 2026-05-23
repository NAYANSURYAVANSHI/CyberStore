import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

const CURRENCIES = [
  { code: 'USD', symbol: '$', flag: '🇺🇸', name: 'US Dollar' },
  { code: 'INR', symbol: '₹', flag: '🇮🇳', name: 'Indian Rupee' },
  { code: 'EUR', symbol: '€', flag: '🇪🇺', name: 'Euro' },
  { code: 'GBP', symbol: '£', flag: '🇬🇧', name: 'British Pound' },
  { code: 'AED', symbol: 'د.إ', flag: '🇦🇪', name: 'UAE Dirham' },
  { code: 'CAD', symbol: 'CA$', flag: '🇨🇦', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', flag: '🇦🇺', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', flag: '🇯🇵', name: 'Japanese Yen' },
];

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    return CURRENCIES.find(c => c.code === (localStorage.getItem('currency') || 'USD')) || CURRENCIES[0];
  });
  const [rates, setRates] = useState({ USD: 1 });
  const [ratesLoading, setRatesLoading] = useState(true);

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      // Free, no-key-needed exchange rate API
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      const data = await res.json();
      if (data.rates) {
        setRates(data.rates);
      }
    } catch (err) {
      console.error('Failed to fetch exchange rates:', err);
      // Fallback approximate rates
      setRates({
        USD: 1, INR: 83.5, EUR: 0.92, GBP: 0.79,
        AED: 3.67, CAD: 1.36, AUD: 1.53, JPY: 149.5,
      });
    } finally {
      setRatesLoading(false);
    }
  };

  const changeCurrency = (currencyCode) => {
    const selected = CURRENCIES.find(c => c.code === currencyCode);
    if (selected) {
      setCurrency(selected);
      localStorage.setItem('currency', currencyCode);
    }
  };

  /**
   * Convert a USD price to the currently selected currency.
   * Returns a formatted string like "₹8,350.00"
   */
  const formatPrice = (usdPrice) => {
    if (usdPrice === undefined || usdPrice === null) return `${currency.symbol}0.00`;
    const converted = usdPrice * (rates[currency.code] || 1);

    // Use Intl for proper number formatting
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: currency.code === 'JPY' ? 0 : 2,
      maximumFractionDigits: currency.code === 'JPY' ? 0 : 2,
    }).format(converted);

    return `${currency.symbol}${formatted}`;
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      currencies: CURRENCIES,
      rates,
      ratesLoading,
      changeCurrency,
      formatPrice,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
