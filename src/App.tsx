import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import CoinReminderBanner from './components/CoinReminderBanner'
import { useAuth } from './hooks/useAuth'
import loader from './assets/loader.svg'

function App() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader">
          <img src={loader} alt="Loading..." className="w-12 h-12" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col ">
      <Header />
      <CoinReminderBanner />

      <main className="grow flex items-center justify-center px-4 py-8 sm:py-16">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default App
