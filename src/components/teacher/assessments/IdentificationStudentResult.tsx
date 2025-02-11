/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useRef } from 'react';
import { Check, ArrowLeft, Loader2, MoreVertical } from "lucide-react";
import { getIdentificationResultById } from '@/utils/getResults';
import {
  updateIdentificationResult,
  updateIdentificationQuestionResult,
} from '@/utils/updateIdentificationResults';
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const IdentificationStudentResult = ({ resultId }: { resultId: string }) => {
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [backLink, setBackLink] = useState<string>("/assessments");
  // activePopup holds the id of the question result whose dropdown is open
  const [activePopup, setActivePopup] = useState<string | null>(null);
  // A ref to the currently open dropdown container
  const activeDropdownRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const loadResult = async () => {
      try {
        const data = await getIdentificationResultById(resultId);
        setBackLink(`/assessments/${data.assessment.id}/identification`);
        setResult(data);
      } catch (err) {
        console.error('Error fetching identification result:', err);
        toast({
          title: "Error",
          description: "Failed to load identification result",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadResult();
  }, [resultId, toast]);

  // Close the dropdown when clicking outside of it.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        activeDropdownRef.current &&
        !activeDropdownRef.current.contains(event.target as Node)
      ) {
        setActivePopup(null);
      }
    }
    if (activePopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activePopup]);

  // Calculate total score as the count of correct answers.
  const calculateTotalScore = (): number => {
    if (!result) return 0;
    return result.questionResults.filter((qr) => qr.isCorrect).length;
  };

  // Update the correctness flag of a given question result.
  const handleSetCorrectness = (questionResultId: string, isCorrect: boolean) => {
    setResult((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        questionResults: prev.questionResults.map((qr) =>
          qr.id === questionResultId ? { ...qr, isCorrect } : qr
        ),
      };
    });
    // Close the dropdown after updating.
    setActivePopup(null);
  };

  const handleSaveChanges = async () => {
    if (!result) return;
    setSaving(true);
    try {
      await updateIdentificationResult(result.id, { studentName: result.studentName });
      const updatePromises = result.questionResults.map((qr) =>
        updateIdentificationQuestionResult(qr.id, { isCorrect: qr.isCorrect })
      );
      await Promise.all(updatePromises);
      toast({ title: 'Saved changes successfully!' });
    } catch (error: any) {
      console.error("Error saving changes:", error);
      toast({
        title: 'Error saving changes',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-6 w-1/2 mb-4" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (!result) return <div className="p-4">No result found</div>;

  return (
    <div className="w-full p-4">
      {/* Header with a back link and the assessment name */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <ArrowLeft
            className="w-5 h-5 hover:cursor-pointer"
            onClick={() => router.push(backLink)}
          />
          <h1 className="text-2xl font-bold ml-2">{result.assessment.name}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2" onClick={handleSaveChanges} disabled={saving}>
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Check />
            )}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="text-gray-600">Student</label>
        <div className="relative">
          <input
            type="text"
            value={result.studentName}
            onChange={(e) =>
              setResult((prev) =>
                prev ? { ...prev, studentName: e.target.value } : prev
              )
            }
            className="w-full p-2 border rounded-md pl-4"
            placeholder="Student 1"
          />
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-600">Results</span>
        <span className="text-gray-600">
          Total Score: {calculateTotalScore()}/{result.questionResults.length}
        </span>
      </div>

      <div className="space-y-2">
        {result.questionResults.map((qr, index) => (
          <div
            key={qr.id}
            className="flex items-center justify-between border rounded-md p-2"
          >
            <div className="flex items-center flex-1">
              <span className="mr-2">{index + 1}.</span>
              <span className={qr.isCorrect ? 'text-green-600' : 'text-red-600'}>
                {qr.answer}
              </span>
            </div>
            {/* Dropdown container */}
            <div
              className="relative"
              ref={activePopup === qr.id ? activeDropdownRef : undefined}
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  // Toggle dropdown for this question result.
                  setActivePopup(activePopup === qr.id ? null : qr.id);
                }}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <MoreVertical className="w-5 h-5 text-gray-500" />
              </button>
              {activePopup === qr.id && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div
                    className="px-4 py-2 text-sm text-green-600 hover:bg-green-50 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSetCorrectness(qr.id, true);
                    }}
                  >
                    Right
                  </div>
                  <div
                    className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSetCorrectness(qr.id, false);
                    }}
                  >
                    Wrong
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IdentificationStudentResult;
