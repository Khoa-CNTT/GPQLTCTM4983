"use client";

import React from "react";
import CustomDialog from "@/components/dashboard/Dialog";
import { IDataTableConfig, IDialogConfig } from "@/types/common.i";
import CreatePlanForm from "../../../components/dashboard/spending-plant/CreatePlanForm";
import EditPlanForm from "../../../components/dashboard/spending-plant/EditPlanForm";
import DetailPlanForm from "../../../components/dashboard/spending-plant/DetailPlanForm";
import DeletePlanForm from "../../../components/dashboard/spending-plant/DeletePlanForm";
import CreateBudgetForm from "../../../components/dashboard/spending-plant/CreateBudgetForm";
import EditBudgetForm from "../../../components/dashboard/spending-plant/EditBudgetForm";
import DetailBudgetForm from "../../../components/dashboard/spending-plant/DetailBudgetForm";
import DeleteBudgetForm from "../../../components/dashboard/spending-plant/DeleteBudgetForm";
import { DataTable } from "@/components/dashboard/DataTable";
import { RefreshCw } from "lucide-react";
import { ISpendingPlan } from "@/core/fund-saving-plant/models";
import { IBudget, IDialogFlags } from "@/core/fund-saving-target/models";

interface ISpendingPlanDialogProps {
    plansDialog: {
        transformedSpendingPlanData: any[];
        planColumns: any[];
        dataTableConfig: IDataTableConfig;
        setDataTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>;
        spendingPlans: ISpendingPlan[];
        setSelectedPlan: (plan: ISpendingPlan) => void;
        isLoading: boolean;
    };
    budgetsDialog: {
        transformedBudgetData: any[];
        budgetColumns: any[];
        budgetTableConfig: IDataTableConfig;
        setBudgetTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>;
        budgets: IBudget[];
        setSelectedBudget: (budget: IBudget) => void;
        isLoading: boolean;
    };
    sharedDialogElements: {
        isDialogOpen: IDialogFlags;
        setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogFlags>>;
        selectedPlan: ISpendingPlan | null;
        selectedBudget: IBudget | null;
    };
    onCreatePlan: (newPlan: ISpendingPlan) => void;
    onUpdatePlan: (updatedPlan: ISpendingPlan) => void;
    onCreateBudget: (newBudget: IBudget) => void;
    onUpdateBudget: (updatedBudget: IBudget) => void;
    onDeleteBudget: (id: string) => void;
}

