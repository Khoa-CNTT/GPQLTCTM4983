import { z } from "zod"

export const subscriptionSchema = z.object({
  accountBankId: z.string().min(1, 'Vui lòng chọn tài khoản ngân hàng'),
  hour: z.number().min(0).max(23),
  minute: z.number().min(0).max(59)
})

export type SubscriptionFormValues = z.infer<typeof subscriptionSchema>
