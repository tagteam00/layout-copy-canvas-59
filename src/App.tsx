import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./components/layout/PageTransition";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Onboarding from "./pages/auth/Onboarding";
import TagTeamHub from "./pages/TagTeamHub";
import ProfilePage from "./pages/ProfilePage";
import UserProfilePage from "./pages/UserProfilePage";
import NotificationsPage from "./pages/NotificationsPage";
import Settings from "./pages/Settings";
import WelcomeScreen from "./components/onboarding/WelcomeScreen";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { lazy, Suspense } from "react";
import { toast } from "sonner";
import AuthCallback from "./pages/auth/Callback";
import { getSecurityContext } from "@/utils/securityUtils";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  }
});

// Enhanced error boundary with security-specific error handling
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  isSecurityError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null, isSecurityError: false };
  
  static getDerivedStateFromError(error: Error) {
    const isSecurityError = error.message.includes('insecure') || 
                           error.message.includes('HTTPS') || 
                           error.message.includes('secure context') ||
                           error.message.includes('operation is insecure');
    
    return { hasError: true, error, isSecurityError };
  }
  
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, info);
    
    // Log security context for debugging
    if (this.state.isSecurityError) {
      console.error("Security context:", getSecurityContext());
    }
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className={`p-6 rounded-lg shadow-sm max-w-md ${
            this.state.isSecurityError ? 'bg-yellow-50 border border-yellow-200' : 'bg-red-50'
          }`}>
            <h2 className={`text-xl font-semibold mb-2 ${
              this.state.isSecurityError ? 'text-yellow-800' : 'text-red-800'
            }`}>
              {this.state.isSecurityError ? 'Security Notice' : 'Something went wrong'}
            </h2>
            <p className={`mb-4 ${
              this.state.isSecurityError ? 'text-yellow-700' : 'text-red-700'
            }`}>
              {this.state.isSecurityError ? 
                'Some features require a secure connection (HTTPS). The app will continue to work, but location detection may be unavailable.' :
                (this.state.error?.message || "An unexpected error occurred")
              }
            </p>
            <button 
              className={`px-4 py-2 rounded-md transition-colors ${
                this.state.isSecurityError ? 
                'bg-yellow-600 text-white hover:bg-yellow-700' : 
                'bg-red-600 text-white hover:bg-red-700'
              }`}
              onClick={() => {
                this.setState({ hasError: false, error: null, isSecurityError: false });
                if (this.state.isSecurityError) {
                  // For security errors, just reload the component
                  window.location.reload();
                } else {
                  // For other errors, go home
                  window.location.href = "/";
                }
              }}
            >
              {this.state.isSecurityError ? 'Continue' : 'Return Home'}
            </button>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Protected route component with improved error handling
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, hasCompletedOnboarding, authError } = useAuth();
  const [attemptCount, setAttemptCount] = useState(0);
  
  useEffect(() => {
    setAttemptCount(prev => prev + 1);
    
    if (attemptCount > 5) {
      console.error("Too many authentication check attempts - breaking potential loop");
      toast.error("Authentication error. Please try signing in again.");
    }
  }, []);
  
  if (loading && attemptCount < 5) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-center">
        <p className="text-gray-600">Loading your account...</p>
      </div>
    </div>;
  }

  if (authError) {
    toast.error("Authentication error: " + authError);
    return <Navigate to="/signin" replace />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (!hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

// Onboarding route with improved handling
const OnboardingRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, hasCompletedOnboarding, authError } = useAuth();
  const [attemptCount, setAttemptCount] = useState(0);

  useEffect(() => {
    setAttemptCount(prev => prev + 1);
  }, []);

  if (loading && attemptCount < 5) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-center">
        <p className="text-gray-600">Loading your account...</p>
      </div>
    </div>;
  }

  if (authError) {
    toast.error("Authentication error: " + authError);
    return <Navigate to="/signin" replace />;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  
  if (hasCompletedOnboarding) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

// Public route with auth route handling
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, hasCompletedOnboarding, authError } = useAuth();
  const [transitionTime, setTransitionTime] = useState(Date.now());
  const [redirectAttempts, setRedirectAttempts] = useState(0);
  const location = useLocation();

  useEffect(() => {
    setRedirectAttempts(prev => prev + 1);
    setTransitionTime(Date.now());
    
    if (redirectAttempts > 3 && Date.now() - transitionTime < 3000) {
      console.warn("Potential redirect loop detected, staying on current page");
      toast.error("Navigation error detected. Please try signing in again.");
    }
  }, [location.pathname]);

  if (loading && redirectAttempts < 5) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>;
  }

  if (authError) {
    return children;
  }

  if (redirectAttempts > 3 && Date.now() - transitionTime < 3000) {
    return children;
  }

  if (location.pathname === '/') {
    return children;
  }
  
  if (['/signin', '/signup', '/auth/callback'].includes(location.pathname)) {
    return children;
  }

  if (user && hasCompletedOnboarding) {
    return <Navigate to="/home" replace />;
  }
  
  if (user && !hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PublicRoute>
            <PageTransition>
              <WelcomeScreen />
            </PageTransition>
          </PublicRoute>
        } />
        <Route path="/signin" element={
          <PublicRoute>
            <PageTransition>
              <SignIn />
            </PageTransition>
          </PublicRoute>
        } />
        <Route path="/signup" element={
          <PublicRoute>
            <PageTransition>
              <SignUp />
            </PageTransition>
          </PublicRoute>
        } />
        
        <Route path="/auth/callback" element={
          <PublicRoute>
            <PageTransition>
              <AuthCallback />
            </PageTransition>
          </PublicRoute>
        } />
        
        <Route path="/onboarding" element={
          <OnboardingRoute>
            <PageTransition>
              <Onboarding />
            </PageTransition>
          </OnboardingRoute>
        } />

        <Route path="/home" element={
          <ProtectedRoute>
            <PageTransition>
              <Index />
            </PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/tagteam" element={
          <ProtectedRoute>
            <PageTransition>
              <TagTeamHub />
            </PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <PageTransition>
              <ProfilePage />
            </PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/user/:userId" element={
          <ProtectedRoute>
            <PageTransition>
              <UserProfilePage />
            </PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute>
            <PageTransition>
              <NotificationsPage />
            </PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <PageTransition>
              <Settings />
            </PageTransition>
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
