"use client";
import { useEffect, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import StudentPreview from "./StudentPreview";
import Link from "next/link";
import ImageUploader from "@/components/essay/ImageUploader";
import { fetchEssayResults, fetchIdentificationResults } from "../../../utils/getResults"
import { getAssessmentName } from "@/utils/getAssessmentName";

interface StudentListProps {
  assessmentId: string;
  type: "essay" | "identification";
}

interface Result {
  id: string;
  studentName: string;
  score: number;
  createdAt: Date;
}

export default function StudentList({ assessmentId, type }: StudentListProps) {
  const [results, setResults] = useState<Result[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assessmentName, setAssessmentName] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = type === "essay"
          ? await fetchEssayResults(assessmentId)
          : await fetchIdentificationResults(assessmentId);

        setResults(data.results);
      } catch (err) {
        setError("Failed to fetch results");
        console.error("Error fetching results:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchName = async () => {
      try {
        const name = await getAssessmentName(assessmentId, type);
        setAssessmentName(name);
      } catch (err) {
        setAssessmentName("Untitled Assessment");
        console.error("Error fetching assessment name:", err);
      }
    };

    fetchResults();
    fetchName();
  }, [assessmentId, type]);

  const filteredResults = results.filter((result) =>
    result.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center gap-2 p-4">
        <Link href="/assessments" className="hover:opacity-80 transition-opacity">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold mr-auto">{assessmentName}</h1>
        <ImageUploader type={type} assessmentId={assessmentId} />
      </div>

      <div className="p-4">
        <div className="flex items-center bg-white rounded-lg p-2 border border-black">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name..."
            className="bg-transparent flex-1 px-2 outline-none text-sm"
          />
        </div>
      </div>

      {filteredResults.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          No results found
        </div>
      ) : (
        <div className="space-y-2 p-4">
          {filteredResults.map((result) => (
            <StudentPreview
              key={result.id}
              type={type}
              assessmentId={assessmentId}
              resultId={result.id}
              name={result.studentName}
              score={result.score}
            />
          ))}
        </div>
      )}
    </div>
  );
}