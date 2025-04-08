"use client"
import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, XCircle } from "lucide-react"
import { formatCurrency } from "@/libraries/utils"
import { Label } from "@/components/ui/label"
import { IBudgetTarget } from "@/core/fund-saving-target/models/fund-saving-target.interface"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ChangeStatusBudgetFormProps {
    selectedBudget: IBudgetTarget | null
    onClose: () => void
    onChangeStatus: (id: string, status: string) => void
    isLoading: boolean
}

const ChangeStatusBudgetForm: React.FC<ChangeStatusBudgetFormProps> = ({
    selectedBudget,
    onClose,
    onChangeStatus,
    isLoading
}) => {
    const [status, setStatus] = React.useState<string>(selectedBudget?.status || "ACTIVE")

    const handleChangeStatus = () => {
        if (selectedBudget) {
            onChangeStatus(selectedBudget.id, status)
        }
        onClose()
    }

    if (!selectedBudget) {
        return (
            <div className="flex justify-center items-center p-6">
                <p className="text-muted-foreground">Không tìm thấy thông tin mục tiêu</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="py-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-medium">{selectedBudget.name}</h3>
                            <Badge>{selectedBudget.fundName}</Badge>
                        </div>
                        <div className="mt-2 flex justify-between text-sm">
                            <span className="text-muted-foreground">Mục tiêu: </span>
                            <span>{formatCurrency(selectedBudget.targetAmount)}</span>
                        </div>
                        <div className="mt-1 flex justify-between text-sm">
                            <span className="text-muted-foreground">Hiện tại: </span>
                            <span>{formatCurrency(selectedBudget.currentAmount)}</span>
                        </div>
                        <div className="mt-1 flex justify-between text-sm">
                            <span className="text-muted-foreground">Trạng thái hiện tại: </span>
                            <Badge >
                                {selectedBudget.status}
                            </Badge>
                        </div>
                        <div className="mt-4">
                            <span className="text-sm text-muted-foreground">Thời gian: </span>
                            <p className="flex items-center mt-1">
                                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                {new Date(selectedBudget.startDate).toLocaleDateString('vi-VN')} - {new Date(selectedBudget.endDate).toLocaleDateString('vi-VN')}
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
                    disabled={isLoading || status === selectedBudget.status}
                    isLoading={isLoading}
                >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Cập nhật trạng thái
                </Button>
            </div>
        </div>
    )
}

export default ChangeStatusBudgetForm
