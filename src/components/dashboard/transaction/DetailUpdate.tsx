'use client'

import React, { useEffect, useRef, useState } from 'react'
import { CreditCard, Pencil, BookUserIcon, WalletCardsIcon, User, Clock, ChartBarStackedIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { formatCurrency, formatDateTimeVN, translate } from '@/libraries/utils'
import {
  IDetailUpdateTransactionDialogProps,
  IUpdateTrackerTransactionBody
} from '@/core/tracker-transaction/models/tracker-transaction.interface'
import FormZod from '@/components/core/FormZod'
import toast from 'react-hot-toast'
import {
  defineUpdateTrackerTransactionFormBody,
  updateTrackerTransactionSchema
} from '@/core/tracker-transaction/constants/update-tracker-transaction.constant'
import { Pencil2Icon } from '@radix-ui/react-icons'
import { Separator } from '@/components/ui/separator'
import { modifiedTrackerTypeForComboBox } from '@/app/dashboard/tracker-transaction/handlers'
import {
  ITrackerTranSactionEditType,
  ITrackerTransactionType
} from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MoneyInput } from '@/components/core/MoneyInput'
import { Combobox } from '@/components/core/Combobox'
import EditTrackerTypeDialog from '../EditTrackerType'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateTransactionSchema } from '@/core/transaction/constants/update-transaction.constant'
import { IUpdateTransactionBody } from '@/core/transaction/models'

