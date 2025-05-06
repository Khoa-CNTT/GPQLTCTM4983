import { initEmptyAccountSource } from '@/app/dashboard/account-source/constants'
import { handleTransferAccountSource } from '@/app/dashboard/account-source/handler'
import CreateAndUpdateAccountSourceForm from '@/components/dashboard/account-source/Create&UpdateForm'
import DetailUpdateAccountSourceForm from '@/components/dashboard/account-source/DetailUpdateForm'
import TransferAccountSourceForm from '@/components/dashboard/account-source/TransferForm'
import CustomDialog from '@/components/dashboard/Dialog'
import {
  EAccountSourceType,
  IAccountSource,
  IAccountSourceBody,
  IAccountSourceTransfer,
  IDialogAccountSource
} from '@/core/account-source/models'
import { IDialogConfig } from '@/types/common.i'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface IAccountSourceDialogProps {
  fundId: string
  sharedDialogElements: {
    isDialogOpen: IDialogAccountSource
    setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogAccountSource>>
    isCreating: boolean
    isUpdating: boolean
    isDeletingOne: boolean
    isDeletingMultiple: boolean
    isTransferring: boolean
  }

  callBack: (payload: IAccountSourceBody) => void
  transferCallBack: (payload: IAccountSourceTransfer) => void
  detailAccountSourceDialog: {
    dataDetail: IAccountSource
  }
}

export default function AccountSourceDialog({
  fundId,
  sharedDialogElements,
  detailAccountSourceDialog,
  callBack,
  transferCallBack
}: IAccountSourceDialogProps) {
  const { t } = useTranslation(['accountSource', 'common'])
  const [typeState, setTypeState] = useState<EAccountSourceType>(EAccountSourceType.WALLET)
  useEffect(() => {
    if (sharedDialogElements.isDialogOpen.isDialogUpdateOpen && detailAccountSourceDialog.dataDetail)
      setTypeState(detailAccountSourceDialog.dataDetail.type)
  }, [sharedDialogElements.isDialogOpen.isDialogUpdateOpen])

  const updateConfigDialog: IDialogConfig = {
    content: CreateAndUpdateAccountSourceForm({
      callBack,
      defaultValue: detailAccountSourceDialog.dataDetail,
      isCreating: sharedDialogElements.isCreating,
      isUpdating: sharedDialogElements.isUpdating,
      typeState,
      setTypeState
    }),
    description: t('AccountSourceDialog.updateDialog.description'),
    title: t('AccountSourceDialog.updateDialog.title'),
    isOpen: sharedDialogElements.isDialogOpen.isDialogUpdateOpen,

    onClose: () => {
      sharedDialogElements.setIsDialogOpen((prev) => ({ ...prev, isDialogUpdateOpen: false }))
      setTypeState(EAccountSourceType.WALLET)
    }
  }

  const createConfigDialog: IDialogConfig = {
    content: CreateAndUpdateAccountSourceForm({
      callBack,
      defaultValue: initEmptyAccountSource,
      isCreating: sharedDialogElements.isCreating,
      isUpdating: sharedDialogElements.isUpdating,
      typeState,
      setTypeState
    }),
    description: t('AccountSourceDialog.createDialog.description'),
    title: t('AccountSourceDialog.createDialog.title'),
    isOpen: sharedDialogElements.isDialogOpen.isDialogCreateOpen,
    onClose: () => {
      sharedDialogElements.setIsDialogOpen((prev) => ({ ...prev, isDialogCreateOpen: false }))
      setTypeState(EAccountSourceType.WALLET)
    }
  }

  const detailsConfigDialog: IDialogConfig = {
    content: (
      <DetailUpdateAccountSourceForm
        sharedDialogElements={sharedDialogElements}
        detailAccountSource={detailAccountSourceDialog.dataDetail}
      />
    ),
    description: t('AccountSourceDialog.detailsDialog.description'),
    title: t('AccountSourceDialog.detailsDialog.title'),
    isOpen: sharedDialogElements.isDialogOpen.isDialogDetailOpen,
    onClose: () => {
      sharedDialogElements.setIsDialogOpen((prev) => ({ ...prev, isDialogDetailOpen: false }))
    }
  }

  const transferConfigDialog: IDialogConfig = {
    content: (
      <TransferAccountSourceForm
        sourceAccountSource={detailAccountSourceDialog.dataDetail}
        targetFundId={fundId}
        onSubmit={(values) => {
          transferCallBack(values);
        }}
      />
    ),
    description: t('AccountSourceDialog.transferDialog.description'),
    title: t('AccountSourceDialog.transferDialog.title'),
    isOpen: sharedDialogElements.isDialogOpen.isDialogTransferOpen,
    onClose: () => {
      sharedDialogElements.setIsDialogOpen((prev) => ({ ...prev, isDialogTransferOpen: false }))
    }
  }

  return (
    <div>
      <CustomDialog config={createConfigDialog} />
      <CustomDialog config={updateConfigDialog} />
      <CustomDialog config={detailsConfigDialog} />
      <CustomDialog config={transferConfigDialog} />
    </div>
  )
}
