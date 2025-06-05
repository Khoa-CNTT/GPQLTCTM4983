import { modifiedTrackerTypeForComboBox } from '@/app/dashboard/tracker-transaction/handlers'
import EditTrackerTypeDialog from '@/components/dashboard/EditTrackerType'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { translate } from '@/libraries/utils'
import { EFieldType } from '@/types/formZod.interface'
import { z } from 'zod'

export const defineCreateTrackerTransactionFormBody = ({
  accountSourceData,
  incomeTrackerType,
  expenseTrackerType,
  currentDirection,
  setCurrentDirection,
  setOpenEditTrackerTxTypeDialog,
  openEditTrackerTxTypeDialog,
  typeOfEditTrackerType,
  setTypeOfEditTrackerType,
  handleCreateTrackerType,
  handleUpdateTrackerType,
  handleDeleteTrackerType,
  expenditureFund,
  directionCategoryMap,
  onCategoryChange,
  isPending
}: any) => {
  const t = translate(['trackerTransaction'])
  return [
    {
      name: 'reasonName',
      type: EFieldType.Input,
      label: t('form.defineCreateTrackerTransactionFormBody.reasonName.label'),
      placeHolder: t('form.defineCreateTrackerTransactionFormBody.reasonName.placeholder'),
      props: {
        autoComplete: 'reasonName'
      }
    },
    {
      name: 'amount',
      type: EFieldType.MoneyInput,
      label: t('form.defineCreateTrackerTransactionFormBody.amount.label'),
      placeHolder: t('form.defineCreateTrackerTransactionFormBody.amount.placeholder'),
      props: {
        autoComplete: 'amount'
      }
    },
    {
      name: 'accountSourceId',
      type: EFieldType.Select,
      label: t('form.defineCreateTrackerTransactionFormBody.accountSourceId.label'),
      placeHolder: t('form.defineCreateTrackerTransactionFormBody.accountSourceId.placeholder'),
      props: {
        onchange: (value: any) => {
          setCurrentDirection(value as ETypeOfTrackerTransactionType)
        }
      },
      dataSelector: modifiedTrackerTypeForComboBox(accountSourceData)
    },
    {
      name: 'direction',
      type: EFieldType.Select,
      label: t('form.defineCreateTrackerTransactionFormBody.direction.label'),
      placeHolder: t('form.defineCreateTrackerTransactionFormBody.direction.placeholder'),
      props: {
        autoComplete: 'direction',
        onchange: (value: any) => {
          const previousDirection = currentDirection
          setCurrentDirection(value as ETypeOfTrackerTransactionType)
        }
      },
      dataSelector: [
        {
          value: 'INCOMING',
          label: t('form.defineCreateTrackerTransactionFormBody.direction.options.incoming')
        },
        {
          value: 'EXPENSE',
          label: t('form.defineCreateTrackerTransactionFormBody.direction.options.expense')
        }
      ]
    },
    {
      name: 'trackerTypeId',
      type: EFieldType.Combobox,
      label: t('form.defineCreateTrackerTransactionFormBody.trackerTypeId.label'),
      placeHolder: t('form.defineCreateTrackerTransactionFormBody.trackerTypeId.placeholder'),
      props: {
        autoComplete: 'trackerTypeId',
        setOpenEditDialog: setOpenEditTrackerTxTypeDialog,
        dataArr: modifiedTrackerTypeForComboBox(
          currentDirection === ETypeOfTrackerTransactionType.INCOMING ? incomeTrackerType : expenseTrackerType
        ),
        onValueChange: (value: string) => {
          if (onCategoryChange) {
            onCategoryChange(value)
          }
        },
        value: directionCategoryMap?.[currentDirection] || '',
        dialogEdit: EditTrackerTypeDialog({
          openEditDialog: openEditTrackerTxTypeDialog,
          setOpenEditDialog: setOpenEditTrackerTxTypeDialog,
          dataArr: modifiedTrackerTypeForComboBox(
            typeOfEditTrackerType === ETypeOfTrackerTransactionType.INCOMING ? incomeTrackerType : expenseTrackerType
          ),
          typeDefault: currentDirection || ETypeOfTrackerTransactionType.INCOMING,
          type: typeOfEditTrackerType,
          setType: setTypeOfEditTrackerType,
          handleCreateTrackerType,
          handleUpdateTrackerType,
          handleDeleteTrackerType,
          expenditureFund
        }),
        label: t('form.defineCreateTrackerTransactionFormBody.trackerTypeId.label')
      }
    },
    {
      name: 'description',
      type: EFieldType.Textarea,
      label: t('form.defineCreateTrackerTransactionFormBody.description.label'),
      placeHolder: t('form.defineCreateTrackerTransactionFormBody.description.placeholder'),
      props: {
        autoComplete: 'description'
      }
    }
  ]
}

export const createTrackerTransactionSchema = z
  .object({
    reasonName: z
      .string({
        message: 'Tên lý do phải là chuỗi hợp lệ'
      })
      .trim()
      .min(1, { message: 'Tên lý do không được để trống' })
      .max(100, { message: 'Tên lý do không được vượt quá 100 ký tự' }),
    amount: z
      .any()
      .transform((value) => parseFloat(value))
      .refine((value) => !isNaN(value) && value > 0, {
        message: 'Số tiền phải là số hợp lệ và lớn hơn 0'
      }),
    accountSourceId: z
      .string({ message: 'Vui lòng chọn nguồn tài khoản' })
      .uuid({ message: 'ID nguồn tài khoản không đúng định dạng UUID' }),
    direction: z.enum(['INCOMING', 'EXPENSE'], { message: 'Loại giao dịch phải là "Thu vào" hoặc "Chi tiêu"' }),
    trackerTypeId: z
      .string({ message: 'Vui lòng chọn danh mục' })
      .uuid({ message: 'ID danh mục không đúng định dạng UUID' }),
    description: z.any()
  })
  .strict()
