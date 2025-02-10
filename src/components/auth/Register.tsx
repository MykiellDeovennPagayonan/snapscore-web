"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import createUser from "@/utils/createUser";
import { UserCredential, fetchSignInMethodsForEmail } from "firebase/auth";
import { useCreateUserWithEmailAndPassword, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "../../lib/firebase/init";
import Image from "next/image";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [signInWithGoogle, googleUser, googleLoading, googleError] = useSignInWithGoogle(auth);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      const result = await signInWithGoogle();

      if (result) {
        const userData = {
          email: result.user.email!,
          firebaseId: result.user.uid,
          fullName: result.user.displayName || "",
        };

        console.log(userData)

        try {
          console.log("Trying!")
          await createUser(userData);
          router.push("/assessments");
        } catch (createError) {
          result.user.delete()
          console.error(createError);
          throw new Error("We couldn't complete your registration. Please try again.");
        }
      }
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError("Sorry, something went wrong during Google sign-in. Please try again.");
    }
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 8 || password.length > 64) {
      return "Your password needs to be between 8 and 64 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Please include at least one capital letter in your password";
    }
    if (!/[a-z]/.test(password)) {
      return "Please include at least one lowercase letter in your password";
    }
    if (!/[0-9]/.test(password)) {
      return "Please include at least one number in your password";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Please include at least one special character (like !@#$%) in your password";
    }
    if (/^\s|\s$/.test(password)) {
      return "Your password shouldn't start or end with spaces";
    }
    return null;
  };

  const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please check your email address - it doesn't look quite right";
    }
    return null;
  };

  const validateFullName = (name: string): string | null => {
    if (name.trim().length < 2) {
      return "Please enter your full name (at least 2 characters)";
    }
    if (!/^[a-zA-Z\s'-]+$/.test(name)) {
      return "Your name can only contain letters, spaces, hyphens, and apostrophes";
    }
    return null;
  };

  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      // First check Firebase
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      console.log(signInMethods)
      if (signInMethods.length > 0) {
        return true;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/exists?email=${email}`);
      if (!response.ok) {
        throw new Error('Failed to check email in database');
      }
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error('Error checking email:', error);
      throw new Error("We couldn't verify if this email is available. Please try again.");
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError("");

    try {
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

      const nameError = validateFullName(fullName);
      if (nameError) {
        setError(nameError);
        return;
      }

      setLoading(true);

      const emailExists = await checkEmailExists(email);
      console.log(emailExists)
      if (emailExists) {
        setError("This email is already registered. Would you like to log in instead?");
        setLoading(false);
        return;
      }

      if (!createUserWithEmailAndPassword) {
        throw new Error("Sorry, we're having trouble with our registration service. Please try again in a few minutes.");
      }

      const res: UserCredential | undefined = await createUserWithEmailAndPassword(email, password) as UserCredential;

      console.log(res)

      if (res) {
        const userData = {
          email,
          firebaseId: res.user.uid,
          fullName,
        };

        try {
          await createUser(userData);
          setEmail("");
          setPassword("");
          setFullName("");
          router.push("/assessments");
        } catch (createError) {
          console.error(createError)
          await res.user.delete();
          throw new Error("We couldn't complete your registration. Please try again.");
        }
      } else {
        setError("This email is already registered. Would you like to log in instead?");
      }
    } catch (err) {
      const errorMessage = (err as Error).message || "";

      if (errorMessage.includes('auth/email-already-in-use')) {
        setError("This email address is already registered. Would you like to log in instead?");
      } else if (errorMessage.includes('auth/invalid-email')) {
        setError("Please double-check your email address");
      } else if (errorMessage.includes('auth/network-request-failed')) {
        setError("We're having trouble connecting. Please check your internet connection and try again.");
      } else if (errorMessage.includes('auth/too-many-requests')) {
        setError("We've temporarily blocked signup attempts from this device for security reasons. Please try again later.");
      } else {
        setError("Sorry, something went wrong during registration. Please try again in a few minutes.");
      }
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto p-6 w-full max-w-lg my-12">
      <h1 className="text-3xl font-bold mb-4 text-center">Create New Teacher Account</h1>
      {(error || googleError) && (
        <div className="mb-4 text-red-600 text-sm text-center">
          {error || googleError?.message}
        </div>
      )}
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
          Password requirements:
          <ul className="list-disc pl-5">
            <li>8-64 characters long</li>
            <li>At least one uppercase letter</li>
            <li>At least one lowercase letter</li>
            <li>At least one number</li>
            <li>At least one special character</li>
            <li>No leading or trailing spaces</li>
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
            You agree to our <a href="/terms-of-service" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a>
          </label>
        </div>
        <button
          type="submit"
          disabled={loading || googleLoading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {loading ? "Registering..." : "Register New User"}
        </button>

      </form>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-blue-50 text-gray-500">Or continue with</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading || googleLoading}
        className={`w-full flex items-center justify-center px-4 py-2 border ${
          loading || googleLoading ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'
        } border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
      >
        <Image
          src="/images/google-logo.svg"
          alt="Google logo"
          width={40}
          height={40}
          className="mr-2"
        />
        {googleLoading ? "Signing in..." : "Sign up with Google"}
      </button>
      <div className="mt-4 text-center">
        <Link href="/auth/login" className="text-sm text-blue-600 hover:underline">
          Already have an account? Log In
        </Link>
      </div>
    </div>
  );
}