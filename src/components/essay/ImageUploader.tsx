/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'

interface EssayResponse {
  essayContent: string
  studentName: string
  criteria: {
    name: string
    rating: number
    maxRating: number
  }[]
}

interface ImageUploaderProps {
  type: 'essay' | 'identification'
  assessmentId: string
}

export default function ImageUploader({ type, assessmentId }: ImageUploaderProps) {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const endpoint = process.env.NEXT_PUBLIC_SERVER_URL + (type === 'essay' ? '/essay' : '/identification')

  const submitEssayResult = async (essayData: EssayResponse) => {
    try {
      // Calculate total score as average of all criteria percentages
      const totalScore = essayData.criteria.reduce((acc, criterion) => {
        return acc + (criterion.rating / criterion.maxRating) * 100;
      }, 0) / essayData.criteria.length;

      const requestBody = {
        studentName: essayData.studentName,
        assessmentId,
        score: totalScore,
        questionResults: [{
          questionId: '1', // You might want to make this dynamic
          score: totalScore,
          essayCriteriaResults: essayData.criteria.map(criterion => ({
            criteriaId: criterion.name.toLowerCase(),
            score: (criterion.rating / criterion.maxRating) * 100
          }))
        }]
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/essay-results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Failed to save essay result');
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting essay result:', error);
      throw error;
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) {
      setMessage({ type: 'error', text: 'Please select an image to upload.' })
      return
    }

    setIsLoading(true)
    setMessage(null)

    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()

      if (type === 'essay') {
        // Submit essay result and get the resultId
        const essayResult = await submitEssayResult(data)
        
        // Calculate average score for display
        const averageScore = data.criteria.reduce((acc: number, criterion: any) => 
          acc + (criterion.rating / criterion.maxRating) * 100, 0) / data.criteria.length;
        
        setMessage({ 
          type: 'success', 
          text: `Essay submitted successfully! Average score: ${averageScore.toFixed(1)}%` 
        })

        // Navigate to result page
        router.push(`/assessments/${assessmentId}/${type}/${essayResult.id}`)
      } else {
        let score: number = 0
        data.items.forEach((item: any) => {
          if (item.isCorrect) score++
        })
        const totalScore = data.items.length
        setMessage({ 
          type: 'success', 
          text: `You scored ${score} out of ${totalScore}` 
        })
      }

    } catch (error) {
      console.error(error)
      setMessage({ type: 'error', text: 'Failed to upload image. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-x-4 flex flex-row max-w-4xl py-4">
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          disabled={isLoading}
          className='w-56 bg-white border border-black'
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Uploading...' : 'Upload Image'}
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