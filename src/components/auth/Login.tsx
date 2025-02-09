"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../../lib/firebase/init";

export default function TeacherLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const validateEmail = (email: string): string | null => {
    if (!email.trim()) {
      return "Please enter your email address";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password.trim()) {
      return "Please enter your password";
    }
    if (password.length < 1) {
      return "Please enter your password";
    }
    return null;
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError("");

    // Validate inputs
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    try {
      if (!signInWithEmailAndPassword) {
        throw new Error("Login service is currently unavailable. Please try again in a few minutes.");
      }

      const res = await signInWithEmailAndPassword(email, password);
      
      if (!res) {
        setError("Invalid email or password")
      } else {
        router.push("/assessments")
      }
    } catch (err) {
      const errorMessage = (err as Error).message || "";
      
      // Convert Firebase errors to user-friendly messages
      if (errorMessage.includes('auth/user-not-found')) {
        setError("We couldn't find an account with this email address. Need to create one?");
      } else if (errorMessage.includes('auth/wrong-password')) {
        setError("Incorrect password. Please try again or use 'Forgot Password'");
      } else if (errorMessage.includes('auth/invalid-email')) {
        setError("Please check your email address");
      } else if (errorMessage.includes('auth/user-disabled')) {
        setError("This account has been disabled. Please contact support.");
      } else if (errorMessage.includes('auth/too-many-requests')) {
        setError("Too many failed login attempts. Please try again later or reset your password.");
      } else if (errorMessage.includes('auth/network-request-failed')) {
        setError("Having trouble connecting. Please check your internet and try again.");
      } else if (errorMessage.includes('incomplete')) {
        setError("Account setup incomplete. Please register again.");
      } else {
        setError("Unable to log in at the moment. Please try again in a few minutes.");
      }
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto p-6 w-full max-w-lg my-12">
      <h1 className="text-3xl font-bold text-center mb-6">Teacher Login</h1>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-center text-sm">
          {error}
        </div>
      )}
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
        {/* <div className="flex justify-center mt-4 space-x-3">
          <button type="button" aria-label="Sign in with Facebook" className="p-2 border rounded-md hover:bg-gray-50">
            <Image src="/facebook-icon.png" alt="Facebook" width={24} height={24} />
          </button>
          <button type="button" aria-label="Sign in with Google" className="p-2 border rounded-md hover:bg-gray-50">
            <Image src="/google-icon.png" alt="Google" width={24} height={24} />
          </button>
          <button type="button" aria-label="Sign in with Microsoft" className="p-2 border rounded-md hover:bg-gray-50">
            <Image src="/microsoft-icon.png" alt="Microsoft" width={24} height={24} />
          </button>
        </div> */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}