const SpendingPlanDialog: React.FC<ISpendingPlanDialogProps> = ({
    plansDialog,
    budgetsDialog,
    sharedDialogElements,
    onCreatePlan,
    onUpdatePlan,
    onCreateBudget,
    onUpdateBudget,
    onDeleteBudget,
}) => {
    const { isDialogOpen, setIsDialogOpen, selectedPlan, selectedBudget } = sharedDialogElements;

    // Plan Dialog Configurations
    const createPlanDialog: IDialogConfig = {
        title: "Tạo kế hoạch chi tiêu",
        description: "Tạo một kế hoạch chi tiêu mới để quản lý tài chính hiệu quả hơn.",
        content: (
            <CreatePlanForm
                isOpen={isDialogOpen.isDialogCreatePlanOpen}
                onCreatePlan={onCreatePlan}
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
                onUpdatePlan={onUpdatePlan}
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
            <div className='overflow-x-auto'>
                <DataTable
                    columns={plansDialog.planColumns}
                    data={plansDialog.transformedSpendingPlanData}
                    config={{
                        ...plansDialog.dataTableConfig,
                        classNameOfScroll: "h-full",
                    }}
                    setConfig={plansDialog.setDataTableConfig}
                    buttons={[
                        {
                            title: "Làm mới",
                            onClick: () => {
                                // Refresh logic
                            },
                            variants: "secondary",
                            icon: <RefreshCw className="ml-2 h-4 w-4" />,
                        },
                    ]}
                    onRowClick={(rowData: any) => {
                        const plan = plansDialog.spendingPlans.find((p: ISpendingPlan) => p.id === rowData.id)
                        if (plan) {
                            plansDialog.setSelectedPlan(plan)
                            sharedDialogElements.setIsDialogOpen((prev: any) => ({
                                ...prev, isDialogDetailPlanOpen: true
                            }))
                        }
                    }}
                    isLoading={plansDialog.isLoading}
                    onOpenDelete={(id: string) => {
                        const plan = plansDialog.spendingPlans.find((p: ISpendingPlan) => p.id === id)
                        if (plan) {
                            plansDialog.setSelectedPlan(plan)
                            sharedDialogElements.setIsDialogOpen((prev: any) => ({
                                ...prev, isDialogDeletePlanOpen: true
                            }))
                        }
                    }}
                />
            </div>
        ),
        className: 'sm:max-w-[425px] md:max-w-[1080px]',
        isOpen: isDialogOpen.isDialogDetailPlanOpen,
        onClose: () => setIsDialogOpen((prev) => ({ ...prev, isDialogDetailPlanOpen: false })),
    };

    const deletePlanDialog: IDialogConfig = {
        title: "Xóa kế hoạch",
        description: "Bạn có chắc chắn muốn xóa kế hoạch này? Hành động này không thể hoàn tác.",
        content: (
            <DeletePlanForm
                selectedPlan={selectedPlan}
                onDeletePlan={onUpdatePlan}
                onClose={() => setIsDialogOpen((prev) => ({ ...prev, isDialogDeletePlanOpen: false }))}
                isLoading={plansDialog.isLoading}
            />
        ),
        isOpen: isDialogOpen.isDialogDeletePlanOpen,
        onClose: () => setIsDialogOpen((prev) => ({ ...prev, isDialogDeletePlanOpen: false })),
    };

    // Budget Dialog Configurations
    const createBudgetDialog: IDialogConfig = {
        title: "Tạo ngân sách mới",
        description: "Tạo một ngân sách mới để quản lý chi tiêu hiệu quả hơn.",
        content: (
            <CreateBudgetForm
                isOpen={isDialogOpen.isDialogCreateBudgetOpen}
                isLoading={budgetsDialog.isLoading}
                onCreateBudget={onCreateBudget}
                onClose={() => setIsDialogOpen((prev) => ({ ...prev, isDialogCreateBudgetOpen: false }))}
            />
        ),
        className: "sm:max-w-[425px] md:max-w-[600px]",
        isOpen: isDialogOpen.isDialogCreateBudgetOpen,
        onClose: () => setIsDialogOpen((prev) => ({ ...prev, isDialogCreateBudgetOpen: false })),
    };

    const editBudgetDialog: IDialogConfig = {
        title: "Chỉnh sửa ngân sách",
        description: "Cập nhật thông tin ngân sách của bạn.",
        content: (
            <EditBudgetForm
                isOpen={isDialogOpen.isDialogEditBudgetOpen}
                isLoading={budgetsDialog.isLoading}
                selectedBudget={selectedBudget}
                onUpdateBudget={onUpdateBudget}
                onClose={() => setIsDialogOpen((prev) => ({ ...prev, isDialogEditBudgetOpen: false }))}

            />
        ),
        className: "sm:max-w-[425px] md:max-w-[600px]",
        isOpen: isDialogOpen.isDialogEditBudgetOpen,
        onClose: () => setIsDialogOpen((prev) => ({ ...prev, isDialogEditBudgetOpen: false })),
    };

    const detailBudgetDialog: IDialogConfig = {
        title: "Chi tiết ngân sách",
        description: "Xem thông tin chi tiết của ngân sách.",
        content: (
            <div className='overflow-x-auto'>
                <DataTable
                    columns={budgetsDialog.budgetColumns}
                    data={budgetsDialog.transformedBudgetData}
                    config={{
                        ...budgetsDialog.budgetTableConfig,
                        classNameOfScroll: 'h-[calc(100vh-35rem)]',
                    }}
                    setConfig={budgetsDialog.setBudgetTableConfig}
                    isLoading={budgetsDialog.isLoading}
                    onRowClick={(rowData: any) => {
                        const budget = budgetsDialog.budgets.find((b: IBudget) => b.id === rowData.id)
                        if (budget) {
                            budgetsDialog.setSelectedBudget(budget)
                            sharedDialogElements.setIsDialogOpen((prev: any) => ({
                                ...prev, isDialogDetailBudgetOpen: true
                            }))
                        }
                    }}
                />
            </div>
        ),
        className: 'sm:max-w-[425px] md:max-w-[1080px]',
        isOpen: isDialogOpen.isDialogDetailBudgetOpen,
        onClose: () => setIsDialogOpen((prev) => ({ ...prev, isDialogDetailBudgetOpen: false })),
    }

    const deleteBudgetDialog: IDialogConfig = {
        title: "Xóa ngân sách",
        description: "Bạn có chắc chắn muốn xóa ngân sách này? Hành động này không thể hoàn tác.",
        content: (
            <DeleteBudgetForm
                selectedBudget={selectedBudget}
                onDeleteBudget={onDeleteBudget}
                onClose={() => setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteBudgetOpen: false }))}
                isLoading={budgetsDialog.isLoading}
            />
        ),
        isOpen: isDialogOpen.isDialogDeleteBudgetOpen,
        onClose: () => setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteBudgetOpen: false })),
    };

    return (
        <>
            {/* Plan Dialogs */}
            <CustomDialog config={createPlanDialog} />
            <CustomDialog config={editPlanDialog} />
            <CustomDialog config={detailPlanDialog} />
            <CustomDialog config={deletePlanDialog} />

            {/* Budget Dialogs */}
            <CustomDialog config={createBudgetDialog} />
            <CustomDialog config={editBudgetDialog} />
            <CustomDialog config={detailBudgetDialog} />
            <CustomDialog config={deleteBudgetDialog} />
        </>
    );
};

export default SpendingPlanDialog;