import { EFieldType, IBodyFormField } from '@/types/formZod.interface'
import { z } from 'zod'

export const updateUserSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .transform((val) => (val === '' ? null : val))
      .nullable()
      .refine((val) => val === null || (val.length >= 5 && val.length <= 50), {
        message: 'Full name must be between 5 and 50 characters long.'
      })
      .refine((val) => val === null || /^[A-Za-zÀ-ỹ\s]+$/.test(val), {
        message: 'Full name can only contain letters and spaces.'
      }),

    dateOfBirth: z.coerce
      .date()
      .refine((date) => date <= new Date(), 'Date of birth cannot be in the future.')
      .refine(
        (date) => new Date().getFullYear() - date.getFullYear() >= 10,
        'Date of birth must be at least 10 years old.'
      )
      .nullable(),

    gender: z
      .enum(['Male', 'Female'], {
        message: 'Gender must be either "Male" or "Female".'
      })
      .nullable(),

    workplace: z
      .string()
      .trim()
      .transform((val) => (val === '' ? null : val))
      .nullable()
      .refine((val) => val === null || (val.length >= 10 && val.length <= 100), {
        message: 'Workplace must be between 10 and 100 characters long.'
      }),

    phone_number: z
      .string()
      .trim()
      .transform((val) => (val === '' ? null : val))
      .nullable()
      .refine((val) => val === null || /^(\+?\d{1,3})?\s?\d{9,15}$/.test(val), {
        message: 'Invalid phone number format.'
      }),

    address: z
      .string()
      .trim()
      .transform((val) => (val === '' ? null : val))
      .nullable()
      .refine((val) => val === null || (val.length >= 20 && val.length <= 100), {
        message: 'Address must be between 20 and 100 characters long.'
      })
  })
  .strict()

export const updateUserFormBody: IBodyFormField[] = [
  {
    name: 'fullName',
    type: EFieldType.Input,
    label: 'profile:form.common.fullName.label',
    placeHolder: 'profile:form.common.fullName.placeholder',
    props: {
      autoComplete: 'name',
      className: 'col-span-4'
    }
  },
  {
    name: 'dateOfBirth',
    type: EFieldType.DatePicker,
    label: 'form.common.dateOfBirth.label',
    placeHolder: 'form.common.dateOfBirth.placeholder',
    props: {
      className: 'col-span-2 row-start-2'
    }
  },
  {
    name: 'gender',
    type: EFieldType.Select,
    label: 'form.common.gender.label',
    placeHolder: 'form.common.gender.placeholder',
    dataSelector: [
      {
        value: 'Male',
        label: 'Male'
      },
      {
        value: 'Female',
        label: 'Female'
      }
    ],
    props: {
      className: 'col-span-2 col-start-3 row-start-2'
    }
  },
  {
    name: 'workplace',
    type: EFieldType.Input,
    label: 'form.common.workplace.label',
    placeHolder: 'form.common.workplace.placeholder',
    props: {
      autoComplete: 'workplace',
      className: 'col-span-2 row-start-3'
    }
  },
  {
    name: 'phone_number',
    type: EFieldType.Input,
    label: 'form.common.phone_number.label',
    placeHolder: 'form.common.phone_number.placeholder',
    props: {
      autoComplete: 'phoneNumber',
      className: 'col-span-2 col-start-3 row-start-3'
    }
  },
  {
    name: 'address',
    type: EFieldType.Input,
    label: 'form.common.address.label',
    placeHolder: 'form.common.address.placeholder',
    props: {
      autoComplete: 'address',
      className: 'col-span-4 row-start-4'
    }
  }
]
