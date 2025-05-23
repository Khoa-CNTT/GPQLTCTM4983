import { EBankTypes } from '@/app/dashboard/account-source/constants'
import { IBaseResponseData } from '@/types/common.i'

export interface IAccountBank {
  id: string
  type: EBankTypes
  login_id: string
  pass: string
  accounts: { accountNo: string }[]
  sessionId?: string
  deviceId?: string
  userId?: string
}

export type IGetAccountBankResponse = IBaseResponseData<IAccountBank[]>
