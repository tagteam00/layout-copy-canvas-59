
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white relative">
      {/* Center Logo */}
      <div className="flex-1 flex items-center justify-center">
        <img 
          src="/lovable-uploads/cc8c39f9-28ca-46b1-b6c4-6d0a00ba71dd.png" 
          alt="TagTeam Logo" 
          className="w-48 h-48 object-contain"
        />
      </div>

      {/* Permanent Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] shadow-lg">
        <div className="px-8 pt-10 pb-8">
          <div className="text-center space-y-6">
            <h1 className="text-2xl font-bold mb-4">Welcome to TagTeam</h1>
            <p className="font-['Hanken_Grotesk'] text-[20px] leading-relaxed text-gray-700">
              Your hobbies and interests change your life, TagTeam changes the way you pursue them
            </p>
          </div>
          <div className="mt-10">
            <Button
              onClick={() => navigate('/signup')}
              className="w-full bg-black text-white hover:bg-black/90 py-6 rounded-xl text-lg"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
