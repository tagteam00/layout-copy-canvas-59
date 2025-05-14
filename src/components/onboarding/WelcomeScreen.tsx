import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  const { user, hasCompletedOnboarding } = useAuth();

  const handleGetStarted = () => {
    // Prevent multiple clicks
    if (isNavigating) return;
    
    setIsNavigating(true);
    
    // If user is logged in and completed onboarding, go to home
    if (user && hasCompletedOnboarding) {
      navigate('/home');
    } 
    // If user is logged in but hasn't completed onboarding, go to onboarding
    else if (user && !hasCompletedOnboarding) {
      navigate('/onboarding');
    } 
    // Otherwise go to signup
    else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-[90%] max-w-md bg-[#F0F0FF] rounded-[20px] border border-[#E6E6FF] p-6 flex flex-col items-center">
        {/* Logo */}
        <div className="relative w-[35%] aspect-square mb-8 mt-4">
          <img 
            src="/lovable-uploads/dcc36042-2b42-407d-8eb1-e3324a3a3f5b.png" 
            alt="TagTeam Logo" 
            className="w-full h-full object-scale-down" 
          />
        </div>

        {/* Text Content */}
        <div className="w-full space-y-4 mb-8">
          <h1 className="text-[28px] leading-[34px] font-semibold text-[#333333]">
            Welcome to tagteam
          </h1>
          <p className="text-base leading-[22px] text-[#444444]">
            Your interests and hobbies change your life, tagteam changes the way you pursue them
          </p>
        </div>

        {/* CTA Button */}
        <Button 
          onClick={handleGetStarted} 
          disabled={isNavigating}
          className="w-[85%] h-14 bg-black text-white rounded-full font-medium text-base shadow-sm hover:bg-black/90 transition-colors mt-auto"
        >
          {isNavigating ? 'Loading...' : 'Get Started'}
        </Button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
