import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen flex flex-col ">
      <Header />

      <main className="grow flex items-center justify-center px-4 py-16">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default App
