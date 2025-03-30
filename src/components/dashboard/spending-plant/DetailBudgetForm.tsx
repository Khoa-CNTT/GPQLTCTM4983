"use client"
import React from "react"
import { formatCurrency, formatDateTimeVN } from "@/libraries/utils"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { IBudget } from "@/core/fund-saving-target/models"

interface DetailBudgetFormProps {
    selectedBudget: IBudget | null
    onClose: () => void
    onEdit: () => void
}

const DetailBudgetForm: React.FC<DetailBudgetFormProps> = ({ selectedBudget, onClose, onEdit }) => {
    return (
        <div className="space-y-4">
            {selectedBudget && (
                <>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground">Danh mục</h4>
                            <p className="text-base font-medium">{selectedBudget.category}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground">Trạng thái</h4>
                            <p className="text-base font-medium capitalize">
                                {selectedBudget.status === "active"
                                    ? "Đang hoạt động"
                                    : selectedBudget.status === "completed"
                                        ? "Hoàn thành"
                                        : "Vượt ngân sách"}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground">Ngân sách</h4>
                            <p className="text-base font-medium">{formatCurrency(selectedBudget.budgetAmount, "đ", "vi-vn")}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground">Đã chi tiêu</h4>
                            <p className="text-base font-medium">{formatCurrency(selectedBudget.spentAmount, "đ", "vi-vn")}</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Còn lại</h4>
                        <p
                            className={`text-base font-medium ${selectedBudget.remainingAmount < 0 ? "text-red-500" : "text-green-500"
                                }`}
                        >
                            {formatCurrency(selectedBudget.remainingAmount, "đ", "vi-vn")}
                        </p>
                        <div className="mt-2">
                            <div className="flex justify-between text-xs">
                                <span>0%</span>
                                <span>100%</span>
                            </div>
                            <Progress
                                value={(selectedBudget.spentAmount / selectedBudget.budgetAmount) * 100}
                                className={`h-2 w-24 ${selectedBudget.status === "exceeded" ? "bg-red-200" : "bg-blue-200"
                                    }`}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground">Từ ngày</h4>
                            <p className="text-base font-medium">{formatDateTimeVN(selectedBudget.startDate, true)}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground">Đến ngày</h4>
                            <p className="text-base font-medium">{formatDateTimeVN(selectedBudget.endDate, true)}</p>
                        </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Tạo lúc: {formatDateTimeVN(selectedBudget.createdAt, true)}</span>
                        <span>Cập nhật: {formatDateTimeVN(selectedBudget.updatedAt, true)}</span>
                    </div>
                </>
            )}
            <div className="flex justify-end gap-2 sm:gap-0">
                <Button variant="outline" onClick={onClose}>
                    Đóng
                </Button>
                <Button onClick={onEdit}>Chỉnh sửa</Button>
            </div>
        </div>
    )
}

export default DetailBudgetForm