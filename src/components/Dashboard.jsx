import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Wallet, ArrowUpDown, Activity, BarChart3 } from "lucide-react"
import { formatCurrency } from "../utils/currency.js"
import { motion } from "framer-motion"

export default function Dashboard({ accounts, transactions }) {
  const totalsByCurrency = accounts.reduce((acc, account) => {
    acc[account.currency] = (acc[account.currency] || 0) + account.balance
    return acc
  }, {})

  const recentTransactions = transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5)

  const todayTransactions = transactions.filter(
    (tx) => new Date(tx.timestamp).toDateString() === new Date().toDateString(),
  )

  const stats = [
    {
      title: "Total Accounts",
      value: accounts.length,
      icon: <Wallet className="h-5 w-5 sm:h-6 sm:w-6" />,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
    },
    {
      title: "Total Transactions",
      value: transactions.length,
      icon: <ArrowUpDown className="h-5 w-5 sm:h-6 sm:w-6" />,
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100",
    },
    {
      title: "Today's Transfers",
      value: todayTransactions.length,
      icon: <Activity className="h-5 w-5 sm:h-6 sm:w-6" />,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
    },
    {
      title: "Active Currencies",
      value: Object.keys(totalsByCurrency).length,
      icon: <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />,
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100",
    },
  ]

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Mobile-optimized Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
          >
            <Card className="professional-card border-0 overflow-hidden group">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                  <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">{stat.title}</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                  <div
                    className={`p-2 sm:p-3 bg-gradient-to-br ${stat.bgGradient} rounded-xl sm:rounded-2xl group-hover:scale-110 transition-transform duration-200 self-end sm:self-auto flex-shrink-0`}
                  >
                    <div className={``}>{stat.icon}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Mobile-optimized Currency Overview */}
      <Card className="professional-card border-0">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg sm:rounded-xl flex-shrink-0">
              <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">Treasury Overview</h3>
              <p className="text-slate-600 text-xs sm:text-sm">Multi-currency portfolio summary</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {Object.entries(totalsByCurrency).map(([currency, total]) => {
              const gradient =
                currency === "USD"
                  ? "from-emerald-500 to-emerald-600"
                  : currency === "KES"
                    ? "from-blue-500 to-blue-600"
                    : "from-purple-500 to-purple-600"

              return (
                <div
                  key={currency}
                  className="text-center p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl sm:rounded-2xl hover:shadow-lg transition-all duration-300"
                >
                  <Badge
                    className={`mb-3 sm:mb-4 bg-gradient-to-r ${gradient} text-white border-0 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-semibold`}
                  >
                    {currency}
                  </Badge>
                  <div className="text-xl sm:text-xl lg:text-xl font-bold text-slate-900 mb-1 sm:mb-2">
                    {formatCurrency(total, currency)}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600">
                    {accounts.filter((acc) => acc.currency === currency).length} accounts
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Mobile-optimized Recent Activity */}
      <Card className="professional-card border-0">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-green-600 to-green-700 rounded-lg sm:rounded-xl flex-shrink-0">
              <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">Recent Activity</h3>
              <p className="text-slate-600 text-xs sm:text-sm">Latest transaction history</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium text-sm sm:text-base">No recent transactions</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {recentTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg sm:rounded-xl hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className="p-1.5 sm:p-2 bg-white rounded-lg sm:rounded-xl shadow-sm flex-shrink-0">
                      <ArrowUpDown className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-slate-900 text-sm sm:text-base">
                        {formatCurrency(transaction.originalAmount, transaction.fromCurrency)}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-600 truncate">
                        {transaction.note || "No note provided"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <Badge
                      variant="outline"
                      className="text-xs font-medium border-green-200 text-green-700 bg-green-50 mb-1"
                    >
                      {transaction.status}
                    </Badge>
                    <div className="text-xs text-slate-500">{transaction.timestamp.toLocaleTimeString()}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
