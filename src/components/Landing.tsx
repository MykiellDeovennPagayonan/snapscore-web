"use client"
import Image from 'next/image';
import Link from 'next/link';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase/init";

const Landing = () => {
  const [user] = useAuthState(auth);

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      {/* Hero Section */}
      <div className="text-center mb-20">
        <h1 className="text-4xl font-bold mb-6">Grade Smarter, Not Harder</h1>
        <p className="text-xl text-gray-600 mb-8">Automated grading solution powered by AI</p>
        <Link 
          href={user ? "assessments" : "/auth/login"} 
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200"
        >
          Get Started
        </Link>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-24">
        <div className="relative h-64 group transform hover:scale-105 transition-transform duration-200">
          <div className="absolute inset-0 bg-gray-900 rounded-xl overflow-hidden">
            {/* <Image
              src="/images/writing.jpg"
              alt="Student writing notes"
              fill
              className="object-cover opacity-80 group-hover:opacity-70 transition-opacity duration-200"
            /> */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/70" />
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-bold mb-2">Snap it.</h3>
              <p className="text-gray-200">Capture answer sheets instantly with your device</p>
            </div>
          </div>
        </div>
        <div className="relative h-64 group transform hover:scale-105 transition-transform duration-200">
          <div className="absolute inset-0 bg-gray-900 rounded-xl overflow-hidden">
            {/* <Image
              src="/images/grading.jpg"
              alt="Grading papers"
              fill
              className="object-cover opacity-80 group-hover:opacity-70 transition-opacity duration-200"
            /> */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/70" />
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-bold mb-2">Score it.</h3>
              <p className="text-gray-200">Get instant results with AI-powered grading</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid lg:grid-cols-2 gap-12 px-4">
        {[
          {
            icon: "ai-icon.svg",
            title: "Powered by AI",
            description: "Utilizes multiple AI models to create an accurate and fast grading experience."
          },
          {
            icon: "devices-icon.svg",
            title: "Supported on Multiple Platforms",
            description: "Compatible with Android 8+, and accessible via web browsers. Sync effortlessly across devices: scan with Android, review on Android Tablet, or access via the website"
          },
          {
            icon: "website-icon.svg",
            title: "Accessible Companion Website",
            description: "Optional data sync with Snapscore.ai and across all your devices"
          },
          {
            icon: "download-icon.svg",
            title: "Downloadable Answer Sheets",
            description: "Custom Print Options lets you create tailored answer sheets, fully customizable with your choice of question count and personalized labels throughout"
          }
        ].map((feature, index) => (
          <div 
            key={index} 
            className="text-center p-6 rounded-xl"
          >
            <div className="relative h-40 w-40 mx-auto mb-4">
              <Image
                src={`/images/${feature.icon}`}
                alt={feature.title}
                width={128}
                height={128}
                className='h-40 w-40'
              />
            </div>
            <h2 className="text-xl font-bold mb-3">{feature.title}</h2>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Landing;