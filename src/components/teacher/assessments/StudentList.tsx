/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import StudentPreview from "./StudentPreview";
import Link from "next/link";
import ImageUploader from "@/components/essay/ImageUploader";
import { fetchEssayResults, fetchIdentificationResults } from "../../../utils/getResults"
import { getEssayAssessmentById } from "@/utils/getAssessmentById";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [assessmentLoading, setAssessmentLoading] = useState(true);
  const [nameLoading, setNameLoading] = useState(true)
  // const [error, setError] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<EssayAssessment>();

  useEffect(() => {
    const fetchResults = async () => {
      setAssessmentLoading(true);
      try {
        const data = type === "essay"
          ? await fetchEssayResults(assessmentId)
          : await fetchIdentificationResults(assessmentId);

        setResults(data.results);
      } catch (err) {
        console.error("Error fetching results:", err);
      } finally {
        setAssessmentLoading(false);
      }
    };

    const fetchName = async () => {
      setNameLoading(true)
      try {
        const assessment = await getEssayAssessmentById(assessmentId, type);
        console.log(assessment)
        setAssessment(assessment);
      } catch (err) {
        console.error("Error fetching assessment name:", err);
      } finally {
        setNameLoading(false)
      }
    };

    fetchResults();
    fetchName();
  }, [assessmentId, type]);

  const filteredResults = results.filter((result) =>
    result.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center gap-2 p-4">
        <Link href="/assessments" className="hover:opacity-80 transition-opacity">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        {nameLoading ?
          <Skeleton className="w-full h-10" />
          :
          <h1 className="text-3xl font-bold mr-auto">{assessment ? assessment.name : "Untitled Assessment"}</h1>
        }
        {type === "essay" && assessment ? 
      <ImageUploader type={type} assessmentId={assessmentId} essayCriteria={assessment.essayCriteria}/>
      :
      <ImageUploader type={type} assessmentId={assessmentId} />  
      }
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
          {assessmentLoading ?
            <div className="space-y-2">
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-12" />
            </div>
            :
            filteredResults.map((result) => (
              <StudentPreview
                key={result.id}
                type={type}
                assessmentId={assessmentId}
                resultId={result.id}
                name={result.studentName}
                score={result.score}
              />
            ))
          }
        </div>
      )}
    </div>
  );
}