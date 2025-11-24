import React from 'react';
import { motion } from 'framer-motion';
import type { MashaAction } from '../types';

interface MashaProps {
  action: MashaAction;
}

export const Masha: React.FC<MashaProps> = ({ action }) => {
  // Placeholder for Masha's image. 
  // In a real app, you would switch images based on 'action'.
  
  const variants = {
    idle: { y: [0, -10, 0], transition: { repeat: Infinity, duration: 2 } },
    eating: { scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 0.5 } },
    sleeping: { opacity: 0.8, scale: 0.95 },
    playing: { rotate: [0, -10, 10, 0], transition: { repeat: Infinity, duration: 0.5 } },
    talking: { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 0.2 } },
    listening: { scale: 1.05 },
  };

  return (
    <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center">
      <motion.div
        animate={action}
        variants={variants}
        className="w-full h-full bg-contain bg-center bg-no-repeat drop-shadow-2xl"
        style={{
            // Using a placeholder image of a cartoon girl if available, or just a color block
            // Ideally, replace this URL with a local asset in /public/masha.png
            backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/en/c/c9/Masha_and_the_Bear_Logo.png")', 
            // Note: The above is a logo, user should replace with character sprite
        }}
      >
        {/* Simple CSS eyes to make it look alive if image fails or is just a logo */}
        <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-white rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-white rounded-full animate-pulse" />
      </motion.div>
      
      {action === 'sleeping' && (
        <div className="absolute -top-10 right-0 text-4xl animate-bounce">💤</div>
      )}
    </div>
  );
};
