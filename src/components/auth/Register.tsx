'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '../ui/card'
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth } from '../../lib/firebase/init'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }
    
    setLoading(true)
    try {
      const res = await createUserWithEmailAndPassword(email, password)
      if (res) {
        console.log('User registered:', res)
        setName('')
        setEmail('')
        setPassword('')
        router.push('/dashboard')
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-white p-8 rounded-lg shadow-md w-96 m-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
      {error && (
        <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <div className="mt-4 text-center">
        <Link href="/auth/login" className="text-sm text-indigo-600 hover:text-indigo-500">
          Already have an account? Login here
        </Link>
      </div>
    </Card>
  )
}
