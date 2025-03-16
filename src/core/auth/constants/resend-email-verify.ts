import { EFieldType, IBodyFormField } from '@/types/formZod.interface'
import { z } from 'zod'

export const resendEmailVerifySchema = z
  .object({
    email: z.string().email()
  })
  .strict()

export const resendEmailVerifyFormBody: IBodyFormField[] = [
  {
    name: 'email',
    type: EFieldType.Input,
    label: 'Email',
    placeHolder: 'Enter your email',
    props: {
      autoComplete: 'email'
    }
  }
]
