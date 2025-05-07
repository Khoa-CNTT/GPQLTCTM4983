import React, { useEffect, useState, useMemo, useRef } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  createFundSavingPlanSchema,
  defineCreatePlanFormBody,
  getDaysInMonth
} from '@/core/fund-saving-plan/constants/create-fund-saving-plan.constant'
import { IExpectedDateParams, RecurringFrequency } from '@/core/fund-saving-plan/models'
import { getDaysForMonth } from '@/libraries/utils'
import { DateTimePicker } from '@/components/core/DateTimePicker'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import FormZod from '@/components/core/FormZod'

interface ICreatePlanFormProps {
  isOpen: boolean
  onCreatePlan: (data: any) => void
  onClose: () => void
  isLoading: boolean
  trackerTypeProps: any
}

const CreatePlanForm: React.FC<ICreatePlanFormProps> = ({
  isOpen,
  onCreatePlan,
  onClose,
  isLoading,
  trackerTypeProps
}) => {
  const now = new Date()
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
  const formCreateRef = useRef<HTMLFormElement>(null)
  const { t } = useTranslation(['common', 'spendingPlan'])
  const [selectedFrequency, setSelectedFrequency] = useState<RecurringFrequency>('MONTHLY')
  const [expectedDateParams, setExpectedDateParams] = useState<IExpectedDateParams>({
    dayOfWeek: selectedFrequency === 'WEEKLY' ? 1 : undefined,
    expectedDate: selectedFrequency === 'DAILY' || selectedFrequency === 'MONTHLY' ? now.toDateString() : undefined,
    day: selectedFrequency === 'ANNUAL' ? now.getDate() : undefined,
    month: selectedFrequency === 'ANNUAL' ? now.getMonth() + 1 : undefined,
    dayOfMonth: selectedFrequency === 'MONTHLY' ? now.getDate() : undefined
  })

  const [currentDirection, setCurrentDirection] = useState<ETypeOfTrackerTransactionType>(
    ETypeOfTrackerTransactionType.INCOMING
  )
  const [typeOfEditTrackerType, setTypeOfEditTrackerType] = useState<ETypeOfTrackerTransactionType>(
    ETypeOfTrackerTransactionType.INCOMING
  )

  const [directionCategoryMap, setDirectionCategoryMap] = useState<Record<ETypeOfTrackerTransactionType, string>>({
    [ETypeOfTrackerTransactionType.INCOMING]: '',
    [ETypeOfTrackerTransactionType.EXPENSE]: ''
  })

  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleDirectionChange = (value: ETypeOfTrackerTransactionType) => {
    const oldDirection = currentDirection

    setCurrentDirection(value)

    // const currentForm = form
    if (formCreateRef && typeof formCreateRef.current?.getValues === 'function') {
      const formValues = formCreateRef.current?.getValues()

      if (formValues.trackerTypeId) {
        setDirectionCategoryMap((prev) => ({
          ...prev,
          [oldDirection]: formValues.trackerTypeId
        }))
      }

      setTimeout(() => {
        if (formCreateRef && typeof formCreateRef.current?.setValue === 'function') {
          formCreateRef.current?.setValue('trackerTypeId', directionCategoryMap[value] || '')
        }
      }, 0)
    }
  }

  useEffect(() => {
    setTypeOfEditTrackerType(currentDirection)
  }, [currentDirection])

  const daysInMonth = useMemo(() => {
    return getDaysForMonth(expectedDateParams.month ?? now.getMonth(), now.getFullYear()).map((d) => ({
      value: d.toString(),
      label: d.toString()
    }))
  }, [expectedDateParams.month])

  const handleCreatePlan = () => {
    formCreateRef.current?.requestSubmit()
  }

  return (
    <div className='space-y-4 py-2 pb-4'>
      <FormZod
        formSchema={createFundSavingPlanSchema}
        formFieldBody={defineCreatePlanFormBody({
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
          },
          onFrequencyChange: (value: RecurringFrequency) => {
            console.log('onFrequencyChange', value)

            setSelectedFrequency(value)
          }
        })}
        onSubmit={(data: any) => {
          const payload = { ...data, targetAmount: Number(data.targetAmount) }
          if (data.type === 'DAILY') {
            payload.expectedDate = expectedDateParams.expectedDate
          } else if (data.type === 'WEEKLY') payload.dayOfWeek = expectedDateParams.dayOfWeek
          else if (data.type === 'MONTHLY') payload.dayOfMonth = expectedDateParams.dayOfMonth
          else {
            payload.month = expectedDateParams.month
            payload.day = expectedDateParams.day
          }
          onCreatePlan(payload)
        }}
        submitRef={formCreateRef}
      />
      <div className='space-y-4'>
        {selectedFrequency === 'DAILY' && (
          <div className='mb-4'>
            <div className='mb-2 flex items-center justify-between'>
              <label className='text-sm font-medium text-muted-foreground'>
                {t('spendingPlan:form.planFields.expectedDate')}
              </label>
              {errorMessage && <span className='text-xs text-red-400'>{errorMessage}</span>}
            </div>
            <DateTimePicker
              value={new Date(expectedDateParams.expectedDate ?? now)}
              onChange={(date) => {
                // Ensure selected date is not before today
                const today = new Date()
                today.setHours(0, 0, 0, 0)

                if (date >= today) {
                  setExpectedDateParams((prev) => ({ ...prev, expectedDate: date.toDateString() }))
                } else {
                  // Show error or reset to today
                  setErrorMessage('Date must be greater than or equal to today')
                  setExpectedDateParams((prev) => ({ ...prev, expectedDate: today.toDateString() }))
                }
              }}
            />
          </div>
        )}

        {selectedFrequency === 'WEEKLY' && (
          <div className='mb-4'>
            <div className='mb-2 flex items-center justify-between'>
              <label className='text-sm font-medium text-muted-foreground'>
                {t('spendingPlan:form.planFields.dayOfWeek')}
              </label>
              {errorMessage && <span className='text-xs text-red-400'>{errorMessage}</span>}
            </div>
            <Select
              onValueChange={(value) => {
                setExpectedDateParams((prev) => ({ ...prev, dayOfWeek: Number(value) }))
              }}
              value={expectedDateParams.dayOfWeek?.toString() || now.getDay().toString()}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder={t('spendingPlan:form.planFields.dayOfWeekPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t('spendingPlan:form.planFields.dayOfWeek')}</SelectLabel>
                  <SelectItem value='0'>{t('common:calendar.weekdays.sunday')}</SelectItem>
                  <SelectItem value='1'>{t('common:calendar.weekdays.monday')}</SelectItem>
                  <SelectItem value='2'>{t('common:calendar.weekdays.tuesday')}</SelectItem>
                  <SelectItem value='3'>{t('common:calendar.weekdays.wednesday')}</SelectItem>
                  <SelectItem value='4'>{t('common:calendar.weekdays.thursday')}</SelectItem>
                  <SelectItem value='5'>{t('common:calendar.weekdays.friday')}</SelectItem>
                  <SelectItem value='6'>{t('common:calendar.weekdays.saturday')}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedFrequency === 'ANNUAL' && (
          <div className='grid grid-cols-2 gap-4'>
            <div className='mb-4'>
              <div className='mb-2 flex items-center justify-between'>
                <label className='text-sm font-medium text-muted-foreground'>
                  {t('spendingPlan:form.planFields.month')}
                </label>
                {errorMessage && <span className='text-xs text-red-400'>{errorMessage}</span>}
              </div>
              <Select
                onValueChange={(value) => {
                  setExpectedDateParams((prev) => ({ ...prev, month: Number(value) }))
                }}
                value={expectedDateParams.month?.toString() || now.getMonth().toString()}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder={t('spendingPlan:form.planFields.monthPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t('spendingPlan:form.planFields.month')}</SelectLabel>
                    <SelectItem value='1'>{t('common:calendar.months.january')}</SelectItem>
                    <SelectItem value='2'>{t('common:calendar.months.february')}</SelectItem>
                    <SelectItem value='3'>{t('common:calendar.months.march')}</SelectItem>
                    <SelectItem value='4'>{t('common:calendar.months.april')}</SelectItem>
                    <SelectItem value='5'>{t('common:calendar.months.may')}</SelectItem>
                    <SelectItem value='6'>{t('common:calendar.months.june')}</SelectItem>
                    <SelectItem value='7'>{t('common:calendar.months.july')}</SelectItem>
                    <SelectItem value='8'>{t('common:calendar.months.august')}</SelectItem>
                    <SelectItem value='9'>{t('common:calendar.months.september')}</SelectItem>
                    <SelectItem value='10'>{t('common:calendar.months.october')}</SelectItem>
                    <SelectItem value='11'>{t('common:calendar.months.november')}</SelectItem>
                    <SelectItem value='12'>{t('common:calendar.months.december')}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className='mb-4'>
              <div className='mb-2 flex items-center justify-between'>
                <label className='text-sm font-medium text-muted-foreground'>
                  {t('spendingPlan:form.planFields.day')}
                </label>
                {errorMessage && <span className='text-xs text-red-400'>{errorMessage}</span>}
              </div>
              <Select
                onValueChange={(value) => {
                  setExpectedDateParams((prev) => ({ ...prev, day: Number(value) }))
                }}
                value={expectedDateParams.day?.toString() || now.getDate().toString()}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder={t('spendingPlan:form.planFields.dayPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t('spendingPlan:form.planFields.day')}</SelectLabel>
                    {daysInMonth.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {selectedFrequency === 'MONTHLY' && (
          <div className='mb-4'>
            <div className='mb-2 flex items-center justify-between'>
              <label className='text-sm font-medium text-muted-foreground'>
                {t('spendingPlan:form.planFields.day')}
              </label>
              {errorMessage && <span className='text-xs text-red-400'>{errorMessage}</span>}
            </div>
            <Select
              onValueChange={(value) => {
                setExpectedDateParams((prev) => ({ ...prev, dayOfMonth: Number(value) }))
              }}
              value={expectedDateParams.dayOfMonth?.toString() || now.getMonth().toString()}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder={t('spendingPlan:form.planFields.dayPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t('spendingPlan:form.planFields.day')}</SelectLabel>
                  {daysInMonth.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className='flex justify-end space-x-2 pt-4'>
        <Button variant='outline' onClick={onClose}>
          {t('common:button.cancel')}
        </Button>
        <Button
          onClick={handleCreatePlan}
          disabled={isLoading}
          isLoading={isLoading}
          className='bg-gradient-to-r from-teal-500 to-emerald-500 text-white'
        >
          {t('spendingPlan:form.createPlan')}
        </Button>
      </div>
    </div>
  )
}

export default CreatePlanForm
