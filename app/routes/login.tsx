import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { supabase } from '~/utils/supabase'
import { ArrowLeftIcon } from '~/components/icons'

export function meta() {
  return [
    { title: "Sign In - Nomad Jobs" },
    { name: "description", content: "Sign in to Nomad Jobs." },
  ]
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950 px-4 py-20 flex justify-center items-center">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-10 lg:p-12 border-2 border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 text-center">Welcome Back</h2>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 font-bold rounded-lg border-2 border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all" 
            />
          </div>
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-4 bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 border-2 border-blue-800 dark:border-transparent transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-600 dark:text-slate-400 font-medium">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 dark:text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
