'use client';

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase/init';
import { ArrowLeft, Feather, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

interface User {
  id: string;
  fullName: string;
  email: string;
  school?: string;
}

export default function PersonalInformation() {
  const [firebaseUser, firebaseLoading, firebaseError] = useAuthState(auth);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', school: '' });

  useEffect(() => {
    if (firebaseUser) {
      fetchUser(firebaseUser.uid);
    }
  }, [firebaseUser]);

  const fetchUser = async (firebaseId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/users/firebase/${firebaseId}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      const data = await response.json();
      setUser(data);
      setFormData({ fullName: data.fullName, school: data.school || '' });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      window.location.reload()
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (firebaseLoading || loading) {
    return (
      <div className="max-w-4xl w-full p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="w-5 h-5" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-4 w-full" />
        <div className="space-y-4">
          <div>
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <Skeleton className="h-10 w-full mt-4" />
      </div>
    );
  }

  if (firebaseError) return <div>Error: {firebaseError.message}</div>;
  if (!firebaseUser) return <div>Please sign in</div>;

  return (
    <div className="max-w-4xl w-full p-6">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => router.back()} className="hover:opacity-80">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">Personal Information</h1>
      </div>
      <p className="text-gray-600 mb-4">Manage your account information here.</p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700">Full Name:</label>
          <div className="relative">
            <Feather className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
            <Input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="pl-8"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            School/University
          </label>
          <div className="relative">
            <Feather className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
            <Input
              name="school"
              value={formData.school}
              onChange={handleChange}
              className="pl-8"
            />
          </div>
        </div>
      </div>
      <button onClick={handleSave} className={`w-full mt-6 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-gray-400' : 'bg-gray-600 hover:bg-gray-700'
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`} disabled={saving}>
        {saving ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Saving...
          </span>
        ) : (
          'Save'
        )}
      </button>
    </div>
  );
}
