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
import { useVerifyBank } from '@/core/account-bank/hooks/useVerifyBank'
import toast from 'react-hot-toast'

export default function CreateAndUpdateAccountSourceForm({
  callBack,
  defaultValue,
  isCreating,
  isUpdating,
  typeState,
  setTypeState
}: {
  callBack: (payload: IAccountSourceBody, setIsVerified: (isVerified: boolean) => void) => void
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
  const currentNameRef = useRef<string>(defaultValue?.name || '')
  const [latestName, setLatestName] = useState<string>(defaultValue?.name || '')
  const [formValues, setFormValues] = useState<{ accountSourceName: string }>({
    accountSourceName: defaultValue?.name || ''
  })
  const [isVerified, setIsVerified] = useState<boolean>(false)
  const [isVerifying, setIsVerifying] = useState<boolean>(false)
  const [verifyPayload, setVerifyPayload] = useState<{ username: string; password: string; numberAccount: string }>({
    username: '',
    password: '',
    numberAccount: ''
  })

  const { isPending: isVerifyBank, mutate: verifyBank, error: verifyError, data: dataVerifyBank } = useVerifyBank()

  const formCreateAccountSourceRef = useRef<HTMLFormElement>(null)
  const formCreateAccountBankRef = useRef<HTMLFormElement>(null)
  const formSourceControlRef = useRef<any>(null)
  const formBankControlRef = useRef<any>(null)

  const { t } = useTranslation(['accountSource'])

  const handleSubmit = (v: {
    accountSourceName: string
    initAmount?: string
    accountSourceType: EAccountSourceType
  }) => {
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

    if (defaultValue !== initEmptyAccountSource && defaultValue?.id) {
      newPayload.id = defaultValue.id
    }

    if (typeState === EAccountSourceType.WALLET) {
      callBack(newPayload, setIsVerified)
    }
  }

  const handleSubmitBank = (v: any) => {
    console.log('Bank form submitted with latest name:', formValues.accountSourceName)

    const bankPayload: IAccountSourceBody = {
      ...v,
      name: formValues.accountSourceName,
      accountSourceType: typeState
    }

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

    if (defaultValue !== initEmptyAccountSource && defaultValue?.id) {
      bankPayload.id = defaultValue.id
    }

    console.log('Final bank payload:', bankPayload)
    callBack(bankPayload, setIsVerified)
  }

  const handleVerifyBank = () => {
    if (formBankControlRef.current) {
      try {
        const bankValues = formBankControlRef.current.getValues()
        const accounts = bankValues.accounts || []
        const firstAccount = accounts.length > 0 ? accounts[0] : ''

        if (!bankValues.login_id || !bankValues.password || !firstAccount) {
          toast.error('Vui lòng nhập đầy đủ thông tin tài khoản ngân hàng!')
          return
        }
        verifyBank(
          {
            username: bankValues.login_id || '',
            password: bankValues.password || '',
            numberAccount: accounts
          },
          {
            onSuccess: (res) => {
              if (res?.data?.success == false) {
                toast.error(res?.data?.message)
              }
              if (res?.data?.success == true) {
                toast.success('Xác thực tài khoản ngân hàng thành công!')
                setIsVerified(true)

                if (res.data.accounts && Array.isArray(res.data.accounts)) {
                  const totalBalance = res.data.accounts.reduce(
                    (sum: number, account: any) => sum + (Number(account.currentBalance) || 0),
                    0
                  )

                  if (formSourceControlRef.current && totalBalance) {
                    try {
                      formSourceControlRef.current.setValue('initAmount', totalBalance.toString())
                    } catch (error) {
                      console.error('Error updating initAmount:', error)
                    }
                  }
                }
              }
            }
          }
        )
      } catch (error) {
        console.error('Error getting bank information:', error)
        toast.error('Không thể lấy thông tin ngân hàng!')
      }
    }
  }

  const onSubmitAll = async () => {
    if (formSourceControlRef.current) {
      try {
        const sourceValues = formSourceControlRef.current.getValues()

        const payload: IAccountSourceBody = {
          name: sourceValues.accountSourceName,
          accountSourceType: typeState,
          initAmount: Number(sourceValues.initAmount || 0)
        }

        if (defaultValue !== initEmptyAccountSource && defaultValue?.id) {
          payload.id = defaultValue.id
        }

        if (typeState === EAccountSourceType.BANKING && formBankControlRef.current) {
          const bankValues = formBankControlRef.current.getValues()
          payload.type = bankValues.type
          payload.login_id = bankValues.login_id
          payload.password = bankValues.password
          payload.accounts = bankValues.accounts
        }

        console.log('Final payload:', payload)

        callBack(payload, setIsVerified)
      } catch (error) {
        console.error('Error processing form data:', error)
      }
    }
  }

  useEffect(() => {
    if (defaultValue) {
      currentNameRef.current = defaultValue.name
      setLatestName(defaultValue.name)
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

  useEffect(() => {
    if (dataVerifyBank && dataVerifyBank.data) {
      const { data } = dataVerifyBank

      // Xử lý khi verify thành công chỉ khi success là true
      if (data.success) {
        setIsVerified(true)
        setIsVerifying(false)

        // Tính tổng số dư hiện tại từ tất cả tài khoản
        if (data.accounts && Array.isArray(data.accounts)) {
          const totalBalance = data.accounts.reduce(
            (sum: number, account: any) => sum + (Number(account.currentBalance) || 0),
            0
          )

          // Cập nhật initAmount với tổng số dư
          if (formSourceControlRef.current && totalBalance) {
            try {
              formSourceControlRef.current.setValue('initAmount', totalBalance.toString())
            } catch (error) {
              console.error('Error updating initAmount:', error)
            }
          }
        }
      }
    }
  }, [dataVerifyBank])

  // Thêm useEffect xử lý lỗi
  useEffect(() => {
    if (verifyError) {
      setIsVerifying(false)
    }
  }, [verifyError])

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
      {typeState === EAccountSourceType.BANKING && !isVerified ? (
        <Button
          onClick={handleVerifyBank}
          className='mt-4 w-full'
          variant={'greenPastel1'}
          disabled={isVerifyBank}
          isLoading={isVerifyBank}
        >
          {isVerifyBank ? 'Đang xác thực...' : 'Xác thực'}
        </Button>
      ) : (
        <Button onClick={onSubmitAll} className='mt-4 w-full' disabled={isCreating || isUpdating}>
          {t('form.button.save_changes_account_source')}
        </Button>
      )}
    </div>
  )
}
