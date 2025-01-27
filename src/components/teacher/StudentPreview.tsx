interface EssayStudentPreviewProps {
  name: string;
  score: number;
}

export default function StudentPreview({ name, score }: EssayStudentPreviewProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-black">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
          📚
        </div>
        <span className="text-gray-700 text-sm">{name}</span>
      </div>
      <span className="text-gray-900 font-bold text-sm">{score}</span>
    </div>
  );
}
