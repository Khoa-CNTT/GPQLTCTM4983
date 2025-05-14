'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'
import { translate } from '@/libraries/utils'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ETypeOfTrackerTransactionType, ETrackerTypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { ITrackerTransactionTypeBody } from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { TransactionType } from './transaction-types-table'
import { useAdminTransactionTypes } from '@/core/admin/hooks/useAdminTransactionTypes'

interface EditTransactionTypeDialogProps {
  isOpen: boolean
  onClose: () => void
  transactionType: TransactionType
  onSuccess: () => void
}

export function EditTransactionTypeDialog({ 
  isOpen, 
  onClose, 
  transactionType,
  onSuccess 
}: EditTransactionTypeDialogProps) {
  const t = translate(['common'])
  const { updateTransactionType, isUpdating } = useAdminTransactionTypes()
  
  const [name, setName] = useState(transactionType.name)
  const [description, setDescription] = useState(transactionType.description || '')
  const [type, setType] = useState<string>(transactionType.type)
  const [trackerType, setTrackerType] = useState<string>(transactionType.trackerType)
  const [errors, setErrors] = useState({
    name: '',
    type: '',
  })

  useEffect(() => {
    if (isOpen) {
      setName(transactionType.name)
      setDescription(transactionType.description || '')
      setType(transactionType.type)
      setTrackerType(transactionType.trackerType)
      setErrors({
        name: '',
        type: '',
      })
    }
  }, [isOpen, transactionType])

  const validateForm = () => {
    const newErrors = {
      name: '',
      type: '',
    }
    let valid = true

    if (!name.trim()) {
      newErrors.name = t('admin.transactionTypes.errors.nameRequired')
      valid = false
    }

    if (!type) {
      newErrors.type = t('admin.transactionTypes.errors.typeRequired')
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    updateTransactionType({
      id: transactionType.id,
      data: {
        name: name.trim(),
        description: description.trim(),
        type,
        trackerType: trackerType as ETrackerTypeOfTrackerTransactionType
      }
    }, {
      onSuccess: () => {
        toast.success(t('admin.transactionTypes.updateSuccess'))
        onSuccess()
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || t('admin.transactionTypes.updateError'))
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('admin.transactionTypes.editTitle')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="name">{t('admin.transactionTypes.name')}<span className="text-destructive">*</span></Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('admin.transactionTypes.namePlaceholder')}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('admin.transactionTypes.description')}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('admin.transactionTypes.descriptionPlaceholder')}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">{t('admin.transactionTypes.type')}<span className="text-destructive">*</span></Label>
            <Select value={type} onValueChange={(value) => setType(value)}>
              <SelectTrigger className={errors.type ? "border-destructive" : ""}>
                <SelectValue placeholder={t('admin.transactionTypes.typePlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ETypeOfTrackerTransactionType.INCOMING}>
                  {t('admin.transactionTypes.typeIncoming')}
                </SelectItem>
                <SelectItem value={ETypeOfTrackerTransactionType.EXPENSE}>
                  {t('admin.transactionTypes.typeExpense')}
                </SelectItem>
                <SelectItem value={ETypeOfTrackerTransactionType.TRANSFER}>
                  {t('admin.transactionTypes.typeTransfer')}
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-destructive text-sm">{errors.type}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="trackerType">{t('admin.transactionTypes.trackerType')}</Label>
            <Select value={trackerType} onValueChange={(value) => setTrackerType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ETrackerTypeOfTrackerTransactionType.DEFAULT}>
                  {t('admin.transactionTypes.trackerTypeDefault')}
                </SelectItem>
                <SelectItem value={ETrackerTypeOfTrackerTransactionType.CONTRIBUTE}>
                  {t('admin.transactionTypes.trackerTypeContribute')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('admin.common.cancel')}
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? t('admin.common.saving') : t('admin.common.save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 