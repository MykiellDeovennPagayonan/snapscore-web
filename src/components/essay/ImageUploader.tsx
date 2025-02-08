'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// import { useRouter } from 'next/navigation'
import { rateEssay } from '@/utils/rateEssay'
import { checkIdentification } from '@/utils/checkIdentification'

// interface IdentificationItem {
//   itemNumber: number
//   correctAnswer: string
//   studentAnswer: string
//   isCorrect: boolean
//   manualCheck: boolean
// }

// interface IdentificationResponse {
//   items: IdentificationItem[]
//   studentName: string
// }

interface ImageUploaderProps {
  type: 'essay' | 'identification'
  assessmentId: string
  essayCriteria?: EssayCriteria
}

export default function ImageUploader({ type, assessmentId }: ImageUploaderProps) {
  // const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) {
      setMessage({ type: 'error', text: 'Please select an image to upload.' })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      if (type === 'essay') {
        const essayResult = await rateEssay(file, assessmentId)
        console.log("Essay result:", essayResult)
        setMessage({ 
          type: 'success', 
          text: `Essay submitted successfully! Score: ${essayResult.score.toFixed(1)}%` 
        })
      } else if (type === 'identification') {
        const identificationResult = await checkIdentification(file, assessmentId)
        console.log("Identification result:", identificationResult)
        setMessage({ 
          type: 'success', 
          text: `Identification submitted successfully! Student: ${identificationResult.studentName}` 
        })
      }

      // Optionally, navigate to a details page:
      // router.push(`/assessments/${assessmentId}/${type}/${resultId}`)
    } catch (error) {
      console.error(error)
      setMessage({ type: 'error', text: 'Failed to process image. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-x-4 flex flex-row max-w-2xl py-4">
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          disabled={isLoading}
          className='w-52 bg-white border border-black'
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Upload Image'}
        </Button>
      </form>
      {message && (
        <div className={`p-4 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}
    </div>
  )
}