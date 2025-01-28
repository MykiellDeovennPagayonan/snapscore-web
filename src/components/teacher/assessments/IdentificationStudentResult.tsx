"use client"
import { useState } from 'react';
import { Eye, Check, ArrowLeft } from "lucide-react";
import Link from 'next/link';

interface Answer {
  id: number;
  response: string;
  isCorrect: boolean;
  score: number;
}

interface PopupPosition {
  id: number | null;
  x: number;
  y: number;
}

const IdentificationStudentResult = () => {
  const [studentName, setStudentName] = useState<string>('Student 1');
  const [answers, setAnswers] = useState<Answer[]>([
    { id: 1, response: 'Answer 1', isCorrect: true, score: 1 },
    { id: 2, response: 'Answer 2', isCorrect: true, score: 1 },
    { id: 3, response: 'Answer 3', isCorrect: true, score: 1 },
    { id: 4, response: 'Answer 4', isCorrect: false, score: 0 },
    { id: 5, response: 'Answer 5', isCorrect: false, score: 0 },
    { id: 6, response: 'Answer 6', isCorrect: false, score: 0 },
    { id: 7, response: 'Answer 7', isCorrect: true, score: 1 },
    { id: 8, response: 'Answer 8', isCorrect: true, score: 1 },
    { id: 9, response: 'Answer 9', isCorrect: true, score: 1 },
    { id: 10, response: 'Answer 10', isCorrect: true, score: 1 },
  ]);
  const [popup, setPopup] = useState<PopupPosition>({ id: null, x: 0, y: 0 });

  const calculateTotalScore = (): number => {
    return answers.reduce((sum, answer) => sum + answer.score, 0);
  };

  const toggleAnswerCorrectness = (id: number) => {
    setAnswers(prev =>
      prev.map(answer =>
        answer.id === id
          ? { ...answer, isCorrect: !answer.isCorrect, score: answer.isCorrect ? 0 : 1 }
          : answer
      )
    );
    setPopup({ id: null, x: 0, y: 0 });
  };

  const handleOptionsClick = (event: React.MouseEvent, id: number) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setPopup({
      id: popup.id === id ? null : id,
      x: rect.left,
      y: rect.bottom
    });
  };

  const handleClickOutside = () => {
    setPopup({ id: null, x: 0, y: 0 });
  };

  return (
    <div className="w-full p-4" onClick={handleClickOutside}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/assessments">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">Sample Test</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2"> <Eye /> </button>
          <button className="p-2"><Check /></button>
        </div>
      </div>

      <div className="mb-6">
        <label className="text-gray-600">Student</label>
        <div className="relative">
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="w-full p-2 border rounded-md pl-4"
            placeholder="Student 1"
          />
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-600">Results</span>
        <span className="text-gray-600">
          Total Score: {calculateTotalScore()}/15
        </span>
      </div>

      <div className="space-y-2">
        {answers.map((answer) => (
          <div
            key={answer.id}
            className="relative flex items-center justify-between border rounded-md p-2"
          >
            <div className="flex items-center flex-1">
              <span className="mr-2">{answer.id}. </span>
              <span className={`${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}> {answer.response} </span>
            </div>
            <button
              onClick={(e) => handleOptionsClick(e, answer.id)}
              className="ml-2 px-2"
            >
              ⋮
            </button>

            {/* Popup Menu */}
            {popup.id === answer.id && (
              <div
                className="absolute right-0 top-full mt-1 bg-white border rounded-md shadow-lg z-50"
                onClick={(e) => e.stopPropagation()}
                style={{ minWidth: '120px' }}
              >
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => toggleAnswerCorrectness(answer.id)}
                >
                  Mark as {answer.isCorrect ? 'Wrong' : 'Correct'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default IdentificationStudentResult;