import React, { useEffect, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { EmojiPicker } from '@/components/common/EmojiPicker'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Delete, Edit, PlusIcon, Save, SaveIcon, Undo2, X } from 'lucide-react'
import {
  ITrackerTransactionType,
  ITrackerTransactionTypeBody
} from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { EFieldType, IBodyFormField } from '@/types/formZod.interface'
import { z } from 'zod'
import FormZod from '../core/FormZod'
import CreateTrackerTypeForm from './CreateTrackerTypeForm'
import { Card, CardContent } from '../ui/card'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'

export interface IEditTrackerTypeDialogData extends ITrackerTransactionType {
  value: string
  label: string
}

export interface IEditTrackerTypeDialogProps {
  openEditDialog: boolean
  setOpenEditDialog: React.Dispatch<React.SetStateAction<boolean>>
  dataArr: IEditTrackerTypeDialogData[]
  typeDefault: ETypeOfTrackerTransactionType
  type: ETypeOfTrackerTransactionType
  setType: React.Dispatch<React.SetStateAction<ETypeOfTrackerTransactionType>>
  onClose?: () => void
  handleCreateTrackerType: (
    data: ITrackerTransactionTypeBody,
    setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
  ) => void
  handleUpdateTrackerType: (data: ITrackerTransactionTypeBody) => void
}

export default function EditTrackerTypeDialog({
  openEditDialog,
  setOpenEditDialog,
  dataArr,
  typeDefault,
  type,
  setType,
  handleCreateTrackerType,
  handleUpdateTrackerType
}: IEditTrackerTypeDialogProps) {
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [isUpdate, setIsUpdate] = useState<boolean>(false)
  const [valueSearch, setValueSearch] = useState<string>('')
  const filteredDataArr = dataArr.filter((data) => data.label.toLowerCase().includes(valueSearch.trim().toLowerCase()))

  const onHandleUpdate = () => {
    if (isUpdate) {
      //update
    }
    setIsUpdate(!isUpdate)
  }
  const editTrackerTypeBody: IBodyFormField[] = [
    {
      name: 'name',
      type: EFieldType.Input,
      label: 'Name',
      placeHolder: 'Enter tracker transaction type name',
      props: {
        autoComplete: 'name',
        disabled: !isUpdate
      }
    },
    {
      name: 'type',
      type: EFieldType.Select,
      label: 'Type',
      placeHolder: 'Select type for tracker transaction type',
      props: {
        autoComplete: 'type',
        disabled: !isUpdate,
        value: type
      },
      dataSelector: [
        { value: 'INCOMING', label: 'Incoming' },
        { value: 'EXPENSE', label: 'Expense' }
      ]
    },
    {
      name: 'description',
      type: EFieldType.Textarea,
      label: 'Description',
      placeHolder: 'Enter tracker transaction type description',
      props: {
        autoComplete: 'description',
        disabled: !isUpdate
      }
    }
  ]

  const editTrackerTypeSchema = z
    .object({
      name: z.string().trim().min(2).max(256),
      type: z.enum(['INCOMING', 'EXPENSE']),
      description: z.string().min(10).max(256).optional()
    })
    .strict()

  const formRef = useRef<HTMLFormElement>(null)
  useEffect(() => {
    if (!openEditDialog) {
      setIsCreating(false)
      setIsUpdate(false)
      setType(typeDefault)
    }
  }, [openEditDialog])
  return (
    <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
      <DialogContent className='rsm:max-w-[525px]'>
        <DialogHeader>
          <DialogTitle>Edit Tracker Transaction Type</DialogTitle>
          <DialogDescription>Make changes to your Tracker Transaction Type</DialogDescription>
          <div className='mt-3 w-full'>
            <div className='flex flex-col gap-2 sm:flex-row'>
              <Input
                value={valueSearch}
                onChange={(e) => setValueSearch(e.target.value)}
                className='w-full'
                placeholder='Search Tracker Transaction Type'
              />
            </div>
            <div className='mt-2 flex w-full flex-col gap-2 sm:flex-row'>
              <Select onValueChange={(value: ETypeOfTrackerTransactionType) => setType(value)} value={type}>
                <SelectTrigger>
                  <SelectValue placeholder='Select type for tracker transaction type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key={'INCOMING'} value={'INCOMING'}>
                    Incoming
                  </SelectItem>
                  <SelectItem key={'EXPENSE'} value={'EXPENSE'}>
                    Expense
                  </SelectItem>
                </SelectContent>
              </Select>
              {isCreating === true ? (
                <>
                  <Button variant='secondary' onClick={() => formRef.current?.requestSubmit()}>
                    Save <SaveIcon className='ml-2 h-4 w-4' />
                  </Button>
                  <Button className='w-full whitespace-nowrap sm:w-auto' onClick={() => setIsCreating(false)}>
                    Close <X className='ml-2 h-4 w-4' />
                  </Button>
                </>
              ) : (
                <Button
                  className='w-full whitespace-nowrap sm:w-auto'
                  variant='secondary'
                  onClick={() => setIsCreating(true)}
                >
                  Create <PlusIcon className='ml-2 h-4 w-4' />
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
                formRef={formRef}
                handleCreateTrackerType={handleCreateTrackerType}
                setIsCreating={setIsCreating}
              />
            </div>
          )}
          <ScrollArea className='h-96 overflow-y-auto rounded-md border p-4'>
            <Accordion type='single' collapsible className='w-full'>
              {filteredDataArr.length > 0
                ? filteredDataArr.map((data) => (
                    <AccordionItem key={data.value} value={data.value}>
                      <AccordionTrigger className='flex justify-between'>{data.label}</AccordionTrigger>
                      <AccordionContent>
                        <div className='flex w-full justify-between'>
                          <Button variant={'destructive'}>
                            Delete
                            <Delete className='h-4' />
                          </Button>
                          <div className='flex gap-2'>
                            {isUpdate && (
                              <Button
                                onClick={() => {
                                  setIsUpdate(false)
                                }}
                                className='w-full'
                                variant={'blueVin'}
                              >
                                <div className='flex w-full justify-between'>
                                  <Undo2 className='h-4' />
                                  <span>Discard</span>
                                </div>
                              </Button>
                            )}
                            <Button variant={'default'} onClick={onHandleUpdate} className='w-full'>
                              {isUpdate ? (
                                <div>
                                  <div className='flex w-full justify-between'>
                                    <Save className='h-4' />
                                    <span>Save</span>
                                  </div>
                                </div>
                              ) : (
                                <div className='flex w-full justify-between'>
                                  <Edit className='h-4' />
                                  <span>Edit</span>
                                </div>
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className='grid gap-4 py-4'>
                          <FormZod
                            defaultValues={{
                              name: data.name,
                              type: data.type as ETypeOfTrackerTransactionType,
                              description: data.description
                            }}
                            formFieldBody={editTrackerTypeBody}
                            formSchema={editTrackerTypeSchema}
                            onSubmit={() => {}}
                            buttonConfig={{
                              label: 'Save',
                              className: 'w-full mt-4'
                            }}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))
                : ''}
            </Accordion>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
