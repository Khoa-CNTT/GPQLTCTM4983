import {
    ISpendingPlan,
    ISpendingPlanTable,
    IBudget,
    IBudgetTable,
    IDialogFlags,
    ICategoryStatistic,
    ISpendingPlanDialogProps
} from "@/core/spending-plan/models"
import { formatCurrency, formatDateTimeVN } from "@/libraries/utils"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import React from "react"

/**
 * Transform spending plan data for table display
 */
export const modifySpendingPlanTableData = (payload: ISpendingPlan[]): ISpendingPlanTable[] => {
  return payload.map((plan) => {
    // Convert status to a formatted string
    const statusText = plan.status === "completed" 
      ? "Hoàn thành" 
      : plan.status === "cancelled" 
      ? "Đã hủy" 
      : "Chờ xử lý";
      
    return {
      id: plan.id,
      title: plan.title,
      amount: formatCurrency(plan.amount, "đ", "vi-vn"),
      plannedDate: formatDateTimeVN(plan.plannedDate, true),
      category: plan.category,
      status: statusText
    }
  })
}

/**
 * Transform budget data for table display
 */
export const modifyBudgetTableData = (payload: IBudget[]): IBudgetTable[] => {
  return payload.map((budget) => {
    // Convert progress indicator to a simple text
    const progressText = `${Math.round((budget.spentAmount / budget.budgetAmount) * 100)}%`;
    
    return {
      id: budget.id,
      category: budget.category,
      budgetAmount: formatCurrency(budget.budgetAmount, "đ", "vi-vn"),
      spentAmount: formatCurrency(budget.spentAmount, "đ", "vi-vn"),
      remainingAmount: formatCurrency(budget.remainingAmount, "đ", "vi-vn"),
      status: progressText
    }
  })
}

/**
 * Filter plans that are upcoming within the next 7 days
 */
export const filterUpcomingPlans = (plans: ISpendingPlan[]): ISpendingPlan[] => {
  const now = new Date().getTime()
  const sevenDaysFromNow = now + 7 * 24 * 60 * 60 * 1000

  return plans
    .filter((plan) => {
      const planDate = new Date(plan.plannedDate).getTime()
      return planDate >= now && planDate <= sevenDaysFromNow && plan.status === "pending"
    })
    .sort((a, b) => new Date(a.plannedDate).getTime() - new Date(b.plannedDate).getTime())
}

/**
 * Calculate budget totals
 */
export const calculateBudgetTotals = (budgets: IBudget[]) => {
  const totalBudgetAmount = budgets.reduce((acc, budget) => acc + budget.budgetAmount, 0)
  const totalSpentAmount = budgets.reduce((acc, budget) => acc + budget.spentAmount, 0)
  const remainingBudget = totalBudgetAmount - totalSpentAmount
  const spendingProgress = totalBudgetAmount > 0 ? (totalSpentAmount / totalBudgetAmount) * 100 : 0

  return {
    totalBudgetAmount,
    totalSpentAmount,
    remainingBudget,
    spendingProgress,
  }
}