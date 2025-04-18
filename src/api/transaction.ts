export const transactionRoutes = {
  getAllPayment: 'payment/all',
  getAdvancedTransaction: 'transactions/advanced/:fundId',
  refetchPayment: 'payment/refetch/:id',
  getUnclassifiedTransactions: 'transactions/unclassified/:fundId',
  getTodayTransactions: 'transactions/today/:fundId',
  getSummaryRecentTransactions: 'transactions/get-summary-recent',
  updateTransaction: 'transactions/:id',
  deleteAnTransaction: 'transactions/remove-one/:id',
  deleteMultipleTransaction: 'transactions/remove-multiple/:ids'
}
