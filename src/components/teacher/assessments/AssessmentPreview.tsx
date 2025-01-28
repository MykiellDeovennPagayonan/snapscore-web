import Link from "next/link";

interface AssessmentPreviewProps {
  id: string;
  title: string;
  type: string
}

export default function AssessmentPreview({ id, title, type }: AssessmentPreviewProps) {
  console.log(type)
  return (
    <div>
      <Link href={`/assessments/${id}/${type}`}>
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-black">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
              📚
            </div>
            <span className="text-gray-700 text-sm">{title}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}