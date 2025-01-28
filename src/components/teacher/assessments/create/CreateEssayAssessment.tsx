"use client"
import { useState } from 'react';
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Rubric {
  id: number;
  name: string;
  maxScore: number;
}

interface EssayQuestion {
  id: number;
  text: string;
}

const CreateEssayAssessment = () => {
  const [essayName, setEssayName] = useState<string>('Sample Essay');
  const [questionCount, setQuestionCount] = useState<number>(1);
  const [questions, setQuestions] = useState<EssayQuestion[]>([
    { id: 1, text: '' },
  ]);
  const [rubrics, setRubrics] = useState<Rubric[]>([
    { id: 1, name: 'Sample Rubric 1', maxScore: 20 },
    { id: 2, name: 'Sample Rubric 2', maxScore: 20 },
    { id: 3, name: 'Sample Rubric 3', maxScore: 50 },
    { id: 4, name: 'Sample Rubric 4', maxScore: 10 },
  ]);

  const calculateTotalScore = (): number => {
    return rubrics.reduce((sum, rubric) => sum + rubric.maxScore, 0);
  };

  const handleAddRubric = () => {
    const newRubric = {
      id: rubrics.length + 1,
      name: 'Additional Essay Criteria',
      maxScore: 0,
    };
    setRubrics([...rubrics, newRubric]);
  };

  const handleRubricChange = (id: number, field: 'name' | 'maxScore', value: string | number) => {
    setRubrics(prev =>
      prev.map(rubric =>
        rubric.id === id ? { ...rubric, [field]: value } : rubric
      )
    );
  };

  const handleQuestionChange = (id: number, text: string) => {
    setQuestions(prev =>
      prev.map(question =>
        question.id === id ? { ...question, text } : question
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
            text: '',
          })),
        ];
      } else {
        return prev.slice(0, value);
      }
    });
  };

  const handleSave = () => {
    console.log('Saving essay assessment:', {
      name: essayName,
      questionCount,
      questions,
      rubrics,
      totalScore: calculateTotalScore(),
    });
  };

  const handleResults = () => {
    console.log('Viewing results');
  };

  return (
    <div className="w-full p-4">
      <div className="flex items-center mb-6">
        <Link href="/assessments">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold">Sample Essay</h1>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-gray-600">Essay Name:</label>
          <div className="relative">
            <input
              type="text"
              value={essayName}
              onChange={(e) => setEssayName(e.target.value)}
              className="w-full p-2 border rounded-md pl-4"
              placeholder="Sample Essay"
            />
          </div>
        </div>

        <div>
          <label className="text-gray-600">Pick Number of Questions:</label>
          <div className="relative">
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
        </div>

        <div>
          <label className="text-gray-600">Essay Questions:</label>
          <div className="space-y-2">
            {questions.map((question) => (
              <div key={question.id} className="relative">
                <input
                  type="text"
                  value={question.text}
                  onChange={(e) => handleQuestionChange(question.id, e.target.value)}
                  className="w-full p-2 border rounded-md pl-4"
                  placeholder={`Question ${question.id}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-gray-600">Rubrics:</label>
          <div className="space-y-2">
            {rubrics.map((rubric) => (
              <div key={rubric.id} className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={rubric.name}
                    onChange={(e) => handleRubricChange(rubric.id, 'name', e.target.value)}
                    className="w-full p-2 border rounded-md pl-4"
                  />
                </div>
                <input
                  type="number"
                  value={rubric.maxScore}
                  onChange={(e) => handleRubricChange(rubric.id, 'maxScore', Number(e.target.value))}
                  className="w-20 p-2 border rounded-md text-right"
                />
              </div>
            ))}

            <button
              onClick={handleAddRubric}
              className="flex items-center text-gray-600 mt-2"
            >
              <span className="mr-2">+</span>
              Insert additional essay criteria
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <span className="font-medium">Total Score:</span>
          <span>{calculateTotalScore()}</span>
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

export default CreateEssayAssessment;
