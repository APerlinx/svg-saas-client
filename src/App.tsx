import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import CreditReminderBanner from './components/CreditReminderBanner'
import { useAuth } from './hooks/useAuth'
import LoaderIcon from './components/icons/LoaderIcon'

function App() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader">
          <LoaderIcon className="w-12 h-12" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col ">
      <Header />
      <CreditReminderBanner />

      <main className="grow flex items-center justify-center px-4 py-8 sm:py-16">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default App
