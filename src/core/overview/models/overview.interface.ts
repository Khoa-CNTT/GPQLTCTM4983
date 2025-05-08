export interface ICashFlowAnalysisStatistic {
  outgoing: number
  incoming: number
  date: string
}

export interface ITotalAmount {
  amount: number
  rate: string
}


export interface IStatisticBudgetTargetAndPlan {
  fund: {
    id: string
    name: string
  }
  planStatistic: {
    total: number
    successed: number
  }
  targetStatistic: {
    total: number
    successed: number
  }
}

export interface IrecentTransactions {
  id: string
  direction: 'EXPENSE' | 'INCOMING'
  amount: number
  toAccountNo: string | null
  toAccountName: string | null
  toBankName: string | null
  currency: string
  description: string | null
  transactionDateTime: string
  accountSource: {
    name: string
    accountBank: {accounts: { accountNo: string }[]
    }
  }
}

interface IUnclassifiedTransaction {
  id: string
  direction: 'INCOMING' | 'EXPENSE'
  amount: number
  toAccountNo: string | null
  toAccountName: string | null
  toBankName: string | null
  currency: string
  description: string | null
  transactionDateTime: string
  accountSource: IAccountSource
  ofAccount: string | null
}

export interface ITotalBalanceChart {
  account: string
  amount: number
  fill: string
}

interface IAccountSource {
  name: string
  accountBank: string | null
}

export interface IStatisticOverview {
  cashFlowAnalysis: ICashFlowAnalysisStatistic[]
  currentBalance: number
  totalIncome: ITotalAmount
  totalExpenses: ITotalAmount
  unclassifiedTransactions: IUnclassifiedTransaction[]
  recentTransactions: IrecentTransactions[]
  accountsourceCount: number
  fundCount: number
  statisticBudgetTargetAndPlan: IStatisticBudgetTargetAndPlan[]
}
