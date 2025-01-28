"use client"
import { useState } from 'react';
import { Eye, Check, ArrowLeft } from "lucide-react";
import Link from 'next/link';

interface RubricScore {
  name: string;
  score: number;
  maxScore: number;
}

const EssayStudentResult = () => {
  const [studentName, setStudentName] = useState<string>('Student 1');
  const [answer, setAnswer] = useState<string>('Sample Answer');
  const [rubricScores, setRubricScores] = useState<RubricScore[]>([
    { name: 'Grammar', score: 17, maxScore: 20 },
    { name: 'Relevance to the Question', score: 15, maxScore: 20 },
    { name: 'Content', score: 30, maxScore: 50 },
    { name: 'Organization', score: 7, maxScore: 10 }
  ]);
  const question = 'Sample Question';

  const calculateTotalScore = (): number => {
    return rubricScores.reduce((sum, rubric) => sum + rubric.score, 0);
  };

  const handleScoreChange = (index: number, newScore: number) => {
    setRubricScores(prev => 
      prev.map((rubric, i) => 
        i === index 
          ? { ...rubric, score: Math.min(newScore, rubric.maxScore) }
          : rubric
      )
    );
  };

  return (
    <div className="w-full p-4">
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

      <div className="space-y-4 mb-6">
        <div>
          <label className="text-gray-600 block mb-1">Student</label>
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

        <div>
          <label className="text-gray-600 block mb-1">Question</label>
          <div className="relative">
            <input
              type="text"
              value={question}
              readOnly
              className="w-full p-2 border rounded-md pl-4"
            />
          </div>
        </div>

        <div>
          <label className="text-gray-600 block mb-1">Answer</label>
          <div className="relative">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full p-2 border rounded-md pl-4 min-h-[100px]"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Results</span>
          <span className="text-gray-600">
            Total Score: {calculateTotalScore()}/100
          </span>
        </div>

        <div className="space-y-3">
          {rubricScores.map((rubric, index) => (
            <div key={rubric.name} className="flex justify-between items-center">
              <span className="text-gray-600">
                {rubric.name} ({rubric.maxScore})
              </span>
              <div className="flex items-center">
                <span className="mr-2">Score:</span>
                <input
                  type="number"
                  value={rubric.score}
                  onChange={(e) => handleScoreChange(index, parseInt(e.target.value))}
                  className="w-16 p-1 border rounded-md text-center"
                  min="0"
                  max={rubric.maxScore}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EssayStudentResult;