import Login from "@/components/auth/Login"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export default function Page() {

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navbar />
      <Login />
      <Footer />
    </div>
  )
}