"use client"

import { useParams } from "next/navigation"
import TeacherAccount from "./TeacherAccount"
import TeacherProfile from "./TeacherProfile"
import Assessments from "./Assessments"

interface TeacherLayoutProps {
  type: "assessment" | "answer sheets" | "account settings"
}

export default function TeacherLayout({type}: TeacherLayoutProps) {
  const params = useParams<{ id: string, studentId: string }>()

  console.log(params)

  return (
    <div className="w-full flex flex-col max-w-5xl mx-auto my-12 p-6">
      <TeacherAccount />
      <div className="w-full flex flex-row">
        <TeacherProfile />
        {type === "assessment" && <Assessments />}
      </div>
    </div>
  )
}