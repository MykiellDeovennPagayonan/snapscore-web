/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import { getEssayResultById } from '@/utils/getResults';
import {
  updateEssayCriteriaResult,
  updateEssayQuestionResult,
  updateEssayResult,
} from '@/utils/updateEssayResults';
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from '@/hooks/use-toast';

const EssayStudentResult = ({ resultId }: { resultId: string }) => {
  const [result, setResult] = useState<EssayResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backLink, setBackLink] = useState<string>("/assessments")
  const { toast } = useToast();
  const router = useRouter()

  useEffect(() => {
    const loadResult = async () => {
      try {
        const data = await getEssayResultById(resultId);
        setResult(data);
        setBackLink(`/assessments/${data.assessment.id}/essay`)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load result');
      } finally {
        setLoading(false);
      }
    };

    loadResult();
  }, [resultId]);

  const handleCriteriaScoreChange = (
    questionResultId: string,
    criteriaResultId: string,
    newScore: number
  ) => {
    setResult((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        questionResults: prev.questionResults.map((qr) => {
          if (qr.id === questionResultId) {
            return {
              ...qr,
              essayCriteriaResults: qr.essayCriteriaResults.map((cr) =>
                cr.id === criteriaResultId ? { ...cr, score: newScore } : cr
              ),
            };
          }
          return qr;
        }),
      };
    });
  };

  const handleSave = async () => {
    if (!result) return;
    setSaving(true);
    try {
      for (const qr of result.questionResults) {
        for (const cr of qr.essayCriteriaResults) {
          await updateEssayCriteriaResult(cr.id, cr.score);
        }
        const newQuestionScore = qr.essayCriteriaResults.reduce(
          (acc, cr) => acc + cr.score,
          0
        );
        if (newQuestionScore !== qr.score) {
          await updateEssayQuestionResult(qr.id, newQuestionScore);
        }
      }
      const newTotalScore = result.questionResults.reduce((acc, qr) => {
        const questionScore = qr.essayCriteriaResults.reduce(
          (sum, cr) => sum + cr.score,
          0
        );
        return acc + questionScore;
      }, 0);
      if (newTotalScore !== result.score) {
        await updateEssayResult(result.id, newTotalScore);
      }
      toast({
        title: "Saved successfully",
        description: "Your changes have been saved.",
      });
    } catch (err: any) {
      toast({
        title: "Save failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-4 w-full">
        <div className="flex items-center space-x-2">
          <Skeleton className="w-6 h-6" />
          <Skeleton className="w-40 h-8" />
        </div>
        <Skeleton className="w-full h-10" />
        <div className="space-y-4">
          <Skeleton className="w-full h-32" />
          <Skeleton className="w-full h-32" />
        </div>
      </div>
    );
  }

  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!result) return <div className="p-4">No result found</div>;

  const maxScore = result.questionResults.reduce((acc, qr) => {
    const questionMax = qr.essayCriteriaResults.reduce(
      (sum, cr) => sum + cr.criteria.maxScore,
      0
    );
    return acc + questionMax;
  }, 0);

  return (
    <div className="w-full p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <ArrowLeft className="w-5 h-5 hover:cursor-pointer" onClick={() => router.push(backLink)} />
          <h1 className="text-2xl font-bold ml-2">{result.assessment.name}</h1>
        </div>
        <div className="flex items-center space-x-4">
          {/* <button className="p-2">
            <Eye />
          </button> */}
          <button className="p-2" onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="text-gray-600 block mb-1">Student Name</label>
          <div className="relative">
            <input
              type="text"
              value={result.studentName}
              readOnly
              className="w-full p-2 border rounded-md pl-4"
            />
          </div>
        </div>

        {result.questionResults.map((qr) => (
          <div key={qr.id} className="space-y-4 border p-4 rounded-md">
            <div>
              <label className="text-gray-600 block mb-1">Answer</label>
              <div className="relative">
                <textarea
                  value={qr.answer}
                  readOnly
                  className="w-full p-2 border rounded-md pl-4 min-h-[100px]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Criteria Scores</span>
                <span className="text-gray-600">
                  Question Score:{" "}
                  {qr.essayCriteriaResults.reduce((acc, cr) => acc + cr.score, 0)}
                </span>
              </div>

              <div className="space-y-3">
                {qr.essayCriteriaResults.map((cr) => (
                  <div key={cr.id} className="flex justify-between items-center">
                    <span className="text-gray-600">
                      Criteria {cr.criteria.criteria}
                    </span>
                    <div className="flex items-center">
                      <span className="mr-2">Score:</span>
                      <input
                        type="number"
                        value={cr.score}
                        onChange={(e) =>
                          handleCriteriaScoreChange(
                            qr.id,
                            cr.id,
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-[40px] p-1 border rounded-md text-center"
                        min="0"
                        max={cr.criteria.maxScore}
                      />
                      <span className="mr-2">/ {cr.criteria.maxScore}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end items-center">
        <span className="text-gray-600 text-lg font-semibold">
          Total Score:{" "}
          {result.questionResults.reduce(
            (acc, qr) =>
              acc + qr.essayCriteriaResults.reduce((sum, cr) => sum + cr.score, 0),
            0
          )}{" "}
          / {maxScore}
        </span>
      </div>
    </div>
  );
};

export default EssayStudentResult;