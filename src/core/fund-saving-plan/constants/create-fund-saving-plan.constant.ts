import { z } from 'zod'
export const createFundSavingPlanSchema = z
  .object({
    name: z
      .string()
      .min(3)
      .max(100),
    description: z
      .string()
      .max(500)
      .optional(),
    targetAmount: z
      .string()
      .min(1)
      .refine(val => !isNaN(Number(val.replace(/[^\d.-]/g, ''))) && Number(val.replace(/[^\d.-]/g, '')) > 0, {
        message: "amount_must_be_positive"
      }),
    trackerTypeId: z
      .string()
      .min(1),
    type: z
      .enum(["DAILY", "WEEKLY", "MONTHLY", "ANNUAL"]),
    expectedDate: z
      .date()
      .optional(),
    dayOfWeek: z
      .string()
      .optional(),
    month: z
      .string()
      .optional(),
    day: z
      .string()
      .optional(),
    notifyBefore: z
      .string()
      .default("3"),
  })

export const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month, 0).getDate()
}
