export * from "./fund-saving-plan.interface";

export type RecurringFrequency = "DAILY" | "WEEKLY" | "MONTHLY" | "ANNUAL";

export interface FundSavingPlan {
  id?: string;
  name: string;
  description?: string;
  targetAmount: number;
  trackerTypeId: string;
  type: RecurringFrequency;
  month?: number;
  day?: number;
  startDate?: string;
  dayOfWeek?: number;
  notifyBefore: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FundSavingPlanFormData {
  name: string;
  description: string;
  targetAmount: string;
  trackerTypeId: string;
  month?: string;
  day?: string;
  type: RecurringFrequency;
  startDate?: string;
  dayOfWeek?: string;
  notifyBefore: string;
}
