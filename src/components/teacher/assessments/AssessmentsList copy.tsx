import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../lib/firebase/init";
import AssessmentPreview from "./AssessmentPreview";
import NewAssessment from "./NewAssessment";

import { getAllAssessmentsByUser, Assessment } from "@/utils/getAllAssessmentsByUser";

export default function AssessmentsList() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Firebase auth state hook
  const [user] = useAuthState(auth);

  // Fetch assessments when the user is authenticated
  useEffect(() => {
    if (user) {
      async function fetchAssessments() {
        try {
          if (user) {
            const data = await getAllAssessmentsByUser(user.uid);  // Use user.uid for the userId
            setAssessments(data);
          }
        } catch (error) {
          console.error("Failed to fetch assessments:", error);
        }
      }

      fetchAssessments();
    }
  }, [user])

  const filteredAssessments = assessments.filter((assessment) =>
    assessment.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col gap-2 p-4">
        <h1 className="text-3xl font-bold">Assessments</h1>
        <p className="text-sm">Edit and view your assessments here.</p>
      </div>
      <div className="p-4">
        <div className="flex items-center bg-white rounded-lg p-2 border border-black">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search Results"
            className="bg-transparent flex-1 px-2 outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2 p-4">
        {filteredAssessments.length > 0 ? (
          filteredAssessments.map((assessment, index) => (
            <AssessmentPreview
              key={index}
              id={assessment.id}
              title={assessment.title}
              type={assessment.type}
            />
          ))
        ) : (
          <p>No assessments found.</p>
        )}
        <NewAssessment />
      </div>
    </div>
  );
}
