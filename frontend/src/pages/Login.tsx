import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignIn = () => {
    // Demo mode: no backend auth yet — proceed straight to the workspace.
    navigate('/workspace')
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
        className="w-full max-w-sm"
      >
        <Link to="/" className="flex items-center gap-3 justify-center mb-8">
          <div className="w-8 h-8 rounded-btn bg-brand flex items-center justify-center">
            <Zap size={16} className="text-white" aria-hidden="true" />
          </div>
          <span className="font-heading font-bold text-h4 text-text-primary">Pactra</span>
        </Link>

        <div className="rounded-card border border-border-default bg-bg-secondary p-8">
          <h1 className="font-heading text-h3 text-text-primary text-center mb-1">Welcome back</h1>
          <p className="text-small text-text-muted font-body text-center mb-6">
            Sign in to continue to your workspace.
          </p>
          <div className="flex flex-col gap-4">
            <Input
              label="Email" type="email" placeholder="you@company.com"
              value={email} onChange={e => setEmail(e.target.value)}
            />
            <Input
              label="Password" type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
            />
            <Button variant="primary" size="lg" className="w-full mt-2" onClick={handleSignIn}>
              Sign In
            </Button>
          </div>

          <div className="flex items-center gap-3 my-6">
            <span className="h-px flex-1 bg-border-default" aria-hidden="true" />
            <span className="text-caption font-body text-text-muted uppercase tracking-widest">or</span>
            <span className="h-px flex-1 bg-border-default" aria-hidden="true" />
          </div>

          <Button
            variant="secondary" size="lg" className="w-full"
            onClick={() => navigate('/workspace')}
          >
            Explore Demo Workspace
          </Button>

          <p className="text-caption text-text-muted font-body text-center mt-6">
            Don't have an account?{' '}
            <Link to="/onboarding" className="text-brand hover:text-brand-hover transition-colors duration-fast">
              Create your founder profile
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
