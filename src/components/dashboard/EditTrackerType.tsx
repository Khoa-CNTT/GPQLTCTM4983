import React, { useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { PlusIcon, SaveIcon, X } from 'lucide-react'
import { IEditTrackerTypeDialogProps } from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import CreateTrackerTypeForm from './CreateTrackerTypeForm'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import AccordionEditTrackerType from './AccordionEditTrackerType'
import { useTranslation } from 'react-i18next'

export default function EditTrackerTypeDialog({
  openEditDialog,
  setOpenEditDialog,
  dataArr,
  typeDefault,
  type,
  setType,
  handleCreateTrackerType,
  handleUpdateTrackerType,
  handleDeleteTrackerType,
  expenditureFund
}: IEditTrackerTypeDialogProps) {
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [valueSearch, setValueSearch] = useState<string>('')
  const filteredDataArr = dataArr?.filter((data) => data.label.toLowerCase().includes(valueSearch.trim().toLowerCase()))

  const formRefCreate = useRef<HTMLFormElement>(null)
  useEffect(() => {
    if (!openEditDialog) {
      setIsCreating(false)
      setType(typeDefault)
    }
  }, [openEditDialog])
  const { t } = useTranslation(['trackerTransaction', 'common'])
  return (
    <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
      <DialogContent className='rsm:max-w-[525px]'>
        <DialogHeader>
          <DialogTitle>{t('editCategory.title')}</DialogTitle>
          <DialogDescription>{t('editCategory.description')}</DialogDescription>
          <div className='mt-3 w-full'>
            <div className='flex flex-col gap-2 sm:flex-row'>
              <Input
                value={valueSearch}
                onChange={(e) => setValueSearch(e.target.value)}
                className='w-full'
                placeholder={t('editCategory.search')}
              />
            </div>
            <div className='mt-2 flex w-full flex-col gap-2 sm:flex-row'>
              <Select onValueChange={(value: ETypeOfTrackerTransactionType) => setType(value)} value={type}>
                <SelectTrigger style={{ userSelect: 'none' }}>
                  <SelectValue placeholder={t('editCategory.form.selectType')} />
                </SelectTrigger>
                <SelectContent style={{ userSelect: 'none' }}>
                  <SelectItem key={'INCOMING'} value={'INCOMING'}>
                    {t('form.defineCreateTrackerTransactionFormBody.direction.options.incoming')}
                  </SelectItem>
                  <SelectItem key={'EXPENSE'} value={'EXPENSE'}>
                    {t('form.defineCreateTrackerTransactionFormBody.direction.options.expense')}
                  </SelectItem>
                </SelectContent>
              </Select>
              {isCreating === true ? (
                <>
                  <Button variant='secondary' onClick={() => formRefCreate.current?.requestSubmit()}>
                    {t('common:button.save')} <SaveIcon className='ml-2 h-4 w-4' />
                  </Button>
                  <Button className='w-full whitespace-nowrap sm:w-auto' onClick={() => setIsCreating(false)}>
                    {t('common:button.close')} <X className='ml-2 h-4 w-4' />
                  </Button>
                </>
              ) : (
                <Button
                  className='w-full whitespace-nowrap sm:w-auto'
                  variant='secondary'
                  onClick={() => setIsCreating(true)}
                >
                  {t('common:button.create')} <PlusIcon className='ml-2 h-4 w-4' />
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>
        <div>
          {isCreating === true && (
            <div className='mb-2 rounded-lg border p-4'>
              <CreateTrackerTypeForm
                typeOfTrackerType={type}
                formRef={formRefCreate}
                handleCreateTrackerType={handleCreateTrackerType}
                setIsCreating={setIsCreating}
                expenditureFund={expenditureFund}
              />
            </div>
          )}

          <AccordionEditTrackerType
            dataArr={filteredDataArr || []}
            handleDeleteTrackerType={handleDeleteTrackerType}
            handleUpdateTrackerType={handleUpdateTrackerType}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
