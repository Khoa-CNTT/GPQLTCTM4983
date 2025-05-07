'use client'

import React, { useState } from 'react'
import CustomDialog from '@/components/dashboard/Dialog'
import { IDataTableConfig, IDialogConfig } from '@/types/common.i'
import CreatePlanForm from '../../../components/dashboard/spending-plan/CreatePlanForm'
import EditPlanForm from '../../../components/dashboard/spending-plan/EditPlanForm'
import DeletePlanForm from '../../../components/dashboard/spending-plan/DeletePlanForm'
import DetailPlanForm from '../../../components/dashboard/spending-plan/DetailPlanForm'
import CreateBudgetForm from '../../../components/dashboard/spending-target/CreateBudgetForm'
import EditBudgetForm from '../../../components/dashboard/spending-target/EditBudgetForm'
import DeleteBudgetForm from '../../../components/dashboard/spending-target/DeleteBudgetForm'
import ChangeStatusBudgetForm from '@/components/dashboard/spending-target/ChangeStatusBudgetForm'
import ChangeStatusPlanForm from '@/components/dashboard/spending-plan/ChangeStatusPlanForm'
import {
  IBudgetTarget,
  ICreateFundSavingTargetRequest,
  IDialogFlags,
  IGetAllDataFundSavingTargetTable,
  IUpdateFundSavingTargetRequest
} from '@/core/fund-saving-target/models/fund-saving-target.interface'
import DetailBudgetForm from '@/components/dashboard/spending-target/DetailBudgetForm'
import { DataTable } from '@/components/dashboard/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import {
  ICreateFundSavingPlanRequest,
  ISpendingPlan,
  ISpendingPlanTable,
  IUpdateFundSavingPlanRequest
} from '@/core/fund-saving-plan/models'
import { ITrackerTransactionTypeBody } from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'

interface ISpendingPlanDialogProps {
  plansDialog: {
    transformedSpendingPlanData: ISpendingPlanTable[]
    planColumns: ColumnDef<ISpendingPlanTable>[]
    dataTableConfig: IDataTableConfig
    setDataTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
    spendingPlans: ISpendingPlan[]
    setSelectedPlan: (plan: ISpendingPlan) => void
    isLoading: boolean
  }
  targetsDialog: {
    transformedTargetData: IGetAllDataFundSavingTargetTable[]
    targetColumns: ColumnDef<IGetAllDataFundSavingTargetTable>[]
    targetTableConfig: IDataTableConfig
    setTargetTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
    targets: IBudgetTarget[]
    setSelectedTarget: (target: IBudgetTarget | null) => void
    isLoading: boolean
  }
  sharedDialogElements: {
    isDialogOpen: IDialogFlags
    setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogFlags>>
    selectedPlan: ISpendingPlan | null
    selectedTarget: IBudgetTarget | null
  }
  callBack: {
    onCreatePlan: (plan: ICreateFundSavingPlanRequest) => void
    onUpdatePlan: (plan: IUpdateFundSavingPlanRequest) => void
    onDeletePlan: (id: string) => void
    onRestorePlan: (id: string) => void
    onUpdatePlanStatus: (id: string, status: string) => void

    onCreateTarget: (target: ICreateFundSavingTargetRequest) => void
    onUpdateTarget: (target: IUpdateFundSavingTargetRequest) => void
    onDeleteTarget: (id: string) => void
    onRestoreTarget: (id: string) => void
    onUpdateTargetStatus: (id: string, status: string) => void

    onGetAllFundSavingTarget: () => IBudgetTarget[]
    onGetAllFundSavingPlan: () => ISpendingPlan[]

    handleCreateTrackerType: (
      data: ITrackerTransactionTypeBody,
      setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
    ) => void
    handleUpdateTrackerType: (data: ITrackerTransactionTypeBody) => void
    handleDeleteTrackerType: (id: string) => void
  }
  incomeTrackerType: ITrackerTransactionTypeBody[]
  expenseTrackerType: ITrackerTransactionTypeBody[]
  expenditureFund: { label: string; value: string | number }[]
}

