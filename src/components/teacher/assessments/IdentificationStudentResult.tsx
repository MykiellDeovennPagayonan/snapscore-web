/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from 'react';
import { Check, ArrowLeft, Loader2 } from "lucide-react";
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
  const [backLink, setBackLink] = useState<string>("/assessments")
  const { toast } = useToast();
  const router = useRouter()

  useEffect(() => {
    const loadResult = async () => {
      try {
        const data = await getIdentificationResultById(resultId);
        setBackLink(`/assessments/${data.assessment.id}/identification`)
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

  // Calculate total score as the count of correct answers.
  const calculateTotalScore = (): number => {
    if (!result) return 0;
    return result.questionResults.filter((qr) => qr.isCorrect).length;
  };

  // Toggle the correctness of a given question result.
  const toggleQuestionCorrectness = (questionResultId: string) => {
    setResult((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        questionResults: prev.questionResults.map((qr) =>
          qr.id === questionResultId
            ? { ...qr, isCorrect: !qr.isCorrect }
            : qr
        ),
      };
    });
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
          <ArrowLeft className="w-5 h-5 hover:cursor-pointer" onClick={() => router.push(backLink)} />
          <h1 className="text-2xl font-bold ml-2">{result.assessment.name}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            className="p-2"
            onClick={handleSaveChanges}
            disabled={saving}
          >
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
              <span className="mr-2">{index + 1}. </span>
              <span className={qr.isCorrect ? 'text-green-600' : 'text-red-600'}>
                {qr.answer}
              </span>
            </div>
            <button
              onClick={() => toggleQuestionCorrectness(qr.id)}
              className="ml-2 px-2"
            >
              {/* The ⋮ button can be replaced with a proper options menu if needed */}
              ⋮
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IdentificationStudentResult;
