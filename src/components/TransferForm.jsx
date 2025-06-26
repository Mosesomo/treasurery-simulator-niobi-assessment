import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, X, Send, Info } from "lucide-react"
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
        borderRadius: "12px",
      },
    })

    const transferAmount = Number.parseFloat(amount)

    // Validation
    if (!fromAccount || !toAccount) {
      toast.error("Please select both source and destination accounts", {
        style: {
          background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
          color: "white",
          borderRadius: "12px",
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
          borderRadius: "12px",
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
          borderRadius: "12px",
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
          borderRadius: "12px",
        },
      })
      setIsProcessing(false)
      toast.dismiss(processingToast)
      return
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

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
      {/* Gradient header background */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-blue-600/5 to-purple-600/5" />

      <CardHeader className="relative z-10 pb-6">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
              <Send className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Transfer Funds</h2>
              <p className="text-slate-600 text-sm mt-1">Move money between your accounts</p>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="h-10 w-10 p-0 hover:bg-slate-100 rounded-xl">
              <X className="h-5 w-5" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="relative z-10 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="from-account" className="text-sm font-semibold text-slate-700">
                From Account
              </Label>
              <Select value={fromAccount} onValueChange={setFromAccount}>
                <SelectTrigger className="h-12 border-0 bg-white shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
                  <SelectValue placeholder="Select source account" />
                </SelectTrigger>
                <SelectContent className="border-0 shadow-xl rounded-xl bg-white">
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id} className="rounded-lg hover:bg-slate-50">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">{account.name}</span>
                        <span className="text-sm text-slate-500 ml-2">
                          {account.currency} - {formatCurrency(account.balance, account.currency)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="to-account" className="text-sm font-semibold text-slate-700">
                To Account
              </Label>
              <Select value={toAccount} onValueChange={setToAccount}>
                <SelectTrigger className="h-12 border-0 bg-white shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
                  <SelectValue placeholder="Select destination account" />
                </SelectTrigger>
                <SelectContent className="border-0 shadow-xl rounded-xl bg-white">
                  {accounts
                    .filter((acc) => acc.id !== fromAccount)
                    .map((account) => (
                      <SelectItem key={account.id} value={account.id} className="rounded-lg hover:bg-slate-50">
                        <div className="flex items-center justify-between w-full">
                          <span className="font-medium">{account.name}</span>
                          <span className="text-sm text-slate-500 ml-2">
                            {account.currency} - {formatCurrency(account.balance, account.currency)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-3">
            <Label htmlFor="amount" className="text-sm font-semibold text-slate-700">
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
              className="h-12 border-0 bg-white shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200 rounded-xl text-lg font-medium"
            />
            {fromAccountData && amount && (
              <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl">
                <Info className="h-4 w-4" />
                <span>Available: {formatCurrency(fromAccountData.balance, fromAccountData.currency)}</span>
              </div>
            )}
          </div>

          {/* Currency Conversion Info */}
          <AnimatePresence>
            {conversionInfo && conversionInfo.fxRate !== 1 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert className="border-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <div className="font-semibold text-slate-800">Currency conversion will be applied:</div>
                      <div className="text-lg font-bold text-slate-900">
                        {formatCurrency(Number.parseFloat(amount), fromAccountData.currency)} →{" "}
                        {formatCurrency(conversionInfo.convertedAmount, toAccountData.currency)}
                      </div>
                      <div className="text-sm text-slate-600">
                        Exchange rate: 1 {fromAccountData.currency} = {conversionInfo.fxRate} {toAccountData.currency}
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Note Input */}
          <div className="space-y-3">
            <Label htmlFor="note" className="text-sm font-semibold text-slate-700">
              Transfer Note (Optional)
            </Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note for this transfer..."
              rows={3}
              className="border-0 bg-white shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200 rounded-xl resize-none"
            />
          </div>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Alert variant="destructive" className="border-0 bg-gradient-to-r from-red-50 to-red-100 rounded-xl">
                  <AlertCircle className="h-5 w-5" />
                  <AlertDescription className="font-medium">{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            {onClose && (
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-12 border-0 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              className="flex-1 h-12 professional-button border-0 text-white font-semibold rounded-xl"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing Transfer...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5" />
                  Transfer Funds
                </div>
              )}
            </Button>
          </div>
        </form>

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center rounded-2xl z-20">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
              <div className="text-center">
                <p className="text-lg font-semibold text-slate-800">Processing Transfer</p>
                <p className="text-sm text-slate-600">Please wait while we process your transaction...</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
