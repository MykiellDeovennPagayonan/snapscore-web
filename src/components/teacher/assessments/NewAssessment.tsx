'use client'
import { useState } from "react"
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"
import Image from "next/image"

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
              className="w-52 flex flex-col p-2 aspect-square border items-center border-black rounded-lg"
            >
              <Image
                src={"/images/essay-assessment.svg"}
                width={154}
                height={154}
                alt={"essay assessment icon"}
                className="m-auto"
                />
              <p>Essay </p>
            </Link>
            <Link
              href={`/assessments/create/identification`}
              className="w-52 flex flex-col p-2 aspect-square border items-center border-black rounded-lg"
            >
              <Image
                src={"/images/identification-assessment.svg"}
                width={154}
                height={154}
                alt={"identification assessment icon"}
                className="m-auto"
                />
              <p>Identification </p>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
