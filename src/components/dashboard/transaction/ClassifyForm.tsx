import {
  IAgentRecommend,
  IClassiFyFormProps,
  IClassifyTransactionBody,
  ITransaction,
  IUnclassifiedTransaction
} from '@/core/transaction/models'
import { useEffect, useState } from 'react'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { motion } from 'framer-motion'
import {
  classifyTransactionSchema,
  defineClassifyTransactionFormBody
} from '@/core/transaction/constants/classify-transaction.constant'
import { IEditTrackerTypeDialogProps } from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Combobox } from '@/components/core/Combobox'
import { modifiedTrackerTypeForComboBox } from '@/app/dashboard/tracker-transaction/handlers'
import EditTrackerTypeDialog from '../EditTrackerType'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { translate } from '@/libraries/utils'

export default function ClassifyForm({
  selectedTransaction,
  incomeTrackerType,
  expenseTrackerType,
  formClassifyRef,
  handleClassify,
  editTrackerTypeDialogProps,
  indexSuggestSelected,
  setIndexSuggestSelected
}: Omit<IClassiFyFormProps, 'editTrackerTypeDialogProps'> & {
  editTrackerTypeDialogProps: Omit<
    IEditTrackerTypeDialogProps,
    'dataArr' | 'type' | 'setType' | 'setOpenEditDialog' | 'openEditDialog'
  >
  indexSuggestSelected: number
  setIndexSuggestSelected: React.Dispatch<React.SetStateAction<number>>
}) {
  // useEffect(() => {
  //   console.log('indexSuggestSelected - classify form', indexSuggestSelected)
  // }, [indexSuggestSelected])

  const t = translate(['transaction', 'common'])
  const [typeOfEditTrackerType, setTypeOfEditTrackerType] = useState<ETypeOfTrackerTransactionType>(
    (selectedTransaction?.direction as ETypeOfTrackerTransactionType) || ETypeOfTrackerTransactionType.INCOMING
  )

  const classifyForm = useForm<z.infer<typeof classifyTransactionSchema>>({
    resolver: zodResolver(classifyTransactionSchema),
    defaultValues: {},
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  })

  const [isOpenDialogEditTrackerType, setIsOpenDialogEditTrackerType] = useState<boolean>(false)
  useEffect(() => {
    setTypeOfEditTrackerType(editTrackerTypeDialogProps?.typeDefault || ETypeOfTrackerTransactionType.INCOMING)
  }, [editTrackerTypeDialogProps?.typeDefault])

  const handleSelect = (index: number) => {
    if (index === indexSuggestSelected) {
      setIndexSuggestSelected(-1)
      if (typeof classifyForm.setValue === 'function') {
        classifyForm.setValue('reasonName', '')
        classifyForm.setValue('trackerTypeId', '')
      }
    } else {
      setIndexSuggestSelected(index)
      if (typeof classifyForm.setValue === 'function') {
        console.log('check 1111', selectedTransaction?.agentSuggest[index].reasonName)
        console.log('check 2222', selectedTransaction?.agentSuggest[index].trackerTypeId)

        classifyForm.setValue('reasonName', selectedTransaction?.agentSuggest[index].reasonName as string)
        classifyForm.setValue('trackerTypeId', selectedTransaction?.agentSuggest[index].trackerTypeId as string)
      }
    }
  }

  return (
    // <FormZod
    //   formSchema={classifyTransactionSchema}
    //   formFieldBody={defineClassifyTransactionFormBody({
    //     selectedTransaction,
    //     editTrackerTypeDialogProps,
    //     expenseTrackerType,
    //     incomeTrackerType,
    //     typeOfEditTrackerType,
    //     setTypeOfEditTrackerType,
    //     setOpenEditDialog: setIsOpenDialogEditTrackerType,
    //     openEditDialog: isOpenDialogEditTrackerType
    //   })}
    //   // onSubmit={(data) => handleClassify({ ...data, transactionId } as IClassifyTransactionBody)}
    //   onSubmit={(data) => {}}
    //   submitRef={formClassifyRef}
    // />
    <Form {...classifyForm}>
      <form
        ref={formClassifyRef}
        id='classify-tracker-transaction-form'
        onSubmit={classifyForm.handleSubmit((data) =>
          handleClassify({
            ...data,
            transactionId: (selectedTransaction as IUnclassifiedTransaction).id
          } as IClassifyTransactionBody)
        )}
        className='grid grid-cols-2 gap-x-4 gap-y-0'
      >
        <FormField
          control={classifyForm.control}
          name='reasonName'
          defaultValue={
            indexSuggestSelected !== -1 ? selectedTransaction?.agentSuggest[indexSuggestSelected].reasonName : ''
          }
          render={({ field }) => (
            <FormItem className='col-span-2 mb-4'>
              <div className='flex justify-between'>
                <FormLabel className='text-muted-foreground'>
                  {t('TransactionType.defineClassifyTransactionFormBody.reasonName.label')}
                </FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input
                  placeholder={t('TransactionType.defineClassifyTransactionFormBody.reasonName.placeholder')}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className='mb-4 flex flex-wrap gap-2'>
          {selectedTransaction?.agentSuggest.map((suggestion: IAgentRecommend, index: number) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSelect(index)}
              className={`mb-2 mr-2 inline-block cursor-pointer whitespace-nowrap rounded-full px-3 py-1 text-sm transition-colors ${
                indexSuggestSelected === index
                  ? 'text-blue-900 dark:bg-gradient-to-r dark:from-purple-700 dark:via-indigo-800 dark:to-blue-900 dark:text-white'
                  : 'bg-accent/50 hover:bg-accent'
              }`}
            >
              {suggestion.reasonName}
            </motion.div>
          ))}
        </div>
        <FormField
          control={classifyForm.control}
          name='trackerTypeId'
          defaultValue={
            indexSuggestSelected !== -1 ? selectedTransaction?.agentSuggest[indexSuggestSelected].trackerTypeId : ''
          }
          render={({ field }) => (
            <FormItem className='col-span-2 mb-4'>
              <div className='flex justify-between'>
                <FormLabel className='text-muted-foreground'>
                  {t('TransactionType.defineClassifyTransactionFormBody.trackerTypeId.label')}
                </FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Combobox
                  setOpenEditDialog={setIsOpenDialogEditTrackerType}
                  dataArr={modifiedTrackerTypeForComboBox(
                    selectedTransaction?.direction === ETypeOfTrackerTransactionType.INCOMING
                      ? incomeTrackerType
                      : expenseTrackerType
                  )}
                  value={field.value}
                  dialogEdit={EditTrackerTypeDialog({
                    openEditDialog: isOpenDialogEditTrackerType,
                    setOpenEditDialog: setIsOpenDialogEditTrackerType,
                    dataArr: modifiedTrackerTypeForComboBox(
                      typeOfEditTrackerType === ETypeOfTrackerTransactionType.INCOMING
                        ? incomeTrackerType
                        : expenseTrackerType
                    ),
                    typeDefault:
                      (selectedTransaction?.direction as ETypeOfTrackerTransactionType) ||
                      ETypeOfTrackerTransactionType.INCOMING,
                    type: typeOfEditTrackerType,
                    setType: setTypeOfEditTrackerType,
                    handleCreateTrackerType: editTrackerTypeDialogProps.handleCreateTrackerType,
                    handleUpdateTrackerType: editTrackerTypeDialogProps.handleUpdateTrackerType,
                    handleDeleteTrackerType: editTrackerTypeDialogProps.handleDeleteTrackerType,
                    expenditureFund: editTrackerTypeDialogProps.expenditureFund
                  })}
                  onValueSelect={(value) => {
                    field.onChange(value)
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className='mb-4 flex flex-wrap gap-2'>
          {selectedTransaction?.agentSuggest.map((suggestion: IAgentRecommend, index: number) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSelect(index)}
              className={`mb-2 mr-2 inline-block cursor-pointer whitespace-nowrap rounded-full px-3 py-1 text-sm transition-colors ${
                indexSuggestSelected === index
                  ? 'text-blue-900 dark:bg-gradient-to-r dark:from-purple-700 dark:via-indigo-800 dark:to-blue-900 dark:text-white'
                  : 'bg-accent/50 hover:bg-accent'
              }`}
            >
              {suggestion.trackerTypeName}
            </motion.div>
          ))}
        </div>
        <FormField
          control={classifyForm.control}
          name='description'
          render={({ field }) => (
            <FormItem className='col-span-2 mb-4'>
              <div className='flex justify-between'>
                <FormLabel className='text-muted-foreground'>
                  {t('TransactionType.defineClassifyTransactionFormBody.description.label')}
                </FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Textarea
                  placeholder={t('TransactionType.defineClassifyTransactionFormBody.description.placeholder')}
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
  )
}
