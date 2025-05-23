'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'
import { handleApiError } from '@/libraries/errorHandler'
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
import { useAdminTransactionTypes } from '@/core/admin/hooks/useAdminTransactionTypes'

interface CreateTransactionTypeDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CreateTransactionTypeDialog({ isOpen, onClose, onSuccess }: CreateTransactionTypeDialogProps) {
  const t = translate(['common'])
  const { createTransactionType, isCreating } = useAdminTransactionTypes()
  
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<ETypeOfTrackerTransactionType | ''>('')
  const [trackerType, setTrackerType] = useState<ETrackerTypeOfTrackerTransactionType>(ETrackerTypeOfTrackerTransactionType.DEFAULT)
  const [errors, setErrors] = useState({
    name: '',
    type: '',
  })

  const resetForm = () => {
    setName('')
    setDescription('')
    setType('')
    setTrackerType(ETrackerTypeOfTrackerTransactionType.DEFAULT)
    setErrors({
      name: '',
      type: '',
    })
  }

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

    createTransactionType({
      name: name.trim(),
      description: description.trim(),
      type,
      trackerType
    }, {
      onSuccess: () => {
        toast.success(t('admin.transactionTypes.createSuccess'))
        resetForm()
        onSuccess()
      },
      onError: (error: any) => {
        handleApiError(error)
      }
    })
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('admin.transactionTypes.createTitle')}</DialogTitle>
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
            <Select value={type} onValueChange={(value) => setType(value as ETypeOfTrackerTransactionType)}>
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
            <Select 
              value={trackerType} 
              onValueChange={(value) => setTrackerType(value as ETrackerTypeOfTrackerTransactionType)}
            >
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
            <Button type="button" variant="outline" onClick={handleClose}>
              {t('admin.common.cancel')}
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? t('admin.common.creating') : t('admin.common.create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 