'use client'
import React, { useEffect, useState, useMemo } from 'react'
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
import { editFundSavingPlanSchema } from '@/core/fund-saving-plan/constants/edit-fund-saving-plan.constant'
import { ISpendingPlan, IUpdateFundSavingPlanRequest, RecurringFrequency } from '@/core/fund-saving-plan/models'
import { getDaysForMonth, getNextDayOfMonth, getNextDayOfWeek } from '@/libraries/utils'
import { DateTimePicker } from '@/components/core/DateTimePicker'
import { MoneyInput } from '@/components/core/MoneyInput'
import { mockDataTrackerType } from '@/app/dashboard/spending-plan/constant'
import { getDaysInMonth } from '@/core/fund-saving-plan/constants/create-fund-saving-plan.constant'
import { z } from 'zod'
import { Combobox } from '@/components/core/Combobox'
import EditTrackerTypeDialog from '../EditTrackerType'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { modifiedTrackerTypeForComboBox } from '@/app/dashboard/tracker-transaction/handlers'

interface EditPlanFormProps {
  selectedPlan: ISpendingPlan | null
  onClose: () => void
  onUpdatePlan: (updatedPlan: IUpdateFundSavingPlanRequest) => void
  isLoading: boolean
  isOpen: boolean
  trackerTypeProps: any
}

