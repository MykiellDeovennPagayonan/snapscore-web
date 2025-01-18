'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2 } from 'lucide-react'

interface ImageUploaderProps {
  type: 'essay' | 'identification'
}

export default function ImageUploader({type} : ImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const endpoint = process.env.NEXT_PUBLIC_SERVER_URL + (type === 'essay' ? '/essay' : '/identification')
  console.log(endpoint)

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

      console.log(data)

      let text = ''

      if (type === 'essay') {
        text = `the rating of your essay is, ${data} / 100`
      }
      else {
        text = `you did identification!`
      }

      setMessage({ type: 'success', text: text })
    } catch (error) {
      console.log(error)
      setMessage({ type: 'error', text: 'Failed to upload image. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
      <div>
        <Label htmlFor="image">Select Image</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          disabled={isLoading}
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Uploading...' : 'Upload Image'}
      </Button>
      {message && (
        <div className={`flex items-center ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.type === 'success' ? <CheckCircle2 className="mr-2" /> : <AlertCircle className="mr-2" />}
          {message.text}
        </div>
      )}
    </form>
  )
}

