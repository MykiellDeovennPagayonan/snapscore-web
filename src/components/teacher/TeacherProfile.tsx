'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase/init"
import { getUserByFirebaseId } from "@/utils/getUserByFirebaseId"
import { useAuthState } from "react-firebase-hooks/auth"
import { Skeleton } from "../ui/skeleton"

export default function TeacherProfile() {
  const pathname = usePathname()
  const [firebaseUser] = useAuthState(auth)
  const [userData, setUserData] = useState<User | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!firebaseUser) return

      try {
        const data = await getUserByFirebaseId(firebaseUser.uid)
        setUserData(data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchUserData()
  }, [firebaseUser])

  return (
    <div className="w-1/3 flex flex-col items-center space-y-6 p-4">
      <div className="w-3/5 bg-white border border-black aspect-square rounded-full"></div>
      <div className="w-full flex flex-col items-center">
        {userData?.fullName ?
          <h2 className="font-bold text-2xl text-center">{userData.fullName}</h2>
          :
          <Skeleton className="w-full h-6 mb-6" />
        }
        {userData?.email ?
          <h2 className="font-semibold text-gray-500 text-center">{userData.email}</h2>
          :
          <Skeleton className="w-1/2 h-6" />
        }
      </div>

      <div className="w-full flex flex-col items-center space-y-4">
        <Link
          href="/assessments"
          className={`font-semibold text-lg ${pathname.includes("/assessments") ? "text-blue-500" : "text-gray-900"
            }`}
        >
          Assessments
        </Link>
        <Link
          href="/answer-sheets"
          className={`font-semibold text-lg ${pathname.includes("/answer-sheets") ? "text-blue-500" : "text-gray-900"
            }`}
        >
          Answer Sheets
        </Link>
        <Link
          href="/account-settings"
          className={`font-semibold text-lg ${pathname.includes("/account-settings") ? "text-blue-500" : "text-gray-900"
            }`}
        >
          Account Settings
        </Link>
      </div>
    </div>
  )
}