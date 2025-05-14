import {
  IPropsHandleConfirm,
  IPropsHandleSaveEdit,
  IPropsHandleSend,
  IPropsStartEdit,
  Transaction
} from '@/app/chatbox/constants'
import { getAccessTokenFromLocalStorage } from '@/libraries/helpers'
import { Dispatch, SetStateAction } from 'react'
import { v4 as uuidv4 } from 'uuid'

const API_URL = process.env.NEXT_PUBLIC_CHATBOT || 'http://localhost:3002/'
const accessToken = getAccessTokenFromLocalStorage()

export const handleStartEdit = ({ transaction, setEditingId, setEditForms }: IPropsStartEdit) => {
  setEditingId(transaction.id)
  setEditForms((prev) => {
    const updatedForm = {
      ...prev,
      [transaction.id]: {
        description: transaction.description,
        amount: transaction.amount,
        categoryId: transaction.categoryId,
        categoryName: transaction.categoryName,
        accountSourceId: transaction?.accountSourceId ?? '',
        accountSourceName: transaction.walletName
      }
    }
    return updatedForm
  })
}

export const confirmChange = (
  transactions: Transaction[],
  changedTransaction: any[],
  setChangedTransaction: React.Dispatch<React.SetStateAction<any[]>>
) => {
  const existingIds = new Set(changedTransaction.map((item) => item.id))

  const newTransactions = transactions.filter((transaction) => !existingIds.has(transaction.id))

  if (newTransactions.length > 0) {
    setChangedTransaction((prev) => [
      ...prev,
      ...newTransactions.map((transaction) => ({
        id: transaction.id,
        reasonName: transaction.description,
        amount: transaction.amount,
        categoryId: transaction.categoryId,
        categoryName: transaction.categoryName,
        accountSourceId: transaction?.accountSourceId ?? '',
        accountSourceName: transaction.walletName,
        type: transaction.type
      }))
    ])
  }
}

export const handleSend = async ({
  input,
  setError,
  typingInterval,
  setMessages,
  setInput,
  scrollToBottom,
  fundId,
  setIsTyping,
  setCurrentResponse,
  setApiData
}: IPropsHandleSend) => {
  if (!input.trim()) {
    setError('Bạn phải nhập tin nhắn trước khi gửi.')
    return
  }

  if (typingInterval) {
    clearInterval(typingInterval)
    typingInterval = null
  }

  const newUserMessageId = Date.now()
  const newBotMessageId = Date.now() + 1

  setMessages((prev) => [
    ...prev.filter((msg) => msg.text !== ''),
    { id: newUserMessageId, text: input, sender: 'user' },
    { id: newBotMessageId, text: '', sender: 'bot' }
  ])

  setInput('')
  setError('')
  setTimeout(scrollToBottom, 100)

  try {
    const response = await fetch(`${API_URL}chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        message: input,
        fundId
      })
    })

    if (!response.ok) throw new Error('Network response was not ok')

    const reader = response.body?.getReader()
    if (!reader) throw new Error('Response reader not available')

    let fullResponse = ''
    setIsTyping(true)

    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        setIsTyping(false)
        setTimeout(scrollToBottom, 100)
        break
      }

      const chunk = new TextDecoder().decode(value)
      const lines = chunk.split('data: ').filter((line) => line.trim())

      for (const line of lines) {
        try {
          const data = JSON.parse(line)
          const updatedTransactions =
            data?.data?.transactions?.map((transaction: any) => ({
              ...transaction,
              idMessage: newBotMessageId,
              id: uuidv4()
            })) || []

          const processedRecent = data.recent
            ? data.recent.replace(/\\n/g, '<br />').replace(/\\"/g, '"').replace(/\\'/g, "'")
            : ''

          fullResponse = `${data.message}\n\n${'_'.repeat(50)}\n\n${processedRecent}`
          setCurrentResponse(fullResponse)

          setMessages((prev) => prev.map((msg) => (msg.id === newBotMessageId ? { ...msg, text: fullResponse } : msg)))

          setApiData((prev = []) => [
            ...prev,
            {
              message: { id: newBotMessageId, text: fullResponse, sender: 'bot' },
              transactions: updatedTransactions
            }
          ])

          setTimeout(scrollToBottom, 100)
        } catch (e) {
          console.error('Error parsing JSON:', e)
          console.log('Problematic line:', line)
        }
      }
    }
  } catch (error) {
    console.error('Error sending message:', error)

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
        sender: 'bot'
      }
    ])

    setIsTyping(false)
    setTimeout(scrollToBottom, 100)
  }
}

export const handleCancelEdit = (setEditingId: Dispatch<SetStateAction<string | null>>) => {
  setEditingId(null)
}

export const handleConfirm = async ({ editedTransactions, fundId, postTrackerTransactions }: IPropsHandleConfirm) => {
  const payload = editedTransactions.map((item) => {
    return {
      trackerTypeId: item?.categoryId,
      accountSourceId: item.accountSourceId,
      reasonName: item.reasonName,
      direction: item.type,
      amount: item.amount,
      fundId
    }
  })
  await postTrackerTransactions(payload)
}