const EditPlanForm: React.FC<EditPlanFormProps> = ({
  selectedPlan,
  onClose,
  onUpdatePlan,
  isLoading,
  isOpen,
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
  const [year] = useState<number>(new Date().getFullYear())
  const [currentMonth, setCurrentMonth] = useState<string>((new Date().getMonth() + 1).toString())
  const [selectedDay, setSelectedDay] = useState<string>(new Date().getDate().toString())
  const [selectedFrequency, setSelectedFrequency] = useState<RecurringFrequency>(
    (selectedPlan?.type as RecurringFrequency) || 'MONTHLY'
  )
  const [key, setKey] = useState(0)
  const [currentDirection, setCurrentDirection] = useState<ETypeOfTrackerTransactionType>(
    incomeTrackerType.find((item: any) => selectedPlan?.trackerTypeId === item.id)
      ? ETypeOfTrackerTransactionType.INCOMING
      : ETypeOfTrackerTransactionType.EXPENSE || ETypeOfTrackerTransactionType.INCOMING
  )
  const [directionCategoryMap, setDirectionCategoryMap] = useState<Record<ETypeOfTrackerTransactionType, string>>({
    [ETypeOfTrackerTransactionType.INCOMING]: incomeTrackerType.find(
      (item: any) => selectedPlan?.trackerTypeId === item.id
    )
      ? (selectedPlan?.trackerTypeId as string)
      : '',
    [ETypeOfTrackerTransactionType.EXPENSE]: expenseTrackerType.find(
      (item: any) => selectedPlan?.trackerTypeId === item.id
    )
      ? (selectedPlan?.trackerTypeId as string)
      : ''
  })
  const [typeOfEditTrackerType, setTypeOfEditTrackerType] = useState<ETypeOfTrackerTransactionType>(
    incomeTrackerType.find((item: any) => selectedPlan?.trackerTypeId === item.id)
      ? ETypeOfTrackerTransactionType.INCOMING
      : ETypeOfTrackerTransactionType.EXPENSE || ETypeOfTrackerTransactionType.INCOMING
  )

  const handleDirectionChange = (value: ETypeOfTrackerTransactionType) => {
    const oldDirection = currentDirection

    setCurrentDirection(value)

    const currentForm = form
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

  const defaultValues = selectedPlan
    ? {
        name: selectedPlan.name,
        description: selectedPlan.description,
        targetAmount: selectedPlan.targetAmount?.toString(),
        type: selectedPlan.type as RecurringFrequency,
        expectedDate: new Date(selectedPlan.expectedDate),
        dayOfWeek: selectedPlan.expectedDateParams.dayOfWeek?.toString(),
        day: selectedPlan.expectedDateParams.day?.toString(),
        month: selectedPlan.expectedDateParams.month?.toString(),
        dayOfMonth: selectedPlan.expectedDateParams.dayOfMonth?.toString(),
        trackerTypeId: directionCategoryMap?.[currentDirection] || ''
      }
    : {
        name: '',
        description: '',
        targetAmount: '0',
        type: 'MONTHLY' as RecurringFrequency,
        expectedDate: new Date(),
        dayOfWeek: '0',
        day: '12',
        month: '1',
        trackerTypeId: '',
        dayOfMonth: '1'
      }

  const form = useForm<z.infer<z.ZodObject<any>>>({
    resolver: zodResolver(editFundSavingPlanSchema),
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  })

  const daysInMonth = useMemo(() => {
    return getDaysForMonth(Number(currentMonth), year).map((d) => ({
      value: d.toString(),
      label: d.toString()
    }))
  }, [currentMonth, year])

  useEffect(() => {
    setTypeOfEditTrackerType(currentDirection)
  }, [currentDirection])

  // Force re-render the form when selectedPlan changes
  useEffect(() => {
    if (isOpen && selectedPlan) {
      setKey((prev) => prev + 1)

      // Set appropriate initial values based on the plan's frequency type
      setSelectedFrequency(selectedPlan.type as RecurringFrequency)

      const planDate = new Date(selectedPlan.expectedDate)
      setSelectedDay(planDate.getDate().toString())
      setCurrentMonth((planDate.getMonth() + 1).toString())

      // Reset form with new values
      form.reset({
        name: selectedPlan.name,
        description: selectedPlan.description,
        targetAmount: selectedPlan.targetAmount?.toString(),
        type: selectedPlan.type as RecurringFrequency,
        expectedDate: new Date(selectedPlan.expectedDate),
        dayOfWeek: selectedPlan.expectedDateParams.dayOfWeek?.toString(),
        day: selectedPlan.expectedDateParams.day?.toString(),
        month: selectedPlan.expectedDateParams.month?.toString(),
        dayOfMonth: selectedPlan.expectedDateParams.dayOfMonth?.toString(),
        trackerTypeId: selectedPlan.trackerTypeId
      })
    }
  }, [isOpen, form])

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
        setCurrentMonth(value.month.toString())
      }

      if (value.day && (name === 'day' || name === undefined)) {
        setSelectedDay(value.day.toString())
      }

      if (value.type && (name === 'type' || name === undefined)) {
        setSelectedFrequency(value.type as RecurringFrequency)
      }
    })

    return () => subscription.unsubscribe()
  }, [form])

  const handleUpdatePlan = (e: React.FormEvent) => {
    e.preventDefault()
    const planData: IUpdateFundSavingPlanRequest = { type: form.getValues().type }
    if (planData.type === 'DAILY') {
      form.setValue('day', undefined)
      form.setValue('month', undefined)
      form.setValue('dayOfMonth', undefined)
      form.setValue('dayOfWeek', undefined)
      planData.expectedDate = form.getValues().expectedDate.toISOString()
    } else if (planData.type === 'WEEKLY') {
      form.setValue('day', undefined)
      form.setValue('month', undefined)
      form.setValue('dayOfMonth', undefined)
      form.setValue('expectedDate', undefined)
      planData.dayOfWeek = Number(form.getValues().dayOfWeek)
    } else if (planData.type === 'MONTHLY') {
      form.setValue('day', undefined)
      form.setValue('month', undefined)
      form.setValue('dayOfWeek', undefined)
      form.setValue('expectedDate', undefined)
      planData.dayOfMonth = Number(form.getValues().dayOfMonth)
    } else {
      form.setValue('dayOfMonth', undefined)
      form.setValue('dayOfWeek', undefined)
      form.setValue('expectedDate', undefined)
      planData.month = Number(form.getValues().month)
      planData.day = Number(form.getValues().day)
    }

    form.handleSubmit((data) => {
      try {
        if (selectedPlan !== null) {
          ;(planData.id = selectedPlan.id),
            (planData.name = data.name),
            (planData.description = data.description),
            (planData.trackerTypeId = data.trackerTypeId),
            (planData.targetAmount = parseFloat(data.targetAmount)),
            console.log('planData', planData)

          onUpdatePlan(planData)
        }
      } catch (error) {
        console.error('Error updating plan:', error)
      }
    })()
  }

  return (
    <div className='space-y-4 py-2 pb-4' key={key}>
      <Form {...form}>
        <form id='update-plan-form' onSubmit={handleUpdatePlan} className='grid grid-cols-2 gap-x-4 gap-y-0'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='col-span-2 mb-4'>
                <div className='flex justify-between'>
                  <FormLabel className='text-muted-foreground'>{t('spendingPlan:form.planFields.title')}</FormLabel>
                  <FormMessage />
                </div>
                <FormControl>
                  <Input placeholder={t('spendingPlan:form.planFields.titlePlaceholder')} {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem className='col-span-2 mb-4'>
                <div className='flex justify-between'>
                  <FormLabel className='text-muted-foreground'>
                    {t('spendingPlan:form.planFields.description')}
                  </FormLabel>
                  <FormMessage />
                </div>
                <FormControl>
                  <Textarea
                    placeholder={t('spendingPlan:form.planFields.descriptionPlaceholder')}
                    rows={3}
                    {...field}
                    value={field.value || ''}
                    onChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='targetAmount'
            render={({ field }) => (
              <FormItem className='col-span-2 mb-4'>
                <div className='flex justify-between'>
                  <FormLabel className='text-muted-foreground'>{t('spendingPlan:form.planFields.amount')}</FormLabel>
                  <FormMessage />
                </div>
                <FormControl>
                  <MoneyInput
                    placeholder={t('spendingPlan:form.planFields.amountPlaceholder')}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='trackerTypeId'
            render={({ field }) => (
              <FormItem className='col-span-2 mb-4'>
                <div className='flex justify-between'>
                  <FormLabel className='text-muted-foreground'>{t('spendingPlan:form.planFields.category')}</FormLabel>
                  <FormMessage />
                </div>
                <FormControl>
                  <Combobox
                    setOpenEditDialog={setOpenEditTrackerTxTypeDialog}
                    dataArr={modifiedTrackerTypeForComboBox(
                      currentDirection === ETypeOfTrackerTransactionType.INCOMING
                        ? incomeTrackerType
                        : expenseTrackerType
                    )}
                    value={directionCategoryMap?.[currentDirection] || ''}
                    dialogEdit={EditTrackerTypeDialog({
                      openEditDialog: openEditTrackerTxTypeDialog,
                      setOpenEditDialog: setOpenEditTrackerTxTypeDialog,
                      dataArr: modifiedTrackerTypeForComboBox(
                        typeOfEditTrackerType === ETypeOfTrackerTransactionType.INCOMING
                          ? incomeTrackerType
                          : expenseTrackerType
                      ),
                      typeDefault: currentDirection || ETypeOfTrackerTransactionType.INCOMING,
                      type: typeOfEditTrackerType,
                      setType: setTypeOfEditTrackerType,
                      handleCreateTrackerType,
                      handleUpdateTrackerType,
                      handleDeleteTrackerType,
                      expenditureFund
                    })}
                    defaultValue={field.value as any}
                    value={field.value as any}
                    onValueSelect={(value) => {
                      ;(value: string) => {
                        setDirectionCategoryMap((prev) => ({
                          ...prev,
                          [currentDirection]: value
                        }))
                      }
                      field.onChange(value)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='type'
            render={({ field }) => (
              <FormItem className='col-span-2 mb-4'>
                <div className='flex justify-between'>
                  <FormLabel className='text-muted-foreground'>{t('spendingPlan:form.planFields.frequency')}</FormLabel>
                  <FormMessage />
                </div>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    setSelectedFrequency(value as RecurringFrequency)
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder={t('spendingPlan:form.planFields.frequencyPlaceholder')} />
                    </SelectTrigger>
                  </FormControl>
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
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedFrequency === 'DAILY' && (
            <FormField
              control={form.control}
              name='expectedDate'
              render={({ field }) => (
                <FormItem className='col-span-2 mb-4'>
                  <div className='flex justify-between'>
                    <FormLabel className='text-muted-foreground'>
                      {t('spendingPlan:form.planFields.expectedDate')}
                    </FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <DateTimePicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          {selectedFrequency === 'WEEKLY' && (
            <FormField
              control={form.control}
              name='dayOfWeek'
              render={({ field }) => (
                <FormItem className='col-span-2 mb-4'>
                  <div className='flex justify-between'>
                    <FormLabel className='text-muted-foreground'>
                      {t('spendingPlan:form.planFields.dayOfWeek')}
                    </FormLabel>
                    <FormMessage />
                  </div>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder={t('spendingPlan:form.planFields.dayOfWeekPlaceholder')} />
                      </SelectTrigger>
                    </FormControl>
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
                </FormItem>
              )}
            />
          )}

          {selectedFrequency === 'ANNUAL' && (
            <div>
              <FormField
                control={form.control}
                name='month'
                render={({ field }) => (
                  <FormItem className='col-span-1 mb-4'>
                    <div className='flex justify-between'>
                      <FormLabel className='text-muted-foreground'>{t('spendingPlan:form.planFields.month')}</FormLabel>
                      <FormMessage />
                    </div>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        setCurrentMonth(value)
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder={t('spendingPlan:form.planFields.monthPlaceholder')} />
                        </SelectTrigger>
                      </FormControl>
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
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='day'
                render={({ field }) => (
                  <FormItem className='col-span-1 mb-4'>
                    <div className='flex justify-between'>
                      <FormLabel className='text-muted-foreground'>{t('spendingPlan:form.planFields.day')}</FormLabel>
                      <FormMessage />
                    </div>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        setSelectedDay(value)
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder={t('spendingPlan:form.planFields.dayPlaceholder')} />
                        </SelectTrigger>
                      </FormControl>
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
                  </FormItem>
                )}
              />
            </div>
          )}
          {selectedFrequency === 'MONTHLY' && (
            <FormField
              control={form.control}
              name='dayOfMonth'
              render={({ field }) => (
                <FormItem className='col-span-2 mb-4'>
                  <div className='flex justify-between'>
                    <FormLabel className='text-muted-foreground'>{t('spendingPlan:form.planFields.day')}</FormLabel>
                    <FormMessage />
                  </div>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      setSelectedDay(value)
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder={t('spendingPlan:form.planFields.dayPlaceholder')} />
                      </SelectTrigger>
                    </FormControl>
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
                </FormItem>
              )}
            />
          )}
          <div className='col-span-2 flex justify-end space-x-2 pt-4'>
            <Button variant='outline' onClick={onClose}>
              {t('common:button.cancel')}
            </Button>
            <Button
              type='submit'
              disabled={isLoading}
              isLoading={isLoading}
              className='bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
            >
              {t('spendingPlan:form.updatePlan')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default EditPlanForm
