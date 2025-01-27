"use client"

import Link from "next/link"
import { usePathname } from "next/navigation";
import IdentificationSheets from "./IdentificationSheets";
import EssaySheets from "./EssaySheets";

export default function AnswerSheets() {
  const pathname = usePathname()
  const isAnswerSheets = pathname === "/answer-sheets";

  console.log(isAnswerSheets)

  function renderContent() {
    switch (pathname) {
      case "/answer-sheets/identification":
        return <IdentificationSheets />
      case "/answer-sheets/essay":
        return <EssaySheets />
      default:
        return (
          <div className="flex flex-col w-full">
            <div className="flex flex-col gap-2 p-4">
              <h1 className="text-3xl font-bold">Answer Sheets</h1>
              <p className="text-sm"> Print your answer sheets based on your assessment here. </p>
            </div>
            <div className="p-4 flex w-full gap-4 flex-wrap justify-center">
              <Link href={`/answer-sheets/identification`} className="w-72 flex p-4 aspect-[8.5/11] bg-white border items-center border-black rounded-lg">
                <p className="mt-auto text-center w-full"> Identification </p>
              </Link>
              <Link href={`/answer-sheets/essay`} className="w-72 flex p-4 aspect-[8.5/11] bg-white border items-center border-black rounded-lg">
                <p className="mt-auto text-center w-full"> Essay </p>
              </Link>
            </div>
          </div>
        )
    }
  }

  return renderContent()
}