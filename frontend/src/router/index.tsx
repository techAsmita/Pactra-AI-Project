import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/layouts/AppShell'
import { LandingPage } from '@/pages/Landing'
import { LoginPage } from '@/pages/Login'
import { OnboardingPage } from '@/pages/Onboarding'
import { WorkspacePage } from '@/pages/Workspace'
import { ContractsPage } from '@/pages/Contracts'
import { UploadPage } from '@/pages/Upload'
import { ContextReviewPage } from '@/pages/ContextReview'
import { AgreementWorkspacePage } from '@/pages/AgreementWorkspace'
import { AnalysisPage } from '@/pages/Analysis'
import { DecisionCenterPage } from '@/pages/DecisionCenter'
import { NegotiationPage } from '@/pages/Negotiation'
import { AnalyticsPage } from '@/pages/Analytics'
import { SettingsPage } from '@/pages/Settings'

export const router = createBrowserRouter([
  // ─── Marketing Layer ──────────────────────────────────────────────────
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/onboarding', element: <OnboardingPage /> },

  // ─── Application Layer ─────────────────────────────────────────────────
  {
    element: <AppShell />,
    children: [
      { path: '/workspace', element: <WorkspacePage /> },

      // Upload flow: upload → context review → analysis
      { path: '/contracts', element: <ContractsPage /> },
      { path: '/contracts/new', element: <UploadPage /> },
      { path: '/contracts/new/context', element: <ContextReviewPage /> },

      // Agreement Workspace shell with nested tab routes
      {
        path: '/contracts/:id',
        element: <AgreementWorkspacePage />,
        children: [
          { index: true, element: <Navigate to="analysis" replace /> },
          { path: 'analysis',  element: <AnalysisPage /> },
          { path: 'decision',  element: <DecisionCenterPage /> },
          { path: 'negotiate', element: <NegotiationPage /> },
        ],
      },

      { path: '/negotiations', element: <NegotiationPage /> },
      { path: '/analytics',   element: <AnalyticsPage /> },
      { path: '/settings',    element: <SettingsPage /> },
    ],
  },

  { path: '*', element: <Navigate to="/" replace /> },
])
