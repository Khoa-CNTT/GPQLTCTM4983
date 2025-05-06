import React, { useEffect, useMemo } from 'react'
import { FormProvider, Path, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl, useFormField } from '@/components/ui/form'
import { EFieldType, IFormZodProps, InputProps, TextareaProps } from '@/types/formZod.interface'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { IDynamicType } from '@/types/common.i'
import { cn } from '@/libraries/utils'
import { Textarea } from '@/components/ui/textarea'
import { Combobox, IComboboxProps } from '@/components/core/Combobox'
import { DateTimePicker, DateTimePickerProps } from '@/components/core/DateTimePicker'
import { DateRangePicker, DateRangePickerProps } from '@/components/core/DateRangePicker'
import { DateRange } from 'react-day-picker'
import { EEmojiPickerProps, EmojiPicker } from '@/components/common/EmojiPicker'
import MultiInput from '@/components/core/MultiInput'
import { MoneyInput } from '@/components/core/MoneyInput'

const FormFieldComponent = React.memo(
  ({ fieldItem, field, disabled }: { fieldItem: any; field: any; disabled?: boolean }) => {
    if (fieldItem.type === EFieldType.Input) {
      return (
        <Input
          placeholder={fieldItem.placeHolder}
          {...(fieldItem.props as InputProps)}
          {...field}
          disabled={disabled}
          value={String(field.value ?? '')}
        />
      )
    }

    if (fieldItem.type === EFieldType.MoneyInput) {
      return (
        <MoneyInput
          placeholder={fieldItem.placeHolder}
          {...(fieldItem.props as InputProps)}
          disabled={disabled}
          value={String(field.value ?? '')}
          onChange={(e) => field.onChange(e.target.value)}
        />
      )
    }

    if (fieldItem.type === EFieldType.MultiInput) {
      return (
        <MultiInput
          props={{
            ...fieldItem?.props,
            placeholder: fieldItem.placeHolder
          }}
          defaultValue={field.value ?? []}
          value={field.value ?? []}
          onValueChange={(value: any[]) => {
            field.onChange(value)
          }}
        />
      )
    }

    if (fieldItem.type === EFieldType.Select) {
      return (
        <Select
          onValueChange={(value) => {
            fieldItem?.props?.onchange?.(value)
            field.onChange(value)
          }}
          value={(field?.value as any) ?? undefined}
          disabled={disabled}
        >
          <SelectTrigger className={cn('w-full', fieldItem?.classNameTrigger)}>
            <SelectValue placeholder={fieldItem.placeHolder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select {fieldItem.label}</SelectLabel>
              {fieldItem?.dataSelector?.map((item: IDynamicType) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )
    }

    if (fieldItem.type === EFieldType.Textarea) {
      return (
        <Textarea
          {...field}
          placeholder={fieldItem.placeHolder}
          {...(fieldItem.props as TextareaProps)}
          disabled={disabled}
          value={String(field.value ?? '')}
        />
      )
    }

    if (fieldItem.type === EFieldType.Combobox) {
      return (
        <Combobox
          {...(fieldItem.props as IComboboxProps)}
          {...field}
          disabled={disabled}
          defaultValue={field.value as string}
          value={fieldItem.props?.value !== undefined ? fieldItem.props.value : (field.value as string)}
          onValueSelect={(value) => {
            if (fieldItem.props?.onValueChange) {
              fieldItem.props.onValueChange(value)
            }
            field.onChange(value)
          }}
        />
      )
    }

    if (fieldItem.type === EFieldType.DatePicker) {
      return (
        <DateTimePicker
          {...field}
          {...(fieldItem.props as DateTimePickerProps)}
          disabled={disabled}
          onChange={(value) => {
            field.onChange(value)
          }}
        />
      )
    }

    if (fieldItem.type === EFieldType.DateRangePicker) {
      return (
        <DateRangePicker
          {...field}
          {...(fieldItem.props as DateRangePickerProps)}
          disabled={disabled}
          value={field.value as DateRange | undefined}
          onChange={(value) => {
            field.onChange(value)
          }}
        />
      )
    }

    if (fieldItem.type === EFieldType.EmojiPicker) {
      return (
        <EmojiPicker
          {...field}
          {...(fieldItem.props as EEmojiPickerProps)}
          disabled={disabled}
          onChangeValue={(value) => {
            field.onChange(value)
          }}
        />
      )
    }

    return null
  }
)

FormFieldComponent.displayName = 'FormFieldComponent'

export default function FormZod<T extends z.ZodRawShape>({
  formSchema,
  defaultValues,
  onSubmit,
  formFieldBody,
  buttonConfig,
  classNameForm,
  disabled = false,
  submitRef,
  formRef
}: IFormZodProps<T> & { disabled?: boolean }) {
  const form = useForm<z.infer<z.ZodObject<T>>>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  })

  const { formState } = form
  const { errors, isSubmitting, isSubmitSuccessful, isSubmitted } = formState

  // Log errors khi form được submit mà có lỗi
  useEffect(() => {
    if (isSubmitted && Object.keys(errors).length > 0) {
      console.log('FormZod validation errors:', errors)
    }
  }, [isSubmitted, errors])

  // Debug log khi có vấn đề về submit
  useEffect(() => {
    if (isSubmitting) {
      console.log('FormZod is submitting...')
    }
    
    if (isSubmitSuccessful) {
      console.log('FormZod submitted successfully')
    }
  }, [isSubmitting, isSubmitSuccessful])

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      form.handleSubmit((data) => {
        console.log('FormZod submit data:', data)
        onSubmit(data)
      })()
    } catch (error) {
      console.error('FormZod submission error:', error)
    }
  }

  const memoizedFormFieldBody = useMemo(() => formFieldBody, [formFieldBody])

  useEffect(() => {
    if (formRef) {
      formRef.current = {
        ...form
      }
    }
  }, [formRef, form])

  useEffect(() => {
    form.reset(defaultValues)
  }, [defaultValues, form])

  return (
    <div>
      <Form {...form}>
        <form ref={submitRef} onSubmit={handleFormSubmit}>
          <div className={cn('space-y-5', classNameForm)}>
            {memoizedFormFieldBody.map((fieldItem, index) => {
              return !fieldItem.hidden ? (
                <FormField
                  control={form.control}
                  name={fieldItem.name as any}
                  key={index}
                  render={({ field }) => (
                    <FormItem className={(fieldItem.props as any)?.className}>
                      <div className='flex justify-between'>
                        {fieldItem?.label && (
                          <FormLabel className={cn((fieldItem.props as any)?.classNameLabel, 'text-muted-foreground')}>
                            {fieldItem.label}
                          </FormLabel>
                        )}
                        <FormMessage />
                      </div>
                      <FormControl className={cn((fieldItem.props as any)?.classNameControl)}>
                        <FormFieldComponent
                          fieldItem={fieldItem}
                          field={field}
                          disabled={disabled || (fieldItem.props as any)?.disabled}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ) : null
            })}
          </div>
          {Object.keys(errors).length > 0 && (
            <div className="text-red-500 text-sm mt-2">
              {Object.entries(errors).map(([key, error]) => (
                <p key={key}>{`${key}: ${error?.message?.toString() || 'Invalid value'}`}</p>
              ))}
            </div>
          )}
          {!submitRef && (
            <Button {...buttonConfig} type='submit' disabled={disabled || buttonConfig?.disabled}>
              {buttonConfig?.label ?? 'Submit'}
            </Button>
          )}
        </form>
      </Form>
    </div>
  )
}