const SpendingPlanDialog: React.FC<ISpendingPlanDialogProps> = ({
  plansDialog,
  targetsDialog,
  sharedDialogElements,
  callBack,
  incomeTrackerType,
  expenseTrackerType,
  expenditureFund
}) => {
  const { t } = useTranslation(['common', 'spendingPlan'])
  const { isDialogOpen, setIsDialogOpen, selectedPlan, selectedTarget } = sharedDialogElements
  const [openEditTrackerTxTypeDialog, setOpenEditTrackerTxTypeDialog] = useState<boolean>(false)

  const createPlanDialog: IDialogConfig = {
    title: t('spendingPlan:dialog.plan.create.title'),
    description: t('spendingPlan:dialog.plan.create.description'),
    content: (
      <CreatePlanForm
        isOpen={isDialogOpen.isDialogCreatePlanOpen}
        onCreatePlan={callBack.onCreatePlan}
        onClose={() => setIsDialogOpen((prev) => ({ ...prev, isDialogCreatePlanOpen: false }))}
        isLoading={plansDialog.isLoading}
        trackerTypeProps={{
          incomeTrackerType,
          expenseTrackerType,
          setOpenEditTrackerTxTypeDialog,
          openEditTrackerTxTypeDialog,
          handleCreateTrackerType: callBack.handleCreateTrackerType,
          handleUpdateTrackerType: callBack.handleUpdateTrackerType,
          handleDeleteTrackerType: callBack.handleDeleteTrackerType,
          expenditureFund
        }}
      />
    ),
    className: 'w-full max-w-lg h-auto',
    isOpen: isDialogOpen.isDialogCreatePlanOpen,
    onClose: () => setIsDialogOpen((prev) => ({ ...prev, isDialogCreatePlanOpen: false }))
  }

  const editPlanDialog: IDialogConfig = {
    title: t('spendingPlan:dialog.plan.edit.title'),
    description: t('spendingPlan:dialog.plan.edit.description'),
    content: (
      <EditPlanForm
        isOpen={isDialogOpen.isDialogEditPlanOpen}
        selectedPlan={selectedPlan}
        onUpdatePlan={callBack.onUpdatePlan}
        onClose={() => setIsDialogOpen((prev) => ({ ...prev, isDialogEditPlanOpen: false }))}
        isLoading={plansDialog.isLoading}
        trackerTypeProps={{
          incomeTrackerType,
          expenseTrackerType,
          setOpenEditTrackerTxTypeDialog,
          openEditTrackerTxTypeDialog,
          handleCreateTrackerType: callBack.handleCreateTrackerType,
          handleUpdateTrackerType: callBack.handleUpdateTrackerType,
          handleDeleteTrackerType: callBack.handleDeleteTrackerType,
          expenditureFund
        }}
      />
    ),
    className: 'w-full max-w-lg h-auto',
    isOpen: isDialogOpen.isDialogEditPlanOpen,
    onClose: () => setIsDialogOpen((prev) => ({ ...prev, isDialogEditPlanOpen: false }))
  }

  const detailPlanDialog: IDialogConfig = {
    title: t('spendingPlan:dialog.plan.detail.title'),
    description: t('spendingPlan:dialog.plan.detail.description'),
    content: <DetailPlanForm selectedPlan={selectedPlan} setIsDialogOpen={setIsDialogOpen} />,
    className: 'sm:max-w-[425px] md:max-w-[700px]',
    isOpen: isDialogOpen.isDialogDetailPlanOpen,
    onClose: () => setIsDialogOpen((prev) => ({ ...prev, isDialogDetailPlanOpen: false }))
  }

  const deletePlanDialog: IDialogConfig = {
    title: t('spendingPlan:dialog.plan.delete.title'),
    description: t('spendingPlan:dialog.plan.delete.description'),
    content: (
      <DeletePlanForm
        selectedPlan={selectedPlan}
        onDeletePlan={(id: string) => {
          callBack.onDeletePlan(id)
          setIsDialogOpen((prev) => ({ ...prev, isDialogDeletePlanOpen: false }))
        }}
        onClose={() => setIsDialogOpen((prev) => ({ ...prev, isDialogDeletePlanOpen: false }))}
        isLoading={plansDialog.isLoading}
      />
    ),
    isOpen: isDialogOpen.isDialogDeletePlanOpen,
    onClose: () => setIsDialogOpen((prev) => ({ ...prev, isDialogDeletePlanOpen: false }))
  }

  const changeStatusPlanDialog: IDialogConfig = {
    title: t('spendingPlan:dialog.plan.changeStatus.title'),
    description: t('spendingPlan:dialog.plan.changeStatus.description'),
    content: (
      <ChangeStatusPlanForm
        selectedPlan={selectedPlan}
        onChangeStatus={(id, status) => {
          callBack.onUpdatePlanStatus(id, status)
          setIsDialogOpen((prev) => ({ ...prev, isDialogChangeStatusPlanOpen: false }))
        }}
        onClose={() => setIsDialogOpen((prev) => ({ ...prev, isDialogChangeStatusPlanOpen: false }))}
        isLoading={plansDialog.isLoading}
      />
    ),
    isOpen: isDialogOpen.isDialogChangeStatusPlanOpen || false,
    onClose: () => setIsDialogOpen((prev) => ({ ...prev, isDialogChangeStatusPlanOpen: false }))
  }

  // Target Dialog Configurations
  const createTargetDialog: IDialogConfig = {
    title: t('spendingPlan:dialog.budget.create.title'),
    description: t('spendingPlan:dialog.budget.create.description'),
    content: (
      <CreateBudgetForm
        isOpen={isDialogOpen.isDialogCreateTargetOpen}
        onCreateBudget={callBack.onCreateTarget}
        onClose={() => setIsDialogOpen((prev) => ({ ...prev, isDialogCreateTargetOpen: false }))}
        isLoading={targetsDialog.isLoading}
        trackerTypeProps={{
          incomeTrackerType,
          expenseTrackerType,
          setOpenEditTrackerTxTypeDialog,
          openEditTrackerTxTypeDialog,
          handleCreateTrackerType: callBack.handleCreateTrackerType,
          handleUpdateTrackerType: callBack.handleUpdateTrackerType,
          handleDeleteTrackerType: callBack.handleDeleteTrackerType,
          expenditureFund
        }}
      />
    ),
    className: 'sm:max-w-[450px] md:max-w-[650px]',
    isOpen: isDialogOpen.isDialogCreateTargetOpen,
    onClose: () => setIsDialogOpen((prev) => ({ ...prev, isDialogCreateTargetOpen: false }))
  }

  const editTargetDialog: IDialogConfig = {
    title: t('spendingPlan:dialog.budget.edit.title'),
    description: t('spendingPlan:dialog.budget.edit.description'),
    content: (
      <EditBudgetForm
        isOpen={isDialogOpen.isDialogEditTargetOpen}
        selectedBudget={selectedTarget}
        onUpdateBudget={callBack.onUpdateTarget}
        onClose={() =>
          setIsDialogOpen((prev) => ({ ...prev, isDialogEditTargetOpen: false, isDialogDetailTargetOpen: false }))
        }
        isLoading={targetsDialog.isLoading}
      />
    ),
    className: 'sm:max-w-[450px] md:max-w-[650px]',
    isOpen: isDialogOpen.isDialogEditTargetOpen,
    onClose: () => setIsDialogOpen((prev) => ({ ...prev, isDialogEditTargetOpen: false }))
  }

  const detailTargetDialog: IDialogConfig = {
    title: t('spendingPlan:dialog.budget.detail.title'),
    description: t('spendingPlan:dialog.budget.detail.description'),
    content: (
      <DetailBudgetForm
        setIsDialogOpen={setIsDialogOpen}
        selectedTarget={selectedTarget}
        onClose={() => setIsDialogOpen((prev) => ({ ...prev, isDialogDetailTargetOpen: false }))}
        onEdit={() => {
          setIsDialogOpen((prev) => ({
            ...prev,
            isDialogEditTargetOpen: true,
            isDialogDetailTargetOpen: false
          }))
        }}
      />
    ),
    className: 'sm:max-w-[425px] md:max-w-[700px]',
    isOpen: isDialogOpen.isDialogDetailTargetOpen,
    onClose: () => setIsDialogOpen((prev) => ({ ...prev, isDialogDetailTargetOpen: false }))
  }

  const deleteTargetDialog: IDialogConfig = {
    title: t('spendingPlan:dialog.budget.delete.title'),
    description: t('spendingPlan:dialog.budget.delete.description'),
    content: (
      <DeleteBudgetForm
        selectedBudget={selectedTarget}
        onDeleteBudget={(id) => {
          callBack.onDeleteTarget(id)
          setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteTargetOpen: false, isDialogDetailTargetOpen: false }))
        }}
        onClose={() => setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteTargetOpen: false }))}
        isLoading={targetsDialog.isLoading}
      />
    ),
    isOpen: isDialogOpen.isDialogDeleteTargetOpen,
    onClose: () => setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteTargetOpen: false }))
  }

  const changeStatusTargetDialog: IDialogConfig = {
    title: t('spendingPlan:dialog.budget.changeStatus.title'),
    description: t('spendingPlan:dialog.budget.changeStatus.description'),
    content: (
      <ChangeStatusBudgetForm
        selectedBudget={selectedTarget}
        onChangeStatus={(id, status) => {
          callBack.onUpdateTargetStatus(id, status)
          setIsDialogOpen((prev) => ({ ...prev, isDialogChangeStatusTargetOpen: false }))
        }}
        onClose={() => setIsDialogOpen((prev) => ({ ...prev, isDialogChangeStatusTargetOpen: false }))}
        isLoading={targetsDialog.isLoading}
      />
    ),
    isOpen: isDialogOpen.isDialogChangeStatusTargetOpen,
    onClose: () => setIsDialogOpen((prev) => ({ ...prev, isDialogChangeStatusTargetOpen: false }))
  }

  const viewAllDataDialog: IDialogConfig = {
    title: t('spendingPlan:dialog.budget.viewAll.title'),
    description: t('spendingPlan:dialog.budget.viewAll.description'),
    content: (
      <div className='overflow-x-auto'>
        <DataTable
          columns={targetsDialog.targetColumns}
          data={targetsDialog.transformedTargetData}
          config={targetsDialog.targetTableConfig}
          setConfig={targetsDialog.setTargetTableConfig}
          onRowClick={(rowData) => {
            targetsDialog.setSelectedTarget(rowData as any)
            setIsDialogOpen((prev) => ({
              ...prev,
              isDialogDetailTargetOpen: true,
              isDialogViewAllDataOpen: false
            }))
          }}
        />
      </div>
    ),
    className: 'w-full max-w-[90vw]',
    isOpen: isDialogOpen.isDialogViewAllDataOpen || false,
    onClose: () => setIsDialogOpen((prev) => ({ ...prev, isDialogViewAllDataOpen: false }))
  }

  const viewAllPlansDialog: IDialogConfig = {
    title: t('spendingPlan:dialog.plan.viewAll.title'),
    description: t('spendingPlan:dialog.plan.viewAll.description'),
    content: (
      <div className='overflow-x-auto'>
        <DataTable
          columns={plansDialog.planColumns}
          data={plansDialog.transformedSpendingPlanData}
          config={plansDialog.dataTableConfig}
          setConfig={plansDialog.setDataTableConfig}
          onRowClick={(rowData) => {
            plansDialog.setSelectedPlan(rowData as any)
            setIsDialogOpen((prev) => ({
              ...prev,
              isDialogDetailPlanOpen: true,
              isDialogViewAllPlansOpen: false
            }))
          }}
        />
      </div>
    ),
    className: 'w-full max-w-[90vw]',
    isOpen: isDialogOpen.isDialogViewAllPlansOpen || false,
    onClose: () => setIsDialogOpen((prev) => ({ ...prev, isDialogViewAllPlansOpen: false }))
  }

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
  )
}

export default SpendingPlanDialog
