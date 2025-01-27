"use client"
import { useState } from 'react';
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Answer {
  id: number;
  value: string;
}

const CreateIdentificationAssessment = () => {
  const [assessmentName, setAssessmentName] = useState<string>('');
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(10);
  const [answers, setAnswers] = useState<Answer[]>(
    Array.from({ length: numberOfQuestions }, (_, i) => ({ id: i + 1, value: '' }))
  );

  const handleSave = () => {
    console.log('Saving assessment:', {
      name: assessmentName,
      numberOfQuestions,
      answers,
    });
  };

  const handleResults = () => {
    console.log('Viewing results');
  };

  const handleAnswerChange = (id: number, value: string) => {
    setAnswers(prev =>
      prev.map(answer =>
        answer.id === id ? { ...answer, value } : answer
      )
    );
  };

  const handleNumberOfQuestionsChange = (value: number) => {
    setNumberOfQuestions(value);
    setAnswers(prev => {
      if (value > prev.length) {
        return [
          ...prev,
          ...Array.from({ length: value - prev.length }, (_, i) => ({
            id: prev.length + i + 1,
            value: '',
          })),
        ];
      } else {
        return prev.slice(0, value);
      }
    });
  };

  return (
    <div className="w-full p-4">
      <div className="flex items-center mb-6">
        <Link href="/assessments">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold">Create Identification Assessment</h1>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-gray-600">Assessment Name:</label>
          <div className="relative">
            <input
              type="text"
              value={assessmentName}
              onChange={(e) => setAssessmentName(e.target.value)}
              className="w-full p-2 border rounded-md pl-4"
              placeholder="Sample Test"
            />
          </div>
        </div>

        <div>
          <label className="text-gray-600">Pick Number of Questions:</label>
          <div className="relative">
            <select
              value={numberOfQuestions}
              onChange={(e) => handleNumberOfQuestionsChange(Number(e.target.value))}
              className="w-32 p-2 border rounded-md appearance-none pl-4"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={40}>40</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-gray-600">Answer Key:</label>
          <div className="space-y-2">
            {answers.map((answer) => (
              <div key={answer.id} className="relative">
                <input
                  type="text"
                  value={answer.value}
                  onChange={(e) => handleAnswerChange(answer.id, e.target.value)}
                  className="w-full p-2 border rounded-md pl-4"
                  placeholder={`Answer ${answer.id}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-4 mt-6">
          <button
            onClick={handleSave}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
          >
            Save
          </button>
          <button
            onClick={handleResults}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
          >
            Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateIdentificationAssessment;
