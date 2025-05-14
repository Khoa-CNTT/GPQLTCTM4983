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
    Banknote,
    CheckIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { motion } from "framer-motion"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { useState } from "react"

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
    const [selectedCategory, setSelectedCategory] = useState(transaction?.category || "");

    if (!transaction) return null;

    // Danh sách category mẫu - có thể thay đổi theo yêu cầu thực tế
    const categories = transaction.type === "incoming"
        ? ["Lương", "Thưởng", "Tiền gửi", "Hoàn tiền", "Khác"]
        : ["Ăn uống", "Di chuyển", "Mua sắm", "Giải trí", "Khác"];

    const handleConfirmCategory = () => {
        // Xử lý logic xác nhận phân loại
        console.log("Đã xác nhận phân loại:", selectedCategory);
        // Đóng dialog
        setOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[550px] max-h-[850px] overflow-hidden rounded-xl ">
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
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={cn(
                                "flex flex-col items-center justify-center p-4 rounded-xl border shadow-sm",
                            )}
                        >
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center mb-3",
                                transaction.type === "incoming"
                                    ? "bg-green-100"
                                    : "bg-red-100"
                            )}>
                                {transaction.type === "incoming"
                                    ? <ArrowDownIcon className="h-4 w-4 text-green-600" />
                                    : <ArrowUpIcon className="h-4 w-4 text-rose-600" />
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
                                    "px-3 py-1 text-xs text-white",
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
                            className="space-y-3 bg-accent/20 rounded-xl p-4 border border-accent/10"
                        >
                            <h4 className="text-sm font-semibold flex items-center">
                                <InfoIcon className="h-4 w-4 mr-2 text-primary/90" />
                                Thông tin giao dịch
                            </h4>

                            <div className="grid grid-cols-1 gap-3 text-sm">
                                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/10 transition-colors">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <CalendarIcon className="h-4 w-4" />
                                        <span>Ngày giao dịch</span>
                                    </div>
                                    <div className="font-medium">
                                        {format(transaction.date, 'dd/MM/yyyy', { locale: vi })}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/10 transition-colors">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <ClockIcon className="h-4 w-4" />
                                        <span>Thời gian</span>
                                    </div>
                                    <div className="font-medium">
                                        {format(transaction.date, 'HH:mm:ss', { locale: vi })}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/10 transition-colors">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <CreditCardIcon className="h-4 w-4" />
                                        <span>Số tài khoản</span>
                                    </div>
                                    <div className="font-mono font-medium">
                                        {transaction.accountNumber}
                                    </div>
                                </div>

                                {transaction.bankName && (
                                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/10 transition-colors">
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
                                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/10 transition-colors">
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
                            className="space-y-3 bg-accent/20 rounded-xl p-4 border border-accent/10"
                        >
                            <h4 className="text-sm font-semibold flex items-center">
                                <PiggyBankIcon className="h-4 w-4 mr-2 text-primary/90" />
                                Phân loại
                            </h4>

                            <div className="p-2 rounded-lg bg-accent/20">
                                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                                    <span>Danh mục</span>
                                </div>
                                <div className="font-medium">
                                    <Select defaultValue={selectedCategory} onValueChange={setSelectedCategory}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Chọn danh mục" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="p-2 rounded-lg bg-accent/10">
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

                <DialogFooter className="flex gap-2 mt-4 pt-2 border-t">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="flex-1"
                    >
                        Đóng
                    </Button>
                    <Button
                        variant="default"
                        onClick={handleConfirmCategory}
                        className="flex-1"
                    >
                        <CheckIcon className="mr-2 h-4 w-4" />
                        Xác nhận phân loại
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
