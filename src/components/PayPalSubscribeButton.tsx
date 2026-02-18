import { PayPalButtons } from '@paypal/react-paypal-js'
import { useState } from 'react'
import { createSubscription } from '../services/paypalService'

interface PayPalSubscribeButtonProps {
  onSuccess: () => void
  onError: (message: string) => void
}

export default function PayPalSubscribeButton({
  onSuccess,
  onError,
}: PayPalSubscribeButtonProps) {
  const [isPending, setIsPending] = useState(false)

  return (
    <div className="w-full">
      {isPending && (
        <div className="text-sm text-gray-500 text-center mb-2">
          Setting up subscription...
        </div>
      )}
      <PayPalButtons
        style={{
          shape: 'pill',
          color: 'gold',
          label: 'subscribe',
          layout: 'vertical',
        }}
        createSubscription={async () => {
          setIsPending(true)
          try {
            const result = await createSubscription()
            return result.subscriptionId
          } catch (err) {
            const message =
              err instanceof Error ? err.message : 'Failed to create subscription'
            onError(message)
            throw err
          } finally {
            setIsPending(false)
          }
        }}
        onApprove={async (_data) => {
          // Webhook will finalize the plan upgrade on the backend.
          // We optimistically show success and refresh user data.
          onSuccess()
        }}
        onError={(err) => {
          console.error('PayPal error:', err)
          onError('Something went wrong with PayPal. Please try again.')
        }}
        onCancel={() => {
          setIsPending(false)
        }}
      />
    </div>
  )
}
