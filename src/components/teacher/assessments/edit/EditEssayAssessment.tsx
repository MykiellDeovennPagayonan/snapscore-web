/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { useParams, usePathname, useRouter } from "next/navigation";

interface Rubric {
  score: string;
  description: string;
}

interface EssayCriteria {
  id: number;
  criteria: string;
  maxScore: number;
  rubrics: Rubric[];
}

interface EssayQuestion {
  id: number;
  question: string;
  essayCriteria: EssayCriteria[];
}

const EditEssayAssessment = () => {
  const [essayName, setEssayName] = useState<string>("");
  const [questionCount, setQuestionCount] = useState<number>(1);
  const [questions, setQuestions] = useState<EssayQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const router = useRouter();
  const { id: assessmentId } = useParams();
  const pathname = usePathname();
  // const [user] = useAuthState(auth);

  const handleNavigation = () => {
    const pathSegments = pathname.split("/");
    pathSegments.pop();
    const newPath = pathSegments.join("/");

    router.push(newPath);
  };

  useEffect(() => {
    if (!assessmentId) return;
    const fetchAssessment = async () => {
      setInitialLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;
        const response = await fetch(`${baseUrl}/essay-assessment/${assessmentId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch assessment");
        }
        const data = await response.json();

        setEssayName(data.name);

        const transformedQuestions: EssayQuestion[] = data.essayQuestions.map(
          (q: any, qIndex: number) => ({
            id: qIndex + 1,
            question: q.question,
            essayCriteria: q.essayCriteria.map((c: any, cIndex: number) => ({
              id: cIndex + 1,
              criteria: c.criteria,
              maxScore: c.maxScore,
              rubrics: c.rubrics.map((r: any) => ({
                score: r.score,
                description: r.description,
              })),
            })),
          })
        );

        setQuestions(transformedQuestions);
        setQuestionCount(transformedQuestions.length);
      } catch (error) {
        console.error("Error fetching assessment:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchAssessment();
  }, [assessmentId]);

  const handleQuestionChange = (questionId: number, text: string) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === questionId ? { ...question, question: text } : question
      )
    );
  };

  const handleCriteriaChange = (
    questionId: number,
    criteriaId: number,
    field: "criteria" | "maxScore",
    value: string | number
  ) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === questionId
          ? {
            ...question,
            essayCriteria: question.essayCriteria.map((criteria) =>
              criteria.id === criteriaId ? { ...criteria, [field]: value } : criteria
            ),
          }
          : question
      )
    );
  };

  const handleRubricChange = (
    questionId: number,
    criteriaId: number,
    rubricIndex: number,
    field: "score" | "description",
    value: string
  ) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === questionId
          ? {
            ...question,
            essayCriteria: question.essayCriteria.map((criteria) =>
              criteria.id === criteriaId
                ? {
                  ...criteria,
                  rubrics: criteria.rubrics.map((rubric, index) =>
                    index === rubricIndex ? { ...rubric, [field]: value } : rubric
                  ),
                }
                : criteria
            ),
          }
          : question
      )
    );
  };

  const handleAddCriteria = (questionId: number) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === questionId
          ? {
            ...question,
            essayCriteria: [
              ...question.essayCriteria,
              {
                id: question.essayCriteria.length + 1,
                criteria: "New Criteria",
                maxScore: 0,
                rubrics: [
                  { score: "0", description: "Poor performance" },
                  { score: "0", description: "Fair performance" },
                ],
              },
            ],
          }
          : question
      )
    );
  };

  const handleDeleteCriteria = (questionId: number, criteriaId: number) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === questionId
          ? {
            ...question,
            essayCriteria: question.essayCriteria.filter(
              (criteria) => criteria.id !== criteriaId
            ),
          }
          : question
      )
    );
  };

  const handleAddRubricLevel = (questionId: number, criteriaId: number) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === questionId
          ? {
            ...question,
            essayCriteria: question.essayCriteria.map((criteria) =>
              criteria.id === criteriaId
                ? {
                  ...criteria,
                  rubrics: [
                    ...criteria.rubrics,
                    { score: "0", description: "New level description" },
                  ],
                }
                : criteria
            ),
          }
          : question
      )
    );
  };

  const handleQuestionCountChange = (value: number) => {
    setQuestionCount(value);
    setQuestions((prev) => {
      if (value > prev.length) {
        return [
          ...prev,
          ...Array.from({ length: value - prev.length }, (_, i) => ({
            id: prev.length + i + 1,
            question: "",
            essayCriteria: [
              {
                id: 1,
                criteria: "Content and Organization",
                maxScore: 20,
                rubrics: [
                  { score: "20", description: "Excellent performance" },
                  { score: "10", description: "Fair performance" },
                ],
              },
            ],
          })),
        ];
      } else {
        return prev.slice(0, value);
      }
    });
  };

  const calculateTotalScore = (questionId: number): number => {
    const question = questions.find((q) => q.id === questionId);
    return question?.essayCriteria.reduce((sum, criteria) => sum + criteria.maxScore, 0) || 0;
  };

  const handleSave = async () => {
    if (!assessmentId) return;
    setIsLoading(true);

    // Prepare the payload similar to the create payload.
    // Note: We only send what your backend expects to update.
    const transformedData = {
      name: essayName,
      // You might not need to send the firebaseId on update.
      // If your endpoint supports nested updates, include questions.
      questions: questions.map((q) => ({
        question: q.question,
        essayCriteria: q.essayCriteria.map((c) => ({
          criteria: c.criteria,
          maxScore: c.maxScore,
          rubrics: c.rubrics,
        })),
      })),
    };

    try {
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;
      const response = await fetch(`${baseUrl}/essay-assessment/${assessmentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transformedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update assessment");
      }

      // const responseData = await response.json();
      // Redirect to the updated assessment page or dashboard
      // router.push(`/assessments/${assessmentId}/essay`);
    } catch (error) {
      console.error("Failed to update essay assessment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (initialLoading) {
    return <p>Loading assessment data...</p>;
  }

  return (
    <div className="w-full p-4">
      <div className="flex items-center mb-6">
        <Link href="/assessments">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold">Edit: {essayName}</h1>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-gray-600">Essay Name:</label>
          <input
            type="text"
            value={essayName}
            onChange={(e) => setEssayName(e.target.value)}
            className="w-full p-2 border rounded-md pl-4"
            placeholder="Enter Essay Name"
          />
        </div>

        <div>
          <label className="text-gray-600">Number of Questions:</label>
          <select
            value={questionCount}
            onChange={(e) => handleQuestionCountChange(Number(e.target.value))}
            className="w-32 p-2 border rounded-md appearance-none pl-4"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </div>

        {questions.map((question) => (
          <div key={question.id} className="space-y-4 border-b pb-4">
            <div>
              <label className="text-gray-600">Question {question.id}:</label>
              <input
                type="text"
                value={question.question}
                onChange={(e) => handleQuestionChange(question.id, e.target.value)}
                className="w-full p-2 border rounded-md pl-4"
                placeholder={`Question ${question.id}`}
              />
            </div>

            <div className="space-y-4">
              <label className="text-gray-600">Criteria and Rubrics:</label>
              {question.essayCriteria.map((criteria) => (
                <div key={criteria.id} className="space-y-2 border p-4 rounded-md">
                  <div className="flex space-x-2 items-center">
                    <input
                      type="text"
                      value={criteria.criteria}
                      onChange={(e) =>
                        handleCriteriaChange(question.id, criteria.id, "criteria", e.target.value)
                      }
                      className="flex-1 p-2 border rounded-md"
                      placeholder="Criteria name"
                    />
                    <p>Max Score:</p>
                    <input
                      type="number"
                      value={criteria.maxScore}
                      onChange={(e) =>
                        handleCriteriaChange(
                          question.id,
                          criteria.id,
                          "maxScore",
                          Number(e.target.value)
                        )
                      }
                      className="w-24 p-2 border rounded-md"
                      placeholder="Max score"
                    />
                    {question.essayCriteria.length > 1 && (
                      <Button
                        onClick={() => handleDeleteCriteria(question.id, criteria.id)}
                        variant="destructive"
                      >
                        ×
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {criteria.rubrics.map((rubric, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="text"
                          value={rubric.score}
                          onChange={(e) =>
                            handleRubricChange(
                              question.id,
                              criteria.id,
                              index,
                              "score",
                              e.target.value
                            )
                          }
                          className="w-24 p-2 border rounded-md"
                          placeholder="Score"
                        />
                        <input
                          type="text"
                          value={rubric.description}
                          onChange={(e) =>
                            handleRubricChange(
                              question.id,
                              criteria.id,
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          className="flex-1 p-2 border rounded-md"
                          placeholder="Description"
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => handleAddRubricLevel(question.id, criteria.id)}
                      className="text-gray-600 text-sm"
                      type="button"
                    >
                      + Add Rubric Level
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => handleAddCriteria(question.id)}
                className="text-gray-600"
                type="button"
              >
                + Add Criteria
              </button>
            </div>

            <div className="flex justify-end">
              <span className="font-medium">
                Question Total: {calculateTotalScore(question.id)}
              </span>
            </div>
          </div>
        ))}

        <div className="flex space-x-4 mt-6">
          <button
            onClick={handleNavigation}
            disabled={isLoading}
            className={`flex-1 py-2 px-4 rounded-md transition-all ${isLoading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            Results
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEssayAssessment;
