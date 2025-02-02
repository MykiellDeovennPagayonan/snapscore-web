import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../lib/firebase/init";
import AssessmentPreview from "./AssessmentPreview";
import NewAssessment from "./NewAssessment";
import { getAllAssessmentsByUser, Assessment } from "@/utils/getAllAssessmentsByUser";
import { getUserByFirebaseId } from "@/utils/getUserByFirebaseId";
import { Skeleton } from "@/components/ui/skeleton";

type User = {
  id: string;
  email: string;
  firebaseId: string;
  fullName: string;
}

export default function AssessmentsList() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      if (!user) return;

      try {
        const data = await getUserByFirebaseId(user.uid);
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    }

    fetchUserData();
  }, [user]);

  useEffect(() => {
    async function fetchAssessments() {
      if (!userData) return;

      try {
        const data = await getAllAssessmentsByUser(userData.id);
        setAssessments(data);
      } catch (error) {
        console.error("Failed to fetch assessments:", error);
      }
    }

    fetchAssessments();
  }, [userData]);

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
        {loading ?
          <div className="space-y-2">
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
          </div>
          :
          filteredAssessments.length > 0 ? (
            filteredAssessments.map((assessment) => (
              <AssessmentPreview
                key={assessment.id}
                id={assessment.id}
                title={assessment.title}
                type={assessment.type}
              />
            ))
          ) : (
            <p>No assessments found.</p>
          )
        }
        <NewAssessment />
      </div>
    </div>
  );
}