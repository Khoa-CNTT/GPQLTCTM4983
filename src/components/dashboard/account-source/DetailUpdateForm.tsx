import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { formatCurrency, translate } from '@/libraries/utils'
import { EAccountSourceType, IAccountSource } from '@/core/account-source/models'
import { Calendar, CreditCard, RefreshCw, Wallet, Landmark, DollarSign, Edit, Tag, Copy, Check } from 'lucide-react'
import { useSyncBalance } from '@/core/users/hooks/useUpdateUser'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { useUpdateModel } from '@/hooks/useQueryModel'
import { GET_ADVANCED_ACCOUNT_SOURCE_KEY } from '@/core/account-source/constants'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/libraries/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export default function DetailUpdateAccountSourceForm({
  detailAccountSource,
  sharedDialogElements
}: {
  detailAccountSource: IAccountSource
  sharedDialogElements: any
}) {
  const t = translate(['accountSource', 'common'])
  const [isSyncing, setIsSyncing] = useState(false)
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null)
  const { resetData: resetCacheExpenditureFund } = useUpdateModel([GET_ADVANCED_ACCOUNT_SOURCE_KEY], () => { })

  const { mutate: syncBalance } = useSyncBalance({
    callBackOnSuccess: () => {
      setTimeout(() => {
        resetCacheExpenditureFund()
        setIsSyncing(false)
        sharedDialogElements.setIsDialogOpen((prev: any) => ({ ...prev, isDialogDetailOpen: false }))
      }, 1000)
    },
    callBackOnError: () => {
      setIsSyncing(false)
    }
  })

  const handleSyncBalance = () => {
    if (!detailAccountSource.id) {
      toast.error('Account source not found')
      return
    }

    setIsSyncing(true)
    syncBalance({ accountSourceId: detailAccountSource.id })
  }

  const handleCopyAccount = (accountNo: string) => {
    navigator.clipboard.writeText(accountNo)
    setCopiedAccount(accountNo)
    toast.success('Đã sao chép số tài khoản')
    setTimeout(() => setCopiedAccount(null), 2000)
  }

  const isWallet = detailAccountSource.type === EAccountSourceType.WALLET

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='py-6 px-1'
    >
      {/* Header with Amount */}
      <Card className={cn(
        "mb-6 overflow-hidden border-none shadow-lg relative",
        isWallet 
          ? "bg-gradient-to-br from-secondary/50 to-secondary/20" 
          : "bg-gradient-to-br from-primary/50 to-primary/20"
      )}>
        <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 opacity-10">
          {isWallet ? (
            <Wallet className="w-full h-full" />
          ) : (
            <Landmark className="w-full h-full" />
          )}
        </div>
        <CardContent className="p-6 relative z-10">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge 
                variant={isWallet ? "secondary" : "default"} 
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-full text-secondary-foreground",
                  isWallet ? "bg-secondary " : "bg-primary "
                )}
              >
                {isWallet ? (
                  <Wallet className="mr-1.5 h-3.5 w-3.5" />
                ) : (
                  <Landmark className="mr-1.5 h-3.5 w-3.5" />
                )}
                {isWallet ? t('type.WALLET') : t('type.BANKING')}
              </Badge>
              <Badge 
                variant="outline" 
                className="px-3 py-1.5 text-xs font-medium rounded-full bg-background/60 backdrop-blur-sm"
              >
                <Tag className="mr-1.5 h-3.5 w-3.5" />
                {detailAccountSource.name}
              </Badge>
            </div>

            <div className="mt-3">
              <p className='text-sm font-medium text-muted-foreground flex items-center'>
                <DollarSign className="mr-1.5 h-4 w-4" />
                {t('form.editAccountSource.currentAmount')}
              </p>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                <span className={cn(
                  'text-4xl font-bold block mt-2 text-secondary-foreground',
                )}>
                  {formatCurrency(detailAccountSource.currentAmount ?? 0, 'đ', 'vi-vn')}
                </span>
              </motion.div>
            </div>

            <div className='flex justify-end gap-3 mt-4'>
              {detailAccountSource.type === EAccountSourceType.BANKING && (
                <Button
                  variant={isWallet ? "secondary" : "default"}
                  className={cn(
                    "flex items-center gap-2 transition-all rounded-full shadow-md",
                    isWallet ? "bg-background/80 hover:bg-background" : "bg-background/80 hover:bg-background"
                  )}
                  onClick={handleSyncBalance}
                  disabled={isSyncing}
                >
                  <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  {t('button.reload_data')}
                </Button>
              )}
              <Button
                variant={isWallet ? "default" : "secondary"}
                className="flex items-center gap-2 rounded-full shadow-md"
                type='button'
                onClick={() => {
                  sharedDialogElements.setIsDialogOpen((prev: { isDialogUpdateOpen: boolean }) => ({
                    ...prev,
                    isDialogUpdateOpen: true
                  }))
                }}
              >
                <Edit className="h-4 w-4" />
                {t('form.button.edit_account_source')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Section */}
      <Card className="bg-card shadow-md border-none">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 divide-y divide-border/60">
            {/* Account Number */}
            <div className="flex items-start p-5 transition-colors hover:bg-muted/30">
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full text-primary-foreground",
                isWallet ? "bg-secondary" : "bg-primary"
              )}>
                <CreditCard className="h-6 w-6" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-semibold">{t('form.editAccountSource.accountBank')}</p>
                
                {detailAccountSource.accountBank && detailAccountSource.accountBank.accounts.length > 0 ? (
                  <div className="mt-3 space-y-2.5">
                    {detailAccountSource.accountBank.accounts.map((account, index) => (
                      <motion.div
                        key={account.accountNo}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.1 }}
                        className={cn(
                          "flex items-center justify-between p-2.5 rounded-lg",
                          "bg-muted/50 border border-border/40 group"
                        )}
                      >
                        <div className="flex items-center">
                          <span className={cn(
                            "inline-block w-7 h-7 flex items-center justify-center rounded-full text-xs mr-2.5",
                            isWallet ? "bg-secondary/20 text-secondary-foreground" : "bg-primary/20"
                          )}>
                            {index + 1}
                          </span>
                          <div className="font-mono text-sm tracking-wide">
                            {account.accountNo.replace(/(\d{4})(?=\d)/g, '$1 ')}
                          </div>
                        </div>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={() => handleCopyAccount(account.accountNo)}
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                              >
                                {copiedAccount === account.accountNo ? (
                                  <Check className="h-3.5 w-3.5 text-green-500" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{copiedAccount === account.accountNo ? 'Đã sao chép' : 'Sao chép số tài khoản'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-2 py-3 px-4 rounded-lg bg-muted/40 text-sm text-muted-foreground italic border border-dashed border-border/50">
                    Không có thông tin tài khoản
                  </div>
                )}
              </div>
            </div>

            {/* Currency */}
            <div className="flex items-start p-5 transition-colors hover:bg-muted/30">
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full text-primary-foreground",
                isWallet ? "bg-secondary" : "bg-primary"
              )}>
                <DollarSign className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold">{t('form.editAccountSource.currency')}</p>
                <div className="mt-2 inline-block py-1.5 px-3 rounded-md bg-muted/40 text-sm font-medium">
                  {detailAccountSource.currency || 'VND'}
                </div>
              </div>
            </div>

            {/* Initial Amount */}
            <div className="flex items-start p-5 transition-colors hover:bg-muted/30">
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full text-primary-foreground",
                isWallet ? "bg-secondary" : "bg-primary"
              )}>
                <Calendar className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold">{t('form.editAccountSource.initialAmount')}</p>
                <p className="mt-2 text-lg font-semibold">
                  {formatCurrency(detailAccountSource.initAmount ?? 0, 'đ', 'vi-vn')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
