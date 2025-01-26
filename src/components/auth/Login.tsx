"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../../lib/firebase/init";

export default function TeacherLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signInWithEmailAndPassword(email, password);
      if (res) {
        console.log("Logged in successfully:", res);
        router.push("/dashboard");
      }
    } catch (err) {
      setError((err as Error).message || "An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto p-6 w-full max-w-md">
      <h1 className="text-2xl font-bold text-center mb-6">Teacher Login</h1>
      {error && <div className="mb-4 text-red-600 text-center text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <div className="text-center text-sm text-gray-600">
          By entering your username and password, you agree to our{" "}
          <Link href="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </Link>.
        </div>
        <div className="flex justify-center mt-4 space-x-3">
          <button type="button" aria-label="Sign in with Facebook" className="p-2 border rounded-md hover:bg-gray-50">
            <Image src="/facebook-icon.png" alt="Facebook" width={24} height={24} />
          </button>
          <button type="button" aria-label="Sign in with Google" className="p-2 border rounded-md hover:bg-gray-50">
            <Image src="/google-icon.png" alt="Google" width={24} height={24} />
          </button>
          <button type="button" aria-label="Sign in with Microsoft" className="p-2 border rounded-md hover:bg-gray-50">
            <Image src="/microsoft-icon.png" alt="Microsoft" width={24} height={24} />
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="mt-4 text-center text-sm">
        Don’t have an account?{" "}
        <Link href="/auth/signup" className="text-blue-600 hover:underline">
          Sign Up
        </Link>
        <br />
        <Link href="/auth/forgot-username" className="text-gray-600 hover:underline">
          Forgot Username
        </Link>{" "}
        |{" "}
        <Link href="/auth/forgot-password" className="text-gray-600 hover:underline">
          Forgot Password
        </Link>
      </div>
    </div>
  );
}
