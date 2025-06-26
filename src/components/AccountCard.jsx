import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  Building2,
  Smartphone,
  TrendingUp,
  ChevronRight,
  Zap,
} from "lucide-react";
import { formatCurrency } from "../utils/currency.js";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const getAccountIcon = (accountName) => {
  if (
    accountName.toLowerCase().includes("mpesa") ||
    accountName.toLowerCase().includes("mobile")
  ) {
    return <Smartphone className="h-6 w-6 text-slate-600" />;
  }
  if (
    accountName.toLowerCase().includes("bank") ||
    accountName.toLowerCase().includes("reserve")
  ) {
    return <Building2 className="h-6 w-6 text-slate-600" />;
  }
  return <Wallet className="h-6 w-6 text-slate-600" />;
};

const getCurrencyGradient = (currency) => {
  const gradients = {
    USD: "from-emerald-500 via-emerald-600 to-green-600",
    KES: "from-blue-500 via-blue-600 to-cyan-600",
    NGN: "from-purple-500 via-purple-600 to-violet-600",
  };
  return gradients[currency] || "from-gray-500 to-gray-600";
};

const getCurrencyBg = (currency) => {
  const backgrounds = {
    USD: "from-emerald-50 via-emerald-100 to-green-100",
    KES: "from-blue-50 via-blue-100 to-cyan-100",
    NGN: "from-purple-50 via-purple-100 to-violet-100",
  };
  return backgrounds[currency] || "from-gray-50 to-gray-100";
};

export default function AccountCard({ account, onClick, isSelected }) {
  return (
    <motion.div
      whileHover={{ x: 6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
      className={`cursor-pointer transition-all duration-500 professional-card rounded-2xl p-5 sm:p-6 group touch-manipulation relative overflow-hidden ${
        isSelected
          ? "ring-4 ring-blue-500/30 shadow-2xl shadow-blue-500/30 bg-gradient-to-r from-blue-50/80 to-indigo-50/80"
          : ""
      }`}
      onClick={() => {
        onClick(account);
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
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl"></div>
      </div>

      <div className="flex items-center justify-between relative z-10">
        {/* Left side - Account info */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div
            className={`p-3 bg-gradient-to-br ${getCurrencyBg(account.currency)} rounded-2xl group-hover:shadow-lg transition-all duration-300 flex-shrink-0 border border-white/50`}
          >
            {getAccountIcon(account.name)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-slate-800 transition-colors truncate">
                {account.name}
              </h3>
              <Badge
                className={`bg-gradient-to-r ${getCurrencyGradient(account.currency)} text-white border-0 shadow-lg font-semibold px-3 py-1 text-sm flex-shrink-0`}
              >
                {account.currency}
              </Badge>
            </div>

            <div className="flex items-center gap-3 mb-2">
              <div className="text-md sm:text-lg font-bold gradient-text group-hover:text-slate-800 transition-colors">
                {formatCurrency(account.balance, account.currency)}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                <span className="text-sm text-green-600 font-semibold">
                  Online
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 font-medium">
                Available Balance
              </span>
              <Zap className="h-3 w-3 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Right side - Action indicator */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex flex-col items-center gap-1">
            <TrendingUp className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
            <span className="text-xs text-slate-500 hidden sm:inline font-medium">
              Active
            </span>
          </div>
          <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
            <ChevronRight className="h-6 w-6 text-slate-400 group-hover:text-blue-500 transition-colors" />
          </motion.div>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
    </motion.div>
  );
}
