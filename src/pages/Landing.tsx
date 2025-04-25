
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white relative p-4">
      {/* Center Logo */}
      <div className="flex-1 flex items-center justify-center">
        <img 
          src="/lovable-uploads/cc8c39f9-28ca-46b1-b6c4-6d0a00ba71dd.png" 
          alt="TagTeam Logo" 
          className="w-48 h-48 object-contain"
        />
      </div>

      {/* Bottom Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent 
          side="bottom" 
          className="h-[240px] rounded-t-[32px]"
        >
          <SheetHeader className="text-center pt-6">
            <SheetTitle className="text-2xl font-bold mb-4">Welcome to TagTeam</SheetTitle>
            <SheetDescription className="font-['Hanken_Grotesk'] text-[20px] leading-tight text-gray-700 px-4 mb-8">
              Your hobbies and interests change your life, TagTeam changes the way you pursue them
            </SheetDescription>
          </SheetHeader>
          <div className="flex justify-center px-4">
            <Button
              onClick={() => navigate('/signup')}
              className="w-full bg-black text-white hover:bg-black/90 py-6 rounded-xl text-lg"
            >
              Get Started
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Landing;
