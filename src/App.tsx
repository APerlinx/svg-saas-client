import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import CreditReminderBanner from './components/CreditReminderBanner'
import { useAuth } from './hooks/useAuth'
import LoaderIcon from './components/icons/LoaderIcon'

const LOADING_MESSAGES = [
  'It may take some time to load the app - we’re still in beta.',
  'Sorry for the inconvenience, and thank you for your patience.',
]

function InitialLoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length)
    }, 3500)

    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="flex flex-col items-center text-center gap-3">
        <p className="text-sm sm:text-base text-gray-700 max-w-md">
          {LOADING_MESSAGES[messageIndex]}
        </p>
        <div className="loader" aria-label="Loading">
          <LoaderIcon className="w-12 h-12" />
        </div>
      </div>
    </div>
  )
}

function App() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return <InitialLoadingScreen />
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      <CreditReminderBanner />

      <main className="grow flex items-start justify-center px-4 py-8 sm:py-16">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default App
