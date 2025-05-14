'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TransactionTypesTable } from './components/transaction-types-table'
import { translate } from '@/libraries/utils'

export default function TransactionTypesPage() {
  const t = translate(['common'])
  
  useEffect(() => {
    document.title = `${t('admin.transactionTypes.title')} | Admin`
  }, [t])

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{t('admin.transactionTypes.title')}</h2>
      </div>
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">{t('admin.transactionTypes.tabs.all')}</TabsTrigger>
          <TabsTrigger value="incoming">{t('admin.transactionTypes.tabs.incoming')}</TabsTrigger>
          <TabsTrigger value="expense">{t('admin.transactionTypes.tabs.expense')}</TabsTrigger>
          <TabsTrigger value="transfer">{t('admin.transactionTypes.tabs.transfer')}</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.transactionTypes.allTransactionTypes')}</CardTitle>
              <CardDescription>
                {t('admin.transactionTypes.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <TransactionTypesTable filterType={undefined} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="incoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.transactionTypes.incomingTransactionTypes')}</CardTitle>
              <CardDescription>
                {t('admin.transactionTypes.incomingDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <TransactionTypesTable filterType="INCOMING" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="expense" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.transactionTypes.expenseTransactionTypes')}</CardTitle>
              <CardDescription>
                {t('admin.transactionTypes.expenseDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <TransactionTypesTable filterType="EXPENSE" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="transfer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.transactionTypes.transferTransactionTypes')}</CardTitle>
              <CardDescription>
                {t('admin.transactionTypes.transferDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <TransactionTypesTable filterType="TRANSFER" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 