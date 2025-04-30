import React, { useEffect, useState, useMemo } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  createFundSavingPlanSchema,
  getDaysInMonth
} from "@/core/fund-saving-plan/constants/create-fund-saving-plan.constant"
import { RecurringFrequency } from "@/core/fund-saving-plan/models"
import { getDaysForMonth, getNextDayOfMonth, getNextDayOfWeek } from "@/libraries/utils"
import { DateTimePicker } from "@/components/core/DateTimePicker"
import { MoneyInput } from "@/components/core/MoneyInput"
import { mockDataTrackerType } from "@/app/dashboard/spending-plan/constant"

interface ICreatePlanFormProps {
  isOpen: boolean
  onCreatePlan: (data: any) => void
  onClose: () => void
  isLoading: boolean
}

const CreatePlanForm: React.FC<ICreatePlanFormProps> = ({
  isOpen,
  onCreatePlan,
  onClose,
  isLoading,
}) => {
  const { t } = useTranslation(['common', 'spendingPlan'])
  const [year] = useState<number>(new Date().getFullYear())
  const [currentMonth, setCurrentMonth] = useState<string>((new Date().getMonth() + 1).toString())
  const [selectedDay, setSelectedDay] = useState<string>(new Date().getDate().toString())
  const [selectedFrequency, setSelectedFrequency] = useState<RecurringFrequency>("MONTHLY")

  const defaultValues = {
    name: "",
    description: "",
    targetAmount: "",
    trackerTypeId: "",
    month: (new Date().getMonth() + 1).toString(),
    day: new Date().getDate().toString(),
    type: "MONTHLY" as RecurringFrequency,
    dayOfWeek: "1",
    expectedDate: new Date(),
  }

  const form = useForm({
    resolver: zodResolver(createFundSavingPlanSchema),
    defaultValues,
    mode: "onSubmit"
  })

  const daysInMonth = useMemo(() => {
    return getDaysForMonth(currentMonth, year).map(d => ({
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
      expectedDate: (selectedFrequency === 'DAILY' || selectedFrequency === 'MONTHLY') ? currentDateTime : undefined,
      day: (selectedFrequency === 'MONTHLY' || selectedFrequency === 'ANNUAL') ? selectedDay : undefined,
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
      type: data.type,
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
    <div className="space-y-4 py-2 pb-4">
      <Form {...form}>
        <form onSubmit={handleCreatePlan} className="grid grid-cols-2 gap-x-4 gap-y-0">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="col-span-2 mb-4">
                <FormLabel className="text-muted-foreground">
                  {t('spendingPlan:form.planFields.title')}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('spendingPlan:form.planFields.titlePlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2 mb-4">
                <FormLabel className="text-muted-foreground">
                  {t('spendingPlan:form.planFields.description')}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t('spendingPlan:form.planFields.descriptionPlaceholder')}
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="targetAmount"
            render={({ field }) => (
              <FormItem className="col-span-2 mb-4">
                <FormLabel className="text-muted-foreground">
                  {t('spendingPlan:form.planFields.amount')}
                </FormLabel>
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
            name="trackerTypeId"
            render={({ field }) => (
              <FormItem className="col-span-2 mb-4">
                <FormLabel className="text-muted-foreground">
                  {t('spendingPlan:form.planFields.category')}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('spendingPlan:form.planFields.categoryPlaceholder')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t('spendingPlan:form.planFields.category')}</SelectLabel>
                      {mockDataTrackerType.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="col-span-2 mb-4">
                <FormLabel className="text-muted-foreground">
                  {t('spendingPlan:form.planFields.frequency')}
                </FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    setSelectedFrequency(value as RecurringFrequency)
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('spendingPlan:form.planFields.frequencyPlaceholder')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t('spendingPlan:form.planFields.frequency')}</SelectLabel>
                      <SelectItem value="DAILY">{t('spendingPlan:frequency.daily')}</SelectItem>
                      <SelectItem value="WEEKLY">{t('spendingPlan:frequency.weekly')}</SelectItem>
                      <SelectItem value="MONTHLY">{t('spendingPlan:frequency.monthly')}</SelectItem>
                      <SelectItem value="ANNUAL">{t('spendingPlan:frequency.annual')}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {(selectedFrequency === 'DAILY') && (
            <FormField
              control={form.control}
              name="expectedDate"
              render={({ field }) => (
                <FormItem className={selectedFrequency === 'DAILY' ? 'col-span-2 mb-4' : 'col-span-1 mb-4'}>
                  <FormLabel className="text-muted-foreground">
                    {t('spendingPlan:form.planFields.expectedDate')}
                  </FormLabel>
                  <FormControl>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {selectedFrequency === 'WEEKLY' && (
            <FormField
              control={form.control}
              name="dayOfWeek"
              render={({ field }) => (
                <FormItem className="col-span-2 mb-4">
                  <FormLabel className="text-muted-foreground">
                    {t('spendingPlan:form.planFields.dayOfWeek')}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('spendingPlan:form.planFields.dayOfWeekPlaceholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>{t('spendingPlan:form.planFields.dayOfWeek')}</SelectLabel>
                        <SelectItem value="0">{t('common:calendar.weekdays.sunday')}</SelectItem>
                        <SelectItem value="1">{t('common:calendar.weekdays.monday')}</SelectItem>
                        <SelectItem value="2">{t('common:calendar.weekdays.tuesday')}</SelectItem>
                        <SelectItem value="3">{t('common:calendar.weekdays.wednesday')}</SelectItem>
                        <SelectItem value="4">{t('common:calendar.weekdays.thursday')}</SelectItem>
                        <SelectItem value="5">{t('common:calendar.weekdays.friday')}</SelectItem>
                        <SelectItem value="6">{t('common:calendar.weekdays.saturday')}</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {selectedFrequency === 'ANNUAL' && (
            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <FormItem className="col-span-1 mb-4">
                  <FormLabel className="text-muted-foreground">
                    {t('spendingPlan:form.planFields.month')}
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      setCurrentMonth(value)
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('spendingPlan:form.planFields.monthPlaceholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>{t('spendingPlan:form.planFields.month')}</SelectLabel>
                        <SelectItem value="1">{t('common:calendar.months.january')}</SelectItem>
                        <SelectItem value="2">{t('common:calendar.months.february')}</SelectItem>
                        <SelectItem value="3">{t('common:calendar.months.march')}</SelectItem>
                        <SelectItem value="4">{t('common:calendar.months.april')}</SelectItem>
                        <SelectItem value="5">{t('common:calendar.months.may')}</SelectItem>
                        <SelectItem value="6">{t('common:calendar.months.june')}</SelectItem>
                        <SelectItem value="7">{t('common:calendar.months.july')}</SelectItem>
                        <SelectItem value="8">{t('common:calendar.months.august')}</SelectItem>
                        <SelectItem value="9">{t('common:calendar.months.september')}</SelectItem>
                        <SelectItem value="10">{t('common:calendar.months.october')}</SelectItem>
                        <SelectItem value="11">{t('common:calendar.months.november')}</SelectItem>
                        <SelectItem value="12">{t('common:calendar.months.december')}</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Day Field */}
          {(selectedFrequency === 'MONTHLY' || selectedFrequency === 'ANNUAL') && (
            <FormField
              control={form.control}
              name="day"
              render={({ field }) => (
                <FormItem className={selectedFrequency === 'MONTHLY' ? "col-span-2 mb-4" : "col-span-1 mb-4"}>
                  <FormLabel className="text-muted-foreground">
                    {t('spendingPlan:form.planFields.day')}
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      setSelectedDay(value)
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
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
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </form>
      </Form>

      <div className="pt-4 flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          {t('common:button.cancel')}
        </Button>
        <Button
          onClick={handleCreatePlan}
          disabled={isLoading}
          isLoading={isLoading}
          className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white"
        >
          {t('spendingPlan:form.createPlan')}
        </Button>
      </div>
    </div>
  )
}

export default CreatePlanForm
