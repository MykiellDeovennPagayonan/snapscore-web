/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../../lib/firebase/init';
import { sendPasswordResetEmail, onAuthStateChanged } from 'firebase/auth';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ChangePassword() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true); 
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setPageLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleChangePassword = async () => {
    setMessage('');
    setError('');

    if (!auth.currentUser || !auth.currentUser.email) {
      setError('No user email found. Please try again later.');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, auth.currentUser.email);
      setMessage('Password reset email sent! Please check your inbox.');
    } catch (err: any) {
      console.error('Error sending reset email:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="max-w-4xl w-full p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="w-5 h-5" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl w-full p-6">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => router.back()} className="hover:opacity-80">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">Change Password</h1>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-md text-center text-sm">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-center text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleChangePassword}
        disabled={loading}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          loading ? 'bg-gray-400' : 'bg-gray-600 hover:bg-gray-700'
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
      >
        {loading ? 'Sending...' : 'Send Reset Password Email'}
      </button>
    </div>
  );
}
