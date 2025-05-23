export interface ICommonInformationForm {
  id: string
  fullName?: string
  dateOfBirth?: Date | null
  gender?: string | null
  address?: string | null
  phone_number?: string | null
  workplace?: string | null
  avatar?: string | null
}

export interface ICredentialInformationForm {
  id: string
  currentPassword?: string | undefined
  newPassword?: string | undefined
}
