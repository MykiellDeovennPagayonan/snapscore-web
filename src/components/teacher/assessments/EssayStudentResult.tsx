"use client"
import { useState, useEffect } from 'react';
import { Eye, Check, ArrowLeft } from "lucide-react";
import Link from 'next/link';
import { getEssayResultById } from '@/utils/getResults'; 

const EssayStudentResult = ({ resultId }: { resultId: string }) => {
  const [result, setResult] = useState<EssayResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadResult = async () => {
      try {
        const data = await getEssayResultById(resultId);
        setResult(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load result');
      } finally {
        setLoading(false);
      }
    };

    loadResult();
  }, [resultId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!result) return <div>No result found</div>;

  // const handleCriteriaScoreChange = async (
  //   questionResultId: string,
  //   criteriaResultId: string,
  //   newScore: number
  // ) => {
  //   try {
  //     // Add API call to update criteria score
  //     // Update local state after successful API call
  //     setResult(prev => {
  //       if (!prev) return prev;
  //       return {
  //         ...prev,
  //         questionResults: prev.questionResults.map(qr => ({
  //           ...qr,
  //           essayCriteriaResults: qr.essayCriteriaResults.map(cr => 
  //             cr.id === criteriaResultId 
  //               ? { ...cr, score: newScore }
  //               : cr
  //           )
  //         }))
  //       };
  //     });
  //   } catch (err) {
  //     console.log(err)
  //     setError('Failed to update score');
  //   }
  // };

  return (
    <div className="w-full p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/assessments">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold ml-2">{result.assessment.name}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2"><Eye /></button>
          <button className="p-2"><Check /></button>
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

        {/* {result.paperImage && (
          <div>
            <label className="text-gray-600 block mb-1">Student Paper</label>
            <div className="relative h-64 w-full">
              <Image
                src={result.paperImage}
                alt="Student Paper"
                fill
                className="object-contain rounded-md"
              />
            </div>
          </div>
        )} */}

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
                  Question Score: {qr.score}
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
                        readOnly
                        // onChange={(e) => handleCriteriaScoreChange(
                        //   qr.id,
                        //   cr.id,
                        //   parseInt(e.target.value)
                        // )}
                        className="w-16 p-1 border rounded-md text-center"
                        min="0"
                      />
                      <span className="mr-2">/ {cr.maxScore}</span>
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
          Total Score: {result.score}
        </span>
      </div>
    </div>
  );
};

export default EssayStudentResult;