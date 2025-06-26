export const initialAccounts = [
    { id: "mpesa_kes_1", name: "Mpesa_KES_1", currency: "KES", balance: 150000.0 },
    { id: "mpesa_kes_2", name: "Mpesa_KES_2", currency: "KES", balance: 75000.0 },
    { id: "bank_kes_1", name: "Bank_KES_1", currency: "KES", balance: 500000.0 },
    { id: "bank_usd_1", name: "Bank_USD_1", currency: "USD", balance: 25000.0 },
    { id: "bank_usd_2", name: "Bank_USD_2", currency: "USD", balance: 15000.0 },
    { id: "bank_usd_3", name: "Bank_USD_3", currency: "USD", balance: 8500.0 },
    { id: "wallet_ngn_1", name: "Wallet_NGN_1", currency: "NGN", balance: 2500000.0 },
    { id: "wallet_ngn_2", name: "Wallet_NGN_2", currency: "NGN", balance: 1800000.0 },
    { id: "mobile_ngn_1", name: "Mobile_NGN_1", currency: "NGN", balance: 950000.0 },
    { id: "reserve_usd_1", name: "Reserve_USD_1", currency: "USD", balance: 50000.0 },
  ]
  
  export const currencies = ["KES", "USD", "NGN"]
  
  // Static FX rates (base: USD)
  export const fxRates = {
    USD: 1,
    KES: 129.5, // 1 USD = 129.50 KES
    NGN: 1650.0, // 1 USD = 1650.00 NGN
  }
  
  export const initialTransactions = [
    {
      id: "tx_001",
      fromAccount: "bank_usd_1",
      toAccount: "mpesa_kes_1",
      fromCurrency: "USD",
      toCurrency: "KES",
      originalAmount: 1000,
      convertedAmount: 129500,
      fxRate: 129.5,
      note: "Initial funding for mobile payments",
      timestamp: new Date("2024-01-15T10:30:00"),
      status: "completed",
    },
    {
      id: "tx_002",
      fromAccount: "wallet_ngn_1",
      toAccount: "wallet_ngn_2",
      fromCurrency: "NGN",
      toCurrency: "NGN",
      originalAmount: 500000,
      convertedAmount: 500000,
      fxRate: 1,
      note: "Rebalancing between wallets",
      timestamp: new Date("2024-01-14T14:15:00"),
      status: "completed",
    },
  ]
  