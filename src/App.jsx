import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { RefreshCw, Plus, TrendingUp, Wallet } from "lucide-react"
import { initialAccounts, initialTransactions } from "@/data/accounts.js"
import { convertCurrency, formatCurrency } from "@/utils/currency.js"
import AccountCard from "@/components/AccountCard.jsx"
import TransferForm from "@/components/TransferForm.jsx"
import TransactionLog from "@/components/TransactionLogs.jsx"
import Dashboard from "@/components/Dashboard.jsx"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function App() {
  const [accounts, setAccounts] = useState(initialAccounts)
  const [transactions, setTransactions] = useState(initialTransactions)
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [showTransferForm, setShowTransferForm] = useState(false)

  const handleTransfer = (transferData) => {
    const { fromAccount, toAccount, amount, note, fromCurrency, toCurrency } = transferData

    // Calculate conversion if needed
    const { convertedAmount, fxRate } = convertCurrency(amount, fromCurrency, toCurrency)

    // Get account names for better messaging
    const fromAccountData = accounts.find((acc) => acc.id === fromAccount)
    const toAccountData = accounts.find((acc) => acc.id === toAccount)

    // Create transaction record
    const newTransaction = {
      id: `tx_${Date.now()}`,
      fromAccount,
      toAccount,
      fromCurrency,
      toCurrency,
      originalAmount: amount,
      convertedAmount,
      fxRate,
      note: note || "",
      timestamp: new Date(),
      status: "completed",
    }

    // Update account balances
    setAccounts((prevAccounts) =>
      prevAccounts.map((account) => {
        if (account.id === fromAccount) {
          return { ...account, balance: account.balance - amount }
        }
        if (account.id === toAccount) {
          return { ...account, balance: account.balance + convertedAmount }
        }
        return account
      }),
    )

    // Add transaction to history
    setTransactions((prevTransactions) => [newTransaction, ...prevTransactions])

    // Show detailed success toast
    const conversionText = fxRate !== 1 ? ` (converted to ${formatCurrency(convertedAmount, toCurrency)})` : ""

    toast.success(
      `Transfer Successful!\n${formatCurrency(amount, fromCurrency)}${conversionText}\nFrom: ${fromAccountData.name}\nTo: ${toAccountData.name}`,
      {
        duration: 6000,
        style: {
          background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
          color: "white",
          fontWeight: "500",
          whiteSpace: "pre-line",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)",
        },
        icon: "💰",
      },
    )

    // Reset form state
    setShowTransferForm(false)
    setSelectedAccount(null)
  }

  const handleAccountClick = (account) => {
    setSelectedAccount(account)
    setShowTransferForm(true)
    toast(`Selected ${account.name} for transfer`, {
      icon: "👆",
      duration: 2000,
      style: {
        background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
        color: "white",
        borderRadius: "12px",
        boxShadow: "0 8px 20px rgba(59, 130, 246, 0.3)",
      },
    })
  }

  const refreshData = () => {
    setAccounts([...accounts])
    setTransactions([...transactions])
    toast.success("Data refreshed successfully", {
      style: {
        background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
        color: "white",
        borderRadius: "12px",
        boxShadow: "0 8px 20px rgba(139, 92, 246, 0.3)",
      },
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Mobile-Optimized Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8 lg:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl sm:rounded-2xl shadow-lg shadow-blue-500/25">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Treasury Management
                </h1>
                <p className="text-slate-600 mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg">
                  Streamline your multi-currency operations
                </p>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <Button
                variant="outline"
                onClick={refreshData}
                className="flex-1 sm:flex-none bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 h-10 sm:h-auto"
              >
                <RefreshCw className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button
                onClick={() => setShowTransferForm(true)}
                className="flex-1 sm:flex-none professional-button border-0 text-white font-medium h-10 sm:h-auto"
              >
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">New Transfer</span>
                <span className="sm:hidden">Transfer</span>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Mobile-Optimized Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-4 sm:space-y-6 lg:space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm shadow-lg border-0 p-1 rounded-xl sm:rounded-2xl h-12 sm:h-auto">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg sm:rounded-xl font-medium transition-all duration-200 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">Home</span>
            </TabsTrigger>
            <TabsTrigger
              value="accounts"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg sm:rounded-xl font-medium transition-all duration-200 text-xs sm:text-sm"
            >
              Accounts
            </TabsTrigger>
            <TabsTrigger
              value="transfer"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg sm:rounded-xl font-medium transition-all duration-200 text-xs sm:text-sm"
            >
              Transfer
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg sm:rounded-xl font-medium transition-all duration-200 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Transactions</span>
              <span className="sm:hidden">History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard accounts={accounts} transactions={transactions} />
          </TabsContent>

          <TabsContent value="accounts">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="professional-card border-0">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                      <Wallet className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Account Overview</h2>
                      <p className="text-slate-600 text-sm">Manage your multi-currency accounts</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="space-y-3">
                    <AnimatePresence>
                      {accounts.map((account, index) => (
                        <motion.div
                          key={account.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
                        >
                          <AccountCard
                            account={account}
                            onClick={handleAccountClick}
                            isSelected={selectedAccount?.id === account.id}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Summary Stats */}
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
                        <div className="text-2xl font-bold text-slate-900">{accounts.length}</div>
                        <div className="text-xs text-slate-600">Total Accounts</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                        <div className="text-2xl font-bold text-blue-900">
                          {accounts.filter((acc) => acc.currency === "USD").length}
                        </div>
                        <div className="text-xs text-blue-600">USD Accounts</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                        <div className="text-2xl font-bold text-green-900">
                          {accounts.filter((acc) => acc.currency === "KES").length}
                        </div>
                        <div className="text-xs text-green-600">KES Accounts</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                        <div className="text-2xl font-bold text-purple-900">
                          {accounts.filter((acc) => acc.currency === "NGN").length}
                        </div>
                        <div className="text-xs text-purple-600">NGN Accounts</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="transfer">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
              <TransferForm accounts={accounts} onTransfer={handleTransfer} selectedFromAccount={selectedAccount} />
            </motion.div>
          </TabsContent>

          <TabsContent value="transactions">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <TransactionLog transactions={transactions} accounts={accounts} />
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Mobile-Optimized Transfer Modal */}
        <AnimatePresence>
          {showTransferForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-6 z-50"
              onClick={() => {
                setShowTransferForm(false)
                setSelectedAccount(null)
              }}
            >
              <motion.div
                initial={{ scale: 1, opacity: 0, y: "100%" }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 1, opacity: 0, y: "100%" }}
                transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
                className="w-full sm:max-w-3xl sm:w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <TransferForm
                  accounts={accounts}
                  onTransfer={handleTransfer}
                  selectedFromAccount={selectedAccount}
                  onClose={() => {
                    setShowTransferForm(false)
                    setSelectedAccount(null)
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App;