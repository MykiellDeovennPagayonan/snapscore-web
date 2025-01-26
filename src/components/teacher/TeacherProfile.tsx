import Link from "next/link"

export default function TeacherProfile() {
  return (
    <div className="w-1/3 flex flex-col items-center space-y-6">
      <div className="w-3/5 bg-white border border-black aspect-square rounded-full"></div>
      <div className="w-full flex flex-col items-center">
        <h2 className="font-bold text-2xl"> Jovel Young </h2>
        <p className="font-semibold text-gray-500"> jovel.young@tupv.edu.ph </p>
      </div>

      <div className="w-full flex flex-col items-center space-y-4">
        <Link
          href="/register"
          className="text-gray-900 font-semibold text-lg"
        >
          Assessments
        </Link>
        <Link
          href="/register"
          className="text-gray-900 font-semibold text-lg"
        >
          Answer Sheets
        </Link>
        <Link
          href="/register"
          className="text-gray-900 font-semibold text-lg"
        >
          Account Settings
        </Link>
      </div>
    </div>
  )
}