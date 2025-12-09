interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

export default function AuthLayout({
  children,
  title,
  subtitle,
}: AuthLayoutProps) {
  return (
    <div className="flex px-4">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl">
        {/* Auth Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
