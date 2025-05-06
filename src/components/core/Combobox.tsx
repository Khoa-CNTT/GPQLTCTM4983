'use client'

import React, { useState, forwardRef, useEffect } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/libraries/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useStoreLocal } from '@/hooks/useStoreLocal'
import { useTranslation } from 'react-i18next'

export interface IComboboxProps {
  className?: string
  label?: string
  dataArr: { value: string; label: string }[]
  dialogEdit?: React.ReactNode
  setOpenEditDialog?: React.Dispatch<React.SetStateAction<boolean>>
  onValueSelect?: (value: string) => void
  value?: string
  onChange?: (value: string) => void
  contentTrigger?: JSX.Element
  variantTrigger?: any
}

export const Combobox = forwardRef<HTMLButtonElement, IComboboxProps>(
  (
    {
      contentTrigger,
      variantTrigger,
      className,
      label,
      dataArr,
      dialogEdit,
      setOpenEditDialog,
      onValueSelect,
      value: controlledValue,
      onChange
    },
    ref
  ) => {
    const [open, setOpen] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [internalValue, setInternalValue] = useState(controlledValue || '')
    const { viewportHeight } = useStoreLocal()
    const [scrollMaxHeight, setScrollMaxHeight] = useState('')
    const { t } = useTranslation(['common'])

    useEffect(() => {
      if (controlledValue !== undefined) {
        setInternalValue(controlledValue)
      }
    }, [controlledValue])

    const filteredDataArr = dataArr?.filter((data) =>
      data.label.toLowerCase().includes(searchValue.trim().toLowerCase())
    )

    const handleSelect = (currentValue: string) => {
      const newValue = currentValue

      setInternalValue(newValue)

      if (onChange) {
        onChange(newValue)
      }
      if (onValueSelect) {
        onValueSelect(newValue)
      }
      setOpen(false)
      setSearchValue('')
    }

    useEffect(() => {
      if (viewportHeight <= 700) {
        setScrollMaxHeight('max-h-[200px] h-[200px]')
      }
    }, [viewportHeight])

    return (
      <div className={cn(className)}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              variant={variantTrigger ?? 'outline'}
              role='combobox'
              aria-expanded={open}
              className={cn(className, 'h-10 w-full justify-between px-2')}
              style={{ width: '100%' }}
            >
              {contentTrigger ? (
                contentTrigger
              ) : (
                <>
                  <span className='ml-1 text-sm'>
                    {internalValue && dataArr && dataArr.length > 0
                      ? dataArr.find((data) => data.value === internalValue)?.label
                      : `${t('combobox.select')} ${label ?? t('combobox.item')}`}
                  </span>
                  <ChevronsUpDown className='mr-1 h-3 w-3 shrink-0 opacity-50' />
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-full min-w-[300px] p-3' style={{ width: '100%' }}>
            <Command shouldFilter={false}>
              <CommandInput
                value={searchValue}
                onValueChange={setSearchValue}
                placeholder={`${t('combobox.select')} ${label ?? t('combobox.item')}`}
              />
              <CommandList className={scrollMaxHeight}>
                {filteredDataArr?.length > 0 ? (
                  <CommandGroup>
                    {filteredDataArr?.map((data) => (
                      <CommandItem key={data.value} value={data.value} onSelect={() => handleSelect(data.value)}>
                        <div className='flex w-full justify-between'>
                          {data.label}
                          <Check
                            className={cn('h-4 w-4', internalValue === data.value ? 'opacity-100' : 'opacity-0')}
                          />
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ) : (
                  <CommandEmpty>{t('combobox.noItemsFound')}</CommandEmpty>
                )}
              </CommandList>
            </Command>
            {setOpenEditDialog && (
              <Button className='mt-4 w-full' variant='outline' onClick={() => setOpenEditDialog(true)}>
                {t('button.edit')} {label ?? t('combobox.item')}
              </Button>
            )}
          </PopoverContent>
        </Popover>
        {dialogEdit}
      </div>
    )
  }
)

Combobox.displayName = 'Combobox'
