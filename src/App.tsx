
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
import NotificationsPage from "./pages/NotificationsPage";
import Settings from "./pages/Settings";
import WelcomeScreen from "./components/onboarding/WelcomeScreen";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { lazy, Suspense } from "react";
import { toast } from "sonner";
import React from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Improve performance by preventing unnecessary refetches
      retry: 1, // Limit retries to improve performance
    }
  }
});

// Error boundary component with proper TypeScript interface
interface ErrorBoundaryProps {
  children: React.ReactNode; // Added proper children type
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
          <div className="bg-red-50 p-6 rounded-lg shadow-sm max-w-md">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Something went wrong</h2>
            <p className="text-red-700 mb-4">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button 
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = "/";
              }}
            >
              Return Home
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
    // Increment attempt counter to detect potential infinite loops
    setAttemptCount(prev => prev + 1);
    
    // If we've tried too many times, something is wrong
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
  
  // Redirect to onboarding if the user hasn't completed it yet
  if (!hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

// Onboarding route - accessible only to authenticated users who haven't completed onboarding
const OnboardingRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, hasCompletedOnboarding, authError } = useAuth();
  const [attemptCount, setAttemptCount] = useState(0);

  useEffect(() => {
    // Increment attempt counter to detect potential infinite loops
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
  
  // If the user has already completed onboarding, redirect to home
  if (hasCompletedOnboarding) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

// Public route - redirects to home if already authenticated
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, hasCompletedOnboarding, authError } = useAuth();
  const [transitionTime, setTransitionTime] = useState(Date.now());
  const [redirectAttempts, setRedirectAttempts] = useState(0);
  const location = useLocation();

  useEffect(() => {
    // Track transition attempts to detect loops
    setRedirectAttempts(prev => prev + 1);
    setTransitionTime(Date.now());
    
    // If we're stuck in a possible loop, don't redirect
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
    // Just show the children if there's an auth error on public routes
    return children;
  }

  // Safety check - if we're in a potential loop, just show the current component
  if (redirectAttempts > 3 && Date.now() - transitionTime < 3000) {
    return children;
  }

  // Special case for the welcome screen - don't redirect to home
  if (location.pathname === '/') {
    return children;
  }

  // If user exists and has completed onboarding, redirect to home
  if (user && hasCompletedOnboarding) {
    return <Navigate to="/home" replace />;
  }
  
  // If user exists but hasn't completed onboarding, redirect to onboarding
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
        {/* Public routes - redirect to home if already authenticated */}
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
        
        {/* Onboarding route - for authenticated users who haven't completed onboarding */}
        <Route path="/onboarding" element={
          <OnboardingRoute>
            <PageTransition>
              <Onboarding />
            </PageTransition>
          </OnboardingRoute>
        } />

        {/* Protected routes - require authentication and completed onboarding */}
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
