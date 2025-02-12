"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import IdentificationSheets from "./IdentificationSheets";
// import EssaySheets from "./EssaySheets";
import Image from "next/image";

export default function AnswerSheets() {
  const pathname = usePathname();

  const downloadEssay = () => {
    const filePath = "/pdf/Essay.pdf";
    const link = document.createElement("a");
    link.href = filePath;
    link.download = "Essay.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  function renderContent() {
    switch (pathname) {
      case "/answer-sheets/identification":
        return <IdentificationSheets />;
      // case "/answer-sheets/essay":
      //   return <EssaySheets />;
      default:
        return (
          <div className="flex flex-col w-full">
            <div className="flex flex-col gap-2 p-4">
              <h1 className="text-3xl font-bold">Answer Sheets</h1>
              <p className="text-sm">
                Print your answer sheets based on your assessment here.
              </p>
            </div>
            <div className="p-4 flex w-full gap-4 flex-wrap justify-center">
              <Link
                href="/answer-sheets/identification"
                className="w-72 flex flex-col p-4 aspect-[8.5/11] bg-white border items-center border-black rounded-lg"
              >
                <Image
                  src="/images/Identification_10_Questions.png"
                  alt="Identification Preview"
                  width={288}
                  height={370}
                  className="rounded-md mb-2"
                />
                <p className="mt-auto text-center w-full">Identification</p>
              </Link>

              <div
                onClick={downloadEssay}
                className="w-72 flex flex-col p-4 aspect-[8.5/11] bg-white border items-center border-black rounded-lg cursor-pointer"
              >
                <Image
                  src="/images/Essay.png"
                  alt="Essay Preview"
                  width={288}
                  height={370}
                  className="rounded-md mb-2"
                />
                <p className="mt-auto text-center w-full">Essay</p>
              </div>
            </div>
          </div>
        );
    }
  }

  return renderContent();
}
