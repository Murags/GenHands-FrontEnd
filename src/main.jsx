import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#F5F1E8',
            color: '#4A3728',
            border: '1px solid #8B7355',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(74, 55, 40, 0.15)',
          },
          success: {
            iconTheme: {
              primary: '#2D5016',
              secondary: '#F5F1E8',
            },
            style: {
              background: '#E8F5E8',
              color: '#2D5016',
              border: '1px solid #4F7942',
            },
          },
          error: {
            iconTheme: {
              primary: '#8B2635',
              secondary: '#F5F1E8',
            },
            style: {
              background: '#FDF2F2',
              color: '#8B2635',
              border: '1px solid #DC6803',
            },
          },
        }}
      />
    </QueryClientProvider>
  </StrictMode>,
)
