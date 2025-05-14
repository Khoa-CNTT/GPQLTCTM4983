"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowDownIcon, 
  ArrowUpIcon, 
  ArrowRightIcon,
  CheckCircleIcon,
  XCircleIcon
} from "lucide-react"

// Dữ liệu giao dịch gần đây (mẫu)
const transactions = [
  {
    id: "728ed52f",
    amount: 100,
    status: "completed",
    type: "deposit",
    email: "user1@example.com",
    name: "Nguyễn Văn A",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    type: "withdrawal",
    email: "user2@example.com",
    name: "Trần Thị B",
  },
  {
    id: "63dfe6d5",
    amount: 250,
    status: "completed",
    type: "transfer",
    email: "user3@example.com",
    name: "Lê Văn C",
  },
  {
    id: "891ad31b",
    amount: 75,
    status: "failed",
    type: "withdrawal",
    email: "user4@example.com",
    name: "Phạm Thị D",
  },
  {
    id: "342af3c1",
    amount: 175,
    status: "completed",
    type: "deposit",
    email: "user5@example.com",
    name: "Hoàng Văn E",
  },
]

export default function RecentTransactions() {
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between rounded-lg border p-3"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border">
              <AvatarImage src="" alt="" />
              <AvatarFallback className="text-xs">
                {transaction.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
              <p className="text-sm font-medium">{transaction.name}</p>
              <p className="text-xs text-muted-foreground">{transaction.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <p className="text-sm font-medium">
                {transaction.type === 'withdrawal' ? '-' : transaction.type === 'deposit' ? '+' : ''}
                ${transaction.amount}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatTransactionType(transaction.type)}
              </p>
            </div>
            <div>
              {renderStatusBadge(transaction.status)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function formatTransactionType(type: string) {
  switch (type) {
    case 'deposit':
      return 'Nạp tiền'
    case 'withdrawal':
      return 'Rút tiền'
    case 'transfer':
      return 'Chuyển khoản'
    default:
      return type
  }
}

function renderStatusBadge(status: string) {
  switch (status) {
    case 'completed':
      return (
        <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-500">
          <CheckCircleIcon className="mr-1 h-3 w-3" />
          Hoàn thành
        </Badge>
      )
    case 'processing':
      return (
        <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 hover:text-blue-500">
          <ArrowRightIcon className="mr-1 h-3 w-3" />
          Đang xử lý
        </Badge>
      )
    case 'failed':
      return (
        <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-500">
          <XCircleIcon className="mr-1 h-3 w-3" />
          Thất bại
        </Badge>
      )
    default:
      return null
  }
} 