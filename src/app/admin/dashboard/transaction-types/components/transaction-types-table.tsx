'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { 
  MoreHorizontal, 
  Search, 
  PencilIcon,
  Trash2Icon,
  Plus
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AdminTransactionType, useAdminTransactionTypes } from '@/core/admin/hooks/useAdminTransactionTypes'
import { translate } from '@/libraries/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { CreateTransactionTypeDialog } from '@/app/admin/dashboard/transaction-types/components/create-transaction-type-dialog'
import { EditTransactionTypeDialog } from '@/app/admin/dashboard/transaction-types/components/edit-transaction-type-dialog'
import { useTranslation } from 'react-i18next'

export type TransactionType = AdminTransactionType

interface TransactionTypesTableProps {
  filterType?: string
}

export function TransactionTypesTable({ filterType }: TransactionTypesTableProps) {
  const { i18n } = useTranslation()
  const t = translate(['common'])
  const [searchQuery, setSearchQuery] = useState('')
  const [trackerTypeFilter, setTrackerTypeFilter] = useState<string | undefined>(undefined)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTransactionType, setSelectedTransactionType] = useState<TransactionType | null>(null)
  const [languageKey, setLanguageKey] = useState(i18n.language)

  const { 
    transactionTypes, 
    isLoading, 
    deleteTransactionType, 
    isDeleting 
  } = useAdminTransactionTypes({ 
    type: filterType, 
    trackerType: trackerTypeFilter 
  })

  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguageKey(i18n.language)
    }
    
    window.addEventListener('languageChanged', handleLanguageChange)
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange)
    }
  }, [i18n])

  const filteredData = transactionTypes?.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const handleDelete = (transactionType: TransactionType) => {
    setSelectedTransactionType(transactionType)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedTransactionType) {
      deleteTransactionType(selectedTransactionType.id, {
        onSuccess: () => {
          toast.success(t('admin.transactionTypes.deleteSuccess'))
          setDeleteDialogOpen(false)
        },
        onError: (error) => {
          toast.error(t('admin.transactionTypes.deleteError'))
        }
      })
    }
  }

  const handleEdit = (transactionType: TransactionType) => {
    setSelectedTransactionType(transactionType)
    setEditDialogOpen(true)
  }

  const renderTransactionTypeType = (type: string) => {
    switch (type) {
      case 'INCOMING':
        return <Badge className="bg-green-500 hover:bg-green-600">{t('admin.transactionTypes.typeIncoming')}</Badge>
      case 'EXPENSE':
        return <Badge variant="destructive">{t('admin.transactionTypes.typeExpense')}</Badge>
      case 'TRANSFER':
        return <Badge variant="outline">{t('admin.transactionTypes.typeTransfer')}</Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  const renderTrackerType = (trackerType: string) => {
    switch (trackerType) {
      case 'DEFAULT':
        return <Badge variant="secondary">{t('admin.transactionTypes.trackerTypeDefault')}</Badge>
      case 'CONTRIBUTE':
        return <Badge variant="outline">{t('admin.transactionTypes.trackerTypeContribute')}</Badge>
      default:
        return <Badge variant="secondary">{trackerType}</Badge>
    }
  }

  return (
    <>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('admin.transactionTypes.search')}
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select 
            value={trackerTypeFilter} 
            onValueChange={setTrackerTypeFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('admin.transactionTypes.filterByTrackerType')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={undefined as any}>{t('admin.transactionTypes.all')}</SelectItem>
              <SelectItem value="DEFAULT">{t('admin.transactionTypes.trackerTypeDefault')}</SelectItem>
              <SelectItem value="CONTRIBUTE">{t('admin.transactionTypes.trackerTypeContribute')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="ml-auto">
          <Plus className="mr-2 h-4 w-4" />
          {t('admin.transactionTypes.create')}
        </Button>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">{t('admin.transactionTypes.name')}</TableHead>
              <TableHead>{t('admin.transactionTypes.description')}</TableHead>
              <TableHead>{t('admin.transactionTypes.type')}</TableHead>
              <TableHead>{t('admin.transactionTypes.trackerType')}</TableHead>
              <TableHead className="text-right">{t('admin.transactionTypes.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-6 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredData.length > 0 ? (
              filteredData.map((transactionType) => (
                <TableRow key={transactionType.id}>
                  <TableCell className="font-medium">{transactionType.name}</TableCell>
                  <TableCell>{transactionType.description || '-'}</TableCell>
                  <TableCell>{renderTransactionTypeType(transactionType.type)}</TableCell>
                  <TableCell>{renderTrackerType(transactionType.trackerType)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">{t('admin.common.openMenu')}</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(transactionType)}>
                          <PencilIcon className="mr-2 h-4 w-4" />
                          {t('admin.common.edit')}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(transactionType)}
                        >
                          <Trash2Icon className="mr-2 h-4 w-4" />
                          {t('admin.common.delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {t('admin.common.noResults')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <CreateTransactionTypeDialog 
        isOpen={createDialogOpen} 
        onClose={() => setCreateDialogOpen(false)} 
        onSuccess={() => setCreateDialogOpen(false)} 
      />

      {selectedTransactionType && (
        <EditTransactionTypeDialog 
          isOpen={editDialogOpen} 
          onClose={() => setEditDialogOpen(false)} 
          transactionType={selectedTransactionType}
          onSuccess={() => setEditDialogOpen(false)} 
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.transactionTypes.deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.transactionTypes.deleteConfirmDescription', { name: selectedTransactionType?.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('admin.common.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? t('admin.common.deleting') : t('admin.common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 