import FormZod from '@/components/core/FormZod'
import CustomDialog from '@/components/dashboard/Dialog'
import { Button } from '@/components/ui/button'
import { resendEmailVerifyFormBody, resendEmailVerifySchema } from '@/core/auth/constants/resend-email-verify'
import { IDialogConfig } from '@/types/common.i'
import { useEffect, useRef } from 'react'

export default function ResendEmailVerifyDialog({
  email,
  handle,
  isResending,
  isOpen,
  setIsOpen
}: {
  email: string
  handle: (email: string) => void
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  isResending: boolean
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const dialogResendEmailConfig: IDialogConfig = {
    title: 'Resend Email Verification',
    content: (
      <FormZod
        formSchema={resendEmailVerifySchema}
        formFieldBody={resendEmailVerifyFormBody}
        onSubmit={(values) => {
          handle(values.email)
        }}
        submitRef={formRef}
        defaultValues={{ email }}
        buttonConfig={{ label: 'Send' }}
      />
    ),
    isOpen,
    onClose: () => {
      setIsOpen(false)
    },
    footer: (
      <Button isLoading={isResending} onClick={() => formRef.current?.requestSubmit()} type='button'>
        Send
      </Button>
    )
    //We have sent you a verification email. Please check your inbox and click the link to verify your account.
  }
  return <CustomDialog config={dialogResendEmailConfig} />
}
