import { IdCard, Loader2 } from 'lucide-react'
import React, { useEffect } from 'react'
import { useStoreLocal } from '@/hooks/useStoreLocal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useExpenditureFund } from '@/core/expenditure-fund/hooks'
import { useTranslation } from 'react-i18next'

export default function FundToggle() {
  const { fundId, setFundId, fundArr, setFundArr } = useStoreLocal()
  const { getFundOfUser } = useExpenditureFund()
  const { fundOfUserData, isGetFundPending } = getFundOfUser()
  const { t } = useTranslation(['common'])
  useEffect(() => {
    setFundArr(fundOfUserData?.data || [])
  }, [fundOfUserData])

  const selectedFund = fundArr?.find((fund) => fund.id === fundId) ?? fundArr?.[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='mt-0.5 h-7 select-none rounded-full !border-0 p-0 outline-none hover:bg-transparent focus:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0'
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className='flex items-center gap-2'>
            <IdCard className='h-5 w-5' />
            <span>{selectedFund?.name}</span>
            {isGetFundPending && <Loader2 className='h-4 w-4 animate-spin' />}
          </motion.div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56 select-none' align='center' sideOffset={5}>
        <DropdownMenuGroup>
          <div className='px-2 py-1.5 text-center text-sm font-semibold text-muted-foreground'>
            <span>{t('fundToggle.expenditureFunds')}</span>
          </div>
          <DropdownMenuSeparator />
          <div className='max-h-[150px] overflow-y-auto overflow-x-hidden'>
            {fundArr?.map((fund, index) => (
              <React.Fragment key={fund.id}>
                {index !== 0 && <DropdownMenuSeparator />}
                <DropdownMenuItem className='cursor-pointer' onClick={() => setFundId(fund.id)}>
                  {fund.name.charAt(0).toUpperCase() + fund.name.slice(1)}
                </DropdownMenuItem>
              </React.Fragment>
            ))}
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
