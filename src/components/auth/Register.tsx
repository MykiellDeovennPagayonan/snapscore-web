"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../../lib/firebase/init";
import createUser from "@/utils/createUser";
import { UserCredential } from "firebase/auth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError("");

    if (password.length < 8 || password.length > 64) {
      setError("Password must be between 8 and 64 characters.");
      return;
    }

    setLoading(true);
    try {
      const res: UserCredential = await createUserWithEmailAndPassword(email, password) as UserCredential;
      if (res) {
        const userData = {
          email,
          firebaseId: res.user.uid,
          fullName,
        }
        await createUser(userData)
        console.log("User registered:", res);
        setEmail("");
        setPassword("");
        setFullName("");
        router.push("/assessments");
      }
    } catch (err) {
      setError((err as Error).message || "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto p-6 w-full max-w-lg my-12">
      <h1 className="text-3xl font-bold mb-4 text-center">Create New Teacher Account</h1>
      {error && <div className="mb-4 text-red-600 text-sm text-center">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your password"
          />
        </div>
        <div className="text-xs text-gray-600">
          Elements of a strong password include:
          <ul className="list-disc pl-5">
            <li>Between 8 and 64 characters.</li>
            <li>Do not use commonly guessed passwords.</li>
            <li>Use upper-case, lower-case letters, numbers, and symbols.</li>
            <li>Do not use leading or trailing spaces.</li>
          </ul>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="terms"
            required
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="terms" className="text-sm text-gray-600">
            You agree to our <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {loading ? "Registering..." : "Register New User"}
        </button>
      </form>
      {/* <div className="flex justify-center mt-4 space-x-2">
        <button className="p-2 bg-gray-100 rounded-md hover:bg-gray-200">
          <img src="/icons/facebook.svg" alt="Facebook login" className="w-6 h-6" />
        </button>
        <button className="p-2 bg-gray-100 rounded-md hover:bg-gray-200">
          <img src="/icons/google.svg" alt="Google login" className="w-6 h-6" />
        </button>
        <button className="p-2 bg-gray-100 rounded-md hover:bg-gray-200">
          <img src="/icons/microsoft.svg" alt="Microsoft login" className="w-6 h-6" />
        </button>
      </div> */}
      <div className="mt-4 text-center">
        <Link href="/auth/login" className="text-sm text-blue-600 hover:underline">
          Already have an account? Sign In
        </Link>
      </div>
    </div>
  );
}
