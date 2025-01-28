"use client";

import AssessmentsList from "./AssessmentsList";
import StudentList from "./StudentList";
import { JSX } from "react";
import { usePathname } from "next/navigation";
import CreateIdentificationAssessment from "./create/CreateIdentificationAssessment";
import CreateEssayAssessment from "./create/CreateEssayAssessment";
import IdentificationStudentResult from "./IdentificationStudentResult";
import EssayStudentResult from "./EssayStudentResult";

interface AssessmentsProps {
  params: {
    id: string;
    resultId: string;
    type: "essay" | "identification"
  }
}

export default function Assessments({params} : AssessmentsProps) {
  const pathname = usePathname()

  function renderContent() : JSX.Element {
    if (pathname === "/assessments/create/identification") {
      return <CreateIdentificationAssessment />
    }
    if (pathname === "/assessments/create/essay") {
      return <CreateEssayAssessment />
    }
    if (params.id && params.resultId) {
      if (pathname.includes("/identification")) {
        return <IdentificationStudentResult />
      }
      if (pathname.includes("/essay")) {
        return <EssayStudentResult />
      }
    }
    if (params.id) {
      return <StudentList assessmentId={params.id} type={params.type}/>
    }
    return <AssessmentsList/>
  }

  return (
    renderContent()
  )
}