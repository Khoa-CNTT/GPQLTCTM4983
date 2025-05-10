import {
  IAdvancedExpenditureFundResponse,
  IExpenditureFundDataFormat,
  IExpenditureFundDialogOpen,
  IHandleCreateExpenditureFundProps,
  IHandleDeleteAnExpenditureFundProps,
  IHandleDeleteMultipleExpenditureFundProps,
  IHandleUpdateExpenditureFundProps,
  TExpenditureFundActions
} from '@/core/expenditure-fund/models/expenditure-fund.interface'
import { formatArrayData } from '@/libraries/utils'
import { IDataTableConfig } from '@/types/common.i'
import toast from 'react-hot-toast'
import { formatExpenditureFundData } from './constants'

interface ICallBackRefetchAPIProps {
  refetchAdvancedExpendingFund: any
}

export const callBackRefetchAPI = async ({ refetchAdvancedExpendingFund }: ICallBackRefetchAPIProps) => {
  refetchAdvancedExpendingFund()
}

export const handleCreateExpenditureFund = async ({
  data,
  hookCreate,
  setIsDialogOpen,
  callBackRefetchAPI,
  setDataTableConfig
}: IHandleCreateExpenditureFundProps) => {
  hookCreate(data, {
    onSuccess: (res: any) => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        setDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
        setIsDialogOpen((prev) => ({ ...prev, isDialogCreateOpen: false }))
        callBackRefetchAPI(['getAllExpendingFund', 'getExpenditureFund', 'getStatisticExpenditureFund', 'getStatisticOverviewPage'])
        toast.success('Create expenditure fund successfully!')
      }
    }
  })
}

export const handleUpdateExpenditureFund = async ({
  data,
  hookUpdate,
  callBackRefetchAPI,
  setDetailData,
  setIsDialogOpen,
  setDataTableConfig
}: IHandleUpdateExpenditureFundProps) => {
  hookUpdate(data, {
    onSuccess: (res: any) => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        setDetailData((prev) => ({ ...prev, ...res.data }))
        setDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
        setIsDialogOpen((prev) => ({ ...prev, isDialogUpdateOpen: false }))
        callBackRefetchAPI(['getAllExpendingFund', 'getExpenditureFund', 'getStatisticExpenditureFund', 'getStatisticOverviewPage'])
        toast.success('Update expenditure fund successfully!')
      }
    }
  })
}

export const initExpenditureFundDataTable = (
  isGetAdvancedPending: boolean,
  getAdvancedData: IAdvancedExpenditureFundResponse | undefined,
  setDataTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>,
  setTableData: React.Dispatch<React.SetStateAction<IExpenditureFundDataFormat[]>>
) => {
  if (!isGetAdvancedPending && getAdvancedData) {
    const formattedData: IExpenditureFundDataFormat[] = formatArrayData(getAdvancedData.data, formatExpenditureFundData)

    setDataTableConfig((prev) => ({
      ...prev,
      totalPage: Number(getAdvancedData.pagination?.totalPage)
    }))
    setTableData(formattedData)
  }
}

export const handleDeleteAnExpenditureFund = async ({
  id,
  setDataTableConfig,
  setIsDialogOpen,
  hookDelete,
  setIdDeletes,
  callBackRefetchAPI,
  fundId
}: IHandleDeleteAnExpenditureFundProps) => {
  if (id === fundId) {
    toast.error('Cannot delete the currently selected fund! Please choose a different fund before trying again.')
    return
  }
  hookDelete(
    { id },
    {
      onSuccess: (res: any) => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          setDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
          setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteOpen: false }))
          setIdDeletes([])
          callBackRefetchAPI(['getAllExpendingFund', 'getExpenditureFund', 'getStatisticExpenditureFund', 'getStatisticOverviewPage'])
          toast.success('Delete expenditure fund successfully')
        }
      }
    }
  )
}

export const handleDeleteMultipleExpenditureFund = async ({
  ids,
  setDataTableConfig,
  setIsDialogOpen,
  hookDelete,
  setIdDeletes,
  callBackRefetchAPI,
  fundId
}: IHandleDeleteMultipleExpenditureFundProps) => {
  if (ids.includes(fundId)) {
    toast.error('Cannot delete the currently selected fund! Please choose a different fund before trying again.')
    return
  }
  hookDelete(
    { ids },
    {
      onSuccess: (res: any) => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          setDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
          setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteAllOpen: false }))
          setIdDeletes([])
          callBackRefetchAPI(['getAllExpendingFund', 'getExpenditureFund', 'getStatisticExpenditureFund', 'getStatisticOverviewPage'])
          toast.success('Delete all expenditure fund successfully')
        }
      }
    }
  )
}

export const handleInviteParticipant = async ({
  hookInvite,
  data,
  setIsDialogOpen,
  callBackOnSuccess
}: {
  hookInvite: any
  data: {
    fundId: string
    userInfoValues: string[]
  }
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IExpenditureFundDialogOpen>>
  callBackOnSuccess: (action: TExpenditureFundActions[]) => void
}) => {
  hookInvite(data, {
    onSuccess: () => {
      callBackOnSuccess(['getExpenditureFund'])
      toast.success('Send invite participant successfully')
      setIsDialogOpen((prev) => ({ ...prev, isDialogInviteOpen: false }))
    }
  })
}

export const handleDeleteParticipant = ({
  hookDelete,
  id,
  callBackOnSuccess,
  setIsDialogOpen
}: {
  hookDelete: any
  id: string
  callBackOnSuccess: (actions: TExpenditureFundActions[]) => void
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IExpenditureFundDialogOpen>>
}) => {
  hookDelete(
    { id },
    {
      onSuccess: (res: any) => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          callBackOnSuccess(['getExpenditureFund'])
          toast.success('Delete participant successfully')
          setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteParticipantOpen: false }))
        }
      }
    }
  )
}
