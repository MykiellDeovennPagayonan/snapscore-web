"use client"

import { useParams } from "next/navigation"
import TeacherAccount from "./TeacherAccount"
import TeacherProfile from "./TeacherProfile"
import Assessments from "./Assessments"
import AnswerSheets from "./AnswerSheets"
import AccountSettings from "./AccountSettings"
import { JSX } from "react"

interface TeacherLayoutProps {
  type: "assessment" | "answer sheets" | "account settings"
}

export default function TeacherLayout({type}: TeacherLayoutProps) {
  const params = useParams<{ id: string, studentId: string }>()

  function renderContent() : JSX.Element {
    switch(type) {
      case "assessment":
        return <Assessments params={params}/>
      case "answer sheets":
        return <AnswerSheets />
      case "account settings":
        return <AccountSettings />
    }
  }

  return (
    <div className="w-full flex flex-col max-w-5xl mx-auto my-12 p-6">
      <TeacherAccount />
      <div className="w-full flex flex-row">
        <TeacherProfile />
        {renderContent()}
      </div>
    </div>
  )
}