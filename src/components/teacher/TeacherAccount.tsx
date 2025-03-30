import { Separator } from "../ui/separator"
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase/init";

export default function TeacherAccount() {
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User logged out successfully");
        window.location.href = "/auth/login";
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <div className="w-full flex flex-col mb-4">
      <div className="w-full flex flex-row items-center justify-between mb-2">
        <h2 className="font-bold text-3xl">User Account</h2>
        <button
          className="bg-[#bdd5db] hover:bg-[#cadee3] text-black font-bold px-6 py-1 rounded-full"
          onClick={handleLogout}
        >
          log out
        </button>
      </div>
      <Separator className="bg-black h-[2px]" />
    </div>
  )
}