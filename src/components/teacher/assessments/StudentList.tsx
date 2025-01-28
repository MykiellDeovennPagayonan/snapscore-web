import { ArrowLeft } from "lucide-react";
import { Search } from "lucide-react";
import StudentPreview from "./StudentPreview";
import Link from "next/link";
import ImageUploader from "@/components/essay/ImageUploader";

interface StudentListProps {
  assessmentId: string;
  type: "essay" | "identification"
}

const studentResults = [
  { id: "eqdwads", name: "Student 1", score: 69 },
  { id: "eqddssdds", name: "Student 2", score: 100 },
  { id: "eqadds", name: "Student 3", score: 99 },
  { id: "eqdwads", name: "Student 4", score: 89 },
  { id: "esdsawads", name: "Student 5", score: 79 },
  { id: "eqadasdads", name: "Student 6", score: 69 },
];

export default function StudentList({assessmentId, type}: StudentListProps) {
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center gap-2 p-4">
        <Link href="/assessments">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold mr-auto">{type === "essay" ? "Sample Essay" : "Sample Identification"}</h1>
        <ImageUploader type={type} assessmentId={assessmentId}/>
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
        {studentResults.map((result, index) => (
          <StudentPreview key={index} type={type} assessmentId={assessmentId} resultId={result.id} name={result.name} score={result.score} />
        ))}
      </div>
    </div>
  )
}