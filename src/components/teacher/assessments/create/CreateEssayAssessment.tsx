"use client"
import { useState } from 'react';
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { auth } from "../../../../lib/firebase/init";

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

const CreateEssayAssessment = () => {
  const [essayName, setEssayName] = useState<string>('Sample Essay');
  const [questionCount, setQuestionCount] = useState<number>(1);
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)
  const [questions, setQuestions] = useState<EssayQuestion[]>([
    {
      id: 1,
      question: '',
      essayCriteria: [
        {
          id: 1,
          criteria: 'Content',
          maxScore: 5,
          rubrics: [
            { score: '5', description: 'Insightful, well-developed ideas with strong, compelling support.' },
            { score: '4', description: 'Well-developed ideas with solid support.' },
            { score: '3', description: 'Some ideas developed; moderate supporting details.' },
            { score: '2', description: 'Ideas are weak or unclear; minimal support.' },
            { score: '1', description: 'Lacks clear ideas; little to no development.' }
          ]
        },
        {
          id: 2,
          criteria: 'Organization',
          maxScore: 5,
          rubrics: [
            { score: '5', description: 'Excellent structure; ideas flow logically and effectively.' },
            { score: '4', description: 'Well-organized with smooth transitions.' },
            { score: '3', description: 'Some logical flow but inconsistent.' },
            { score: '2', description: 'Weak organization; difficult to follow.' },
            { score: '1', description: 'No clear structure; ideas are scattered.' }
          ]
        },
        {
          id: 3,
          criteria: 'Style',
          maxScore: 5,
          rubrics: [
            { score: '5', description: 'Polished, sophisticated, and engaging style.' },
            { score: '4', description: 'Clear and engaging writing with good variety.' },
            { score: '3', description: 'Mostly clear, with occasional awkwardness.' },
            { score: '2', description: 'Weak or inconsistent style; some awkward phrasing.' },
            { score: '1', description: 'Poor sentence structure; unclear or awkward phrasing.' }
          ]
        },
        {
          id: 4,
          criteria: 'Mechanics',
          maxScore: 5,
          rubrics: [
            { score: '5', description: 'Virtually error-free and highly polished.' },
            { score: '4', description: 'Few minor errors.' },
            { score: '3', description: 'Some errors, but they don’t significantly impact understanding.' },
            { score: '2', description: 'Many errors that disrupt readability.' },
            { score: '1', description: 'Frequent grammar, spelling, or punctuation errors.' }
          ]
        }
      ]   
    }
  ]);

  const handleQuestionChange = (questionId: number, text: string) => {
    setQuestions(prev =>
      prev.map(question =>
        question.id === questionId ? { ...question, question: text } : question
      )
    );
  };

  const handleCriteriaChange = (questionId: number, criteriaId: number, field: 'criteria' | 'maxScore', value: string | number) => {
    setQuestions(prev =>
      prev.map(question =>
        question.id === questionId ? {
          ...question,
          essayCriteria: question.essayCriteria.map(criteria =>
            criteria.id === criteriaId ? { ...criteria, [field]: value } : criteria
          )
        } : question
      )
    );
  };

  const handleRubricChange = (questionId: number, criteriaId: number, rubricIndex: number, field: 'score' | 'description', value: string) => {
    setQuestions(prev =>
      prev.map(question =>
        question.id === questionId ? {
          ...question,
          essayCriteria: question.essayCriteria.map(criteria =>
            criteria.id === criteriaId ? {
              ...criteria,
              rubrics: criteria.rubrics.map((rubric, index) =>
                index === rubricIndex ? { ...rubric, [field]: value } : rubric
              )
            } : criteria
          )
        } : question
      )
    );
  };

  const handleAddCriteria = (questionId: number) => {
    setQuestions(prev =>
      prev.map(question =>
        question.id === questionId ? {
          ...question,
          essayCriteria: [
            ...question.essayCriteria,
            {
              id: question.essayCriteria.length + 1,
              criteria: 'New Criteria',
              maxScore: 0,
              rubrics: [
                { score: '0', description: 'Poor performance' },
                { score: '0', description: 'Fair performance' }
              ]
            }
          ]
        } : question
      )
    );
  };

  const handleDeleteCriteria = (questionId: number, criteriaId: number) => {
    setQuestions(prev =>
      prev.map(question =>
        question.id === questionId ? {
          ...question,
          essayCriteria: question.essayCriteria.filter(criteria => criteria.id !== criteriaId)
        } : question
      )
    );
  };

  const handleAddRubricLevel = (questionId: number, criteriaId: number) => {
    setQuestions(prev =>
      prev.map(question =>
        question.id === questionId ? {
          ...question,
          essayCriteria: question.essayCriteria.map(criteria =>
            criteria.id === criteriaId ? {
              ...criteria,
              rubrics: [
                ...criteria.rubrics,
                { score: '0', description: 'New level description' }
              ]
            } : criteria
          )
        } : question
      )
    );
  };

  const handleQuestionCountChange = (value: number) => {
    setQuestionCount(value);
    setQuestions(prev => {
      if (value > prev.length) {
        return [
          ...prev,
          ...Array.from({ length: value - prev.length }, (_, i) => ({
            id: prev.length + i + 1,
            question: '',
            essayCriteria: [{
              id: 1,
              criteria: 'Content and Organization',
              maxScore: 20,
              rubrics: [
                { score: '20', description: 'Excellent performance' },
                { score: '10', description: 'Fair performance' }
              ]
            }]
          }))
        ];
      } else {
        return prev.slice(0, value);
      }
    });
  };

  const calculateTotalScore = (questionId: number): number => {
    const question = questions.find(q => q.id === questionId);
    return question?.essayCriteria.reduce((sum, criteria) => sum + criteria.maxScore, 0) || 0;
  };

  const handleSave = async () => {
    setIsLoading(true)
    const transformedData = {
      name: essayName,
      firebaseId: user?.uid,
      questions: questions.map(q => ({
        question: q.question,
        essayCriteria: q.essayCriteria.map(c => ({
          criteria: c.criteria,
          maxScore: c.maxScore,
          rubrics: c.rubrics
        }))
      }))
    };

    try {
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    
      const response = await fetch(`${baseUrl}/essay-assessment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedData),
      });
    
      if (!response.ok) {
        throw new Error('Failed to create assessment');
      }
    
      const responseData = await response.json();
      const assessmentId = responseData.id;
    
      router.push(`/assessments/${assessmentId}/essay`)
    
    } catch (error) {
      console.error('Failed to create essay assessment:', error);
    } finally {
      setIsLoading(false)
    }
    
  };

  return (
    <div className="w-full p-4">
      <div className="flex items-center mb-6">
        <Link href="/assessments">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold">{essayName}</h1>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-gray-600">Essay Name:</label>
          <input
            type="text"
            value={essayName}
            onChange={(e) => setEssayName(e.target.value)}
            className="w-full p-2 border rounded-md pl-4"
            placeholder="Sample Essay"
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
              {question.essayCriteria.map((criteria, index) => (
                <div key={criteria.id} className="space-y-2 border p-4 rounded-md">
                  <div className="flex space-x-2 items-center">
                    <input
                      type="text"
                      value={criteria.criteria}
                      onChange={(e) => handleCriteriaChange(question.id, criteria.id, 'criteria', e.target.value)}
                      className="flex-1 p-2 border rounded-md"
                      placeholder="Criteria name"
                    />
                    <p> Max Score: </p>
                    <input
                      type="number"
                      value={criteria.maxScore}
                      onChange={(e) => handleCriteriaChange(question.id, criteria.id, 'maxScore', Number(e.target.value))}
                      className="w-24 p-2 border rounded-md"
                      placeholder="Max score"
                    />
                    {index !== 0 &&
                      <Button
                        onClick={() => handleDeleteCriteria(question.id, criteria.id)}
                        variant="destructive"
                        className=""
                      >
                        ×
                      </Button>
                    }
                  </div>

                  <div className="space-y-2">
                    {criteria.rubrics.map((rubric, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="text"
                          value={rubric.score}
                          onChange={(e) => handleRubricChange(question.id, criteria.id, index, 'score', e.target.value)}
                          className="w-24 p-2 border rounded-md"
                          placeholder="Score"
                        />
                        <input
                          type="text"
                          value={rubric.description}
                          onChange={(e) => handleRubricChange(question.id, criteria.id, index, 'description', e.target.value)}
                          className="flex-1 p-2 border rounded-md"
                          placeholder="Description"
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => handleAddRubricLevel(question.id, criteria.id)}
                      className="text-gray-600 text-sm"
                    >
                      + Add Rubric Level
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => handleAddCriteria(question.id)}
                className="text-gray-600"
              >
                + Add Criteria
              </button>
            </div>

            <div className="flex justify-end">
              <span className="font-medium">Question Total: {calculateTotalScore(question.id)}</span>
            </div>
          </div>
        ))}

        <div className="flex space-x-4 mt-6">
          <button
            onClick={handleSave}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEssayAssessment;