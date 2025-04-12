"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarClock, CheckCircle2, Clock, Repeat, XCircle } from "lucide-react"
import { formatCurrency, formatDateTimeVN } from "@/libraries/utils"
import { ISpendingPlan } from "@/core/fund-saving-plant/models"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ChangeStatusPlanFormProps {
    selectedPlan: ISpendingPlan | null
    onClose: () => void
    onChangeStatus: (id: string, status: string) => void
    isLoading: boolean
}

// Helper function to get human-readable frequency labels
const getFrequencyLabel = (type: string) => {
    switch (type) {
        case "ANNUAL": return "Hàng năm";
        case "MONTHLY": return "Hàng tháng";
        case "WEEKLY": return "Hàng tuần";
        case "DAILY": return "Hàng ngày";
        default: return "Không xác định";
    }
}

const ChangeStatusPlanForm: React.FC<ChangeStatusPlanFormProps> = ({
    selectedPlan,
    onClose,
    onChangeStatus,
    isLoading
}) => {
    const [status, setStatus] = useState<string>("ACTIVE");

    const handleChangeStatus = () => {
        if (selectedPlan) {
            onChangeStatus(selectedPlan.id, status);
        }
        onClose();
    }

    if (!selectedPlan) {
        return (
            <div className="flex justify-center items-center p-6">
                <p className="text-muted-foreground">Không tìm thấy thông tin kế hoạch</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="py-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-medium">{selectedPlan.name}</h3>
                            <Badge variant="outline">{selectedPlan.trackerTypeName || "Chưa phân loại"}</Badge>
                        </div>

                        <div className="mt-2 flex justify-between text-sm">
                            <span className="text-muted-foreground">Số tiền: </span>
                            <span className="font-medium text-emerald-600">{formatCurrency(selectedPlan.targetAmount)}</span>
                        </div>

                        <div className="mt-1 flex justify-between text-sm">
                            <span className="text-muted-foreground">Tần suất: </span>
                            <Badge className={
                                selectedPlan.type === "DAILY" ? "bg-purple-500" :
                                selectedPlan.type === "WEEKLY" ? "bg-blue-500" :
                                selectedPlan.type === "MONTHLY" ? "bg-emerald-500" : "bg-amber-500"
                            }>
                                <Repeat className="h-3.5 w-3.5 mr-1.5" />
                                {getFrequencyLabel(selectedPlan.type)}
                            </Badge>
                        </div>

                        <div className="mt-4">
                            <span className="text-sm text-muted-foreground">Ngày dự kiến: </span>
                            <p className="flex items-center mt-1">
                                <CalendarClock className="h-4 w-4 mr-2 text-muted-foreground" />
                                {formatDateTimeVN(selectedPlan.expectedDate, true)}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-3">
                <h3 className="font-medium">Chọn trạng thái mới</h3>
                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
                        <SelectItem value="CANCELLED">Hủy</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={onClose}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Hủy
                </Button>
                <Button
                    onClick={handleChangeStatus}
                    disabled={isLoading}
                    isLoading={isLoading}
                >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Cập nhật trạng thái
                </Button>
            </div>
        </div>
    )
}

export default ChangeStatusPlanForm
