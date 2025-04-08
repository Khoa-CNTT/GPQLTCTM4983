"use client";

import React from "react";
import CustomDialog from "@/components/dashboard/Dialog";
import { IDataTableConfig, IDialogConfig } from "@/types/common.i";
import CreatePlanForm from "../../../components/dashboard/spending-plant/CreatePlanForm";
import EditPlanForm from "../../../components/dashboard/spending-plant/EditPlanForm";
import DeletePlanForm from "../../../components/dashboard/spending-plant/DeletePlanForm";
import DetailPlanForm from "../../../components/dashboard/spending-plant/DetailPlanForm";
import CreateBudgetForm from "../../../components/dashboard/spending-target/CreateBudgetForm";
import EditBudgetForm from "../../../components/dashboard/spending-target/EditBudgetForm";
import DeleteBudgetForm from "../../../components/dashboard/spending-target/DeleteBudgetForm";
import ChangeStatusBudgetForm from "@/components/dashboard/spending-target/ChangeStatusBudgetForm";
import ChangeStatusPlanForm from "@/components/dashboard/spending-plant/ChangeStatusPlanForm";
import { IBudgetTarget, ICreateFundSavingTargetRequest, IDialogFlags, IGetAllDataFundSavingTargetTable, IUpdateFundSavingTargetRequest } from "@/core/fund-saving-target/models/fund-saving-target.interface";
import { ICreateFundSavingPlanRequest, ISpendingPlan, ISpendingPlanTable, IUpdateFundSavingPlanRequest } from "@/core/fund-saving-plant/models";
import DetailBudgetForm from "@/components/dashboard/spending-target/DetailBudgetForm";
import { DataTable } from "@/components/dashboard/DataTable";
import { ColumnDef } from "@tanstack/react-table";

interface ISpendingPlanDialogProps {
    plansDialog: {
        transformedSpendingPlanData: ISpendingPlanTable[];
        planColumns: ColumnDef<ISpendingPlanTable>[];
        dataTableConfig: IDataTableConfig;
        setDataTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>;
        spendingPlans: ISpendingPlan[];
        setSelectedPlan: (plan: ISpendingPlan | null) => void;
        isLoading: boolean;
    };
    targetsDialog: {
        transformedTargetData: IGetAllDataFundSavingTargetTable[];
        targetColumns: ColumnDef<IGetAllDataFundSavingTargetTable>[];
        targetTableConfig: IDataTableConfig;
        setTargetTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>;
        targets: IBudgetTarget[];
        setSelectedTarget: (target: IBudgetTarget | null) => void;
        isLoading: boolean;
    };
    sharedDialogElements: {
        isDialogOpen: IDialogFlags;
        setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogFlags>>;
        selectedPlan: ISpendingPlan | null;
        selectedTarget: IBudgetTarget | null;
    };
    callBack: {
        onCreatePlan: (plan: ICreateFundSavingPlanRequest) => void;
        onUpdatePlan: (plan: IUpdateFundSavingPlanRequest) => void;
        onDeletePlan: (id: string) => void;
        onRestorePlan: (id: string) => void;
        onUpdatePlanStatus: (id: string, status: string) => void;

        onCreateTarget: (target: ICreateFundSavingTargetRequest) => void;
        onUpdateTarget: (target: IUpdateFundSavingTargetRequest) => void;
        onDeleteTarget: (id: string) => void;
        onRestoreTarget: (id: string) => void;
        onUpdateTargetStatus: (id: string, status: string) => void;

        onGetAllFundSavingTarget: () => IBudgetTarget[];
        onGetAllFundSavingPlan: () => ISpendingPlan[];
    }
}

