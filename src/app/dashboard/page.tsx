"use client"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from '../../lib/firebase/init'
import { signOut } from "firebase/auth"

export default function Page() {
  const [user, loading] = useAuthState(auth)

  console.log("loading", loading)
  console.log(user)

  return (
    <div className="w-full h-screen bg-green-200">
      <button onClick={() => signOut(auth)}> Log out </button>
      <h1>Dashboard</h1>
    </div>
  )
}