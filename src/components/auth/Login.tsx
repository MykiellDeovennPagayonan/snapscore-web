'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '../ui/card'
import { auth } from '../../lib/firebase/init'
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await signInWithEmailAndPassword(email, password)
      if (res) {
        console.log('User registered:', res)
        setEmail('')
        setPassword('')
        router.push('/dashboard')
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err : any) {
      console.error('Login failed:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-white p-8 rounded-lg shadow-md w-96 m-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
      {error && (
        <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      <div className="mt-4 text-center">
        <Link href="/auth/register" className="text-sm text-indigo-600 hover:text-indigo-500">
          Don&apos;t have an account? Register here
        </Link>
      </div>
    </Card>
  )
}
