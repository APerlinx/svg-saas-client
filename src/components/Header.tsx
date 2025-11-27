import logo from '../assets/logo.svg'

export default function Header() {
  return (
    <header className="border-b-[0.5px]  border-gray-100 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center font-serif">
            <img src={logo} alt="SVG Wiz Logo" className="w-12 h-12" />
            <h1 className="font-bold text-sm mt-3">SVG WIZ</h1>
          </div>

          <nav className="flex items-center gap-8">
            <a href="#" className="">
              Home
            </a>
            <a href="#" className="">
              Gallery
            </a>
            <a href="#" className="">
              Pricing
            </a>
            <div className="flex gap-4">
              <button>Sign In</button>
              <button>Sign Up</button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
