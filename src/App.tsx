
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Improve performance by preventing unnecessary refetches
      retry: 1, // Limit retries to improve performance
    }
  }
});

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading, hasCompletedOnboarding } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>;
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
const OnboardingRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

// Public route - redirects to home if already authenticated
const PublicRoute = ({ children }) => {
  const { user, loading, hasCompletedOnboarding } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>;
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
);

export default App;
