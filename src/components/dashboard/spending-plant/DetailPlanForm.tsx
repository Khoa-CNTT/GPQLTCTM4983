"use client"
import React from "react"
import { formatCurrency, formatDateTimeVN } from "@/libraries/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ISpendingPlan } from "@/core/fund-saving-plant/models"
import { Badge } from "@/components/ui/badge"
import { CalendarClock, CalendarDays, CircleDollarSign, PencilIcon, Repeat, Trash } from "lucide-react"
import { IDialogFlags } from "@/core/fund-saving-target/models/fund-saving-target.interface"

interface DetailPlanFormProps {
    selectedPlan: ISpendingPlan | null;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogFlags>>;
}


const DetailPlanForm: React.FC<DetailPlanFormProps> = ({
    selectedPlan,
    setIsDialogOpen
}) => {
    if (!selectedPlan) return null;

    return (
        <div className="space-y-4">
            <div className="p-4 rounded-lg border bg-muted/30">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Tiêu đề</h4>
                        <p className="text-base font-medium">{selectedPlan.name}</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Danh mục</h4>
                        <div className="flex items-center">
                            <CircleDollarSign className="h-4 w-4 text-emerald-500 mr-1.5" />
                            <p className="text-base font-medium">{selectedPlan.trackerTypeName || "Chưa phân loại"}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Mô tả</h4>
                    <p className="text-base">{selectedPlan.description || "Không có mô tả"}</p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Số tiền</h4>
                        <p className="text-base font-medium text-emerald-600">{formatCurrency(selectedPlan.targetAmount)}</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Ngày dự kiến</h4>
                        <div className="flex items-center">
                            <CalendarDays className="h-4 w-4 text-blue-500 mr-1.5" />
                            <p className="text-base font-medium">{formatDateTimeVN(selectedPlan.expectedDate, true)}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Tần suất lặp lại</h4>
                        <Badge className={
                            selectedPlan.type === "DAILY" ? "bg-purple-500" :
                                selectedPlan.type === "WEEKLY" ? "bg-blue-500" :
                                    selectedPlan.type === "MONTHLY" ? "bg-emerald-500" : "bg-amber-500"
                        }>
                            <Repeat className="h-3.5 w-3.5 mr-1.5" />
                            {selectedPlan.type}
                        </Badge>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Số ngày còn lại</h4>
                        <p className="text-base font-medium">
                            {selectedPlan.remainingDays !== null ? `${selectedPlan.remainingDays} ngày` : "Không xác định"}
                        </p>
                    </div>
                </div>

                {selectedPlan.fundName && (
                    <div className="mt-4">
                        <h4 className="text-sm font-medium text-muted-foreground">Nguồn tiền</h4>
                        <p className="text-base font-medium">{selectedPlan.fundName}</p>
                    </div>
                )}
            </div>

            <Separator />

            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                    <CalendarClock className="h-4 w-4 mr-1.5" />
                    <span>Ngày hết hạn: {formatDateTimeVN(selectedPlan.expiredDate, true)}</span>
                </div>
            </div>

            <div className="flex justify-end gap-2 sm:gap-0">
                <Button variant="outline" onClick={
                    () => setIsDialogOpen(prev => ({
                        ...prev,
                        isDialogDetailPlanOpen: false
                    }))
                }
                    className="mr-2">
                    Đóng
                </Button>
                <Button variant="destructive"
                    className="mr-2"
                    onClick={() => {
                        setIsDialogOpen(prev => ({
                            ...prev,
                            isDialogDeletePlanOpen: true,
                            isDialogDetailPlanOpen: false
                        }))
                    }}
                >
                    <Trash className="h-4 w-4 mr-1.5" />
                    Xóa
                </Button>
                <Button onClick={
                    () => setIsDialogOpen(prev => ({
                        ...prev,
                        isDialogEditPlanOpen: true,
                        isDialogDetailPlanOpen: false
                    }))
                }>
                    Chỉnh sửa
                </Button>

            </div>
        </div>
    )
}

export default DetailPlanForm