export default function DetailUpdateTransaction({
  updateTransactionProps,
  updateTrackerTransactionProps,
  commonProps,
  classifyDialogProps
}: IDetailUpdateTransactionDialogProps) {
  const defaultValueTransactions = {
    direction: updateTransactionProps.transaction.direction as ETypeOfTrackerTransactionType,
    accountSourceId: updateTransactionProps.transaction.accountSource.id,
    amount: updateTransactionProps.transaction.amount
  }
  console.log('defaultValueTransactions', defaultValueTransactions)

  const defaultValueTrackerTransactions = {
    reasonName: updateTrackerTransactionProps?.trackerTransaction.reasonName || '',
    trackerTypeId: updateTrackerTransactionProps?.trackerTransaction.trackerTypeId || '',
    description: updateTrackerTransactionProps?.trackerTransaction.description || ''
  }
  const transactionForm = useForm<z.infer<typeof updateTransactionSchema>>({
    resolver: zodResolver(updateTransactionSchema),
    defaultValues: defaultValueTransactions,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  })

  const trackerTransactionForm = useForm<z.infer<typeof updateTrackerTransactionSchema>>({
    resolver: zodResolver(updateTrackerTransactionSchema),
    defaultValues: defaultValueTrackerTransactions,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  })
  const submitUpdateTransactionRef = useRef<HTMLFormElement>(null)
  const submitUpdateTrackerTransactionRef = useRef<HTMLFormElement>(null)
  const formUpdateTrackerTransactionRef = useRef(trackerTransactionForm)
  const formUpdateTransactionRef = useRef(transactionForm)
  const [trackerTypeData, setTrackerTypeData] = useState<ITrackerTransactionType[]>([])
  const [transactionState, setTransactionState] = useState<ITrackerTranSactionEditType>({
    isUpdateTrackerTransaction:
      (updateTransactionProps?.transaction?.direction as ETypeOfTrackerTransactionType) ||
      ETypeOfTrackerTransactionType.INCOMING,
    direction:
      (updateTransactionProps?.transaction?.direction as ETypeOfTrackerTransactionType) ||
      ETypeOfTrackerTransactionType.INCOMING,
    trackerTypeId: updateTrackerTransactionProps?.trackerTransaction?.trackerTypeId || ''
  })

  const t = translate(['transaction', 'common', 'trackerTransaction'])

  useEffect(() => {
    setTrackerTypeData(
      modifiedTrackerTypeForComboBox(
        transactionState.isUpdateTrackerTransaction === ETypeOfTrackerTransactionType.INCOMING
          ? updateTrackerTransactionProps?.editTrackerTransactionTypeProps?.incomeTrackerType
          : updateTrackerTransactionProps?.editTrackerTransactionTypeProps?.expenseTrackerType
      )
    )
  }, [transactionState.isUpdateTrackerTransaction])

  useEffect(() => {
    // Cập nhật form values khi direction thay đổi
    if (updateTrackerTransactionProps) {
      trackerTransactionForm.setValue(
        'trackerTypeId',
        updateTrackerTransactionProps.trackerTransaction.trackerTypeId || ''
      )
    }
  }, [updateTrackerTransactionProps])

  const [currentDirection, setCurrentDirection] = useState<ETypeOfTrackerTransactionType>(
    updateTransactionProps.transaction.direction as ETypeOfTrackerTransactionType
  )
  const [directionCategoryMap, setDirectionCategoryMap] = useState<Record<ETypeOfTrackerTransactionType, string>>({
    [ETypeOfTrackerTransactionType.INCOMING]:
      updateTransactionProps.transaction.direction === ETypeOfTrackerTransactionType.INCOMING
        ? updateTrackerTransactionProps?.trackerTransaction.trackerTypeId || ''
        : '',
    [ETypeOfTrackerTransactionType.EXPENSE]:
      updateTransactionProps.transaction.direction === ETypeOfTrackerTransactionType.EXPENSE
        ? updateTrackerTransactionProps?.trackerTransaction.trackerTypeId || ''
        : '',
    [ETypeOfTrackerTransactionType.TRANSFER]: ''
  })
  const [typeOfEditTrackerType, setTypeOfEditTrackerType] = useState<ETypeOfTrackerTransactionType>(
    updateTransactionProps.transaction.direction as ETypeOfTrackerTransactionType
  )

  useEffect(() => {
    setTrackerTypeData(
      modifiedTrackerTypeForComboBox(
        currentDirection === ETypeOfTrackerTransactionType.INCOMING
          ? updateTrackerTransactionProps?.editTrackerTransactionTypeProps?.incomeTrackerType
          : updateTrackerTransactionProps?.editTrackerTransactionTypeProps?.expenseTrackerType
      )
    )
  }, [currentDirection, updateTrackerTransactionProps])

  if (!updateTransactionProps || !updateTransactionProps.transaction) {
    return
  }

  const handleSubmit = async () => {
    console.log('updated')

    if (updateTransactionProps.isEditing) {
      if (
        classifyDialogProps?.formClassifyRef &&
        !updateTransactionProps.transaction.TrackerTransaction &&
        !updateTrackerTransactionProps
      ) {
        console.log(1111)
        classifyDialogProps.formClassifyRef.current?.requestSubmit()
      } else {
        console.log(2222)
        // Validate transaction form
        const isTransactionValid = await transactionForm.trigger()
        console.log('isTransactionValid', isTransactionValid)

        // trường hợp chỉ update Transaction
        if (!updateTrackerTransactionProps?.isEditing) {
          console.log(3333)
          if (isTransactionValid) submitUpdateTransactionRef.current?.requestSubmit()
        } else if (updateTrackerTransactionProps?.isEditing) {
          console.log(4444)
          // Validate tracker transaction form
          const isTrackerValid = await trackerTransactionForm.trigger()
          console.log('isTrackerValid', isTrackerValid)

          if (isTransactionValid && isTrackerValid) {
            console.log(5555)
            submitUpdateTransactionRef.current?.requestSubmit()
            submitUpdateTrackerTransactionRef.current?.requestSubmit()
          }
        }
      }
    }
  }

  const TransactionDetails = () => (
    <div className='select-none space-y-6'>
      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <h3 className='text-2xl font-bold'>{formatCurrency(updateTransactionProps.transaction.amount, 'đ')}</h3>
          <Badge
            className='rounded-full px-4 py-1 text-base font-semibold'
            style={{
              backgroundColor:
                updateTransactionProps.transaction.direction === ETypeOfTrackerTransactionType.INCOMING
                  ? window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? '#b3e6cc'
                    : '#e6f7ee'
                  : window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? '#f4cccc'
                    : '#fde5e5',
              color:
                updateTransactionProps.transaction.direction === ETypeOfTrackerTransactionType.INCOMING
                  ? window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? '#276749'
                    : '#276749'
                  : window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? '#a94442'
                    : '#a94442'
            }}
          >
            {updateTransactionProps.transaction.direction === ETypeOfTrackerTransactionType.INCOMING
              ? t('IUpdateTransactionFormBody.direction.options.incoming')
              : t('IUpdateTransactionFormBody.direction.options.expense')}
          </Badge>
        </div>
        <div className='flex items-center gap-2'>
          <Clock className='h-4 w-4 text-muted-foreground' />
          <p className='font-medium'>{formatDateTimeVN(updateTransactionProps.transaction.time, true)}</p>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-1'>
          <p className='text-sm text-muted-foreground'>{t('transaction:transactionDetails.senderAccount')}</p>
          {updateTransactionProps.transaction.ofAccount ? (
            <div className='mt-1 flex items-start gap-3'>
              <Avatar>
                <AvatarFallback className='bg-muted'>
                  <WalletCardsIcon className='h-4 w-4 text-muted-foreground' />
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <span className='font-medium'>{updateTransactionProps.transaction.accountSource?.name}</span>
                <span className='text-sm text-muted-foreground'>
                  {updateTransactionProps.transaction.ofAccount.accountNo +
                    ' • ' +
                    (updateTransactionProps.transaction.accountBank.type === 'MB_BANK' ? 'MB Bank' : 'N/A')}
                </span>
              </div>
            </div>
          ) : (
            <div className='flex items-center gap-3'>
              <Avatar>
                <AvatarFallback>
                  <WalletCardsIcon className='h-4 w-4 text-muted-foreground' />
                </AvatarFallback>
              </Avatar>
              <span className='font-medium'>{updateTransactionProps.transaction.accountSource?.name}</span>
            </div>
          )}
        </div>

        {updateTransactionProps.transaction.toAccountNo && (
          <div className='space-y-1'>
            <p className='text-sm text-muted-foreground'>{t('transaction:transactionDetails.receiverAccount')}</p>
            <div className='flex items-start gap-3'>
              <Avatar>
                <AvatarFallback className='bg-muted'>
                  <BookUserIcon className='h-4 w-4 text-muted-foreground' />
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <span className='font-medium'>{updateTransactionProps.transaction.toAccountName}</span>
                <span className='text-sm text-muted-foreground'>
                  {updateTransactionProps.transaction.toAccountNo} • {updateTransactionProps.transaction.toBankName}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className='space-y-2'>
        <div className='text-sm text-muted-foreground'>{t('transaction:transactionDetails.transactionContent')}</div>
        {updateTransactionProps.transaction.description ? (
          <div className='flex items-start gap-3'>
            <Avatar>
              <AvatarFallback className='bg-muted'>
                <Pencil2Icon className='h-4 w-4 text-muted-foreground' />
              </AvatarFallback>
            </Avatar>
            <div className='flex flex-col'>
              <span className='text-sm text-muted-foreground'>
                {updateTransactionProps.transaction.description || 'N/A'}
              </span>
            </div>
          </div>
        ) : (
          <div className='flex items-center space-x-4'>
            <Avatar>
              <AvatarFallback className='bg-muted'>
                <Pencil2Icon className='h-5 w-5 bg-muted' />
              </AvatarFallback>
            </Avatar>
            <span className='text-sm text-muted-foreground'>N/A</span>
          </div>
        )}
      </div>

      {updateTransactionProps.transaction.transactionId && (
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <CreditCard className='h-4 w-4' />
          <span>
            {t('transaction:transactionDetails.transactionCode')} {updateTransactionProps.transaction.transactionId}
          </span>
        </div>
      )}

      {updateTrackerTransactionProps && (
        <>
          <Separator />
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-1'>
                <p className='text-sm text-muted-foreground'>{t('transaction:transactionDetails.classifier')}</p>
                <div className='flex items-center gap-2'>
                  <User className='h-4 w-4 text-muted-foreground' />
                  <p className='font-medium'>
                    {updateTrackerTransactionProps.trackerTransaction.participant.user.fullName}
                  </p>
                </div>
              </div>

              <div className='space-y-1'>
                <p className='text-sm text-muted-foreground'>
                  {t('transaction:transactionDetails.classificationTime')}
                </p>
                <div className='flex items-center gap-2'>
                  <Clock className='h-4 w-4 text-muted-foreground' />
                  <p className='font-medium'>
                    {formatDateTimeVN(updateTrackerTransactionProps.trackerTransaction.trackerTime, true)}
                  </p>
                </div>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-1'>
                <p className='text-sm text-muted-foreground'>{t('transaction:transactionDetails.description')}</p>
                <div className='flex items-center gap-2'>
                  <p className='font-semibold'>
                    {updateTrackerTransactionProps.trackerTransaction.reasonName || 'N/A'}
                  </p>
                </div>
              </div>

              <div className='space-y-1'>
                <p className='text-sm text-muted-foreground'>{t('transaction:transactionDetails.category')}</p>
                <div className='flex items-center gap-2'>
                  {/* <ChartBarStackedIcon className='h-4 w-4 text-muted-foreground' /> */}
                  <p className='font-medium'>{updateTrackerTransactionProps.trackerTransaction.TrackerType.name}</p>
                </div>
              </div>
            </div>

            <div className='space-y-1'>
              <p className='text-sm text-muted-foreground'>{t('transaction:transactionDetails.note')}</p>
              <p className='text-muted-foreground'>
                {updateTrackerTransactionProps.trackerTransaction.description ||
                  t('transaction:transactionDetails.noNote')}
              </p>
            </div>
          </div>
        </>
      )}

      <div className='flex justify-end'>
        <Button
          onClick={() => {
            if (
              updateTransactionProps.transaction.ofAccount &&
              updateTransactionProps.transaction.TrackerTransaction &&
              !updateTrackerTransactionProps
            )
              toast.error(t('transactionDetails.toast'))
            else updateTransactionProps.setIsEditing(true)
          }}
        >
          <Pencil className='mr-2 h-4 w-4' />
          {!updateTransactionProps.transaction.TrackerTransaction && !updateTrackerTransactionProps
            ? t('transactionDetails.classify')
            : t('common:button.update')}
        </Button>
      </div>
    </div>
  )

  const UpdateForm = () => (
    <div>
      {!updateTransactionProps.transaction.TrackerTransaction && classifyDialogProps ? (
        <classifyDialogProps.ClassifyForm />
      ) : (
        <>
          {/* Form update transaction */}
          {!updateTransactionProps.transaction.ofAccount && (
            <Form {...transactionForm}>
              <form
                ref={submitUpdateTransactionRef}
                id='update-transaction-form'
                onSubmit={transactionForm.handleSubmit((data) => {
                  let currentTrackerTypeid = ''
                  if (
                    formUpdateTrackerTransactionRef.current &&
                    typeof formUpdateTrackerTransactionRef.current.getValues === 'function'
                  ) {
                    const values = formUpdateTrackerTransactionRef.current.getValues()
                    currentTrackerTypeid = values?.trackerTypeId || ''
                  }
                  if (updateTrackerTransactionProps) {
                  }
                  const payload: IUpdateTransactionBody = {
                    accountSourceId: data.accountSourceId,
                    direction: data.direction as ETypeOfTrackerTransactionType,
                    amount: Number(data.amount),
                    id: updateTransactionProps.transaction.id,
                    trackerTransactionTypeId: currentTrackerTypeid
                  }
                  updateTransactionProps.handleUpdateTransaction(payload, updateTransactionProps.setIsEditing)
                })}
                className='grid grid-cols-2 gap-x-4 gap-y-0'
              >
                <FormField
                  control={transactionForm.control}
                  name='amount'
                  render={({ field }) => (
                    <FormItem className='col-span-2 mb-4'>
                      <div className='flex justify-between'>
                        <FormLabel className='text-muted-foreground'>
                          {t('IUpdateTransactionFormBody.amount.label')}
                        </FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <MoneyInput
                          placeholder={t('IUpdateTransactionFormBody.amount.placeholder')}
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={transactionForm.control}
                  name='accountSourceId'
                  render={({ field }) => (
                    <FormItem className='col-span-2 mb-4'>
                      <div className='flex justify-between'>
                        <FormLabel className='text-muted-foreground'>
                          {t('IUpdateTransactionFormBody.accountSource.label')}
                        </FormLabel>
                        <FormMessage />
                      </div>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder={t('IUpdateTransactionFormBody.accountSource.label')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>{t('IUpdateTransactionFormBody.accountSource.placeholder')}</SelectLabel>
                            {commonProps.accountSourceData.map((accountSource, index) => (
                              <SelectItem key={index} value={accountSource.id}>
                                {accountSource.name + ' - ' + formatCurrency(accountSource.currentAmount, 'đ')}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={transactionForm.control}
                  name='direction'
                  render={({ field }) => (
                    <FormItem className='col-span-2 mb-4'>
                      <div className='flex justify-between'>
                        <FormLabel className='text-muted-foreground'>
                          {t('IUpdateTransactionFormBody.direction.label')}
                        </FormLabel>
                        <FormMessage />
                      </div>
                      <Select
                        onValueChange={(value: ETypeOfTrackerTransactionType) => {
                          console.log('checkkk', value !== updateTransactionProps.transaction.direction)

                          // Cập nhật currentDirection
                          setCurrentDirection(value)

                          // Kiểm tra và cập nhật trackerTypeId
                          if (value !== updateTransactionProps.transaction.direction) {
                            trackerTransactionForm.setValue('trackerTypeId', '')
                          } else {
                            trackerTransactionForm.setValue(
                              'trackerTypeId',
                              updateTrackerTransactionProps?.trackerTransaction.trackerTypeId || ''
                            )
                          }
                          field.onChange(value)
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder={t('IUpdateTransactionFormBody.direction.placeholder')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>{t('spendingPlan:form.planFields.frequency')}</SelectLabel>
                            <SelectItem value={ETypeOfTrackerTransactionType.INCOMING}>
                              {ETypeOfTrackerTransactionType.INCOMING}
                            </SelectItem>
                            <SelectItem value={ETypeOfTrackerTransactionType.EXPENSE}>
                              {ETypeOfTrackerTransactionType.EXPENSE}
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          )}
          {/* Form update tracker transaction */}
          {updateTrackerTransactionProps && (
            <Form {...trackerTransactionForm}>
              <form
                ref={submitUpdateTrackerTransactionRef}
                id='update-tracker-transaction-form'
                onSubmit={trackerTransactionForm.handleSubmit((data) => {
                  const payload: IUpdateTrackerTransactionBody = {
                    ...data,
                    description: data.description || undefined,
                    id: updateTrackerTransactionProps.trackerTransaction.id
                  }
                  updateTrackerTransactionProps.handleUpdateTrackerTransaction(
                    payload,
                    updateTransactionProps.setIsEditing
                  )
                })}
                className='grid grid-cols-2 gap-x-4 gap-y-0'
              >
                <FormField
                  control={trackerTransactionForm.control}
                  name='reasonName'
                  render={({ field }) => (
                    <FormItem className='col-span-2 mb-4'>
                      <div className='flex justify-between'>
                        <FormLabel className='text-muted-foreground'>
                          {t('form.defineCreateTrackerTransactionFormBody.reasonName.label')}
                        </FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input
                          placeholder={t('form.defineCreateTrackerTransactionFormBody.reasonName.placeholder')}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={trackerTransactionForm.control}
                  name='trackerTypeId'
                  render={({ field }) => (
                    <FormItem className='col-span-2 mb-4'>
                      <div className='flex justify-between'>
                        <FormLabel className='text-muted-foreground'>
                          {t('form.defineCreateTrackerTransactionFormBody.trackerTypeId.label')}
                        </FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Combobox
                          setOpenEditDialog={updateTrackerTransactionProps.setOpenEditDialog}
                          dataArr={modifiedTrackerTypeForComboBox(
                            currentDirection === ETypeOfTrackerTransactionType.INCOMING
                              ? updateTrackerTransactionProps?.editTrackerTransactionTypeProps.incomeTrackerType
                              : updateTrackerTransactionProps?.editTrackerTransactionTypeProps.expenseTrackerType
                          )}
                          value={directionCategoryMap?.[currentDirection] || ''}
                          dialogEdit={EditTrackerTypeDialog({
                            openEditDialog: updateTrackerTransactionProps.openEditDialog,
                            setOpenEditDialog: updateTrackerTransactionProps.setOpenEditDialog,
                            dataArr: modifiedTrackerTypeForComboBox(
                              typeOfEditTrackerType === ETypeOfTrackerTransactionType.INCOMING
                                ? updateTrackerTransactionProps.editTrackerTransactionTypeProps.incomeTrackerType
                                : updateTrackerTransactionProps.editTrackerTransactionTypeProps.expenseTrackerType
                            ),
                            typeDefault: currentDirection || ETypeOfTrackerTransactionType.INCOMING,
                            type: typeOfEditTrackerType,
                            setType: setTypeOfEditTrackerType,
                            handleCreateTrackerType:
                              updateTrackerTransactionProps.editTrackerTransactionTypeProps.editTrackerTypeDialogProps
                                .handleCreateTrackerType,
                            handleUpdateTrackerType:
                              updateTrackerTransactionProps.editTrackerTransactionTypeProps.editTrackerTypeDialogProps
                                .handleUpdateTrackerType,
                            handleDeleteTrackerType:
                              updateTrackerTransactionProps.editTrackerTransactionTypeProps.editTrackerTypeDialogProps
                                .handleDeleteTrackerType,
                            expenditureFund:
                              updateTrackerTransactionProps.editTrackerTransactionTypeProps.editTrackerTypeDialogProps
                                .expenditureFund
                          })}
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
                    </FormItem>
                  )}
                />
                <FormField
                  control={trackerTransactionForm.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem className='col-span-2 mb-4'>
                      <div className='flex justify-between'>
                        <FormLabel className='text-muted-foreground'>
                          {t('form.defineCreateTrackerTransactionFormBody.description.label')}
                        </FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Textarea
                          placeholder={t('form.defineCreateTrackerTransactionFormBody.description.placeholder')}
                          rows={3}
                          {...field}
                          value={field.value || ''}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          )}
        </>
      )}
      <div className='flex justify-between'>
        <Button type='button' variant='outline' onClick={() => updateTransactionProps.setIsEditing(false)}>
          {t('common:button.cancel')}
        </Button>
        <Button
          type='button'
          onClick={handleSubmit}
          isLoading={
            updateTrackerTransactionProps
              ? updateTrackerTransactionProps.statusUpdateTrackerTransaction === 'pending' &&
                updateTransactionProps.statusUpdateTransaction === 'pending'
              : updateTransactionProps.statusUpdateTransaction === 'pending'
          }
        >
          {t('common:button.save_changes')}
        </Button>
      </div>
    </div>
  )

  return <div>{updateTransactionProps.isEditing ? <UpdateForm /> : <TransactionDetails />}</div>
}
