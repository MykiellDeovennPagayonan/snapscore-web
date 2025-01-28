import Link from 'next/link';
import { FC } from 'react';
import Image from 'next/image';

const Navbar: FC = () => {
  return (
    <>
      <nav className="bg-gray-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <div className="flex items-center gap-8">
              <span className="text-5xl font-bold">SnapScore</span>
              <div className='flex flex-col items-center'>
                <span className="ml-2 text-lg text-gray-400">
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

            <div className="flex items-center space-x-4">
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
          </div>
        </div>

        <div className="bg-[#bdd5db] py-2">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 hidden md:flex space-x-6">
            <Link
              href="/pricing"
              className="text-lg font-semibold text-gray-50 hover:text-gray-200"
            >
              Pricing
            </Link>
            <Link
              href="/support"
              className="text-lg font-semibold text-gray-50 hover:text-gray-200"
            >
              Support
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;