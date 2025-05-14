'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import FormZod from '@/components/core/FormZod'
import { ICreateFundSavingTargetRequest } from '@/core/fund-saving-target/models'
import {
  createFundSavingTargetSchema,
  defineCreateFundSavingTargetFormBody
} from '@/core/fund-saving-target/constants/create-fund-saving-target.constant'
import { useTranslation } from 'react-i18next'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'

interface CreateBudgetFormProps {
  onCreateBudget: (newBudget: ICreateFundSavingTargetRequest) => void
  onClose: () => void
  isLoading: boolean
  isOpen: boolean
  fundId?: string // Optional fundId that might be passed from parent
  trackerTypeProps: any
}

const CreateBudgetForm: React.FC<CreateBudgetFormProps> = ({
  onCreateBudget,
  onClose,
  isLoading,
  isOpen,
  fundId,
  trackerTypeProps
}) => {
  const {
    incomeTrackerType,
    expenseTrackerType,
    setOpenEditTrackerTxTypeDialog,
    openEditTrackerTxTypeDialog,
    handleCreateTrackerType,
    handleUpdateTrackerType,
    handleDeleteTrackerType,
    expenditureFund
  } = trackerTypeProps
  const { t } = useTranslation(['common', 'spendingPlan'])
  const formSubmitRef = useRef<HTMLFormElement>(null)

  const handleCreateBudget = (data: any) => {
    onCreateBudget({
      name: data.name,
      description: data.description,
      targetAmount: parseFloat(data.targetAmount),
      fundId: data.fundId || fundId || '',
      trackerTypeId: data.trackerTypeId,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate.toISOString(),
      isCreateNormally: true
    })
    onClose()
  }

  const [currentDirection, setCurrentDirection] = useState<ETypeOfTrackerTransactionType>(
    ETypeOfTrackerTransactionType.INCOMING
  )
  const [typeOfEditTrackerType, setTypeOfEditTrackerType] = useState<ETypeOfTrackerTransactionType>(
    ETypeOfTrackerTransactionType.INCOMING
  )

  const [directionCategoryMap, setDirectionCategoryMap] = useState<Record<ETypeOfTrackerTransactionType, string>>({
    [ETypeOfTrackerTransactionType.INCOMING]: '',
    [ETypeOfTrackerTransactionType.EXPENSE]: '',
    [ETypeOfTrackerTransactionType.TRANSFER]: ''
  })

  const handleDirectionChange = (value: ETypeOfTrackerTransactionType) => {
    const oldDirection = currentDirection

    setCurrentDirection(value)

    const currentForm = formSubmitRef.current
    if (currentForm && typeof currentForm.getValues === 'function') {
      const formValues = currentForm.getValues()

      if (formValues.trackerTypeId) {
        setDirectionCategoryMap((prev) => ({
          ...prev,
          [oldDirection]: formValues.trackerTypeId
        }))
      }

      setTimeout(() => {
        if (currentForm && typeof currentForm.setValue === 'function') {
          currentForm.setValue('trackerTypeId', directionCategoryMap[value] || '')
        }
      }, 0)
    }
  }

  useEffect(() => {
    setTypeOfEditTrackerType(currentDirection)
  }, [currentDirection])

  return (
    <div className='py-4'>
      <div className='mb-4 text-sm text-muted-foreground'>
        {t('spendingPlan:targetForm.createBudget.customDescription')}
      </div>

      <FormZod
        formSchema={createFundSavingTargetSchema as any}
        formFieldBody={defineCreateFundSavingTargetFormBody({
          incomeTrackerType,
          expenseTrackerType,
          currentDirection,
          setCurrentDirection: handleDirectionChange,
          setOpenEditTrackerTxTypeDialog,
          openEditTrackerTxTypeDialog,
          typeOfEditTrackerType,
          setTypeOfEditTrackerType,
          handleCreateTrackerType,
          handleUpdateTrackerType,
          handleDeleteTrackerType,
          expenditureFund,
          directionCategoryMap,
          onCategoryChange: (value: string) => {
            setDirectionCategoryMap((prev) => ({
              ...prev,
              [currentDirection]: value
            }))
          }
        })}
        onSubmit={handleCreateBudget}
        submitRef={formSubmitRef}
        classNameForm='grid grid-cols-2 gap-x-4 gap-y-2'
      />

      <div className='mt-6 flex justify-end gap-2 border-t pt-2'>
        <Button variant='outline' onClick={onClose}>
          {t('common:button.cancel')}
        </Button>
        <Button onClick={() => formSubmitRef.current?.requestSubmit()} disabled={isLoading} isLoading={isLoading}>
          {t('spendingPlan:targetForm.createBudget.createCustomBudget')}
        </Button>
      </div>
    </div>
  )
}

export default CreateBudgetForm
