import { useState, useEffect } from 'react';
import { Masha3D } from './components/Masha3D';
import { useSpeech } from './hooks/useSpeech';
import { getMashaResponse, setApiConfig } from './services/openai';
import type { MashaAction, GameState } from './types';
import { Settings, Utensils, Moon, Smile, ShoppingCart, Plane } from 'lucide-react';

function App() {
  const [action, setAction] = useState<MashaAction>('idle');
  const [gameState, setGameState] = useState<GameState>({
    hunger: 100,
    happiness: 100,
    energy: 100,
    cleanliness: 100,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [level] = useState(2); // Mock level from screenshot

  const [isConversationMode, setIsConversationMode] = useState(false);

  const { isListening, transcript, speak, listen, setTranscript } = useSpeech();

  // Load saved settings on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('GOOGLE_API_KEY');
    
    if (savedKey) setApiKeyInput(savedKey);
  }, []);

  // Handle speech recognition result
  useEffect(() => {
    if (transcript && !isListening) {
      handleConversation(transcript);
    }
  }, [transcript, isListening]);

  const handleConversation = async (text: string) => {
    setAction('listening');
    setTranscript(''); 
    
    const response = await getMashaResponse(text);
    
    setAction('talking');
    speak(response, () => {
      // When Masha finishes speaking, if in conversation mode, listen again
      if (isConversationMode) {
        setTimeout(() => {
          listen();
        }, 500); // Small delay to avoid picking up own echo
      }
    });
  };

  const toggleConversation = () => {
    if (isConversationMode) {
      setIsConversationMode(false);
    } else {
      setIsConversationMode(true);
      listen();
    }
  };

  // Reset action when speech ends
  useEffect(() => {
    if (action === 'talking') {
      const timer = setTimeout(() => setAction('idle'), 5000); 
      return () => clearTimeout(timer);
    }
  }, [action]);

  const handleAction = (newAction: MashaAction) => {
    setAction(newAction);
    
    if (newAction === 'eating') {
      setGameState(prev => ({ ...prev, hunger: Math.min(100, prev.hunger + 20) }));
      setTimeout(() => setAction('idle'), 3000);
    }
    if (newAction === 'sleeping') {
      setGameState(prev => ({ ...prev, energy: Math.min(100, prev.energy + 20) }));
    }
    if (newAction === 'playing') {
      setGameState(prev => ({ ...prev, happiness: Math.min(100, prev.happiness + 20), energy: Math.max(0, prev.energy - 10) }));
      setTimeout(() => setAction('idle'), 3000);
    }
  };

  const saveApiKey = () => {
    setApiConfig(apiKeyInput);
    setShowSettings(false);
    alert('Configuración guardada!');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#e0f2fe]">
      {/* Room Background - Talking Tom Style */}
      <div className="absolute inset-0 z-0">
        {/* Wall */}
        <div className="absolute top-0 w-full h-[70%] bg-[#4ade80] border-b-8 border-[#86efac]">
           {/* Chalkboard removed */}
        </div>
        {/* Floor */}
        <div className="absolute bottom-0 w-full h-[30%] bg-[#fbbf24]" />
      </div>

      {/* Top Left UI: Level & Status */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {/* Level Badge */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 bg-white rounded-full border-4 border-gray-200 flex items-center justify-center">
            <span className="text-2xl font-bold text-purple-600">{level}</span>
          </div>
          {/* Progress Ring (Mock) */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="32" cy="32" r="28" stroke="#a855f7" strokeWidth="4" fill="none" strokeDasharray="175" strokeDashoffset="40" />
          </svg>
        </div>
        
        {/* Travel/Status Icon */}
        <div className="w-12 h-12 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center shadow-md">
          <Plane className="w-6 h-6 text-green-500" />
        </div>
      </div>

      {/* Settings Button */}
      <button 
        onClick={() => setShowSettings(!showSettings)}
        className="absolute top-4 right-4 p-2 bg-white/50 rounded-full hover:bg-white/80 z-50"
      >
        <Settings className="w-6 h-6 text-gray-700" />
      </button>

      {/* Settings Modal */}
      {showSettings && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Configuración de IA (Google Gemini)</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Google API Key</label>
              <input 
                type="password" 
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="AIza..."
              />
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowSettings(false)} className="px-4 py-2 text-gray-600">Cancelar</button>
              <button onClick={saveApiKey} className="px-4 py-2 bg-masha-pink text-white rounded">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Character Area */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pt-20">
        <Masha3D action={action} />
      </div>

      {/* Bottom Action Bar - Talking Tom Style */}
      <div className="absolute bottom-6 left-0 w-full flex justify-center items-end gap-4 z-30 px-4">
        
        {/* Shopping (Mock) */}
        <button className="w-14 h-14 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center shadow-lg active:scale-95 transition-transform">
          <ShoppingCart className="w-7 h-7 text-gray-600" />
          <div className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">1</div>
        </button>

        {/* Play / Talk */}
        <div className="flex flex-col items-center gap-1">
          <button 
            onClick={toggleConversation}
            className={`w-16 h-16 rounded-full border-4 flex items-center justify-center shadow-xl transition-all ${
              isListening || isConversationMode ? 'bg-red-100 border-red-500 scale-110' : 'bg-[#bef264] border-[#84cc16] hover:scale-105'
            }`}
          >
            <Smile className={`w-8 h-8 ${isListening || isConversationMode ? 'text-red-600' : 'text-[#3f6212]'}`} />
          </button>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden border border-gray-300">
            <div className="h-full bg-[#84cc16]" style={{ width: `${gameState.happiness}%` }} />
          </div>
        </div>

        {/* Eat */}
        <div className="flex flex-col items-center gap-1">
          <button 
            onClick={() => handleAction('eating')}
            className="w-16 h-16 bg-[#bef264] rounded-full border-4 border-[#84cc16] flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
          >
            <Utensils className="w-8 h-8 text-[#3f6212]" />
          </button>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden border border-gray-300">
            <div className="h-full bg-[#84cc16]" style={{ width: `${gameState.hunger}%` }} />
          </div>
        </div>

        {/* Toilet (Replaced with Cleanliness/Wash for Masha context, or just keep icon) */}
        {/* Using a generic 'clean' icon or similar, but let's stick to the 'Talking Tom' layout which has a toilet. 
            For Masha, maybe 'Potty'? Or just 'Wash'. Let's use a generic circle for now to match layout. */}
        <div className="flex flex-col items-center gap-1">
           <button 
            className="w-16 h-16 bg-[#bef264] rounded-full border-4 border-[#84cc16] flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
          >
            {/* Using a simple circle/icon for 'Toilet' equivalent */}
            <div className="w-8 h-8 border-2 border-[#3f6212] rounded-b-xl rounded-t-sm" /> 
          </button>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden border border-gray-300">
            <div className="h-full bg-[#84cc16]" style={{ width: '80%' }} />
          </div>
        </div>

        {/* Sleep */}
        <div className="flex flex-col items-center gap-1">
          <button 
            onClick={() => handleAction('sleeping')}
            className="w-16 h-16 bg-[#bef264] rounded-full border-4 border-[#84cc16] flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
          >
            <Moon className="w-8 h-8 text-[#3f6212]" />
          </button>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden border border-gray-300">
            <div className="h-full bg-[#84cc16]" style={{ width: `${gameState.energy}%` }} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
