import { ArrowLeft } from "lucide-react";
import { Search } from "lucide-react";
import StudentPreview from "./StudentPreview";

const students = [
  { name: "Student 1", score: 69 },
  { name: "Student 2", score: 100 },
  { name: "Student 3", score: 99 },
  { name: "Student 4", score: 89 },
  { name: "Student 5", score: 79 },
  { name: "Student 6", score: 69 },
];


export default function StudentList() {
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center gap-2 p-4">
        <ArrowLeft className="w-5 h-5" />
        <h1 className="text-3xl font-bold">Sample Essay</h1>
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
        {students.map((student, index) => (
          <StudentPreview key={index} name={student.name} score={student.score} />
        ))}
      </div>
    </div>
  )
}