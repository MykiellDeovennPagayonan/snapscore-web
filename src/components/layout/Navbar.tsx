// components/Navbar.tsx
import Link from 'next/link'
import { FC } from 'react'

const Navbar: FC = () => {
  return (
    <>
      <nav className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold">
                SnapScore
              </Link>
            </div>

            {/* Main Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link 
                  href="/pricing" 
                  className="px-3 py-2 rounded-md text-sm hover:bg-gray-700"
                >
                  Pricing
                </Link>
                <Link 
                  href="/support" 
                  className="px-3 py-2 rounded-md text-sm hover:bg-gray-700"
                >
                  Support
                </Link>
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link 
                href="/register" 
                className="bg-blue-200 text-gray-800 px-4 py-2 rounded-md text-sm hover:bg-blue-300"
              >
                Register
              </Link>
              <Link 
                href="/login" 
                className="bg-blue-200 text-gray-800 px-4 py-2 rounded-md text-sm hover:bg-blue-300"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar