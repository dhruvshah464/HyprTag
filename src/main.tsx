import React, {StrictMode, ErrorInfo, ReactNode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './lib/auth';

// Define process for browser compatibility
if (typeof (window as any).process === 'undefined') {
  (window as any).process = { env: {} };
}

class ErrorBoundary extends (React.Component as any) {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: ErrorInfo) {
    console.error("Critical Runtime Error:", error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state as any;
    if (hasError) {
      return (
        <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-10 text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">System Failure</h1>
          <p className="text-white/60 mb-6 max-w-md">The neural strategist encountered a fatal error during initialization.</p>
          <pre className="bg-black p-4 rounded-xl text-xs text-red-400 overflow-auto max-w-full">
            {error?.message || String(error)}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            className="mt-8 px-6 py-3 bg-white text-black rounded-xl font-bold uppercase tracking-widest text-[10px]"
          >
            Retry Protocol
          </button>
        </div>
      );
    }
    return (this.props as any).children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
);
