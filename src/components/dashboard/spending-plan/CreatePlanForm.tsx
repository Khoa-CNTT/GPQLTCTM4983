import React, { useEffect, useState, useMemo, useRef } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import { RecurringFrequency } from '@/core/fund-saving-plan/models'
import { getDaysForMonth, getNextDayOfMonth, getNextDayOfWeek } from '@/libraries/utils'
import { DateTimePicker } from '@/components/core/DateTimePicker'
import { MoneyInput } from '@/components/core/MoneyInput'
import EditTrackerTypeDialog from '../EditTrackerType'
import { IEditTrackerTypeDialogProps } from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { modifiedTrackerTypeForComboBox } from '@/app/dashboard/tracker-transaction/handlers'
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
  const [year] = useState<number>(new Date().getFullYear())
  const [currentMonth, setCurrentMonth] = useState<string>((new Date().getMonth() + 1).toString())
  const [selectedDay, setSelectedDay] = useState<string>(new Date().getDate().toString())
  const [selectedFrequency, setSelectedFrequency] = useState<RecurringFrequency>('MONTHLY')

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

  const handleDirectionChange = (value: ETypeOfTrackerTransactionType) => {
    const oldDirection = currentDirection

    setCurrentDirection(value)

    // const currentForm = form
    if (form && typeof form.getValues === 'function') {
      const formValues = form.getValues()

      if (formValues.trackerTypeId) {
        setDirectionCategoryMap((prev) => ({
          ...prev,
          [oldDirection]: formValues.trackerTypeId
        }))
      }

      setTimeout(() => {
        if (form && typeof form.setValue === 'function') {
          form.setValue('trackerTypeId', directionCategoryMap[value] || '')
        }
      }, 0)
    }
  }

  useEffect(() => {
    setTypeOfEditTrackerType(currentDirection)
  }, [currentDirection])

  const defaultValues = {
    name: '',
    description: '',
    targetAmount: '',
    trackerTypeId: '',
    month: (new Date().getMonth() + 1).toString(),
    day: new Date().getDate().toString(),
    type: 'MONTHLY' as RecurringFrequency,
    dayOfWeek: '1',
    expectedDate: new Date()
  }

  const form = useForm({
    resolver: zodResolver(createFundSavingPlanSchema),
    defaultValues,
    mode: 'onSubmit'
  })

  const daysInMonth = useMemo(() => {
    return getDaysForMonth(currentMonth, year).map((d) => ({
      value: d.toString(),
      label: d.toString()
    }))
  }, [currentMonth, year])

  useEffect(() => {
    if (currentMonth) {
      const numberOfDays = getDaysInMonth(parseInt(currentMonth), year)

      if (parseInt(selectedDay) > numberOfDays) {
        setSelectedDay(numberOfDays.toString())
        form.setValue('day', numberOfDays.toString())
      }
    }
  }, [currentMonth, year, selectedDay, form])

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (!value) return

      if (value.month && (name === 'month' || name === undefined)) {
        setCurrentMonth(value.month)
      }

      if (value.day && (name === 'day' || name === undefined)) {
        setSelectedDay(value.day)
      }

      if (value.type && (name === 'type' || name === undefined)) {
        setSelectedFrequency(value.type as RecurringFrequency)
      }
    })

    return () => subscription.unsubscribe()
  }, [form])

  const frequencySpecificFields = useMemo(() => {
    const currentDateTime = new Date()
    return {
      dayOfWeek: selectedFrequency === 'WEEKLY' ? '1' : undefined,
      expectedDate: selectedFrequency === 'DAILY' || selectedFrequency === 'MONTHLY' ? currentDateTime : undefined,
      day: selectedFrequency === 'MONTHLY' || selectedFrequency === 'ANNUAL' ? selectedDay : undefined,
      month: selectedFrequency === 'ANNUAL' ? currentMonth : undefined
    }
  }, [selectedFrequency, selectedDay, currentMonth])

  useEffect(() => {
    form.setValue('type', selectedFrequency)

    if (frequencySpecificFields.dayOfWeek) {
      form.setValue('dayOfWeek', frequencySpecificFields.dayOfWeek)
    }

    if (frequencySpecificFields.expectedDate) {
      form.setValue('expectedDate', frequencySpecificFields.expectedDate)
    }

    if (frequencySpecificFields.month) {
      form.setValue('month', frequencySpecificFields.month)
    }

    if (frequencySpecificFields.day) {
      form.setValue('day', frequencySpecificFields.day)
    }
  }, [selectedFrequency, frequencySpecificFields, form])

  const handleCreatePlan = form.handleSubmit((data) => {
    const planData: any = {
      name: data.name,
      description: data.description,
      targetAmount: parseFloat(data.targetAmount.replace(/[^\d.-]/g, '')),
      trackerTypeId: data.trackerTypeId,
      type: data.type
    }

    if (data.type === 'DAILY') {
      planData.expectedDate = data.expectedDate
    } else if (data.type === 'WEEKLY') {
      planData.dayOfWeek = parseInt(data.dayOfWeek)
      planData.expectedDate = getNextDayOfWeek(planData.dayOfWeek)
    } else if (data.type === 'MONTHLY') {
      planData.day = parseInt(data.day)
      planData.expectedDate = getNextDayOfMonth(planData.day)
    } else if (data.type === 'ANNUAL') {
      planData.month = parseInt(data.month)
      planData.day = parseInt(data.day)
    }

    onCreatePlan(planData)
  })

  return (
    <div className='space-y-4 py-2 pb-4'>
      <FormZod
        formSchema={createFundSavingPlanSchema}
        formFieldBody={defineCreatePlanFormBody({
          accountSourceData: [],
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
            form.setValue('trackerTypeId', value)
          },
          isPending: false
        })}
        onSubmit={() => {}}
        submitRef={formCreateRef}
      />
      <div className='space-y-4'>
        <div className='mb-4'>
          <label className='text-sm font-medium text-muted-foreground'>
            {t('spendingPlan:form.planFields.frequency')}
          </label>
          <Select
            onValueChange={(value) => setSelectedFrequency(value as RecurringFrequency)}
            value={selectedFrequency}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder={t('spendingPlan:form.planFields.frequencyPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t('spendingPlan:form.planFields.frequency')}</SelectLabel>
                <SelectItem value='DAILY'>{t('spendingPlan:frequency.daily')}</SelectItem>
                <SelectItem value='WEEKLY'>{t('spendingPlan:frequency.weekly')}</SelectItem>
                <SelectItem value='MONTHLY'>{t('spendingPlan:frequency.monthly')}</SelectItem>
                <SelectItem value='ANNUAL'>{t('spendingPlan:frequency.annual')}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {selectedFrequency === 'DAILY' && (
          <div className='mb-4'>
            <label className='text-sm font-medium text-muted-foreground'>
              {t('spendingPlan:form.planFields.expectedDate')}
            </label>
            <DateTimePicker
              value={form.getValues('expectedDate')}
              onChange={(date) => form.setValue('expectedDate', date)}
            />
          </div>
        )}

        {selectedFrequency === 'WEEKLY' && (
          <div className='mb-4'>
            <label className='text-sm font-medium text-muted-foreground'>
              {t('spendingPlan:form.planFields.dayOfWeek')}
            </label>
            <Select onValueChange={(value) => form.setValue('dayOfWeek', value)} value={form.getValues('dayOfWeek')}>
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
              <label className='text-sm font-medium text-muted-foreground'>
                {t('spendingPlan:form.planFields.month')}
              </label>
              <Select
                onValueChange={(value) => {
                  setCurrentMonth(value)
                  form.setValue('month', value)
                }}
                value={currentMonth}
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
              <label className='text-sm font-medium text-muted-foreground'>
                {t('spendingPlan:form.planFields.day')}
              </label>
              <Select
                onValueChange={(value) => {
                  setSelectedDay(value)
                  form.setValue('day', value)
                }}
                value={selectedDay}
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
            <label className='text-sm font-medium text-muted-foreground'>{t('spendingPlan:form.planFields.day')}</label>
            <Select
              onValueChange={(value) => {
                setSelectedDay(value)
                form.setValue('day', value)
              }}
              value={selectedDay}
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
