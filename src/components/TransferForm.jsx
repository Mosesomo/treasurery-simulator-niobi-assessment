import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, X, Send, Info, Sparkles, Zap } from "lucide-react"
import { convertCurrency, formatCurrency } from "../utils/currency.js"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"

export default function TransferForm({ accounts, onTransfer, selectedFromAccount, onClose }) {
  const [fromAccount, setFromAccount] = useState(selectedFromAccount?.id || "")
  const [toAccount, setToAccount] = useState("")
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
  const [error, setError] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const fromAccountData = accounts.find((acc) => acc.id === fromAccount)
  const toAccountData = accounts.find((acc) => acc.id === toAccount)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsProcessing(true)

    const processingToast = toast.loading("Processing transfer...", {
      style: {
        background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
        color: "white",
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 0.2)",
      },
    })

    const transferAmount = Number.parseFloat(amount)

    // Validation
    if (!fromAccount || !toAccount) {
      toast.error("Please select both source and destination accounts", {
        style: {
          background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
          color: "white",
          borderRadius: "16px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        },
      })
      setIsProcessing(false)
      toast.dismiss(processingToast)
      return
    }

    if (fromAccount === toAccount) {
      toast.error("Source and destination accounts must be different", {
        style: {
          background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
          color: "white",
          borderRadius: "16px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        },
      })
      setIsProcessing(false)
      toast.dismiss(processingToast)
      return
    }

    if (!transferAmount || transferAmount <= 0) {
      toast.error("Please enter a valid amount", {
        style: {
          background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
          color: "white",
          borderRadius: "16px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        },
      })
      setIsProcessing(false)
      toast.dismiss(processingToast)
      return
    }

    if (transferAmount > fromAccountData.balance) {
      const errorMessage = `Insufficient balance. Available: ${formatCurrency(fromAccountData.balance, fromAccountData.currency)}, Requested: ${formatCurrency(transferAmount, fromAccountData.currency)}`
      setError(errorMessage)
      toast.error(errorMessage, {
        style: {
          background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
          color: "white",
          borderRadius: "16px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        },
      })
      setIsProcessing(false)
      toast.dismiss(processingToast)
      return
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const transferData = {
      fromAccount,
      toAccount,
      amount: transferAmount,
      note: note.trim(),
      fromCurrency: fromAccountData.currency,
      toCurrency: toAccountData.currency,
    }

    onTransfer(transferData)

    toast.dismiss(processingToast)

    // Reset form
    setFromAccount("")
    setToAccount("")
    setAmount("")
    setNote("")
    setIsProcessing(false)
  }

  const conversionInfo =
    fromAccountData && toAccountData && amount
      ? convertCurrency(Number.parseFloat(amount), fromAccountData.currency, toAccountData.currency)
      : null

  return (
    <Card className="w-full floating-card relative overflow-hidden">
      {/* Enhanced gradient header background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-indigo-600/10" />
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-br from-blue-600/5 to-purple-600/5" />

      <CardHeader className="relative z-10 pb-8">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl sm:rounded-3xl shadow-2xl shadow-blue-500/30 pulse-glow">
              <Send className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl sm:text-3xl font-bold gradient-text">Transfer Funds</h2>
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-slate-600 text-sm sm:text-base font-medium">Move money between your accounts securely</p>
            </div>
          </div>
          {onClose && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose} 
              className="h-12 w-12 p-0 hover:bg-slate-100 rounded-2xl transition-all duration-300 hover:scale-110"
            >
              <X className="h-6 w-6" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="relative z-10 space-y-8 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Enhanced Account Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-4">
              <Label htmlFor="from-account" className="text-base font-bold text-slate-700 flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-600" />
                From Account
              </Label>
              <Select value={fromAccount} onValueChange={setFromAccount}>
                <SelectTrigger className="h-14 glass-effect hover:shadow-xl transition-all duration-300 rounded-2xl text-base font-medium">
                  <SelectValue placeholder="Select source account" />
                </SelectTrigger>
                <SelectContent className="glass-effect rounded-2xl">
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id} className="rounded-xl hover:bg-slate-50 p-4">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-semibold">{account.name}</span>
                        <span className="text-sm text-slate-500 ml-3 font-medium">
                          {account.currency} - {formatCurrency(account.balance, account.currency)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label htmlFor="to-account" className="text-base font-bold text-slate-700 flex items-center gap-2">
                <Zap className="h-4 w-4 text-green-600" />
                To Account
              </Label>
              <Select value={toAccount} onValueChange={setToAccount}>
                <SelectTrigger className="h-14 glass-effect hover:shadow-xl transition-all duration-300 rounded-2xl text-base font-medium">
                  <SelectValue placeholder="Select destination account" />
                </SelectTrigger>
                <SelectContent className="glass-effect rounded-2xl">
                  {accounts
                    .filter((acc) => acc.id !== fromAccount)
                    .map((account) => (
                      <SelectItem key={account.id} value={account.id} className="rounded-xl hover:bg-slate-50 p-4">
                        <div className="flex items-center justify-between w-full">
                          <span className="font-semibold">{account.name}</span>
                          <span className="text-sm text-slate-500 ml-3 font-medium">
                            {account.currency} - {formatCurrency(account.balance, account.currency)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Enhanced Amount Input */}
          <div className="space-y-4">
            <Label htmlFor="amount" className="text-base font-bold text-slate-700 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              Transfer Amount
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount to transfer"
              className="h-14 glass-effect hover:shadow-xl focus:shadow-2xl transition-all duration-300 rounded-2xl text-lg font-semibold focus-ring"
            />
            {fromAccountData && amount && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 text-sm text-slate-600 bg-gradient-to-r from-slate-50 to-slate-100 p-4 rounded-2xl border border-white/50"
              >
                <Info className="h-5 w-5 text-blue-600" />
                <span className="font-semibold">Available: {formatCurrency(fromAccountData.balance, fromAccountData.currency)}</span>
              </motion.div>
            )}
          </div>

          {/* Enhanced Currency Conversion Info */}
          <AnimatePresence>
            {conversionInfo && conversionInfo.fxRate !== 1 && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.9 }}
                animate={{ opacity: 1, height: "auto", scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.9 }}
                transition={{ duration: 0.4, type: "spring" }}
              >
                <Alert className="glass-effect rounded-2xl border-2 border-blue-200/50">
                  <AlertCircle className="h-6 w-6 text-blue-600" />
                  <AlertDescription>
                    <div className="space-y-3">
                      <div className="font-bold text-slate-800 text-base flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        Currency conversion will be applied:
                      </div>
                      <div className="text-xl font-bold gradient-text">
                        {formatCurrency(Number.parseFloat(amount), fromAccountData.currency)} →{" "}
                        {formatCurrency(conversionInfo.convertedAmount, toAccountData.currency)}
                      </div>
                      <div className="text-sm text-slate-600 font-medium">
                        Exchange rate: 1 {fromAccountData.currency} = {conversionInfo.fxRate} {toAccountData.currency}
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Note Input */}
          <div className="space-y-4">
            <Label htmlFor="note" className="text-base font-bold text-slate-700 flex items-center gap-2">
              <Info className="h-4 w-4 text-slate-600" />
              Transfer Note (Optional)
            </Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note for this transfer..."
              rows={4}
              className="glass-effect hover:shadow-xl focus:shadow-2xl transition-all duration-300 rounded-2xl resize-none text-base font-medium focus-ring"
            />
          </div>

          {/* Enhanced Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Alert variant="destructive" className="glass-effect rounded-2xl border-2 border-red-200/50">
                  <AlertCircle className="h-6 w-6" />
                  <AlertDescription className="font-semibold text-base">{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Action Buttons */}
          <div className="flex gap-4 sm:gap-6 pt-6">
            {onClose && (
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-14 glass-effect hover:shadow-xl text-slate-700 font-bold rounded-2xl text-base transition-all duration-300"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              className="flex-1 h-14 professional-button text-white font-bold rounded-2xl text-base"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  Processing Transfer...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6" />
                  Transfer Funds
                </div>
              )}
            </Button>
          </div>
        </form>

        {/* Enhanced Processing Overlay */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-white/95 backdrop-blur-xl flex items-center justify-center rounded-3xl z-30"
          >
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
                <div className="absolute inset-0 rounded-full bg-blue-600/20 animate-pulse"></div>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold gradient-text mb-2">Processing Transfer</p>
                <p className="text-base text-slate-600 font-medium">Please wait while we securely process your transaction...</p>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}