import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function IdentificationSheets() {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center gap-2">
          <Link href="/answer-sheets">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold">Identification</h1>
        </div>
        <p className="text-sm"> Print your answer sheets based on your number of questions. </p>
      </div>
      <div className="p-4 flex w-full gap-4 flex-wrap justify-center">
        <div className="w-52 flex p-4 aspect-[8.5/11] bg-white border items-center border-black rounded-lg">
          <p className="mt-auto text-center w-full"> 10 Questions</p>
        </div>

        <div className="w-52 flex p-4 aspect-[8.5/11] bg-white border items-center border-black rounded-lg">
          <p className="mt-auto text-center w-full"> 20 Questions</p>
        </div>

        <div className="w-52 flex p-4 aspect-[8.5/11] bg-white border items-center border-black rounded-lg">
          <p className="mt-auto text-center w-full"> 30 Questions</p>
        </div>

        <div className="w-52 flex p-4 aspect-[8.5/11] bg-white border items-center border-black rounded-lg">
          <p className="mt-auto text-center w-full"> 40 </p>
        </div>

        <div className="w-52 flex p-4 aspect-[8.5/11] bg-white border items-center border-black rounded-lg">
          <p className="mt-auto text-center w-full"> 50 Questions</p>
        </div>
      </div>
    </div>
  )
}