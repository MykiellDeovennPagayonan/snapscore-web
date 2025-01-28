'use client'
import { useState } from "react"
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"

export default function NewAssessment() {
  const [open, setOpen] = useState(false)

  return (
    <div className="py-1 bg-white rounded-lg border border-black">
      {/* Trigger for opening the dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="cursor-pointer">
            <p className="w-full text-center text-sm">+ New Assessment</p>
          </div>
        </DialogTrigger>

        {/* Dialog content */}
        <DialogContent className="text-center">
          <DialogTitle>Choose Assessment Type</DialogTitle>
          <div className="mt-4 flex flex-wrap justify-center space-x-4">
            <Link
              href={`/assessments/create/essay`}
              className="w-52 aspect-square border border-black rounded-lg"
            >
              Essay
            </Link>
            <Link
              href={`/assessments/create/identification`}
              className="w-52 aspect-square border border-black rounded-lg"
            >
              Identification
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