const SpendingPlanDialog: React.FC<ISpendingPlanDialogProps> = ({
    plansDialog,
    targetsDialog,
    sharedDialogElements,
    callBack,
}) => {
    const { isDialogOpen, setIsDialogOpen, selectedPlan, selectedTarget } = sharedDialogElements;
    const createPlanDialog: IDialogConfig = {
        title: "Tạo kế hoạch chi tiêu",
        description: "Tạo một kế hoạch chi tiêu mới để quản lý tài chính hiệu quả hơn.",
        content: (
            <CreatePlanForm
                isOpen={isDialogOpen.isDialogCreatePlanOpen}
                onCreatePlan={callBack.onCreatePlan}
                onClose={() => setIsDialogOpen((prev) => ({ ...prev, isDialogCreatePlanOpen: false }))}
                isLoading={plansDialog.isLoading}
            />
        ),
        className: "w-full max-w-lg h-auto",
        isOpen: isDialogOpen.isDialogCreatePlanOpen,
        onClose: () => setIsDialogOpen((prev) => ({ ...prev, isDialogCreatePlanOpen: false })),
    };

    const editPlanDialog: IDialogConfig = {
        title: "Chỉnh sửa kế hoạch chi tiêu",
        description: "Cập nhật thông tin kế hoạch chi tiêu của bạn.",
        content: (
            <EditPlanForm
                isOpen={isDialogOpen.isDialogEditPlanOpen}
                selectedPlan={selectedPlan}
                onUpdatePlan={callBack.onUpdatePlan}
                onClose={() => setIsDialogOpen((prev) => ({ ...prev, isDialogEditPlanOpen: false }))}
                isLoading={plansDialog.isLoading}
            />
        ),
        className: "w-full max-w-lg h-auto",
        isOpen: isDialogOpen.isDialogEditPlanOpen,
        onClose: () => setIsDialogOpen((prev) => ({ ...prev, isDialogEditPlanOpen: false })),
    };

    const detailPlanDialog: IDialogConfig = {
        title: "Chi tiết kế hoạch",
        description: "Xem thông tin chi tiết của kế hoạch chi tiêu.",
        content: (
            <DetailPlanForm
                selectedPlan={selectedPlan}
                setIsDialogOpen={setIsDialogOpen}
            />
        ),
        className: "sm:max-w-[425px] md:max-w-[700px]",
        isOpen: isDialogOpen.isDialogDetailPlanOpen,
        onClose: () => setIsDialogOpen((prev) => ({ ...prev, isDialogDetailPlanOpen: false })),
    };

    const deletePlanDialog: IDialogConfig = {
        title: "Xóa kế hoạch",
        description: "Bạn có chắc chắn muốn xóa kế hoạch này? Hành động này không thể hoàn tác.",
        content: (
            <DeletePlanForm
                selectedPlan={selectedPlan}
                onDeletePlan={(id : string) => {
                    callBack.onDeletePlan(id);
                    setIsDialogOpen(prev => ({ ...prev, isDialogDeletePlanOpen: false }));
                }}
                onClose={() => setIsDialogOpen((prev) => ({ ...prev, isDialogDeletePlanOpen: false }))}
                isLoading={plansDialog.isLoading}
            />
        ),
        isOpen: isDialogOpen.isDialogDeletePlanOpen,
        onClose: () => setIsDialogOpen((prev) => ({ ...prev, isDialogDeletePlanOpen: false })),
    };

    const changeStatusPlanDialog: IDialogConfig = {
        title: "Đổi tần suất lặp lại",
        description: "Thay đổi tần suất lặp lại cho kế hoạch chi tiêu của bạn.",
        content: (
            <ChangeStatusPlanForm
                selectedPlan={selectedPlan}
                onChangeStatus={(id, status) => {
                    callBack.onUpdatePlanStatus(id, status);
                    setIsDialogOpen(prev => ({ ...prev, isDialogChangeStatusPlanOpen: false }));
                }}
                onClose={() => setIsDialogOpen((prev) => ({ ...prev, isDialogChangeStatusPlanOpen: false }))}
                isLoading={plansDialog.isLoading}
            />
        ),
        isOpen: isDialogOpen.isDialogChangeStatusPlanOpen || false,
        onClose: () => setIsDialogOpen((prev) => ({ ...prev, isDialogChangeStatusPlanOpen: false })),
    };

    // Target Dialog Configurations
    const createTargetDialog: IDialogConfig = {
        title: "Tạo ngân sách mới",
        description: "Tạo một ngân sách mới để quản lý chi tiêu hiệu quả hơn.",
        content: (
            <CreateBudgetForm
                isOpen={isDialogOpen.isDialogCreateTargetOpen}
                onCreateBudget={callBack.onCreateTarget}
                onClose={() => setIsDialogOpen((prev) => ({ ...prev, isDialogCreateTargetOpen: false }))}
                isLoading={targetsDialog.isLoading}
            />
        ),
        className: "sm:max-w-[425px] md:max-w-[600px]",
        isOpen: isDialogOpen.isDialogCreateTargetOpen,
        onClose: () => setIsDialogOpen((prev) => ({ ...prev, isDialogCreateTargetOpen: false })),
    };

    const editTargetDialog: IDialogConfig = {
        title: "Chỉnh sửa ngân sách",
        description: "Cập nhật thông tin ngân sách của bạn.",
        content: (
            <EditBudgetForm
                isOpen={isDialogOpen.isDialogEditTargetOpen}
                selectedBudget={selectedTarget}
                onUpdateBudget={callBack.onUpdateTarget}
                onClose={() => setIsDialogOpen((prev) => ({ ...prev, isDialogEditTargetOpen: false , isDialogDetailTargetOpen: false}))}
                isLoading={targetsDialog.isLoading}
            />
        ),
        className: "sm:max-w-[425px] md:max-w-[600px]",
        isOpen: isDialogOpen.isDialogEditTargetOpen,
        onClose: () => setIsDialogOpen((prev) => ({ ...prev, isDialogEditTargetOpen: false })),
    };

    const detailTargetDialog: IDialogConfig = {
        title: "Chi tiết ngân sách",
        description: "Xem thông tin chi tiết của ngân sách.",
        content: (
            <DetailBudgetForm
                setIsDialogOpen={setIsDialogOpen}
                selectedTarget={selectedTarget}
                onClose={() => setIsDialogOpen((prev) => ({ ...prev, isDialogDetailTargetOpen: false }))}
                onEdit={() => {
                    setIsDialogOpen(prev => ({
                        ...prev,
                        isDialogEditTargetOpen: true,
                        isDialogDetailTargetOpen: false
                    }));
                }}
            />
        ),
        className: "sm:max-w-[425px] md:max-w-[700px]",
        isOpen: isDialogOpen.isDialogDetailTargetOpen,
        onClose: () => setIsDialogOpen((prev) => ({ ...prev, isDialogDetailTargetOpen: false })),
    };

    const deleteTargetDialog: IDialogConfig = {
        title: "Xóa ngân sách",
        description: "Bạn có chắc chắn muốn xóa ngân sách này? Hành động này không thể hoàn tác.",
        content: (
            <DeleteBudgetForm
                selectedBudget={selectedTarget}
                onDeleteBudget={(id) => {
                    callBack.onDeleteTarget(id);
                    setIsDialogOpen(prev => ({ ...prev, isDialogDeleteTargetOpen: false }));
                }}
                onClose={() => setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteTargetOpen: false }))}
                isLoading={targetsDialog.isLoading}
            />
        ),
        isOpen: isDialogOpen.isDialogDeleteTargetOpen,
        onClose: () => setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteTargetOpen: false })),
    };

    const changeStatusTargetDialog: IDialogConfig = {
        title: "Đổi trạng thái",
        description: "Bạn có chắc chắn muốn đổi trạng thái ngân sách này? Hành động này không thể hoàn tác.",
        content: (
            <ChangeStatusBudgetForm
                selectedBudget={selectedTarget}
                onChangeStatus={(id, status) => {
                    callBack.onUpdateTargetStatus(id, status);
                    setIsDialogOpen(prev => ({ ...prev, isDialogChangeStatusTargetOpen: false }));
                }}
                onClose={() => setIsDialogOpen((prev) => ({ ...prev, isDialogChangeStatusTargetOpen: false }))}
                isLoading={targetsDialog.isLoading}
            />
        ),
        isOpen: isDialogOpen.isDialogChangeStatusTargetOpen,
        onClose: () => setIsDialogOpen((prev) => ({ ...prev, isDialogChangeStatusTargetOpen: false })),
    };

    const viewAllDataDialog: IDialogConfig = {
        title: "Chi tiết tất cả mục tiêu",
        description: "Xem tất cả các mục tiêu tiết kiệm của bạn.",
        content: (
            <div className='overflow-x-auto'>
                <DataTable
                    columns={targetsDialog.targetColumns}
                    data={targetsDialog.transformedTargetData}
                    config={targetsDialog.targetTableConfig}
                    setConfig={targetsDialog.setTargetTableConfig}
                    onRowClick={(rowData) => {
                        console.log('rowData:', rowData);

                        targetsDialog.setSelectedTarget(rowData as any);
                        setIsDialogOpen(prev => ({
                            ...prev,
                            isDialogDetailTargetOpen: true,
                            isDialogViewAllDataOpen: false
                        }));
                    }}
                />
            </div>
        ),
        className: "w-full max-w-[90vw]",
        isOpen: isDialogOpen.isDialogViewAllDataOpen || false,
        onClose: () => setIsDialogOpen((prev) => ({ ...prev, isDialogViewAllDataOpen: false })),
    };

    const viewAllPlansDialog: IDialogConfig = {
        title: "Chi tiết tất cả kế hoạch chi tiêu",
        description: "Xem tất cả các kế hoạch chi tiêu của bạn.",
        content: (
            <div className='overflow-x-auto'>
                <DataTable
                    columns={plansDialog.planColumns}
                    data={plansDialog.transformedSpendingPlanData}
                    config={plansDialog.dataTableConfig}
                    setConfig={plansDialog.setDataTableConfig}
                    onRowClick={(rowData) => {
                        plansDialog.setSelectedPlan(rowData as any);
                        setIsDialogOpen(prev => ({
                            ...prev,
                            isDialogDetailPlanOpen: true,
                            isDialogViewAllPlansOpen: false
                        }));
                    }}
                />
            </div>
        ),
        className: "w-full max-w-[90vw]",
        isOpen: isDialogOpen.isDialogViewAllPlansOpen || false,
        onClose: () => setIsDialogOpen((prev) => ({ ...prev, isDialogViewAllPlansOpen: false })),
    };

    return (
        <>
            {/* Plan Dialogs */}
            <CustomDialog config={createPlanDialog} />
            <CustomDialog config={editPlanDialog} />
            <CustomDialog config={detailPlanDialog} />
            <CustomDialog config={deletePlanDialog} />
            <CustomDialog config={changeStatusPlanDialog} />

            {/* Target Dialogs */}
            <CustomDialog config={createTargetDialog} />
            <CustomDialog config={editTargetDialog} />
            <CustomDialog config={detailTargetDialog} />
            <CustomDialog config={deleteTargetDialog} />

            <CustomDialog config={viewAllDataDialog} />
            <CustomDialog config={viewAllPlansDialog} />

            {/* Change Status Target Dialog */}
            <CustomDialog config={changeStatusTargetDialog} />
        </>
    );
};

export default SpendingPlanDialog;
