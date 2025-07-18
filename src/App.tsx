import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  }
});

// Simplified error boundary without browser API calls
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, info);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="p-6 rounded-lg shadow-sm max-w-md bg-red-50 border border-red-200">
            <h2 className="text-xl font-semibold mb-2 text-red-800">
              Something went wrong
            </h2>
            <p className="mb-4 text-red-700">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button 
              className="px-4 py-2 rounded-md transition-colors bg-red-600 text-white hover:bg-red-700"
              onClick={() => {
                this.setState({ hasError: false, error: null });
              }}
            >
              Try Again
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
