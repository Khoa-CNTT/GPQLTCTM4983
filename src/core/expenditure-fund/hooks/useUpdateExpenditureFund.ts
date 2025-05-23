import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import {
  ICreateExpenditureFundBody,
  IExpenditureFund,
  IUpdateExpenditureFundBody
} from '../models/expenditure-fund.interface'
import { expenditureFundRoutes } from '../configs'

export const useUpdateExpenditureFund = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom<IUpdateExpenditureFundBody, IExpenditureFund>({
    pathUrl: expenditureFundRoutes.updateExpenditureFund,
    method: 'patch'
  })
}
