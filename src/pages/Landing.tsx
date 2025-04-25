import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
const Landing: React.FC = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen flex flex-col items-center bg-[#EAE9FF] relative">
      {/* Center Logo - Moved up and added proper spacing */}
      <div className="flex-1 flex items-center justify-center pt-12 mb-32 py-0">
        <img src="/lovable-uploads/cc8c39f9-28ca-46b1-b6c4-6d0a00ba71dd.png" alt="TagTeam Logo" className="w-48 h-48 object-contain" />
      </div>

      {/* Permanent Bottom Sheet - Improved shadow and spacing */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
        <div className="px-8 pt-12 pb-10 py-[24px]">
          <div className="text-center space-y-8">
            <h1 className="text-2xl font-bold">Welcome to TagTeam</h1>
            <p className="font-['Hanken_Grotesk'] text-[20px] leading-relaxed text-gray-700">
              Your hobbies and interests change your life, TagTeam changes the way you pursue them
            </p>
          </div>
          <div className="mt-12">
            <Button onClick={() => navigate('/signup')} className="w-full bg-black text-white hover:bg-black/90 py-6 rounded-xl text-lg">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>;
};
export default Landing;