import AssessmentsList from "./AssessmentsList";
import StudentList from "./StudentList";
import { JSX } from "react";

interface AssessmentsProps {
  params: {
    id: string;
    resultId: string;
  }
}

export default function Assessments({params} : AssessmentsProps) {

  console.log(params)

  function renderContent() : JSX.Element {
    if (params.id) {
      return <StudentList assessmentId={params.id}/>
    }
    return <AssessmentsList/>
  }

  return (
    renderContent()
  )
}