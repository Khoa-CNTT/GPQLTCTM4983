export * from './fund-saving-plan.interface'

export type RecurringFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUAL'

export interface IExpectedDateParams {
  month?: number
  day?: number
  dayOfMonth?: number
  dayOfWeek?: number
  expectedDate?: string
}
export interface FundSavingPlan extends IExpectedDateParams {
  id?: string
  name: string
  description?: string
  targetAmount: number
  trackerTypeId: string
  type: RecurringFrequency
  createdAt?: string
  updatedAt?: string
}

export interface FundSavingPlanFormData extends IExpectedDateParams {
  name: string
  description: string
  targetAmount: string
  trackerTypeId: string
}
