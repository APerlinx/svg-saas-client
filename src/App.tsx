import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import CreditReminderBanner from './components/CreditReminderBanner'
import { useAuth } from './hooks/useAuth'
import LoaderIcon from './components/icons/LoaderIcon'
import ScrollToTop from './components/ScrollToTop'

function InitialLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="flex flex-col items-center text-center gap-3">
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
      <ScrollToTop />
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
