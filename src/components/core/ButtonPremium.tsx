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

export default function ButtonPremium() {
  const [open, setOpen] = useState(false)
  const [bankAccounts, setBankAccounts] = useState<IAccountSource[]>([])
  const [subscriptions, setSubscriptions] = useState<IAgentSubscriptionStatus[]>([])
  const [queryOptions, setQueryOptions] = useState<IQueryOptions>(initQueryOptions)
  const { fundId } = useStoreLocal()
  const { getAdvancedAccountSource } = useAccountSource()

  const { getAdvancedData } = getAdvancedAccountSource({ query: queryOptions, fundId })

  useEffect(() => {
    const dataAccountBank = getAdvancedData?.data.filter((item) => item.type === 'BANKING') || []
    setBankAccounts(dataAccountBank)
  }, [getAdvancedData])

  const { useGetAgentSubscription, isSubscribing, subscribeToAgent, useDeleteAgentSubcription } = useAgent()

  const { getAllDataAgent, refetchSubscriptionStatus } = useGetAgentSubscription()

  useEffect(() => {
    setSubscriptions(getAllDataAgent?.data || [])
  }, [getAllDataAgent?.data])

  const subscription = useMemo(() => {
    const currentSubscription = subscriptions[0]
    if (!currentSubscription) return null

    const bankAccount = bankAccounts?.find((account) => account.id === currentSubscription.accountBankId)

    return {
      id: currentSubscription.id,
      isSubscribed: subscriptions.length > 0,
      bankAccount: bankAccount ? {
        id: bankAccount.id,
        name: bankAccount.name,
        accountNo: bankAccount.accountBank?.accounts[0]?.accountNo || 'N/A'
      } : null,
      schedule: {
        hour: currentSubscription.hour,
        minute: currentSubscription.minute
      }
    }
  }, [subscriptions, bankAccounts])

  const { executeUnsubscribe, isUnsubscribing } = useDeleteAgentSubcription(subscription?.id)

  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      accountBankId: '',
      hour: 0,
      minute: 0
    }
  })

  const onSubmit = (values: SubscriptionFormValues) => {
    console.log('values: ', values)

    subscribeToAgent({
      accountBankId: values.accountBankId,
      hour: values.hour,
      minute: values.minute
    })
  }

  const handleUnsubscribe = () => {
    if (subscription?.id) {
      executeUnsubscribe()
    }
  }

  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), [])
  const minutes = useMemo(() => Array.from({ length: 60 }, (_, i) => i), [])

  useEffect(() => {
    refetchSubscriptionStatus()
  }, [refetchSubscriptionStatus])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          className='mr-2 mt-0.5 h-7 select-none rounded-full !border-0 p-0 outline-none hover:bg-transparent focus:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0'
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className='flex items-center gap-2'>
            <Sparkles className='mr-2 h-4 w-4' />
            AI Agent {subscription?.isSubscribed && <Check className='ml-1 h-3 w-3' />}
          </motion.div>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[555px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center text-xl'>
            <Sparkles className='mr-2 h-5 w-5 text-indigo-500' />
            {subscription?.isSubscribed ? 'Quản lý dịch vụ AI Agent' : 'Đăng ký AI Agent Premium'}
          </DialogTitle>
          <DialogDescription className='pt-2 text-base'>
            {subscription?.isSubscribed
              ? 'Quản lý cài đặt và đăng ký dịch vụ AI Agent premium.'
              : 'Nhận hỗ trợ tài chính cá nhân hóa với dịch vụ AI Agent cao cấp.'}
          </DialogDescription>
        </DialogHeader>

        {subscription?.isSubscribed ? (
          <div className='py-6'>
            <div className='mb-6 rounded-lg bg-indigo-50 p-4 dark:bg-indigo-900/20'>
              <h3 className='mb-2 flex items-center font-medium'>
                <Clock1 className='mr-2 h-4 w-4 text-indigo-500' />
                Lịch trình hiện tại
              </h3>
              <div className='space-y-2'>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-500 dark:text-gray-400'>Tài khoản:</span>
                  <span className='font-medium'>
                    {subscription.bankAccount
                      ? `${subscription.bankAccount.name} - ${subscription.bankAccount.accountNo}`
                      : 'Unknown Bank'}
                  </span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-500 dark:text-gray-400'>Thời gian:</span>
                  <span className='font-medium'>
                    Hàng ngày lúc {subscription.schedule.hour?.toString().padStart(2, '0')}:
                    {subscription.schedule.minute?.toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>

            <p className='mb-6 rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-gray-500 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-gray-400'>
              <span className='flex items-start'>
                <AlertTriangle className='mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-500' />
                <span>Bạn có thể hủy đăng ký bất kỳ lúc nào. Dịch vụ sẽ tiếp tục cho đến khi bạn hủy đăng ký.</span>
              </span>
            </p>

            <div className='flex justify-end'>
              <Button
                variant='destructive'
                onClick={handleUnsubscribe}
                disabled={isUnsubscribing === 'pending'}
                className='gap-2'
              >
                <X className='h-4 w-4' />
                Hủy đăng ký
              </Button>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 py-4'>
              <div className='space-y-4'>
                {bankAccounts.length === 0 ? (
                  <div className='rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20'>
                    <div className='flex items-start space-x-3'>
                      <div className='rounded-full bg-yellow-100 p-1 dark:bg-yellow-800/30'>
                        <AlertTriangle className='h-4 w-4 text-yellow-600 dark:text-yellow-400' />
                      </div>
                      <div>
                        <h4 className='mb-1 text-sm font-medium text-yellow-800 dark:text-yellow-200'>
                          Chưa có tài khoản ngân hàng
                        </h4>
                        <p className='text-sm text-yellow-800 dark:text-yellow-200'>
                          Vui lòng thêm tài khoản ngân hàng trước khi đăng ký dịch vụ AI Agent.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className='rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20'>
                      <div className='flex items-start space-x-3'>
                        <div className='rounded-full bg-blue-100 p-1 dark:bg-blue-800/30'>
                          <Info className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                        </div>
                        <div>
                          <h4 className='mb-1 text-sm font-medium text-blue-800 dark:text-blue-200'>
                            Thông tin về dịch vụ
                          </h4>
                          <p className='text-sm text-blue-800 dark:text-blue-200'>
                            AI Agent sẽ phân tích tài chính của bạn và cung cấp thông tin chi tiết hàng ngày vào thời
                            gian đã lên lịch.
                          </p>
                        </div>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name='accountBankId'
                      render={({ field }) => (
                        <FormItem className='mb-4'>
                          <div className='flex justify-between'>
                            <FormLabel className='flex items-center text-muted-foreground'>
                              <CreditCard className='mr-2 h-4 w-4 text-indigo-500' />
                              Tài khoản ngân hàng
                            </FormLabel>
                            <FormMessage />
                          </div>
                          <div className='mt-2'>
                            <div className='relative'>
                              <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className='border-indigo-100 focus:ring-indigo-200 dark:border-indigo-800'>
                                      <SelectValue placeholder='Chọn tài khoản ngân hàng' />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {bankAccounts &&
                                      bankAccounts.map((account) => {
                                        console.log('>>>>>>', account)
                                        console.log('=======', account.accountBankId)

                                        return (
                                        <SelectItem key={account.id} value={account.accountBankId}>
                                          {account.name}
                                        </SelectItem>
                                      ) })}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className='grid grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='hour'
                        render={({ field }) => (
                          <FormItem>
                            <div className='flex justify-between'>
                              <FormLabel className='flex items-center text-muted-foreground'>
                                <Clock1 className='mr-2 h-4 w-4 text-indigo-500' />
                                Giờ
                              </FormLabel>
                              <FormMessage />
                            </div>
                            <div className='mt-2'>
                              <div className='relative'>
                                <FormControl>
                                  <Select
                                    onValueChange={(value) => field.onChange(parseInt(value))}
                                    value={field.value?.toString()}
                                  >
                                    <FormControl>
                                      <SelectTrigger className='border-indigo-100 focus:ring-indigo-200 dark:border-indigo-800'>
                                        <SelectValue placeholder='Chọn giờ' />
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
                              </div>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='minute'
                        render={({ field }) => (
                          <FormItem>
                            <div className='flex justify-between'>
                              <FormLabel className='flex items-center text-muted-foreground'>
                                <Clock1 className='mr-2 h-4 w-4 text-indigo-500' />
                                Phút
                              </FormLabel>
                              <FormMessage />
                            </div>
                            <div className='mt-2'>
                              <div className='relative'>
                                <FormControl>
                                  <Select
                                    onValueChange={(value) => field.onChange(parseInt(value))}
                                    value={field.value?.toString()}
                                  >
                                    <FormControl>
                                      <SelectTrigger className='border-indigo-100 focus:ring-indigo-200 dark:border-indigo-800'>
                                        <SelectValue placeholder='Chọn phút' />
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
                              </div>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className='flex justify-end'>
                <Button type='submit' disabled={isSubscribing || bankAccounts.length === 0} className='gap-2'>
                  <Sparkles className='h-4 w-4' />
                  Đăng ký ngay
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
