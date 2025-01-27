'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function TeacherProfile() {
  const pathname = usePathname()
  return (
    <div className="w-1/3 flex flex-col items-center space-y-6">
      <div className="w-3/5 bg-white border border-black aspect-square rounded-full"></div>
      <div className="w-full flex flex-col items-center">
        <h2 className="font-bold text-2xl"> Jovel Young </h2>
        <p className="font-semibold text-gray-500"> jovel.young@tupv.edu.ph </p>
      </div>

      <div className="w-full flex flex-col items-center space-y-4">
        <Link
          href="/assessments"
          className={`font-semibold text-lg ${
            pathname === "/assessments" ? "text-blue-500" : "text-gray-900"
          }`}
        >
          Assessments
        </Link>
        <Link
          href="/answer-sheets"
          className={`font-semibold text-lg ${
            pathname === "/answer-sheets" ? "text-blue-500" : "text-gray-900"
          }`}
        >
          Answer Sheets
        </Link>
        <Link
          href="/account-settings"
          className={`font-semibold text-lg ${
            pathname === "/account-settings" ? "text-blue-500" : "text-gray-900"
          }`}
        >
          Account Settings
        </Link>
      </div>
    </div>
  )
}