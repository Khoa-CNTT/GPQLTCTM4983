'use client'

import { Button } from '@/components/ui/button'
import {
  EAccountSourceType,
  type IAccountSource,
  type IAccountSourceBody,
  type IAccountSourceFormData
} from '@/core/account-source/models'
import FormZod from '../../core/FormZod'
import {
  createAccountSourceFormBody,
  createAccountSourceSchema
} from '@/core/account-source/constants/create-account-source.constant'
import { Fragment, useEffect, useRef, useState } from 'react'
import {
  createAccountBankFormBody,
  createAccountBankSchema
} from '@/core/account-source/constants/create-account-bank.constant'
import { useTranslation } from 'react-i18next'
import {
  updateAccountSourceFormBody,
  updateAccountSourceSchema
} from '@/core/account-source/constants/update-account-source.constant'
import {
  updateAccountBankFormBody,
  updateAccountBankSchema
} from '@/core/account-source/constants/update-account-bank.constant'
import { EBankTypes, initEmptyAccountSource } from '@/app/dashboard/account-source/constants'

export default function CreateAndUpdateAccountSourceForm({
  callBack,
  defaultValue,
  isCreating,
  isUpdating,
  typeState,
  setTypeState
}: {
  callBack: (payload: IAccountSourceBody) => void
  defaultValue?: IAccountSource
  isCreating: boolean
  isUpdating: boolean
  typeState: EAccountSourceType
  setTypeState: React.Dispatch<React.SetStateAction<EAccountSourceType>>
}) {
  const [defaultValueData, setDefaultValueData] = useState<IAccountSourceFormData>({
    accountBank: undefined,
    accountSource: { accountSourceName: '', accountSourceType: EAccountSourceType.WALLET, initAmount: '' }
  })
  // Store the latest account source name
  const currentNameRef = useRef<string>(defaultValue?.name || '')
  // Add a state to track the latest name for more reliable updates
  const [latestName, setLatestName] = useState<string>(defaultValue?.name || '')
  // Store form values for submission
  const [formValues, setFormValues] = useState<{ accountSourceName: string }>({
    accountSourceName: defaultValue?.name || ''
  })

  const formCreateAccountSourceRef = useRef<HTMLFormElement>(null)
  const formCreateAccountBankRef = useRef<HTMLFormElement>(null)
  // Add form control refs to access form values
  const formSourceControlRef = useRef<any>(null)
  const formBankControlRef = useRef<any>(null)

  const { t } = useTranslation(['accountSource'])

  const handleSubmit = (v: {
    accountSourceName: string
    initAmount?: string
    accountSourceType: EAccountSourceType
  }) => {
    // Update both the ref and the state with the new name
    currentNameRef.current = v.accountSourceName
    setLatestName(v.accountSourceName)
    setFormValues((prev) => ({ ...prev, accountSourceName: v.accountSourceName }))
    console.log('Source form submitted with name:', v.accountSourceName)

    const newPayload: IAccountSourceBody = {
      ...v,
      name: v.accountSourceName,
      accountSourceType: typeState,
      initAmount: Number(v.initAmount || 0)
    }

    // Chỉ thêm id khi đang update (không phải create mới)
    if (defaultValue !== initEmptyAccountSource && defaultValue?.id) {
      newPayload.id = defaultValue.id
    }

    if (typeState !== EAccountSourceType.BANKING) callBack(newPayload)
  }

  const handleSubmitBank = (v: any) => {
    // Use the form values for reliability
    console.log('Bank form submitted with latest name:', formValues.accountSourceName)

    const bankPayload: IAccountSourceBody = {
      ...v,
      name: formValues.accountSourceName, // Use formValues instead of latestName
      accountSourceType: typeState
    }

    // Lấy giá trị initAmount từ form source
    if (formSourceControlRef.current) {
      try {
        const sourceValues = formSourceControlRef.current.getValues()
        if (sourceValues.initAmount) {
          bankPayload.initAmount = Number(sourceValues.initAmount || 0)
        }
      } catch (error) {
        console.error('Error getting initAmount:', error)
      }
    }

    // Chỉ thêm id khi đang update (không phải create mới)
    if (defaultValue !== initEmptyAccountSource && defaultValue?.id) {
      bankPayload.id = defaultValue.id
    }

    console.log('Final bank payload:', bankPayload)
    callBack(bankPayload)
  }

  const onSubmitAll = async () => {
    // Get the current form values using formSourceControlRef
    if (formSourceControlRef.current) {
      try {
        // Get current value from form control
        const currentValue = formSourceControlRef.current.getValues()
        if (currentValue.accountSourceName) {
          // Update the form values synchronously before submitting
          setFormValues({ accountSourceName: currentValue.accountSourceName })
        }
      } catch (error) {
        console.error('Error getting form values:', error)
      }
    }

    // Submit form source first
    if (formCreateAccountSourceRef.current) {
      formCreateAccountSourceRef.current.requestSubmit()
    }

    // If it's BANKING, wait for the first form to complete and ensure we have the updated name
    if (typeState === EAccountSourceType.BANKING) {
      // Use a longer timeout to ensure the first form has completed
      setTimeout(() => {
        // Double check we have the latest values before submitting bank form
        if (formSourceControlRef.current) {
          try {
            // Try to get the most up-to-date value
            const latestValue = formSourceControlRef.current.getValues()
            if (latestValue.accountSourceName) {
              setFormValues({ accountSourceName: latestValue.accountSourceName })
            }
          } catch (error) {
            console.error('Error getting latest form values:', error)
          }
        }

        // Now submit the bank form with the latest value
        if (formCreateAccountBankRef.current) {
          formCreateAccountBankRef.current.requestSubmit()
        }
      }, 800) // Increased timeout for more reliability
    }
  }

  useEffect(() => {
    console.log('defaultValue: ', defaultValue)
    if (defaultValue) {
      console.log('defaultValue: ', defaultValue)
      // Update both ref and state when defaultValue changes
      currentNameRef.current = defaultValue.name
      setLatestName(defaultValue.name)
      // Also update formValues to keep everything in sync
      setFormValues({ accountSourceName: defaultValue.name })

      setDefaultValueData({
        accountBank: {
          type: defaultValue.accountBank?.type ?? EBankTypes.MB_BANK,
          login_id: defaultValue.accountBank?.login_id ?? '',
          password: defaultValue.accountBank?.pass ?? '',
          accounts: defaultValue.accountBank
            ? defaultValue.accountBank.accounts.map((account) => account.accountNo)
            : []
        },
        accountSource: {
          accountSourceName: defaultValue.name,
          accountSourceType: defaultValue.type,
          initAmount: String(defaultValue.initAmount)
        }
      })
    }
  }, [defaultValue])

  return (
    <div>
      <Fragment>
        {defaultValue === initEmptyAccountSource ? (
          <Fragment>
            <FormZod
              defaultValues={defaultValueData.accountSource}
              classNameForm='space-y-4'
              formSchema={createAccountSourceSchema}
              formFieldBody={createAccountSourceFormBody(setTypeState)}
              onSubmit={handleSubmit}
              submitRef={formCreateAccountSourceRef}
              formRef={formSourceControlRef}
            />

            {typeState === EAccountSourceType.BANKING && (
              <FormZod
                defaultValues={defaultValueData.accountBank}
                classNameForm='space-y-4 mt-4'
                formSchema={createAccountBankSchema}
                formFieldBody={createAccountBankFormBody}
                onSubmit={handleSubmitBank}
                submitRef={formCreateAccountBankRef}
                formRef={formBankControlRef}
              />
            )}
          </Fragment>
        ) : (
          <Fragment>
            <FormZod
              defaultValues={defaultValueData.accountSource}
              classNameForm='space-y-4'
              formSchema={updateAccountSourceSchema}
              formFieldBody={updateAccountSourceFormBody(setTypeState)}
              onSubmit={handleSubmit}
              submitRef={formCreateAccountSourceRef}
              formRef={formSourceControlRef}
            />

            {typeState === EAccountSourceType.BANKING && (
              <FormZod
                defaultValues={defaultValueData.accountBank}
                classNameForm='space-y-4 mt-4'
                formSchema={updateAccountBankSchema}
                formFieldBody={updateAccountBankFormBody}
                onSubmit={handleSubmitBank}
                submitRef={formCreateAccountBankRef}
                formRef={formBankControlRef}
              />
            )}
          </Fragment>
        )}
      </Fragment>
      <Button onClick={onSubmitAll} className='mt-4 w-full' disabled={isCreating || isUpdating}>
        {t('form.button.save_changes_account_source')}
      </Button>
    </div>
  )
}
