import CustomDialog from '@/components/dashboard/Dialog'
import { initEmptyDetailExpenditureFund } from './constants'
import { IDialogConfig } from '@/types/common.i'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { t } from 'i18next'
import { IExpenditureFundDialogProps } from '@/core/expenditure-fund/models/expenditure-fund.interface'
import CreateExpenditureFundForm from '@/components/dashboard/expenditure-fund/create-expenditure-fund'
import { DetailExpenditureFund } from '@/components/dashboard/expenditure-fund/detail-expenditure-fund'
import UpdateExpenditureFundForm from '@/components/dashboard/expenditure-fund/update-expenditure-fund'
import DeleteDialog from '@/components/dashboard/DeleteDialog'

export default function ExpenditureFundDialog(params: IExpenditureFundDialogProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const formCreateExpenditureFundRef = useRef<HTMLFormElement>(null)
  const formUpdateExpenditureFundRef = useRef<HTMLFormElement>(null)
  const formInviteParticipantRef = useRef<HTMLFormElement>(null)
  const [idParticipantDelete, setIdParticipantDelete] = useState<string>('')

  const {
    commonDialogState,
    createDialog,
    detailUpdateDialog,
    inviteParticipantDialog,
    createUpdateCategory,
    statisticProps
  } = params
  const createExpenditureFundDialog: IDialogConfig = {
    content: CreateExpenditureFundForm({
      handleCreate: createDialog.handleCreate,
      formCreateRef: formCreateExpenditureFundRef
    }),
    isOpen: commonDialogState.isDialogOpen.isDialogCreateOpen,
    onClose: () => commonDialogState.setIsDialogOpen((prev) => ({ ...prev, isDialogCreateOpen: false })),
    title: 'Create Expenditure Fund',
    description: 'Create a new expenditure fund',
    footer: (
      <Button onClick={() => formCreateExpenditureFundRef.current?.requestSubmit()} type='button'>
        {t('common:button.save')}
      </Button>
    )
  }

  const detailConfigDialog: IDialogConfig = {
    className: 'sm:max-w-[325px] md:max-w-[650px]',
    content: DetailExpenditureFund({
      detailData: detailUpdateDialog.data,
      inviteTabProps: {
        formRef: formInviteParticipantRef,
        handleInvite: inviteParticipantDialog.handleInvite
      },
      categoryTabProps: {
        handleCreate: createUpdateCategory.handleCreateTrackerType,
        handleUpdate: createUpdateCategory.handleUpdateTrackerType,
        isEditing,
        setIsEditing,
        expenditureFund: createUpdateCategory.expenditureFund
      },
      statisticProps,
      setIsDialogOpen: commonDialogState.setIsDialogOpen,
      participantProps: {
        handleDelete: (id: string) => {
          setIdParticipantDelete(id)
          commonDialogState.setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteParticipantOpen: true }))
        }
      }
    }),
    description: 'Detail information of the expenditure fund.',
    title: 'Expenditure Fund Details',
    isOpen: commonDialogState.isDialogOpen.isDialogDetailOpen,
    onClose: () => {
      detailUpdateDialog.setDetailData(initEmptyDetailExpenditureFund)
      commonDialogState.setIsDialogOpen((prev) => ({ ...prev, isDialogDetailOpen: false }))
    }
  }

  const updateConfigDialog: IDialogConfig = {
    content: UpdateExpenditureFundForm({
      handleUpdate: detailUpdateDialog.handleUpdate,
      formUpdateRef: formUpdateExpenditureFundRef,
      defaultValues: {
        id: detailUpdateDialog.data.id,
        description: detailUpdateDialog.data.description,
        name: detailUpdateDialog.data.name,
        status: detailUpdateDialog.data.status
      }
    }),
    isOpen: commonDialogState.isDialogOpen.isDialogUpdateOpen,
    onClose: () => commonDialogState.setIsDialogOpen((prev) => ({ ...prev, isDialogUpdateOpen: false })),
    title: 'Update Expenditure Fund',
    description: 'Update a new expenditure fund',
    footer: (
      <Button onClick={() => formUpdateExpenditureFundRef.current?.requestSubmit()} type='button'>
        {t('common:button.save')}
      </Button>
    )
  }

  return (
    <div>
      <CustomDialog config={createExpenditureFundDialog} />
      <CustomDialog config={detailConfigDialog} />
      <CustomDialog config={updateConfigDialog} />
      <DeleteDialog
        isDialogOpen={commonDialogState.isDialogOpen.isDialogDeleteParticipantOpen}
        onClose={() => commonDialogState.setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteParticipantOpen: false }))}
        onDelete={() => {
          detailUpdateDialog.handleDeleteParticipant(idParticipantDelete)
        }}
        customDescription='Are you sure you want to delete this participant?'
        customTitle='Delete Participant'
      />
    </div>
  )
}
