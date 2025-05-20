import { accountSourceRoutes } from '@/core/account-source/configs'
import { IAccountSourceBody, IAccountSourceResponse } from '@/core/account-source/models'
import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { ICreateExpenditureFundBody, IExpenditureFund } from '../models/expenditure-fund.interface'
import { expenditureFundRoutes } from '../configs'

export const useCreateExpenditureFund = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom<ICreateExpenditureFundBody, IExpenditureFund>({
    pathUrl: expenditureFundRoutes.createExpenditureFund
  })
}
