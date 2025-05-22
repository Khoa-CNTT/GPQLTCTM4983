import { accountBanksRoutes } from '@/api/account-bank'
import { useMutationCustom } from '@/hooks/useMutationCustom'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'

export const useVerifyBank = () => {
  console.log('verifyBank')
  return useMutationCustom<any, any>({
    pathUrl: accountBanksRoutes.verifyBank
  })
}
