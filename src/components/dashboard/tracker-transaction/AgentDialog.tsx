import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CalendarIcon, ArrowDownIcon, ArrowUpIcon, PiggyBankIcon, ShoppingBagIcon, CoffeeIcon, HomeIcon, CarIcon, FileTextIcon, SearchIcon, TrendingUpIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Input } from "@/components/ui/input"
import agentGif from "@/images/gif/agent1.gif"
import { motion } from "framer-motion"

interface Transaction {
    id: number;
    date: Date;
    description: string;
    accountNumber: string;
    type: 'incoming' | 'outgoing';
    amount: number;
    category: string;
}

// Định nghĩa kiểu dữ liệu nhóm transaction
interface TransactionGroup {
    date: Date;
    transactions: Transaction[];
}

// Dữ liệu mẫu cho transaction
const sampleTransactions: Transaction[] = [
    {
        id: 1,
        date: new Date(2023, 5, 15, 9, 30),
        description: "Lương tháng 6",
        accountNumber: "0987654321",
        type: "incoming",
        amount: 15000000,
        category: "Thu nhập",
    },
    {
        id: 2,
        date: new Date(2023, 5, 15, 12, 45),
        description: "Mua sắm tại AEON Mall",
        accountNumber: "1234567890",
        type: "outgoing",
        amount: 850000,
        category: "Mua sắm",
    },
    {
        id: 3,
        date: new Date(2023, 5, 15, 18, 15),
        description: "Thanh toán hoá đơn điện",
        accountNumber: "1234567890",
        type: "outgoing",
        amount: 450000,
        category: "Hoá đơn",
    },
    {
        id: 4,
        date: new Date(2023, 5, 14, 8, 20),
        description: "Cà phê với đồng nghiệp",
        accountNumber: "1234567890",
        type: "outgoing",
        amount: 150000,
        category: "Ăn uống",
    },
    {
        id: 5,
        date: new Date(2023, 5, 14, 14, 30),
        description: "Chuyển tiền từ Nguyễn Văn A",
        accountNumber: "5647382910",
        type: "incoming",
        amount: 2000000,
        category: "Chuyển khoản",
    },
    {
        id: 6,
        date: new Date(2023, 5, 13, 10, 0),
        description: "Thanh toán tiền nhà",
        accountNumber: "1234567890",
        type: "outgoing",
        amount: 5000000,
        category: "Nhà cửa",
    },
    {
        id: 7,
        date: new Date(2023, 5, 13, 18, 20),
        description: "Đổ xăng",
        accountNumber: "1234567890",
        type: "outgoing",
        amount: 250000,
        category: "Phương tiện",
    },
];

// Hàm nhóm các giao dịch theo ngày
const groupTransactionsByDate = (transactions: Transaction[]): TransactionGroup[] => {
    const groups: Record<string, Transaction[]> = {};

    transactions.forEach(transaction => {
        const dateString = format(transaction.date, 'yyyy-MM-dd');
        if (!groups[dateString]) {
            groups[dateString] = [];
        }
        groups[dateString].push(transaction);
    });

    // Sắp xếp các ngày theo thứ tự giảm dần
    const sortedGroups = Object.keys(groups).sort((a, b) =>
        new Date(b).getTime() - new Date(a).getTime()
    );

    return sortedGroups.map(date => ({
        date: new Date(date),
        transactions: groups[date]
    }));
};

// Hàm chọn icon cho category
const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
        case 'mua sắm':
            return <ShoppingBagIcon className="w-3 h-3" />;
        case 'ăn uống':
            return <CoffeeIcon className="w-3 h-3" />;
        case 'nhà cửa':
            return <HomeIcon className="w-3 h-3" />;
        case 'phương tiện':
            return <CarIcon className="w-3 h-3" />;
        case 'thu nhập':
        case 'chuyển khoản':
            return <PiggyBankIcon className="w-3 h-3" />;
        case 'hoá đơn':
            return <FileTextIcon className="w-3 h-3" />;
        default:
            return <ShoppingBagIcon className="w-3 h-3" />;
    }
};

// Hàm định dạng số tiền
const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

interface AgentDialogProps {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    data: {
        transactions?: Transaction[];
    } | null;
}

export function AgentDialog({ isOpen, setOpen, data }: AgentDialogProps) {
    // Sử dụng dữ liệu mẫu hoặc data từ props
    const transactions = data?.transactions || sampleTransactions;
    const groupedTransactions = groupTransactionsByDate(transactions);

    // Tính tổng thu nhập và chi tiêu
    const totalIncoming = transactions
        .filter(t => t.type === 'incoming')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalOutgoing = transactions
        .filter(t => t.type === 'outgoing')
        .reduce((sum, t) => sum + t.amount, 0);

    // Số giao dịch hôm nay
    const todayTransactions = transactions.filter(t => {
        const today = new Date();
        return t.date.getDate() === today.getDate() &&
            t.date.getMonth() === today.getMonth() &&
            t.date.getFullYear() === today.getFullYear();
    });

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[850px] max-h-[750px] overflow-hidden rounded-xl border-primary/10 shadow-lg shadow-primary/5">
                <DialogHeader className="mb-1">
                    <DialogTitle className="text-xl font-semibold text-primary/90 flex items-center">
                        <div className="mr-2 bg-primary/40 p-1.5 rounded-md">
                            <TrendingUpIcon className="h-5 w-5 text-primary/90" />
                        </div>
                        Phân tích giao dịch
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col md:flex-row md:items-start gap-5 pb-5 border-b">
                    <div className="hidden md:flex flex-col items-center space-y-3 flex-shrink-0">
                        <div className="w-32 h-32 p-1.5 flex items-center justify-center">
                            <img
                                src={agentGif.src}
                                alt="Agent Animation"
                                className="w-full h-full object-contain rounded-full"
                            />
                        </div>

                        <div className="w-full space-y-2">
                            <div className="flex justify-between items-center text-xs font-medium">
                                <span className="text-green-600 flex items-center">
                                    <ArrowDownIcon className="h-3 w-3 mr-1" />
                                    Thu
                                </span>
                                <span>{formatCurrency(totalIncoming)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-medium">
                                <span className="text-red-600 flex items-center">
                                    <ArrowUpIcon className="h-3 w-3 mr-1" />
                                    Chi
                                </span>
                                <span>{formatCurrency(totalOutgoing)}</span>
                            </div>
                            <div className="pt-1 border-t">
                                <div className="flex justify-between items-center text-xs font-semibold">
                                    <span className="text-green-500 me-2">Chênh lệch </span>
                                    <span>{formatCurrency(totalIncoming - totalOutgoing)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="space-y-4">
                            <div className="bg-primary/10 p-4 rounded-xl">
                                <h3 className="text-sm font-medium text-primary/90 mb-2 flex items-center">
                                    <CalendarIcon className="h-4 w-4 mr-2 text-primary/80" />
                                    Hôm nay: {format(new Date(), 'EEEE, dd MMMM yyyy', { locale: vi })}
                                </h3>

                                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-3">
                                    <Badge variant="outline" className="bg-primary/5 text-primary/80 border-primary/20 px-2.5 py-1">
                                        <PiggyBankIcon className="h-3 w-3 mr-1.5" />
                                        <span>MB Bank</span>
                                    </Badge>
                                    <span>•</span>
                                    <span className="font-medium">
                                        Đã phân tích {transactions.length} giao dịch
                                    </span>
                                    {transactions.length > 0 && (
                                        <>
                                            <span>•</span>
                                            <span className="font-medium text-green-500">
                                                +{formatCurrency(totalIncoming)}
                                            </span>
                                            <span>•</span>
                                            <span className="font-medium text-red-600">
                                                -{formatCurrency(totalOutgoing)}
                                            </span>
                                        </>
                                    )}
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative p-3.5 bg-primary/10 rounded-lg border border-primary/20 shadow-sm"
                                >
                                    <div className="absolute left-3 top-3.5 flex items-center justify-center">
                                        <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></div>
                                        <div className="h-2 w-2 rounded-full bg-amber-300 animate-pulse absolute" style={{ animationDelay: "300ms" }}></div>
                                    </div>
                                    <p className="text-xs italic text-green-600 font-semibold pl-5">
                                        Hôm nay lại có tận {todayTransactions.length} giao dịch hả? Bạn có biết cách chi tiêu hợp lý hơn không vậy...
                                    </p>
                                </motion.div>
                            </div>

                            <div className="relative">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/70" />
                                <Input
                                    placeholder="Tìm kiếm theo mô tả, số tài khoản, số tiền..."
                                    className="pl-9 pr-4 h-10 text-xs rounded-lg border-primary/20 focus:border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <ScrollArea className="h-[400px] pr-4 pt-2">
                    <div className="space-y-6">
                        {groupedTransactions.map((group, groupIndex) => (
                            <motion.div
                                key={groupIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4, delay: groupIndex * 0.1 }}
                                className="space-y-2.5"
                            >
                                <div className="sticky top-0 bg-gradient-to-r from-primary/10 via-primary/5 to-background p-2.5 rounded-md z-10">
                                    <h3 className="text-xs font-medium flex items-center text-primary">
                                        <CalendarIcon className="mr-2 h-3.5 w-3.5 text-primary/80" />
                                        {format(group.date, 'EEEE, dd MMMM yyyy', { locale: vi })}
                                    </h3>
                                </div>

                                <div className="space-y-3 pl-1">
                                    {group.transactions.map((transaction, idx) => (
                                        <motion.div
                                            key={transaction.id}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                                            className={cn(
                                                "p-3.5 rounded-xl border hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow group",
                                                transaction.type === "incoming" 
                                                    ? "border-green-100/60 bg-gradient-to-r from-green-50/30 to-transparent hover:from-green-50/50" 
                                                    : "border-red-100/60 bg-gradient-to-r from-red-50/30 to-transparent hover:from-red-50/50"
                                            )}
                                        >
                                            <div className="flex justify-between items-center gap-3">
                                                <div className="flex items-center gap-3.5">
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-sm",
                                                        transaction.type === "incoming"
                                                            ? "bg-gradient-to-br from-green-100 to-green-50 group-hover:from-green-200 group-hover:to-green-100"
                                                            : "bg-gradient-to-br from-red-100 to-red-50 group-hover:from-red-200 group-hover:to-red-100"
                                                    )}>
                                                        {transaction.type === "incoming"
                                                            ? <ArrowDownIcon className="h-4.5 w-4.5 text-green-600" />
                                                            : <ArrowUpIcon className="h-4.5 w-4.5 text-red-600" />
                                                        }
                                                    </div>

                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="text-sm font-medium truncate group-hover:text-primary transition-colors">{transaction.description}</h4>
                                                            <Badge
                                                                variant="secondary"
                                                                className={cn(
                                                                    "h-5 px-2 text-[0.65rem] flex items-center gap-1 leading-none ml-auto transition-colors shadow-sm",
                                                                    transaction.type === "incoming"
                                                                        ? "bg-green-50 text-green-700 group-hover:bg-green-100 border-green-100"
                                                                        : "bg-red-50 text-red-700 group-hover:bg-red-100 border-red-100"
                                                                )}
                                                            >
                                                                {getCategoryIcon(transaction.category)}
                                                                <span className="truncate max-w-20">{transaction.category}</span>
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center text-[0.7rem] text-muted-foreground mt-1.5 gap-2">
                                                            <span className="flex items-center bg-muted/30 px-1.5 py-0.5 rounded-full">
                                                                <CalendarIcon className="mr-1 h-3 w-3" />
                                                                {format(transaction.date, 'HH:mm')}
                                                            </span>
                                                            <div className="h-1 w-1 rounded-full bg-muted-foreground/40"></div>
                                                            <span className="font-mono truncate bg-muted/30 px-1.5 py-0.5 rounded-full">{transaction.accountNumber}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={cn(
                                                    "text-sm font-semibold tabular-nums transition-all duration-300 group-hover:scale-105 py-1.5 px-3 rounded-lg",
                                                    transaction.type === "incoming" 
                                                        ? "text-green-600 bg-green-50 group-hover:bg-green-100" 
                                                        : "text-red-600 bg-red-50 group-hover:bg-red-100"
                                                )}>
                                                    {transaction.type === "incoming" ? "+" : "-"}{formatCurrency(transaction.amount)}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </ScrollArea>

                <DialogFooter className="flex flex-row justify-between items-center pt-3 border-t">
                    <div className="text-xs text-muted-foreground flex items-center">
                        <Badge variant="outline" className="mr-2 bg-primary/5">
                            {transactions.length}
                        </Badge>
                        <span>giao dịch đã được phân tích</span>
                    </div>
                    <Button type="button" size="sm" className="text-xs h-9 px-4 bg-primary/90 hover:bg-primary transition-colors">
                        <FileTextIcon className="mr-2 h-3.5 w-3.5" />
                        Xuất báo cáo chi tiết
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
