/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams, usePathname } from "next/navigation";

interface Answer {
  id: number;
  value: string;
}

interface Toast {
  message: string;
  type: "success" | "error";
}

const EditIdentificationAssessment = () => {
  const router = useRouter();
  const { id: assessmentId } = useParams();
  const [assessmentName, setAssessmentName] = useState<string>("");
  const [numberOfAnswers, setNumberOfAnswers] = useState<number>(10);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const pathname = usePathname();

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleNavigation = () => {
    const pathSegments = pathname.split("/");
    pathSegments.pop();
    const newPath = pathSegments.join("/");

    router.push(newPath);
  };

  useEffect(() => {
    if (!assessmentId) return;
    const fetchAssessment = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;
        const response = await fetch(
          `${baseUrl}/identification-assessment/${assessmentId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch identification assessment");
        }
        const data = await response.json();
        // Assuming the returned data has a "name" and "identificationQuestions" array.
        setAssessmentName(data.name || "");
        const fetchedAnswers: Answer[] = data.identificationQuestions.map(
          (q: any, index: number) => ({
            id: index + 1,
            value: q.correctAnswer,
          })
        );
        setAnswers(fetchedAnswers);
        setNumberOfAnswers(fetchedAnswers.length);
      } catch (error) {
        console.error("Error fetching assessment:", error);
        showToast("Error fetching assessment data", "error");
      }
    };

    fetchAssessment();
  }, [assessmentId]);

  const handleAnswerChange = (id: number, value: string) => {
    setAnswers((prev) =>
      prev.map((answer) => (answer.id === id ? { ...answer, value } : answer))
    );
  };

  const handleNumberOfAnswersChange = (value: number) => {
    setNumberOfAnswers(value);
    setAnswers((prev) => {
      const currentLength = prev.length;
      if (value > currentLength) {
        return [
          ...prev,
          ...Array.from({ length: value - currentLength }, (_, i) => ({
            id: currentLength + i + 1,
            value: "",
          })),
        ];
      } else {
        return prev.slice(0, value);
      }
    });
  };

  const handleSave = async () => {
    if (!assessmentName.trim()) {
      showToast("Please enter an assessment name", "error");
      return;
    }

    if (answers.some((answer) => !answer.value.trim())) {
      showToast("Please fill in all answers", "error");
      return;
    }

    if (!assessmentId) {
      showToast("Assessment ID not found", "error");
      return;
    }

    setIsLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;
      const payload = {
        name: assessmentName,
        // Convert the answers array to the expected questions format.
        questions: answers.map((answer) => ({
          correctAnswer: answer.value.trim(),
        })),
      };

      const response = await fetch(
        `${baseUrl}/identification-assessment/${assessmentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update identification assessment");
      }
      showToast("Answer sheet updated successfully!", "success");
      setTimeout(() => router.push("/assessments"), 1500);
    } catch (error) {
      console.error("Error updating answer sheet:", error);
      showToast("Failed to update answer sheet", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full p-4 relative">
      {toast && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md shadow-lg transition-all ${toast.type === "success" ? "bg-green-500" : "bg-red-500"
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
          Edit Identification Answer Sheet
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
            placeholder="Enter Assessment Name"
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
            {[10, 20, 30, 40, 50].map((num) => (
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
            disabled={isLoading}
            className={`flex-1 py-2 px-4 rounded-md transition-all ${isLoading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditIdentificationAssessment;
