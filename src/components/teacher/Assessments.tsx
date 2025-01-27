import AssessmentsList from "./AssessmentsList";
import StudentList from "./StudentList";
import { JSX } from "react";

interface AssessmentsProps {
  params: {
    id: string;
    studentId: string;
  }
}

export default function Assessments({params} : AssessmentsProps) {

  console.log(params)

  function renderContent() : JSX.Element {
    if (params.id) {
      return <StudentList/>
    }
    return <AssessmentsList/>
  }

  return (
    renderContent()
  )
}