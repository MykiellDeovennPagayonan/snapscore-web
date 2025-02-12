'use client';

import { useRouter } from 'next/navigation';
import { User, Key } from 'lucide-react';
import { usePathname } from "next/navigation";
import ChangePassword from './ChangePassword';
import PersonalInformation from './PersonalInformation';

export default function AccountSettings() {
  const router = useRouter();
  const pathname  = usePathname();

  if (pathname.includes("/personal-information")) {
    return <PersonalInformation />
  }

  if (pathname.includes("/change-password")) {
    return <ChangePassword />
  }

  return (
    <div className="max-w-4xl w-full p-6">
      <h1 className="text-2xl font-bold">Account Settings</h1>
      <p className="text-gray-600 mb-4">Manage your account information and settings.</p>

      <div className="space-y-4">
        <button
          onClick={() => router.push('/account-settings/personal-information')}
          className="flex items-center w-full p-4 text-lg font-bold border rounded-2xl bg-white"
        >
          <User className="w-5 h-5 mr-3" />
          Personal Information
        </button>

        <button
          onClick={() => router.push('/account-settings/change-password')}
          className="flex items-center w-full p-4 text-lg font-bold border rounded-2xl bg-white"
        >
          <Key className="w-5 h-5 mr-3" />
          Change Password
        </button>
      </div>
    </div>
  );
}
