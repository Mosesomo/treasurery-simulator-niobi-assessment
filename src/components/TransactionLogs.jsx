import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  Building2,
  Smartphone,
  Wallet,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { formatCurrency } from "../utils/currency.js"
import { motion, AnimatePresence } from "framer-motion"

const getAccountIcon = (accountName) => {
  if (accountName.toLowerCase().includes("mpesa") || accountName.toLowerCase().includes("mobile")) {
    return <Smartphone className="h-3 w-3 sm:h-4 sm:w-4" />
  }
  if (accountName.toLowerCase().includes("bank") || accountName.toLowerCase().includes("reserve")) {
    return <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
  }
  return <Wallet className="h-3 w-3 sm:h-4 sm:w-4" />
}

const getStatusIcon = (status) => {
  switch (status.toLowerCase()) {
    case "completed":
      return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
    case "pending":
      return <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
    case "failed":
      return <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
    default:
      return <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
  }
}

const getStatusBadge = (status) => {
  const statusConfig = {
    completed: "bg-gradient-to-r from-green-500 to-green-600 text-white",
    pending: "bg-gradient-to-r from-orange-500 to-orange-600 text-white",
    failed: "bg-gradient-to-r from-red-500 to-red-600 text-white",
    processing: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
  }

  return statusConfig[status.toLowerCase()] || "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
}

const getCurrencyGradient = (currency) => {
  const gradients = {
    USD: "from-emerald-500 to-emerald-600",
    KES: "from-blue-500 to-blue-600",
    NGN: "from-purple-500 to-purple-600",
  }
  return gradients[currency] || "from-gray-500 to-gray-600"
}

