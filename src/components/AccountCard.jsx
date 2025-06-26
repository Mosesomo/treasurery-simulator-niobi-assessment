import { Badge } from "@/components/ui/badge"
import { Wallet, Building2, Smartphone, TrendingUp, ChevronRight } from "lucide-react"
import { formatCurrency } from "../utils/currency.js"
import { motion } from "framer-motion"
import toast from "react-hot-toast"

const getAccountIcon = (accountName) => {
  if (accountName.toLowerCase().includes("mpesa") || accountName.toLowerCase().includes("mobile")) {
    return <Smartphone className="h-5 w-5 text-slate-600" />
  }
  if (accountName.toLowerCase().includes("bank") || accountName.toLowerCase().includes("reserve")) {
    return <Building2 className="h-5 w-5 text-slate-600" />
  }
  return <Wallet className="h-5 w-5 text-slate-600" />
}

const getCurrencyGradient = (currency) => {
  const gradients = {
    USD: "from-emerald-500 to-emerald-600",
    KES: "from-blue-500 to-blue-600",
    NGN: "from-purple-500 to-purple-600",
  }
  return gradients[currency] || "from-gray-500 to-gray-600"
}

export default function AccountCard({ account, onClick, isSelected }) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
      className={`cursor-pointer transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm hover:bg-white hover:shadow-lg rounded-xl p-4 group touch-manipulation ${
        isSelected ? "ring-2 ring-blue-500 shadow-lg shadow-blue-500/20 bg-blue-50/50" : ""
      }`}
      onClick={() => {
        onClick(account)
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
      }}
    >
      <div className="flex items-center justify-between">
        {/* Left side - Account info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="p-2 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300 flex-shrink-0">
            {getAccountIcon(account.name)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-slate-900 group-hover:text-slate-800 transition-colors truncate">
                {account.name}
              </h3>
              <Badge
                className={`bg-gradient-to-r ${getCurrencyGradient(account.currency)} text-white border-0 shadow-sm font-medium px-2 py-0.5 text-xs flex-shrink-0`}
              >
                {account.currency}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-lg font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
                {formatCurrency(account.balance, account.currency)}
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 font-medium">Online</span>
              </div>
            </div>

            <div className="text-xs text-slate-500 mt-0.5">Available Balance</div>
          </div>
        </div>

        {/* Right side - Action indicator */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-slate-400" />
            <span className="text-xs text-slate-500 hidden sm:inline">Active</span>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
        </div>
      </div>
    </motion.div>
  )
}
