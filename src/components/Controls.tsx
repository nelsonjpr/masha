import React from 'react';
import { Utensils, Moon, Gamepad2, Mic, Sparkles } from 'lucide-react';
import type { MashaAction } from '../types';

interface ControlsProps {
  onAction: (action: MashaAction) => void;
  onTalk: () => void;
  isListening: boolean;
}

export const Controls: React.FC<ControlsProps> = ({ onAction, onTalk, isListening }) => {
  const btnClass = "p-4 rounded-full bg-white shadow-lg hover:bg-gray-100 active:scale-95 transition-all flex flex-col items-center gap-1";
  const iconClass = "w-8 h-8 text-masha-purple";

  return (
    <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 px-4 flex-wrap">
      <button className={btnClass} onClick={() => onAction('eating')}>
        <Utensils className={iconClass} />
        <span className="text-xs font-bold text-gray-600">Comer</span>
      </button>
      
      <button className={btnClass} onClick={() => onAction('sleeping')}>
        <Moon className={iconClass} />
        <span className="text-xs font-bold text-gray-600">Dormir</span>
      </button>

      <button 
        className={`${btnClass} ${isListening ? 'bg-red-100 ring-4 ring-red-300' : ''}`} 
        onClick={onTalk}
      >
        <Mic className={`w-10 h-10 ${isListening ? 'text-red-500' : 'text-masha-pink'}`} />
        <span className="text-xs font-bold text-gray-600">{isListening ? 'Parar y Enviar' : 'Grabar Voz'}</span>
      </button>

      <button className={btnClass} onClick={() => onAction('playing')}>
        <Gamepad2 className={iconClass} />
        <span className="text-xs font-bold text-gray-600">Jugar</span>
      </button>

      <button className={btnClass} onClick={() => onAction('idle')}>
        <Sparkles className={iconClass} />
        <span className="text-xs font-bold text-gray-600">Nada</span>
      </button>
    </div>
  );
};
