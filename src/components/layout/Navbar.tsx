"use client"
import Link from 'next/link';
import { FC, useState } from 'react';
import Image from 'next/image';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../lib/firebase/init";

const Navbar: FC = () => {
  const [user, loading] = useAuthState(auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-600 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo and OpenAI section */}
          <div className="flex items-center gap-2 sm:gap-8">
            <Link href={"/"}>
              <span className="text-2xl sm:text-3xl lg:text-5xl font-bold">SnapScore</span>
            </Link>
            <div className='hidden sm:flex flex-col items-center'>
              <span className="ml-2 text-sm sm:text-lg text-gray-400">
                Powered by:
              </span>
              <Image
                src="/openai.svg"
                alt="OpenAI Logo"
                width={28}
                height={28}
                className="ml-1"
              />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-gray-700"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop navigation */}
          {(!loading && !user) && (
            <div className="hidden sm:flex items-center space-x-4">
              <Link
                href="/auth/register"
                className="bg-[#bdd5db] text-gray-900 font-semibold px-4 py-2 rounded-md text-lg hover:bg-[#cadee3]"
              >
                Register
              </Link>
              <Link
                href="/auth/login"
                className="bg-[#bdd5db] text-gray-900 font-semibold px-4 py-2 rounded-md text-lg hover:bg-[#cadee3]"
              >
                Log In
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (!loading && !user) && (
          <div className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/auth/register"
                className="block bg-[#bdd5db] text-gray-900 font-semibold px-4 py-2 rounded-md text-base hover:bg-[#cadee3] mb-2"
              >
                Register
              </Link>
              <Link
                href="/auth/login"
                className="block bg-[#bdd5db] text-gray-900 font-semibold px-4 py-2 rounded-md text-base hover:bg-[#cadee3]"
              >
                Log In
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;