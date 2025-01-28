'use client'

import { useParams } from 'next/navigation'
import TeacherLayout from "@/components/teacher/TeacherLayout";

export default function Page() {
    const params = useParams<{ id: string }>()
  
    console.log(params.id)
  return (
    <TeacherLayout type="assessment"/>
  )
}