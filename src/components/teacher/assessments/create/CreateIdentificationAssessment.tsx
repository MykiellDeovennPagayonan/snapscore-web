"use client";
import { useState } from 'react';
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { auth } from "../../../../lib/firebase/init";
import { createIdentificationAssessment } from '@/utils/createIdentificationAssessment';

interface Answer {
  id: number;
  value: string;
}

interface Toast {
  message: string;
  type: 'success' | 'error';
}

const CreateIdentificationAssessment = () => {
  const router = useRouter();
  const [assessmentName, setAssessmentName] = useState<string>('');
  const [numberOfAnswers, setNumberOfAnswers] = useState<number>(10);
  const [answers, setAnswers] = useState<Answer[]>(
    Array.from({ length: numberOfAnswers }, (_, i) => ({ id: i + 1, value: '' }))
  );
  const [user] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    if (!assessmentName.trim()) {
      showToast("Please enter an assessment name", "error");
      return;
    }

    if (answers.some(answer => !answer.value.trim())) {
      showToast("Please fill in all answers", "error");
      return;
    }

    if (!user?.uid) {
      showToast("Please sign in to create an assessment", "error");
      return;
    }

    setIsLoading(true);
    try {
      await createIdentificationAssessment({
        name: assessmentName,
        firebaseId: user.uid,
        answers: answers.map(a => a.value.trim()),
      });
      showToast("Answer sheet created successfully!", "success");
      setTimeout(() => router.push('/assessments'), 1500);
    } catch (error) {
      console.error("Error creating answer sheet:", error);
      showToast("Failed to create answer sheet", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (id: number, value: string) => {
    setAnswers(prev =>
      prev.map(answer => (answer.id === id ? { ...answer, value } : answer))
    );
  };

  const handleNumberOfAnswersChange = (value: number) => {
    setNumberOfAnswers(value);
    setAnswers(
      Array.from({ length: value }, (_, i) => ({
        id: i + 1,
        value: i < answers.length ? answers[i].value : '',
      }))
    );
  };

  return (
    <div className="w-full p-4 relative">
      {toast && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md shadow-lg transition-all ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}
        >
          {toast.message}
        </div>
      )}

      <div className="flex items-center mb-6">
        <Link href="/assessments" className="hover:opacity-80 transition-opacity">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold ml-2">
          Create Identification Answer Sheet
        </h1>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-gray-600 block mb-1">
            Assessment Name:
          </label>
          <input
            type="text"
            value={assessmentName}
            onChange={(e) => setAssessmentName(e.target.value)}
            className="w-full p-2 border rounded-md pl-4 focus:outline-none focus:ring-2 focus:ring-gray-200"
            placeholder="Sample Test"
          />
        </div>

        <div>
          <label className="text-gray-600 block mb-1">
            Number of Answers:
          </label>
          <select
            value={numberOfAnswers}
            onChange={(e) =>
              handleNumberOfAnswersChange(Number(e.target.value))
            }
            className="w-32 p-2 border rounded-md appearance-none pl-4 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            {[5, 10, 15, 20].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-gray-600 block mb-1">Answers:</label>
          <div className="space-y-2">
            {answers.map((answer) => (
              <div key={answer.id} className="relative">
                <input
                  type="text"
                  value={answer.value}
                  onChange={(e) =>
                    handleAnswerChange(answer.id, e.target.value)
                  }
                  className="w-full p-2 border rounded-md pl-4 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder={`Answer ${answer.id}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-4 mt-6">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`flex-1 py-2 px-4 rounded-md transition-all ${
              isLoading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isLoading ? 'Saving...' : 'Save Answer Sheet'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateIdentificationAssessment;
