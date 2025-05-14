import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    CalendarIcon,
    ArrowDownIcon,
    ArrowUpIcon,
    PiggyBankIcon,
    InfoIcon,
    UserIcon,
    ClockIcon,
    CreditCardIcon,
    ArrowLeftIcon,
    Banknote
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { motion } from "framer-motion"

interface Transaction {
    id: number;
    date: Date;
    description: string;
    accountNumber: string;
    type: 'incoming' | 'outgoing';
    amount: number;
    category: string;
    reason: string;
    bankName?: string;
    benAccountNo?: string;
}

// Hàm định dạng số tiền
const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

interface AgentDetailDialogProps {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    transaction: Transaction | null;
}

export function AgentDetailDialog({ isOpen, setOpen, transaction }: AgentDetailDialogProps) {
    if (!transaction) return null;

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[550px] max-h-[850px] overflow-hidden rounded-xl border-primary/10 shadow-lg shadow-primary/5">
                <DialogHeader className="mb-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-3 top-3"
                        onClick={() => setOpen(false)}
                    >
                        <ArrowLeftIcon className="h-4 w-4" />
                    </Button>
                    <DialogTitle className="text-xl font-semibold text-primary/90 flex items-center justify-center">
                        Chi tiết giao dịch
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[850px] pr-4 pt-2">
                    <div className="space-y-4 px-1">
                        {/* Header với thông tin chính */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={cn(
                                "flex flex-col items-center justify-center p-4 rounded-xl border shadow-sm",
                                transaction.type === "incoming"
                                    ? "border-green-200 bg-green-50/50"
                                    : "border-red-200 bg-red-50/50"
                            )}
                        >
                            <div className={cn(
                                "w-16 h-16 rounded-full flex items-center justify-center mb-3",
                                transaction.type === "incoming"
                                    ? "bg-green-100"
                                    : "bg-red-100"
                            )}>
                                {transaction.type === "incoming"
                                    ? <ArrowDownIcon className="h-8 w-8 text-green-600" />
                                    : <ArrowUpIcon className="h-8 w-8 text-rose-600" />
                                }
                            </div>

                            <h3 className="text-lg font-medium mb-1">{transaction.description}</h3>

                            <div className={cn(
                                "text-xl font-bold mt-1 mb-3",
                                transaction.type === "incoming"
                                    ? "text-green-600"
                                    : "text-red-600"
                            )}>
                                {transaction.type === "incoming" ? "+" : "-"}{formatCurrency(transaction.amount)}
                            </div>

                            <Badge
                                className={cn(
                                    "px-3 py-1 text-xs",
                                    transaction.type === "incoming"
                                        ? "bg-green-500 hover:bg-green-600"
                                        : "bg-red-500 hover:bg-red-600"
                                )}
                            >
                                {transaction.type === "incoming" ? "Giao dịch nhận" : "Giao dịch chi"}
                            </Badge>
                        </motion.div>

                        {/* Thông tin chi tiết */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="space-y-3 bg-primary/5 rounded-xl p-4 border border-primary/10"
                        >
                            <h4 className="text-sm font-semibold flex items-center">
                                <InfoIcon className="h-4 w-4 mr-2 text-primary/70" />
                                Thông tin giao dịch
                            </h4>

                            <div className="grid grid-cols-1 gap-3 text-sm">
                                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-primary/10 transition-colors">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <CalendarIcon className="h-4 w-4" />
                                        <span>Ngày giao dịch</span>
                                    </div>
                                    <div className="font-medium">
                                        {format(transaction.date, 'dd/MM/yyyy', { locale: vi })}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-primary/10 transition-colors">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <ClockIcon className="h-4 w-4" />
                                        <span>Thời gian</span>
                                    </div>
                                    <div className="font-medium">
                                        {format(transaction.date, 'HH:mm:ss', { locale: vi })}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-primary/10 transition-colors">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <CreditCardIcon className="h-4 w-4" />
                                        <span>Số tài khoản</span>
                                    </div>
                                    <div className="font-mono font-medium">
                                        {transaction.accountNumber}
                                    </div>
                                </div>

                                {transaction.bankName && (
                                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-primary/10 transition-colors">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Banknote className="h-4 w-4" />
                                            <span>Ngân hàng</span>
                                        </div>
                                        <div className="font-medium">
                                            {transaction.bankName}
                                        </div>
                                    </div>
                                )}

                                {transaction.benAccountNo && (
                                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-primary/10 transition-colors">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <UserIcon className="h-4 w-4" />
                                            <span>TK đối tác</span>
                                        </div>
                                        <div className="font-mono font-medium">
                                            {transaction.benAccountNo}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Phân loại và lý do */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className="space-y-3 bg-primary/5 rounded-xl p-4 border border-primary/10"
                        >
                            <h4 className="text-sm font-semibold flex items-center">
                                <PiggyBankIcon className="h-4 w-4 mr-2 text-primary/70" />
                                Phân loại
                            </h4>

                            <div className="p-2 rounded-lg bg-primary/10">
                                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                                    <span>Danh mục</span>
                                </div>
                                <div className="font-medium">
                                    <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none">
                                        {transaction.category}
                                    </Badge>
                                </div>
                            </div>

                            <div className="p-2 rounded-lg bg-primary/10">
                                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                                    <span>Lý do phân loại</span>
                                </div>
                                <div className="text-sm leading-relaxed">
                                    {transaction.reason}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="w-full"
                    >
                        Đóng
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
