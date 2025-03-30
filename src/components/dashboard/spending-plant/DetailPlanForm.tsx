"use client"
import React from "react"
import { formatCurrency, formatDateTimeVN } from "@/libraries/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ISpendingPlan } from "@/core/fund-saving-plant/models"

interface DetailPlanFormProps {
    selectedPlan: ISpendingPlan | null
    onClose: () => void
    onEdit: () => void
}

const DetailPlanForm: React.FC<DetailPlanFormProps> = ({ selectedPlan, onClose, onEdit }) => {
    return (
        <div className="space-y-4">
            {selectedPlan && (
                <>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground">Tiêu đề</h4>
                            <p className="text-base font-medium">{selectedPlan.title}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground">Danh mục</h4>
                            <p className="text-base font-medium">{selectedPlan.category}</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Mô tả</h4>
                        <p className="text-base">{selectedPlan.description || "Không có mô tả"}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground">Số tiền</h4>
                            <p className="text-base font-medium">{formatCurrency(selectedPlan.amount, "đ", "vi-vn")}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground">Ngày dự kiến</h4>
                            <p className="text-base font-medium">{formatDateTimeVN(selectedPlan.plannedDate, true)}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground">Trạng thái</h4>
                            <p className="text-base font-medium capitalize">
                                {selectedPlan.status === "pending"
                                    ? "Chờ thực hiện"
                                    : selectedPlan.status === "completed"
                                        ? "Hoàn thành"
                                        : "Đã hủy"}
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground">Thông báo</h4>
                            <p className="text-base font-medium">
                                {selectedPlan.notifyBefore === 0 ? "Không thông báo" : `Trước ${selectedPlan.notifyBefore} ngày`}
                            </p>
                        </div>
                    </div>
                    {selectedPlan.accountSourceName && (
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground">Nguồn tiền</h4>
                            <p className="text-base font-medium">{selectedPlan.accountSourceName}</p>
                        </div>
                    )}
                    <Separator />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Tạo lúc: {formatDateTimeVN(selectedPlan.createdAt, true)}</span>
                        <span>Cập nhật: {formatDateTimeVN(selectedPlan.updatedAt, true)}</span>
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

export default DetailPlanForm