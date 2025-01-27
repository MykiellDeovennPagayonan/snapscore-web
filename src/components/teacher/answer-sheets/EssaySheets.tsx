import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EssaySheets() {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center gap-2">
          <Link href="/answer-sheets">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold">Essay</h1>
        </div>
        <p className="text-sm"> Print your answer sheets based on your number of questions. </p>
      </div>
      <div className="p-4 flex w-full gap-4 flex-wrap justify-center">
        <div className="w-52 flex p-4 aspect-[8.5/11] bg-white border items-center border-black rounded-lg">
          <p className="mt-auto text-center w-full"> 1 </p>
        </div>

        <div className="w-52 flex p-4 aspect-[8.5/11] bg-white border items-center border-black rounded-lg">
          <p className="mt-auto text-center w-full"> 2 </p>
        </div>
        <div className="w-52 flex p-4 aspect-[8.5/11] bg-white border items-center border-black rounded-lg">
          <p className="mt-auto text-center w-full"> 3 </p>
        </div>
      </div>
    </div>
  )
}