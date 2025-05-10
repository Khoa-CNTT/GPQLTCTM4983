export interface IAgentSubscriptionBody {
  accountBankId: string;
  hour: number;
  minute: number;
}

export interface IAgentSubscriptionResponse {
  id: string
  userId: string
  hour: number
  minute: number
  accountBankId: string
}

export interface IAgentSubscriptionStatus {
    id: string
    userId: string
    hour: number
    minute: number
    accountBankId: string
    accountBank: {
      id: string
      type: string
      login_id: string
      sessionId: string | null
      deviceId: string | null
      userId: string
      AccountSource: any | null
    }
}
