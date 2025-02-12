// components/Footer.tsx
import Link from 'next/link'
// import Image from 'next/image'
import { FC } from 'react'

const Footer: FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Install Section */}
          <div className="col-span-1">
            {/* <h2 className="text-xl mb-4">INSTALL SnapScore FREE</h2> */}
            {/* <Link href="https://play.google.com/store" className="inline-block">
              <div className='p-2 bg-black items-center justify-center rounded-lg'>
                <Image
                  src="/google-play-badge.jpg"
                  alt="Get it on Google Play"
                  width={200}
                  height={30}
                  className="hover:opacity-90 rounded-lg"
                />
              </div>
            </Link> */}
          </div>

          {/* Product Section */}
          {/* <div className="col-span-1">
            <h2 className="text-xl mb-4">PRODUCT:</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/pricing" className="hover:text-gray-300">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-gray-300">
                  Support
                </Link>
              </li>
            </ul>
          </div> */}

          <div className='col-span-1'>

          </div>

          {/* Company Info Section */}
          <div className="col-span-1">
            <h2 className="text-xl mb-4">COMPANY INFO:</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/about-us" className="hover:text-gray-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-gray-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-gray-300">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info Section */}
          <div className="col-span-1">
            <div className="text-gray-400">
              <p>Email: snapscore@gmail.com</p>
              <p>SnapScore LLC</p>
              <p>PO Box 123</p>
              <p>Bacolod City, Neg. Occ., Philippines</p>
            </div>
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-sm text-gray-400">
          <p>2025 © SnapScore LLC. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer