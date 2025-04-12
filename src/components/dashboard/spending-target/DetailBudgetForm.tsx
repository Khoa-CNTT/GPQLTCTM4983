"use client"
import type React from "react"
import { formatCurrency, formatDateTimeVN } from "@/libraries/utils"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { IDialogFlags, IBudgetTarget } from "@/core/fund-saving-target/models"
import { Badge } from "@/components/ui/badge"
import {
    ArrowRightIcon,
    CalendarDays,
    CheckCircle2,
    CircleDollarSign,
    Clock,
    Delete,
    FileText,
    PencilIcon,
    PiggyBank,
    Target,
    Trash2,
    Wallet,
    XCircle,
} from "lucide-react"
interface DetailBudgetFormProps {
    selectedTarget: IBudgetTarget | null
    onClose: () => void
    onEdit: () => void
    setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogFlags>>
}

const DetailBudgetForm: React.FC<DetailBudgetFormProps> = ({ selectedTarget, onClose, setIsDialogOpen }) => {
    if (!selectedTarget) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <PiggyBank className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Không tìm thấy mục tiêu</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                    Không thể tìm thấy thông tin chi tiết của mục tiêu này. Vui lòng thử lại sau.
                </p>
                <Button variant="outline" onClick={onClose} className="min-w-[100px]">
                    <XCircle className="mr-2 h-4 w-4" />
                    Đóng
                </Button>
            </div>
        )
    }

    const percentage = Math.min(100, Math.round((selectedTarget.currentAmount / selectedTarget.targetAmount) * 100))
    const remaining = selectedTarget.targetAmount - selectedTarget.currentAmount
    const isCompleted = percentage >= 100

    return (
        <div className="space-y-6 py-4">
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                        <CircleDollarSign className={`h-6 w-6 ${isCompleted ? "text-emerald-500" : "text-blue-500"}`} />
                        <h2 className="text-2xl font-semibold">{selectedTarget.name}</h2>
                        <Badge
                            variant={isCompleted ? "outline" : "secondary"}
                            className={`${isCompleted ? "border-emerald-500 text-emerald-700 bg-emerald-50" : ""}`}
                        >
                            {selectedTarget.trackerTypeName}
                        </Badge>
                    </div>

                    {selectedTarget.description && (
                        <div className="flex items-start mt-1">
                            <FileText className="h-4 w-4 text-muted-foreground mt-0.5 mr-2 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">{selectedTarget.description}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="p-4 bg-muted/30 rounded-lg">
                            <div className="flex items-center mb-2">
                                <Target className="h-5 w-5 text-muted-foreground mr-2" />
                                <h3 className="font-medium">Mục tiêu</h3>
                            </div>
                            <p className="text-2xl font-semibold">{formatCurrency(selectedTarget.targetAmount)}</p>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg">
                            <div className="flex items-center mb-2">
                                <Wallet className="h-5 w-5 text-muted-foreground mr-2" />
                                <h3 className="font-medium">Đã tiết kiệm</h3>
                            </div>
                            <p className="text-2xl font-semibold">{formatCurrency(selectedTarget.currentAmount)}</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground flex items-center">
                                <Clock className="h-4 w-4 mr-1.5" />
                                Tiến độ:
                            </span>
                            <span
                                className={`font-medium flex items-center ${isCompleted ? "text-emerald-600" : "text-blue-600"}`}
                            >
                                {isCompleted && <CheckCircle2 className="h-4 w-4 mr-1.5" />}
                                {percentage}%
                            </span>
                        </div>
                        <Progress
                            value={percentage}
                            className={`h-3 ${isCompleted ? "bg-emerald-100" : percentage > 75 ? "bg-blue-100" : "bg-muted/50"
                                }`}
                        />

                        {!isCompleted && (
                            <p className="text-sm text-muted-foreground mt-2">
                                Còn thiếu: {formatCurrency(remaining)}
                            </p>
                        )}
                    </div>

                    <div className="mt-6 border-t pt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Thời gian bắt đầu</p>
                                <p className="flex items-center mt-1">
                                    <CalendarDays className="h-4 w-4 mr-1.5 text-muted-foreground" />
                                    {formatDateTimeVN(selectedTarget.startDate, false)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Thời gian kết thúc</p>
                                <p className="flex items-center mt-1">
                                    <CalendarDays className="h-4 w-4 mr-1.5 text-muted-foreground" />
                                    {formatDateTimeVN(selectedTarget.endDate, false)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <p className="text-sm text-muted-foreground">Thời gian còn lại</p>
                        <p className="font-medium mt-1">{selectedTarget.remainingDays}</p>
                    </div>

                    <div className="mt-6">
                        <Badge
                        >
                            {selectedTarget.status}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="flex justify-between gap-3 pt-4 border-t">
                <div className="flex gap-3 ml-auto">
                    <Button variant="outline" onClick={onClose}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Đóng
                    </Button>
                    <Button variant="destructive" onClick={() => setIsDialogOpen(
                        (prev) => ({ ...prev, isDialogDeleteTargetOpen: true })
                    )}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                    </Button>
                    <Button
                        onClick={() => setIsDialogOpen((prev) => ({ ...prev, isDialogEditTargetOpen: true })
                    )}>
                        <PencilIcon className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default DetailBudgetForm
