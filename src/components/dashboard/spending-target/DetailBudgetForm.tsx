'use client'
import type React from 'react'
import { formatCurrency, formatDateTimeVN } from '@/libraries/utils'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import type { IDialogFlags, IBudgetTarget } from '@/core/fund-saving-target/models'
import { Badge } from '@/components/ui/badge'
import {
  ArrowRightIcon,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  FileText,
  PencilIcon,
  PiggyBank,
  Target,
  Trash2,
  Wallet,
  XCircle
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'

interface DetailBudgetFormProps {
  selectedTarget: IBudgetTarget | null
  onClose: () => void
  onEdit: () => void
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogFlags>>
}

const DetailBudgetForm: React.FC<DetailBudgetFormProps> = ({ selectedTarget, onClose, setIsDialogOpen }) => {
  const { t } = useTranslation(['common', 'spendingPlan'])

  if (!selectedTarget) {
    return (
      <div className='flex flex-col items-center justify-center px-4 py-12 text-center'>
        <PiggyBank className='mb-4 h-16 w-16 text-muted-foreground opacity-50' />
        <h3 className='mb-2 text-xl font-semibold'>{t('spendingPlan:targetForm.detailBudget.notFound')}</h3>
        <p className='mb-6 max-w-md text-muted-foreground'>
          {t('spendingPlan:targetForm.detailBudget.notFoundDescription')}
        </p>
        <Button variant='outline' onClick={onClose} className='min-w-[100px]'>
          <XCircle className='mr-2 h-4 w-4' />
          {t('common:button.close')}
        </Button>
      </div>
    )
  }

  const percentage = Math.min(100, Math.round((selectedTarget.currentAmount / selectedTarget.targetAmount) * 100))
  const remaining = selectedTarget.targetAmount - selectedTarget.currentAmount
  const isCompleted = percentage >= 100

  return (
    <div className='space-y-6 py-4'>
      <div className='flex flex-col items-start gap-6 md:flex-row'>
        <div className='flex-1 space-y-4'>
          <div className='flex items-center gap-3'>
            <CircleDollarSign className={`h-6 w-6 ${isCompleted ? 'text-emerald-500' : 'text-blue-500'}`} />
            <h2 className='text-2xl font-semibold'>{selectedTarget.name}</h2>
            <Badge
              className={`text-xs ${selectedTarget.trackerTypeDirection === ETypeOfTrackerTransactionType.INCOMING ? 'border-green-500 bg-green-500 text-white hover:bg-green-600 dark:border-green-700 dark:bg-green-700 dark:text-green-200 dark:hover:bg-green-800' : 'border-rose-500 bg-rose-500 text-white hover:bg-rose-600 dark:border-rose-700 dark:bg-rose-700 dark:text-rose-200 dark:hover:bg-rose-800'}`}
            >
              {selectedTarget.trackerTypeName}
            </Badge>
            <Badge>{selectedTarget.status}</Badge>
          </div>

          {selectedTarget.description && (
            <div className='mt-1 flex items-start'>
              <FileText className='mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground' />
              <p className='text-sm text-muted-foreground'>{selectedTarget.description}</p>
            </div>
          )}

          <div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='rounded-lg bg-muted/30 p-4'>
              <div className='mb-2 flex items-center'>
                <Target className='mr-2 h-5 w-5 text-muted-foreground' />
                <h3 className='font-medium'>{t('spendingPlan:targetForm.detailBudget.target')}</h3>
              </div>
              <p className='text-2xl font-semibold'>{formatCurrency(selectedTarget.targetAmount, 'đ')}</p>
            </div>
            <div className='rounded-lg bg-muted/30 p-4'>
              <div className='mb-2 flex items-center'>
                <Wallet className='mr-2 h-5 w-5 text-muted-foreground' />
                <h3 className='font-medium'>{t('spendingPlan:targetForm.detailBudget.saved')}</h3>
              </div>
              <p className='text-2xl font-semibold'>{formatCurrency(selectedTarget.currentAmount, 'đ')}</p>
            </div>
          </div>

          <div className='mt-6'>
            <div className='mb-2 flex justify-between text-sm'>
              <span className='flex items-center text-muted-foreground'>
                <Clock className='mr-1.5 h-4 w-4' />
                {t('spendingPlan:targetForm.detailBudget.progress')}:
              </span>
              <span className={`flex items-center font-medium ${isCompleted ? 'text-emerald-600' : 'text-blue-600'}`}>
                {isCompleted && <CheckCircle2 className='mr-1.5 h-4 w-4' />}
                {percentage}%
              </span>
            </div>
            <Progress
              value={percentage}
              className={`h-3 ${isCompleted ? 'bg-emerald-100' : percentage > 75 ? 'bg-blue-100' : 'bg-muted/50'}`}
            />

            {!isCompleted && (
              <p className='mt-2 text-sm text-muted-foreground'>
                {t('spendingPlan:targetForm.detailBudget.missing')}: {formatCurrency(remaining, 'đ')}
              </p>
            )}
          </div>

          <div className='mt-6 border-t pt-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-muted-foreground'>{t('spendingPlan:targetForm.detailBudget.startDate')}</p>
                <p className='mt-1 flex items-center'>
                  <CalendarDays className='mr-1.5 h-4 w-4 text-muted-foreground' />
                  {formatDateTimeVN(selectedTarget.startDate, false)}
                </p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>{t('spendingPlan:targetForm.detailBudget.endDate')}</p>
                <p className='mt-1 flex items-center'>
                  <CalendarDays className='mr-1.5 h-4 w-4 text-muted-foreground' />
                  {formatDateTimeVN(selectedTarget.endDate, false)}
                </p>
              </div>
            </div>
          </div>

          <div className='mt-4'>
            <p className='text-sm text-muted-foreground'>{t('spendingPlan:targetForm.detailBudget.timeRemaining')}</p>
            <p className='mt-1 font-medium'>{selectedTarget.remainingDays}</p>
          </div>
        </div>
      </div>

      <div className='flex justify-between gap-3 border-t pt-4'>
        <div className='ml-auto flex gap-3'>
          <Button variant='outline' onClick={onClose}>
            <XCircle className='mr-2 h-4 w-4' />
            {t('common:button.close')}
          </Button>
          <Button
            variant='destructive'
            onClick={() => setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteTargetOpen: true }))}
          >
            <Trash2 className='mr-2 h-4 w-4' />
            {t('common:button.delete')}
          </Button>
          <Button onClick={() => setIsDialogOpen((prev) => ({ ...prev, isDialogEditTargetOpen: true }))}>
            <PencilIcon className='mr-2 h-4 w-4' />
            {t('common:button.edit')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DetailBudgetForm
