import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus, TrendingUp, Wallet, Sparkles } from "lucide-react";
import { initialAccounts, initialTransactions } from "@/data/accounts.js";
import { convertCurrency, formatCurrency } from "@/utils/currency.js";
import AccountCard from "@/components/AccountCard.jsx";
import TransferForm from "@/components/TransferForm.jsx";
import TransactionLog from "@/components/TransactionLogs.jsx";
import Dashboard from "@/components/Dashboard.jsx";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function App() {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showTransferForm, setShowTransferForm] = useState(false);

  const handleTransfer = (transferData) => {
    const { fromAccount, toAccount, amount, note, fromCurrency, toCurrency } =
      transferData;

    // Calculate conversion if needed
    const { convertedAmount, fxRate } = convertCurrency(
      amount,
      fromCurrency,
      toCurrency,
    );

    // Get account names for better messaging
    const fromAccountData = accounts.find((acc) => acc.id === fromAccount);
    const toAccountData = accounts.find((acc) => acc.id === toAccount);

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
    };

    // Update account balances
    setAccounts((prevAccounts) =>
      prevAccounts.map((account) => {
        if (account.id === fromAccount) {
          return { ...account, balance: account.balance - amount };
        }
        if (account.id === toAccount) {
          return { ...account, balance: account.balance + convertedAmount };
        }
        return account;
      }),
    );

    // Add transaction to history
    setTransactions((prevTransactions) => [
      newTransaction,
      ...prevTransactions,
    ]);

    // Show detailed success toast
    const conversionText =
      fxRate !== 1
        ? ` (converted to ${formatCurrency(convertedAmount, toCurrency)})`
        : "";

    toast.success(
      `Transfer Successful!\n${formatCurrency(amount, fromCurrency)}${conversionText}\nFrom: ${fromAccountData.name}\nTo: ${toAccountData.name}`,
      {
        duration: 6000,
        style: {
          background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
          color: "white",
          fontWeight: "500",
          whiteSpace: "pre-line",
          borderRadius: "16px",
          boxShadow: "0 20px 40px rgba(16, 185, 129, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        },
        icon: "💰",
      },
    );

    // Reset form state
    setShowTransferForm(false);
    setSelectedAccount(null);
  };

  const handleAccountClick = (account) => {
    setSelectedAccount(account);
    setShowTransferForm(true);
    toast(`Selected ${account.name} for transfer`, {
      icon: "👆",
      duration: 2000,
      style: {
        background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
        color: "white",
        borderRadius: "16px",
        boxShadow: "0 15px 30px rgba(59, 130, 246, 0.4)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
      },
    });
  };

  const refreshData = () => {
    setAccounts([...accounts]);
    setTransactions([...transactions]);
    toast.success("Data refreshed successfully", {
      style: {
        background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
        color: "white",
        borderRadius: "16px",
        boxShadow: "0 15px 30px rgba(139, 92, 246, 0.4)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 relative z-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8 lg:mb-12"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl sm:rounded-3xl shadow-2xl shadow-blue-500/30 pulse-glow">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-2xl font-bold gradient-text mb-2">
                  Treasury Management
                </h1>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <p className="text-slate-600 text-sm sm:text-base lg:text-lg font-medium">
                    Streamline your multi-currency operations
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 sm:gap-4">
              <Button
                variant="outline"
                onClick={refreshData}
                className="flex-1 sm:flex-none glass-effect hover:shadow-xl transition-all duration-300 h-12 sm:h-14 px-6 font-semibold"
              >
                <RefreshCw className="h-3 w-3 sm:mr-2" />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button
                onClick={() => setShowTransferForm(true)}
                className="flex-1 sm:flex-none professional-button text-white font-semibold h-12 sm:h-14 px-6"
              >
                <Plus className="h-3 w-3 sm:mr-2" />
                <span className="hidden sm:inline">New Transfer</span>
                <span className="sm:hidden">Transfer</span>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Tabs */}
        <Tabs
          defaultValue="dashboard"
          className="space-y-4 sm:space-y-6 lg:space-y-8"
        >
          <TabsList className="grid w-full grid-cols-4 glass-effect p-2 rounded-2xl sm:rounded-3xl h-14 sm:h-16">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-blue-700 data-[state=active]:to-indigo-700 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-blue-500/30 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 text-sm sm:text-base"
            >
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">Home</span>
            </TabsTrigger>
            <TabsTrigger
              value="accounts"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-blue-700 data-[state=active]:to-indigo-700 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-blue-500/30 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 text-sm sm:text-base"
            >
              Accounts
            </TabsTrigger>
            <TabsTrigger
              value="transfer"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-blue-700 data-[state=active]:to-indigo-700 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-blue-500/30 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 text-sm sm:text-base"
            >
              Transfer
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-blue-700 data-[state=active]:to-indigo-700 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-blue-500/30 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 text-sm sm:text-base"
            >
              <span className="hidden sm:inline">Transactions</span>
              <span className="sm:hidden">History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="fade-in-up">
            <Dashboard accounts={accounts} transactions={transactions} />
          </TabsContent>

          <TabsContent value="accounts" className="fade-in-up">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="professional-card">
                <CardHeader className="p-6 sm:p-8">
                  <CardTitle className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl shadow-xl shadow-blue-500/30">
                      <Wallet className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold gradient-text">
                        Account Overview
                      </h2>
                      <p className="text-slate-600 text-sm sm:text-base font-medium">
                        Manage your multi-currency accounts
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 sm:p-8 pt-0">
                  <div className="space-y-4">
                    <AnimatePresence>
                      {accounts.map((account, index) => (
                        <motion.div
                          key={account.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: index * 0.1,
                            type: "spring",
                            stiffness: 100,
                          }}
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

                  {/* Enhanced Summary Stats */}
                  <div className="mt-8 pt-8 border-t border-slate-200">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                      <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="text-2xl sm:text-3xl font-bold gradient-text">
                          {accounts.length}
                        </div>
                        <div className="text-xs sm:text-sm text-slate-600 font-medium">
                          Total Accounts
                        </div>
                      </div>
                      <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="text-2xl sm:text-3xl font-bold text-blue-900">
                          {
                            accounts.filter((acc) => acc.currency === "USD")
                              .length
                          }
                        </div>
                        <div className="text-xs sm:text-sm text-blue-600 font-medium">
                          USD Accounts
                        </div>
                      </div>
                      <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-green-50 via-green-100 to-green-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="text-2xl sm:text-3xl font-bold text-green-900">
                          {
                            accounts.filter((acc) => acc.currency === "KES")
                              .length
                          }
                        </div>
                        <div className="text-xs sm:text-sm text-green-600 font-medium">
                          KES Accounts
                        </div>
                      </div>
                      <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="text-2xl sm:text-3xl font-bold text-purple-900">
                          {
                            accounts.filter((acc) => acc.currency === "NGN")
                              .length
                          }
                        </div>
                        <div className="text-xs sm:text-sm text-purple-600 font-medium">
                          NGN Accounts
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="transfer" className="fade-in-up">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <TransferForm
                accounts={accounts}
                onTransfer={handleTransfer}
                selectedFromAccount={selectedAccount}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="transactions" className="fade-in-up">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <TransactionLog transactions={transactions} accounts={accounts} />
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Enhanced Transfer Modal */}
        <AnimatePresence>
          {showTransferForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-6 z-50"
              onClick={() => {
                setShowTransferForm(false);
                setSelectedAccount(null);
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: "100%" }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: "100%" }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                className="w-full sm:max-w-4xl sm:w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl"
                onClick={(e) => e.stopPropagation()}
              >
                <TransferForm
                  accounts={accounts}
                  onTransfer={handleTransfer}
                  selectedFromAccount={selectedAccount}
                  onClose={() => {
                    setShowTransferForm(false);
                    setSelectedAccount(null);
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Enhanced Toast Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "16px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          },
        }}
      />
    </div>
  );
}

export default App;
