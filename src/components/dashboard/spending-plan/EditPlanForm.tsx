"use client"
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
import { editFundSavingPlanSchema } from "@/core/fund-saving-plan/constants/edit-fund-saving-plan.constant"
import { ISpendingPlan, IUpdateFundSavingPlanRequest, RecurringFrequency } from "@/core/fund-saving-plan/models"
import { getDaysForMonth, getNextDayOfMonth, getNextDayOfWeek } from "@/libraries/utils"
import { DateTimePicker } from "@/components/core/DateTimePicker"
import { MoneyInput } from "@/components/core/MoneyInput"
import { mockDataTrackerType } from "@/app/dashboard/spending-plan/constant"
import { getDaysInMonth } from "@/core/fund-saving-plan/constants/create-fund-saving-plan.constant"

interface EditPlanFormProps {
    selectedPlan: ISpendingPlan | null
    onClose: () => void
    onUpdatePlan: (updatedPlan: IUpdateFundSavingPlanRequest) => void
    isLoading: boolean
    isOpen: boolean
}

const EditPlanForm: React.FC<EditPlanFormProps> = ({
    selectedPlan,
    onClose,
    onUpdatePlan,
    isLoading,
    isOpen
}) => {
    const { t } = useTranslation(['common', 'spendingPlan'])
    const [year] = useState<number>(new Date().getFullYear())
    const [currentMonth, setCurrentMonth] = useState<string>((new Date().getMonth() + 1).toString())
    const [selectedDay, setSelectedDay] = useState<string>(new Date().getDate().toString())
    const [selectedFrequency, setSelectedFrequency] = useState<RecurringFrequency>("MONTHLY")
    const [key, setKey] = useState(0) 

    const defaultValues = selectedPlan ? {
        name: selectedPlan.name || "",
        description: selectedPlan.description || "",
        targetAmount: selectedPlan.targetAmount?.toString() || "0",
        type: (selectedPlan.type as RecurringFrequency) || "MONTHLY",
        expectedDate: new Date(selectedPlan.expectedDate),
        dayOfWeek: new Date(selectedPlan.expectedDate).getDay().toString(),
        day: new Date(selectedPlan.expectedDate).getDate().toString(),
        month: (new Date(selectedPlan.expectedDate).getMonth() + 1).toString(),
    } : {
        name: "",
        description: "",
        targetAmount: "0",
        type: "MONTHLY" as RecurringFrequency,
        expectedDate: new Date(),
        dayOfWeek: "1",
        day: new Date().getDate().toString(),
        month: (new Date().getMonth() + 1).toString(),
    }

    const form = useForm({
        resolver: zodResolver(editFundSavingPlanSchema),
        defaultValues,
        mode: "onSubmit"
    })

    const daysInMonth = useMemo(() => {
        return getDaysForMonth(currentMonth, year).map(d => ({
            value: d.toString(),
            label: d.toString()
        }))
    }, [currentMonth, year])

    // Force re-render the form when selectedPlan changes
    useEffect(() => {
        if (isOpen && selectedPlan) {
            setKey(prev => prev + 1)

            // Set appropriate initial values based on the plan's frequency type
            setSelectedFrequency(selectedPlan.type as RecurringFrequency)

            const planDate = new Date(selectedPlan.expectedDate)
            setSelectedDay(planDate.getDate().toString())
            setCurrentMonth((planDate.getMonth() + 1).toString())

            // Reset form with new values
            form.reset({
                name: selectedPlan.name || "",
                description: selectedPlan.description || "",
                targetAmount: selectedPlan.targetAmount?.toString() || "0",
                type: (selectedPlan.type as RecurringFrequency) || "MONTHLY",
                expectedDate: new Date(selectedPlan.expectedDate),
                dayOfWeek: planDate.getDay().toString(),
                day: planDate.getDate().toString(),
                month: (planDate.getMonth() + 1).toString(),
            })
        }
    }, [isOpen, selectedPlan, form])

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
            expectedDate: (selectedFrequency === 'DAILY') ? currentDateTime : undefined,
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

    const handleUpdatePlan = form.handleSubmit((data) => {
        if (!selectedPlan) return

        const planData: IUpdateFundSavingPlanRequest = {
            id: selectedPlan.id,
            name: data.name,
            description: data.description,
            targetAmount: parseFloat(data.targetAmount.replace(/[^\d.-]/g, '')),
            type: data.type as RecurringFrequency
        }

        // Calculate expectedDate based on frequency type
        if (data.type === 'DAILY') {
            planData.startDate = new Date(data.expectedDate).toISOString().split('T')[0]
        } else if (data.type === 'WEEKLY') {
            const dayOfWeek = parseInt(data.dayOfWeek)
            planData.startDate = getNextDayOfWeek(dayOfWeek).toISOString().split('T')[0]
        } else if (data.type === 'MONTHLY') {
            const day = parseInt(data.day)
            planData.startDate = getNextDayOfMonth(day).toISOString().split('T')[0]
        } else if (data.type === 'ANNUAL') {
            const month = parseInt(data.month) - 1 // JavaScript months are 0-based
            const day = parseInt(data.day)
            const nextDate = new Date()
            nextDate.setMonth(month)
            nextDate.setDate(day)
            if (nextDate < new Date()) {
                nextDate.setFullYear(nextDate.getFullYear() + 1)
            }
            planData.startDate = nextDate.toISOString().split('T')[0]
        }

        onUpdatePlan(planData)
    })

    return (
        <div className="space-y-4 py-2 pb-4" key={key}>
            <Form {...form}>
                <form onSubmit={handleUpdatePlan} className="grid grid-cols-2 gap-x-4 gap-y-0">
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

                    {selectedFrequency === 'DAILY' && (
                        <FormField
                            control={form.control}
                            name="expectedDate"
                            render={({ field }) => (
                                <FormItem className="col-span-2 mb-4">
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
                    onClick={handleUpdatePlan}
                    disabled={isLoading}
                    isLoading={isLoading}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                >
                    {t('spendingPlan:form.updatePlan')}
                </Button>
            </div>
        </div>
    )
}

export default EditPlanForm
