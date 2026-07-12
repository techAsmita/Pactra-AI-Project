import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/router'
import { ToastProvider } from '@/components/ui/Toast'
import { FounderContextProvider } from '@/hooks/useFounderContext'
import { AgreementsProvider } from '@/hooks/useAgreements'
import '@/styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FounderContextProvider>
      <AgreementsProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </AgreementsProvider>
    </FounderContextProvider>
  </React.StrictMode>,
)
