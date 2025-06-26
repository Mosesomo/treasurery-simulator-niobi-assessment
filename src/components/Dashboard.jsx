import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Wallet, ArrowUpDown, Activity, BarChart3, Sparkles, Zap } from "lucide-react"
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
      icon: <Wallet className="h-6 w-6 sm:h-7 sm:w-7" />,
      gradient: "from-blue-500 via-blue-600 to-indigo-600",
      bgGradient: "from-blue-50 via-blue-100 to-indigo-100",
      textColor: "text-blue-900",
    },
    {
      title: "Total Transactions",
      value: transactions.length,
      icon: <ArrowUpDown className="h-6 w-6 sm:h-7 sm:w-7" />,
      gradient: "from-green-500 via-green-600 to-emerald-600",
      bgGradient: "from-green-50 via-green-100 to-emerald-100",
      textColor: "text-green-900",
    },
    {
      title: "Today's Transfers",
      value: todayTransactions.length,
      icon: <Activity className="h-6 w-6 sm:h-7 sm:w-7" />,
      gradient: "from-purple-500 via-purple-600 to-violet-600",
      bgGradient: "from-purple-50 via-purple-100 to-violet-100",
      textColor: "text-purple-900",
    },
    {
      title: "Active Currencies",
      value: Object.keys(totalsByCurrency).length,
      icon: <TrendingUp className="h-6 w-6 sm:h-7 sm:w-7" />,
      gradient: "from-orange-500 via-orange-600 to-red-600",
      bgGradient: "from-orange-50 via-orange-100 to-red-100",
      textColor: "text-orange-900",
    },
  ]

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <Card className="professional-card overflow-hidden group relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} rounded-full blur-2xl`}></div>
              </div>
              
              <CardContent className="p-4 sm:p-6 lg:p-8 relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <div className="space-y-2 sm:space-y-3 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm sm:text-base font-semibold text-slate-600 truncate">{stat.title}</p>
                      <Sparkles className="h-3 w-3 text-slate-400" />
                    </div>
                    <p className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${stat.textColor}`}>{stat.value}</p>
                  </div>
                  <div
                    className={`p-3 sm:p-4 bg-gradient-to-br ${stat.bgGradient} rounded-2xl sm:rounded-3xl group-hover:scale-110 transition-all duration-300 self-end sm:self-auto flex-shrink-0 shadow-lg border border-white/50`}
                  >
                    <div className={`${stat.textColor}`}>{stat.icon}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Currency Overview */}
      <Card className="professional-card overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-full blur-3xl"></div>
        </div>
        
        <CardHeader className="p-6 sm:p-8 relative z-10">
          <CardTitle className="flex items-center gap-4">
            <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl sm:rounded-3xl shadow-xl shadow-blue-500/30 flex-shrink-0">
              <BarChart3 className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-2xl sm:text-3xl font-bold gradient-text">Treasury Overview</h3>
                <Zap className="h-5 w-5 text-yellow-500" />
              </div>
              <p className="text-slate-600 text-sm sm:text-base font-medium">Multi-currency portfolio summary</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 pt-0 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {Object.entries(totalsByCurrency).map(([currency, total], index) => {
              const gradient =
                currency === "USD"
                  ? "from-emerald-500 via-emerald-600 to-green-600"
                  : currency === "KES"
                    ? "from-blue-500 via-blue-600 to-cyan-600"
                    : "from-purple-500 via-purple-600 to-violet-600"

              const bgGradient =
                currency === "USD"
                  ? "from-emerald-50 via-emerald-100 to-green-100"
                  : currency === "KES"
                    ? "from-blue-50 via-blue-100 to-cyan-100"
                    : "from-purple-50 via-purple-100 to-violet-100"

              return (
                <motion.div
                  key={currency}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`text-center p-6 sm:p-8 bg-gradient-to-br ${bgGradient} rounded-2xl sm:rounded-3xl hover:shadow-2xl transition-all duration-500 border border-white/50 relative overflow-hidden group`}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${gradient} rounded-full blur-2xl`}></div>
                  </div>
                  
                  <div className="relative z-10">
                    <Badge
                      className={`mb-4 sm:mb-6 bg-gradient-to-r ${gradient} text-white border-0 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-bold shadow-xl`}
                    >
                      {currency}
                    </Badge>
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-2 sm:mb-3">
                      {formatCurrency(total, currency)}
                    </div>
                    <div className="text-sm sm:text-base text-slate-600 font-semibold">
                      {accounts.filter((acc) => acc.currency === currency).length} accounts
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Recent Activity */}
      <Card className="professional-card overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400 to-blue-400 rounded-full blur-3xl"></div>
        </div>
        
        <CardHeader className="p-6 sm:p-8 relative z-10">
          <CardTitle className="flex items-center gap-4">
            <div className="p-3 sm:p-4 bg-gradient-to-br from-green-600 via-green-700 to-emerald-700 rounded-2xl sm:rounded-3xl shadow-xl shadow-green-500/30 flex-shrink-0">
              <Activity className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-2xl sm:text-3xl font-bold gradient-text">Recent Activity</h3>
                <Sparkles className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-slate-600 text-sm sm:text-base font-medium">Latest transaction history</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 pt-0 relative z-10">
          {recentTransactions.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                <Activity className="h-8 w-8 sm:h-10 sm:w-10 text-slate-400" />
              </div>
              <p className="text-slate-500 font-semibold text-base sm:text-lg">No recent transactions</p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {recentTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 4, scale: 1.02 }}
                  className="flex items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-slate-50 via-slate-100 to-slate-200 rounded-2xl hover:shadow-xl transition-all duration-300 border border-white/50 group"
                >
                  <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
                    <div className="p-2 sm:p-3 bg-white rounded-2xl shadow-lg flex-shrink-0 group-hover:shadow-xl transition-all duration-300">
                      <ArrowUpDown className="h-5 w-5 sm:h-6 sm:w-6 text-slate-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-900 text-base sm:text-lg mb-1">
                        {formatCurrency(transaction.originalAmount, transaction.fromCurrency)}
                      </div>
                      <div className="text-sm sm:text-base text-slate-600 truncate font-medium">
                        {transaction.note || "No note provided"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <Badge
                      variant="outline"
                      className="text-sm font-semibold border-green-200 text-green-700 bg-green-50 mb-2 px-3 py-1"
                    >
                      {transaction.status}
                    </Badge>
                    <div className="text-sm text-slate-500 font-medium">{transaction.timestamp.toLocaleTimeString()}</div>
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