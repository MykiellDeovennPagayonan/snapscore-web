import { Separator } from "../ui/separator"

export default function TeacherAccount() {
  return (
    <div className="w-full flex flex-col mb-4">
      <div className="w-full flex flex-row items-center justify-between mb-2">
        <h2 className="font-bold text-3xl"> Teacher Account </h2>
        <button className="bg-[#bdd5db] hover:bg-[#cadee3] text-black font-bold px-6 py-1 rounded-full"> log out </button>
      </div>
      <Separator className="bg-black h-[2px]"/>
    </div>
  )
}