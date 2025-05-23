import { IAccountSource } from '@/core/account-source/models'
import { IFundOfUser } from '@/core/tracker-transaction/models/tracker-transaction.interface'
import { ITransaction } from '@/core/transaction/models'
import { IUser, IUserFromToken } from '@/types/user.i'
import { create } from 'zustand'

interface StoreState {
  // account source store
  accountSourceData: IAccountSource[]
  setAccountSourceData: (data: IAccountSource[]) => void
  // user store
  user: IUser | null
  setUser: (user: IUser | null) => void
  // unclassified transaction store
  unclassifiedTransactionData: ITransaction[]
  setUnclassifiedTransactionData: (data: ITransaction[]) => void
  // Fund of user store
  fundId: string
  setFundId: (fundId: string) => void
  fundArr: IFundOfUser[]
  setFundArr: (fundArr: IFundOfUser[]) => void
  // checkHeightRange
  checkHeightRange: boolean
  setCheckHeightRange: (checkHeightRange: boolean) => void
  viewportHeight: number
  setViewportHeight: (viewportHeight: number) => void
}

// Add constant for localStorage key
export const FUND_ID_STORAGE_KEY = 'fundId'

export const useStoreLocal = create<StoreState>((set) => ({
  // account source store
  accountSourceData: [],
  setAccountSourceData: (data) => set({ accountSourceData: data }),
  // user store
  user: null,
  setUser: (user) => set({ user }),
  // unclassified transaction store
  unclassifiedTransactionData: [],
  setUnclassifiedTransactionData: (data) => set({ unclassifiedTransactionData: data }),
  // Fund of user store
  fundId: typeof window !== 'undefined' ? localStorage.getItem(FUND_ID_STORAGE_KEY) || '' : '',
  setFundId: (fundId) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(FUND_ID_STORAGE_KEY, fundId)
    }
    set({ fundId })
  },
  fundArr: [],
  setFundArr: (fundArr) => set({ fundArr }),
  checkHeightRange: false,
  setCheckHeightRange: (data) => set({ checkHeightRange: data }),
  viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
  setViewportHeight: (viewportHeight) =>
    set({
      viewportHeight
    })
}))
