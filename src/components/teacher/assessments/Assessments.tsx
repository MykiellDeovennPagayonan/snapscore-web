"use client";

import AssessmentsList from "./AssessmentsList";
import StudentList from "./StudentList";
import { JSX } from "react";
import { usePathname } from "next/navigation";
import CreateIdentificationAssessment from "./create/CreateIdentificationAssessment";
import CreateEssayAssessment from "./create/CreateEssayAssessment";
import IdentificationStudentResult from "./IdentificationStudentResult";
import EssayStudentResult from "./EssayStudentResult";
import EditEssayAssessment from "./edit/EditEssayAssessment";
import EditIdentificationAssessment from "./edit/EditIdentificationAssessment";

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
        if (pathname.includes("/results")) {
          return <EditIdentificationAssessment />
        }
        return <IdentificationStudentResult resultId={params.resultId}/>
      }
      if (pathname.includes("/essay")) {
        if (pathname.includes("/results")) {
          return <EditEssayAssessment />
        }
        return <EssayStudentResult resultId={params.resultId}/>
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