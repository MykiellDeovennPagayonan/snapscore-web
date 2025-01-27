import { Search } from "lucide-react";
import AssessmentPreview from "./AssessmentPreview";

const assessments = [
  {id: "assasssaa", title: "Sample Essay"},
  {id: "ssssasaaas", title: "Sample Identification"}
]

export default function AssessmentsList() {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col gap-2 p-4">
        <h1 className="text-3xl font-bold">Assessments</h1>
        <p className="text-sm"> Edit and view your assessments here.</p>
      </div>
      <div className="p-4">
        <div className="flex items-center bg-white rounded-lg p-2 border border-black">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Results"
            className="bg-transparent flex-1 px-2 outline-none text-sm"
          />
        </div>
      </div>
      <div className="space-y-2 p-4">
        {assessments.map((assessment, index) => (
          <AssessmentPreview key={index} id={assessment.id} title={assessment.title}/>
        ))}
      </div>
    </div>
  )
}