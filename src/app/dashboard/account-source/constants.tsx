import {
  EAccountSourceType,
  IAccountSource,
  IAccountSourceBody,
  IAccountSourceDataFormat,
  IDialogAccountSource
} from '@/core/account-source/models'
import { formatCurrency, translate } from '@/libraries/utils'
import { IButtonInDataTableHeader } from '@/types/core.i'
import { HandCoins, Landmark, PlusIcon, Wallet2 } from 'lucide-react'
import DonutChart, { IChartDataAccountSource } from '@/components/core/charts/DonutChart'
import Image from 'next/image'
import NoDataPlaceHolder from '@/images/2.png'
import { TFunction } from 'i18next'
import { ITabConfig } from '@/components/dashboard/TrackerTransactionChart'

export const formatAccountSourceData = (data: IAccountSource): IAccountSourceDataFormat => {
  const { id, name, type, initAmount, currentAmount, accountBank } = data

  return {
    id,
    name,
    type: type,
    initAmount: formatCurrency(initAmount, 'đ'),
    accountBank: accountBank ? accountBank.type.split('_')[0] + ' Bank' : 'N/A',
    currentAmount: formatCurrency(currentAmount, 'đ'),
    checkType: type
  }
}

export const initDialogFlag: IDialogAccountSource = {
  isDialogCreateOpen: false,
  isDialogUpdateOpen: false,
  isDialogRefetchMoneyOpen: false,
  isDialogDeleteOpen: false,
  isDialogDeleteAllOpen: false,
  isDialogDetailOpen: false
}

export const initButtonInDataTableHeader = ({
  setIsDialogOpen
}: {
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogAccountSource>>
}): IButtonInDataTableHeader[] => {
  const t = translate(['common'])
  return [
    {
      title: t('common:button.create'),
      variants: 'default',
      onClick: () => setIsDialogOpen((prev) => ({ ...prev, isDialogCreateOpen: true })),
      icon: <PlusIcon className='ml-2 h-4 w-4' />
    }
  ]
}

export const initEmptyAccountSource: IAccountSource = {
  id: '',
  name: '',
  type: EAccountSourceType.WALLET,
  initAmount: 0,
  accountBank: null,
  currency: '',
  currentAmount: 0,
  accountBankId: ''
}

export const initEmptyDetailAccountSourceType = {
  type: EAccountSourceType.WALLET,
  data: {
    accountBank: {
      id: '',
      type: '',
      login_id: '',
      accounts: ''
    },
    accountSource: {
      id: '',
      accountSourceName: '',
      accountSourceType: EAccountSourceType.WALLET
    }
  }
}

export enum EBankTypes {
  MB_BANK = 'MB_BANK'
}

export const initAccountSourceTab = (data: IChartDataAccountSource, t: TFunction<any>): ITabConfig => {
  return {
    default: 'Total Balance',
    tabContents: [
      {
        content: (
          <div className='flex w-full items-center justify-center'>
            {data && data?.totalBalanceTypeStats?.length > 0 ? (
              <DonutChart data={data.totalBalanceTypeStats} className='h-[17rem] w-full' types='donut' />
            ) : (
              <div className='mt-10 flex flex-col items-center justify-center'>
                <Image
                  priority
                  src={NoDataPlaceHolder}
                  alt={t('common:table.noDataText', 'No data available')}
                  width={150}
                  height={150}
                />
                <span className='mt-2 text-sm font-semibold text-foreground'>
                  {t('common:table.noDataText', 'No data available')}
                </span>
              </div>
            )}
          </div>
        ),
        labels: t('accountSource:AccountSourceCardDetail.totalBlance', 'Total Balance'),
        value: t('accountSource:AccountSourceCardDetail.totalBlance', 'Total Balance')
      },
      {
        content: (
          <div className='flex w-full items-center justify-center'>
            {data && data.detailBalanceTypeStats?.length > 0 ? (
              <DonutChart data={data.detailBalanceTypeStats} className='h-[17rem] w-full' types='donut' />
            ) : (
              <div className='mt-10 flex flex-col items-center justify-center'>
                <Image
                  src={NoDataPlaceHolder}
                  alt={t('common:table.noDataText', 'No data available')}
                  width={150}
                  height={150}
                />
                <span className='mt-2 text-sm font-semibold text-foreground'>
                  {t('common:table.noDataText', 'No data available')}
                </span>
              </div>
            )}
          </div>
        ),
        labels: t('accountSource:AccountSourceCardDetail.item.detail', 'Detail Balance'),
        value: t('accountSource:AccountSourceCardDetail.item.detail', 'Detail Balance')
      }
    ]
  }
}

export const initAccountSourceFormData: IAccountSourceBody = {
  name: '',
  initAmount: 0,
  accountSourceType: EAccountSourceType.WALLET
}

export const initEmptyDetailAccountSource: IAccountSourceDataFormat = {
  id: '',
  name: '',
  type: EAccountSourceType.WALLET,
  initAmount: '',
  accountBank: '',
  currentAmount: '',
  checkType: ''
}
