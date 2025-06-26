import { fxRates } from "../data/accounts.js"

export const formatCurrency = (amount, currency) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return formatter.format(amount)
}

export const convertCurrency = (amount, fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) {
    return { convertedAmount: amount, fxRate: 1 }
  }

  // Convert to USD first, then to target currency
  const amountInUSD = amount / fxRates[fromCurrency]
  const convertedAmount = amountInUSD * fxRates[toCurrency]
  const fxRate = fxRates[toCurrency] / fxRates[fromCurrency]

  return {
    convertedAmount: Math.round(convertedAmount * 100) / 100,
    fxRate: Math.round(fxRate * 10000) / 10000,
  }
}

export const getCurrencySymbol = (currency) => {
  const symbols = {
    USD: "$",
    KES: "KSh",
    NGN: "₦",
  }
  return symbols[currency] || currency
}
