import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { formatCurrency, translate } from '@/libraries/utils'
import { IAccountSource, IAccountSourceTransfer } from '@/core/account-source/models'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useGetAllAccountSourceFromAllFunds } from '@/core/account-source/hooks/useGetAllAccountSourceFromAllFunds'
import { initQueryOptions } from '@/constants/init-query-options'

const formSchema = z.object({
  targetId: z.string().min(1, 'Vui lòng chọn tài khoản đích'),
  amount: z.coerce
    .number()
    .min(1, 'Số tiền phải lớn hơn 0')
    .refine((val) => Number.isInteger(val), {
      message: 'Số tiền phải là số nguyên'
    })
})

type TransferFormValues = z.infer<typeof formSchema>

// Hàm định dạng số với dấu phẩy phân cách hàng nghìn
const formatNumberWithCommas = (value: string): string => {
  // Loại bỏ tất cả dấu phẩy hiện có
  const plainNumber = value.replace(/,/g, '')
  // Chỉ giữ lại các chữ số
  const numbers = plainNumber.replace(/[^\d]/g, '')
  // Định dạng số với dấu phẩy
  return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export default function TransferAccountSourceForm({
  sourceAccountSource,
  targetFundId,
  onSubmit
}: {
  sourceAccountSource: IAccountSource
  targetFundId: string
  onSubmit: (values: IAccountSourceTransfer) => void
}) {
  const t = translate(['accountSource', 'common'])
  const [allAccountSources, setAllAccountSources] = useState<IAccountSource[]>([])
  const [formattedAmount, setFormattedAmount] = useState('0')
  
  // Sử dụng hook mới để lấy tất cả account sources từ tất cả các quỹ
  const { getAllFundsData, isGetAllFundsPending } = useGetAllAccountSourceFromAllFunds()

  useEffect(() => {
    if (getAllFundsData?.data) {
      // Filter out the current account source
      setAllAccountSources(getAllFundsData.data.filter(acc => acc.id !== sourceAccountSource.id))
    }
  }, [getAllFundsData, sourceAccountSource.id])

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      targetId: '',
      amount: 0
    }
  })

  const handleFormSubmit = (values: TransferFormValues) => {
    onSubmit({
      sourceId: sourceAccountSource.id,
      targetId: values.targetId,
      amount: values.amount
    })
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    
    // Nếu trường input trống, đặt giá trị về '0'
    if (inputValue === '') {
      setFormattedAmount('0')
      form.setValue('amount', 0)
      return
    }
    
    // Loại bỏ các dấu phẩy và ký tự không phải số
    const plainNumber = inputValue.replace(/,/g, '').replace(/[^\d]/g, '')
    
    // Nếu là số 0 đầu tiên và đang nhập thêm, bỏ số 0 đi
    const cleanNumber = plainNumber === '0' ? '' : plainNumber
    
    // Cập nhật state hiển thị với dấu phẩy
    setFormattedAmount(cleanNumber ? formatNumberWithCommas(cleanNumber) : '0')
    
    // Cập nhật giá trị thực cho form
    form.setValue('amount', Number(cleanNumber || '0'))
  }

  return (
    <div className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <p className="text-sm text-muted-foreground">{t('form.editAccountSource.name')}</p>
            <p className="font-medium">{sourceAccountSource.name}</p>
          </div>
          
          <div className="flex flex-col space-y-2">
            <p className="text-sm text-muted-foreground">{t('form.editAccountSource.currentAmount')}</p>
            <p className="font-medium">{formatCurrency(sourceAccountSource.currentAmount, 'đ', 'vi-vn')}</p>
          </div>

          <FormField
            control={form.control}
            name="targetId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.transferAccountSourceFormBody.targetAccountSource.label')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('form.transferAccountSourceFormBody.targetAccountSource.placeholder')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isGetAllFundsPending ? (
                      <SelectItem value="loading" disabled>Đang tải...</SelectItem>
                    ) : allAccountSources.length > 0 ? (
                      allAccountSources.map((acc) => (
                        <SelectItem key={acc.id} value={acc.id}>
                          {acc.name} - {formatCurrency(acc.currentAmount, 'đ', 'vi-vn')}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="empty" disabled>Không tìm thấy tài khoản nào</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.transferAccountSourceFormBody.amount.label')}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={formattedAmount}
                    placeholder={t('form.transferAccountSourceFormBody.amount.placeholder')}
                    onChange={handleAmountChange}
                    onFocus={(e) => {
                      // Nếu giá trị là 0, xóa nó khi focus
                      if (e.target.value === '0') {
                        setFormattedAmount('')
                      } else {
                        // Di chuyển con trỏ về cuối khi focus
                        const val = e.target.value
                        e.target.value = ''
                        e.target.value = val
                      }
                    }}
                    onBlur={() => {
                      // Nếu trường để trống, đặt lại giá trị về '0'
                      if (formattedAmount === '') {
                        setFormattedAmount('0')
                        form.setValue('amount', 0)
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-4">
            <Button type="submit">{t('form.button.transfer_money')}</Button>
          </div>
        </form>
      </Form>
    </div>
  )
} 