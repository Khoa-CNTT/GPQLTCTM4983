'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  Sparkles,
  Loader2,
  CreditCard,
  AlertCircle,
  Info,
  Check,
  Calendar,
  Clock1,
  AlertTriangle,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAgent } from '@/core/agent/hooks'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useAccountSource } from '@/core/account-source/hooks'
import { IAccountSource } from '@/core/account-source/models'
import { useStoreLocal } from '@/hooks/useStoreLocal'
import { SubscriptionFormValues, subscriptionSchema } from '@/core/agent/constants/create-agent'
import { IAgentSubscriptionStatus } from '@/core/agent/models/agent.interface'
import { initQueryOptions } from '@/constants/init-query-options'
import { IQueryOptions } from '@/types/query.interface'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function ButtonPremium() {
  const { t } = useTranslation(['prenium'])
  const [open, setOpen] = useState(false)
  const [bankAccounts, setBankAccounts] = useState<IAccountSource[]>([])
  const [subscriptions, setSubscriptions] = useState<IAgentSubscriptionStatus[]>([])
  const [unsubscribeData, setUnsubscribeData] = useState({ id: '', execute: false })
  const [queryOptions, setQueryOptions] = useState<IQueryOptions>(initQueryOptions)
  const { fundId } = useStoreLocal()

  const { getAdvancedAccountSource } = useAccountSource()
  const { getAdvancedData } = getAdvancedAccountSource({ query: queryOptions, fundId })

  useEffect(() => {
    const dataAccountBank = getAdvancedData?.data.filter((item) => item.type === 'BANKING') || []
    setBankAccounts(dataAccountBank)
  }, [getAdvancedData])

  const { useGetAgentSubscription, isSubscribing, subscribeToAgent, useDeleteAgentSubcription } = useAgent()

  const { getAllDataAgent, refetchSubscriptionStatus } = useGetAgentSubscription({ query: queryOptions, fundId })

  useEffect(() => {
    setSubscriptions(getAllDataAgent?.data || [])
  }, [getAllDataAgent && getAllDataAgent.data])

  const allAccounts = useMemo(() => {
    if (bankAccounts.length === 0) return []
    return bankAccounts.flatMap(bank =>
      (bank?.accountBank?.accounts || []).map(acc => ({
        accountBankId: bank.accountBankId,
        accountNo: acc.accountNo,
        bankName: bank.name
      }))
    )
  }, [bankAccounts])

  const availableAccounts = useMemo(() => {
    const registeredIds = subscriptions.map(sub => sub.accountBankId)
    return allAccounts.filter(acc => !registeredIds.includes(acc.accountBankId))
  }, [allAccounts, subscriptions, unsubscribeData])

  const registeredAccounts = useMemo(() => {
    return subscriptions.map(sub => ({
      id: sub.id,
      accountNo: sub.accountBank?.login_id,
      bankName: sub.accountBank?.AccountSource?.name || sub.accountBank?.login_id || 'Unknown Bank',
      hour: sub.hour,
      minute: sub.minute
    }))
  }, [subscriptions])

  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      accountBankId: '',
      hour: 0,
      minute: 0
    }
  })

  const { isUnsubscribing } = useDeleteAgentSubcription({
    unsubscribeData,
    setUnsubscribeData,
    refetchSubscriptionStatus
  })

  const handleUnsubscribe = async (id: string) => {
    setUnsubscribeData({ id, execute: true })
  }

  const onSubmit = async (values: SubscriptionFormValues) => {
    subscribeToAgent({
      accountBankId: values.accountBankId,
      hour: values.hour,
      minute: values.minute
    }, {
      onSuccess: () => {
        refetchSubscriptionStatus()
      }
    })
  }

  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), [])
  const minutes = useMemo(() => Array.from({ length: 60 }, (_, i) => i), [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          className='mr-2 mt-0.5 h-7 select-none rounded-full !border-0 p-0 outline-none hover:bg-transparent focus:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0'
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className='flex items-center gap-2'>
            <Sparkles className='mr-2 h-4 w-4' />
            {t('title')}
          </motion.div>
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`w-full overflow-y-auto overflow-x-hidden p-2 sm:p-6 ${
          subscriptions.length === 0 ? 'max-w-[555px]' : 'sm:max-w-[1200px]'
        }`}
      >
        <DialogHeader>
          <DialogTitle className='flex items-center text-xl'>
            <Sparkles className='mr-2 h-5 w-5 text-indigo-500' />
            {t('title')}
          </DialogTitle>
          <DialogDescription className='pt-2 text-base'>
            {t('description')}
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col xl:flex-row gap-6 w-full min-w-0'>
          {registeredAccounts.length > 0 && (
            <div className='flex-1 min-w-0 w-full'>
              <div className='mb-4 rounded-lg bg-indigo-50 p-4 dark:bg-indigo-900/20'>
                <h3 className='mb-4 flex items-center font-medium text-lg'>
                  <Clock1 className='mr-2 h-5 w-5 text-indigo-500' />
                  {t('registered')}
                </h3>
                <div className='space-y-3'>
                  {registeredAccounts.map(acc => (
                    <div key={acc.id} className='flex flex-col sm:flex-row sm:items-center justify-between text-sm border-b border-gray-200 dark:border-gray-700 py-3 gap-2 sm:gap-4 w-full min-w-0'>
                      <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1 min-w-0'>
                        <div className='flex flex-col min-w-[120px] max-w-full'>
                          <span className='font-medium text-base truncate'>{acc.bankName}</span>
                          <span className='text-gray-500 dark:text-gray-400 text-sm truncate'>{acc.accountNo}</span>
                        </div>
                        <div className='flex items-center gap-2 text-indigo-600 dark:text-indigo-400 whitespace-nowrap'>
                          <Clock1 className='h-4 w-4 flex-shrink-0' />
                          <span>{t('dailyAt', { hour: acc.hour.toString().padStart(2, '0'), minute: acc.minute.toString().padStart(2, '0') })}</span>
                        </div>
                      </div>
                      <Button
                        variant='destructive'
                        onClick={() => handleUnsubscribe(acc.id)}
                        className='gap-2 whitespace-nowrap flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0'
                      >
                        {t('cancel')}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <p className='mb-4 rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-gray-500 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-gray-400'>
                <span className='flex items-start gap-3'>
                  <AlertTriangle className='mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-500' />
                  <span>{t('confirmCancel')}</span>
                </span>
              </p>
            </div>
          )}

          <div className='flex-1 min-w-0 w-full'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full min-w-0'>
                <div className='space-y-6'>
                  <div className='rounded-lg bg-blue-50 p-5 dark:bg-blue-900/20'>
                    <div className='flex items-start gap-4'>
                      <div className='rounded-full bg-blue-100 p-2 dark:bg-blue-800/30 flex-shrink-0'>
                        <Info className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <h4 className='mb-2 text-base font-medium text-blue-800 dark:text-blue-200'>
                          {t('featureList.title')}
                        </h4>
                        <ul className='list-disc pl-5 text-sm text-blue-800 dark:text-blue-200'>
                          <li>{t('featureList.item1')}</li>
                          <li>{t('featureList.item2')}</li>
                          <li>{t('featureList.item3')}</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className='space-y-6'>
                    <FormField
                      control={form.control}
                      name='accountBankId'
                      render={({ field }) => (
                        <FormItem>
                          <div className='flex justify-between mb-2'>
                            <FormLabel className='flex items-center text-base text-muted-foreground'>
                              <CreditCard className='mr-2 h-5 w-5 text-indigo-500' />
                              {t('accountLabel')}
                            </FormLabel>
                            <FormMessage />
                          </div>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value} disabled={availableAccounts.length === 0}>
                              <FormControl>
                                <SelectTrigger className='w-full h-11 border-indigo-100 focus:ring-indigo-200 dark:border-indigo-800'>
                                  <SelectValue placeholder={t('accountPlaceholder')} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {availableAccounts.map((acc) => (
                                  <SelectItem key={acc.accountNo} value={acc.accountBankId}>
                                    {acc.bankName} - {acc.accountNo}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className='flex flex-col lg:flex-row items-start lg:items-center gap-4 w-full min-w-0'>
                      <FormField
                        control={form.control}
                        name='hour'
                        render={({ field }) => (
                          <FormItem className='flex-1 min-w-0'>
                            <div className='flex justify-between mb-2'>
                              <FormLabel className='flex items-center text-base text-muted-foreground'>
                                <Clock1 className='mr-2 h-5 w-5 text-indigo-500' />
                                {t('hourLabel')}
                              </FormLabel>
                              <FormMessage />
                            </div>
                            <FormControl>
                              <Select
                                onValueChange={(value) => field.onChange(parseInt(value))}
                                value={field.value?.toString()}
                              >
                                <FormControl>
                                  <SelectTrigger className='w-full h-11 border-indigo-100 focus:ring-indigo-200 dark:border-indigo-800'>
                                    <SelectValue placeholder={t('hourPlaceholder')} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {hours.map((hour) => (
                                    <SelectItem key={hour} value={hour.toString()}>
                                      {hour.toString().padStart(2, '0')}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='minute'
                        render={({ field }) => (
                          <FormItem className='flex-1 min-w-0'>
                            <div className='flex justify-between mb-2'>
                              <FormLabel className='flex items-center text-base text-muted-foreground'>
                                <Clock1 className='mr-2 h-5 w-5 text-indigo-500' />
                                {t('minuteLabel')}
                              </FormLabel>
                              <FormMessage />
                            </div>
                            <FormControl>
                              <Select
                                onValueChange={(value) => field.onChange(parseInt(value))}
                                value={field.value?.toString()}
                              >
                                <FormControl>
                                  <SelectTrigger className='w-full h-11 border-indigo-100 focus:ring-indigo-200 dark:border-indigo-800'>
                                    <SelectValue placeholder={t('minutePlaceholder')} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {minutes.map((minute) => (
                                    <SelectItem key={minute} value={minute.toString()}>
                                      {minute.toString().padStart(2, '0')}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {availableAccounts.length === 0 && (
                    <div className='rounded-lg bg-yellow-50 p-5 dark:bg-yellow-900/20'>
                      <div className='flex items-start gap-4'>
                        <div className='rounded-full bg-yellow-100 p-2 dark:bg-yellow-800/30 flex-shrink-0'>
                          <AlertTriangle className='h-5 w-5 text-yellow-600 dark:text-yellow-400' />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <h4 className='mb-1 text-base font-medium text-yellow-800 dark:text-yellow-200'>
                            {t('notRegistered')}
                          </h4>
                          <p className='text-sm text-yellow-800 dark:text-yellow-200'>
                            {t('cannotRegisterMore')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className='flex justify-end pt-4'>
                  <Button
                    type='submit'
                    disabled={isSubscribing || availableAccounts.length === 0}
                    className='gap-2 w-full sm:w-auto h-11 text-base'
                  >
                    {isSubscribing ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Sparkles className='h-5 w-5' />
                    )}
                    {t('register')}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