export default function TransactionLog({ transactions, accounts }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currencyFilter, setCurrencyFilter] = useState("all")
  const [accountFilter, setAccountFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const getAccountName = (accountId) => {
    const account = accounts.find((acc) => acc.id === accountId)
    return account ? account.name : accountId
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getAccountName(transaction.fromAccount).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getAccountName(transaction.toAccount).toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCurrency =
      currencyFilter === "all" ||
      transaction.fromCurrency === currencyFilter ||
      transaction.toCurrency === currencyFilter

    const matchesAccount =
      accountFilter === "all" || transaction.fromAccount === accountFilter || transaction.toAccount === accountFilter

    const matchesStatus = statusFilter === "all" || transaction.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesCurrency && matchesAccount && matchesStatus
  })

  const clearFilters = () => {
    setSearchTerm("")
    setCurrencyFilter("all")
    setAccountFilter("all")
    setStatusFilter("all")
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Mobile-optimized Header with Stats */}
      <Card className="professional-card border-0">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Transaction History</h2>
                <p className="text-slate-600 text-xs sm:text-sm">Complete audit trail of all transfers</p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
              <div className="text-center sm:text-right">
                <div className="text-xl sm:text-2xl font-bold text-slate-900">{filteredTransactions.length}</div>
                <div className="text-xs sm:text-sm text-slate-600">Transactions</div>
              </div>
              
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Mobile-optimized Filters */}
      <Card className="professional-card border-0">
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            {/* Search - Full width on mobile */}
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search transactions, accounts, or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 sm:pl-12 h-11 sm:h-12 border-0 bg-white shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200 rounded-xl text-sm sm:text-base"
              />
            </div>

            {/* Filters - Stacked on mobile, grid on larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {/* Currency Filter */}
              <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
                <SelectTrigger className="h-11 sm:h-12 border-0 bg-white shadow-sm hover:shadow-md transition-all duration-200 rounded-xl text-sm sm:text-base">
                  <SelectValue placeholder="All Currencies" />
                </SelectTrigger>
                <SelectContent className="border-0 shadow-xl rounded-xl bg-white max-h-60">
                  <SelectItem value="all" className="rounded-lg hover:bg-slate-50">
                    All Currencies
                  </SelectItem>
                  <SelectItem value="USD" className="rounded-lg hover:bg-slate-50">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"></div>
                      USD
                    </div>
                  </SelectItem>
                  <SelectItem value="KES" className="rounded-lg hover:bg-slate-50">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                      KES
                    </div>
                  </SelectItem>
                  <SelectItem value="NGN" className="rounded-lg hover:bg-slate-50">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"></div>
                      NGN
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Account Filter */}
              <Select value={accountFilter} onValueChange={setAccountFilter}>
                <SelectTrigger className="h-11 sm:h-12 border-0 bg-white shadow-sm hover:shadow-md transition-all duration-200 rounded-xl text-sm sm:text-base">
                  <SelectValue placeholder="All Accounts" />
                </SelectTrigger>
                <SelectContent className="border-0 shadow-xl rounded-xl bg-white max-h-60">
                  <SelectItem value="all" className="rounded-lg hover:bg-slate-50">
                    All Accounts
                  </SelectItem>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id} className="rounded-lg hover:bg-slate-50">
                      <div className="flex items-center gap-2">
                        {getAccountIcon(account.name)}
                        <span className="truncate">{account.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              <Button
                variant="outline"
                onClick={clearFilters}
                className="h-11 sm:h-12 border-0 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl"
              >
                <Filter className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Clear Filters</span>
                <span className="sm:hidden">Clear</span>
              </Button>
            </div>

            {/* Filter Summary */}
            {(searchTerm || currencyFilter !== "all" || accountFilter !== "all") && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-600"
              >
                <span>
                  Showing {filteredTransactions.length} of {transactions.length} transactions
                </span>
                {searchTerm && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                    Search: "{searchTerm.length > 10 ? searchTerm.substring(0, 10) + "..." : searchTerm}"
                  </Badge>
                )}
                {currencyFilter !== "all" && (
                  <Badge
                    className={`bg-gradient-to-r ${getCurrencyGradient(currencyFilter)} text-white border-0 text-xs`}
                  >
                    {currencyFilter}
                  </Badge>
                )}
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mobile-optimized Transaction List */}
      <Card className="professional-card border-0">
        <CardContent className="p-0">
          <AnimatePresence>
            {filteredTransactions.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 sm:py-16">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <TrendingUp className="h-8 w-8 sm:h-10 sm:w-10 text-slate-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">No transactions found</h3>
                <p className="text-slate-600 text-sm sm:text-base">Try adjusting your search criteria or filters</p>
              </motion.div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
                    className="p-4 sm:p-6 hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-blue-50/30 transition-all duration-300 group"
                  >
                    {/* Mobile-optimized Transaction Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                        
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1 sm:mb-1">
                            <div className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base font-semibold text-slate-900">
                              <div className="flex items-center gap-1">
                                {getAccountIcon(getAccountName(transaction.fromAccount))}
                                <span className="truncate max-w-[120px] sm:max-w-none">
                                  {getAccountName(transaction.fromAccount)}
                                </span>
                              </div>
                              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400 flex-shrink-0" />
                              <div className="flex items-center gap-1">
                                {getAccountIcon(getAccountName(transaction.toAccount))}
                                <span className="truncate max-w-[120px] sm:max-w-none">
                                  {getAccountName(transaction.toAccount)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge
                              className={`${getStatusBadge(transaction.status)} border-0 text-xs font-medium px-2 sm:px-3 py-1`}
                            >
                              <div className="flex items-center gap-1">
                                {getStatusIcon(transaction.status)}
                                <span className="hidden sm:inline">
                                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                </span>
                                <span className="sm:hidden">
                                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1, 4)}
                                </span>
                              </div>
                            </Badge>
                            <span className="text-xs text-slate-500 font-mono truncate">ID: {transaction.id}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                          {formatCurrency(transaction.originalAmount, transaction.fromCurrency)}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span className="hidden sm:inline">{transaction.timestamp.toLocaleDateString()}</span>
                            <span className="sm:hidden">
                              {transaction.timestamp.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {transaction.timestamp.toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile-optimized Transaction Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
                      {/* Amount Details */}
                      <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                        <div className="font-medium text-slate-700 mb-1 sm:mb-2 text-xs sm:text-sm">
                          Transfer Amount
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600">Original:</span>
                            <span className="font-semibold text-slate-900 text-xs sm:text-sm">
                              {formatCurrency(transaction.originalAmount, transaction.fromCurrency)}
                            </span>
                          </div>
                          {transaction.fxRate !== 1 && (
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600">Converted:</span>
                              <span className="font-semibold text-slate-900 text-xs sm:text-sm">
                                {formatCurrency(transaction.convertedAmount, transaction.toCurrency)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Exchange Rate */}
                      {transaction.fxRate !== 1 && (
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                          <div className="font-medium text-blue-700 mb-1 sm:mb-2 text-xs sm:text-sm">Exchange Rate</div>
                          <div className="space-y-1">
                            <div className="text-blue-900 font-semibold text-xs sm:text-sm">
                              1 {transaction.fromCurrency} = {transaction.fxRate} {transaction.toCurrency}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-blue-600">
                              <Badge
                                className={`bg-gradient-to-r ${getCurrencyGradient(transaction.fromCurrency)} text-white border-0 text-xs px-1.5 py-0.5`}
                              >
                                {transaction.fromCurrency}
                              </Badge>
                              <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                              <Badge
                                className={`bg-gradient-to-r ${getCurrencyGradient(transaction.toCurrency)} text-white border-0 text-xs px-1.5 py-0.5`}
                              >
                                {transaction.toCurrency}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Transaction Note */}
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                        <div className="font-medium text-purple-700 mb-1 sm:mb-2 text-xs sm:text-sm">
                          Transaction Note
                        </div>
                        <div className="text-purple-900 text-xs sm:text-sm">
                          {transaction.note ? (
                            <span className="break-words">{transaction.note}</span>
                          ) : (
                            <span className="italic text-purple-600">No note provided</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}
