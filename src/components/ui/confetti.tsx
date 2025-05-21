
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ConfettiPieceProps {
  size: number;
  color: string;
  x: number;
  delay: number;
}

const ConfettiPiece: React.FC<ConfettiPieceProps> = ({ size, color, x, delay }) => {
  return (
    <motion.div
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: size * 0.3,
        position: "absolute",
        top: -20,
        left: `${x}%`
      }}
      initial={{ y: -20, rotate: 0, opacity: 0 }}
      animate={{
        y: ["0%", "100%"],
        rotate: [0, 360],
        opacity: [1, 0]
      }}
      transition={{
        duration: Math.random() * 2 + 2,
        ease: "easeOut",
        delay: delay,
        repeat: 2,
        repeatType: "loop"
      }}
    />
  );
};

interface ConfettiProps {
  active: boolean;
  duration?: number;
}

export const Confetti: React.FC<ConfettiProps> = ({ active, duration = 6 }) => {
  const [isActive, setIsActive] = useState(active);
  const colors = ["#8CFF6E", "#827AFF", "#FFD700", "#FF6B6B", "#4ECDC4"];
  const pieces = Array.from({ length: 80 });

  useEffect(() => {
    setIsActive(active);
    
    if (active) {
      const timer = setTimeout(() => {
        setIsActive(false);
      }, duration * 1000);
      
      return () => clearTimeout(timer);
    }
  }, [active, duration]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((_, i) => (
        <ConfettiPiece
          key={i}
          size={Math.random() * 10 + 5}
          color={colors[Math.floor(Math.random() * colors.length)]}
          x={Math.random() * 100}
          delay={Math.random() * 2}
        />
      ))}
    </div>
  );
};
