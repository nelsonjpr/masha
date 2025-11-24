import { useState, useCallback, useRef } from 'react';
import axios from 'axios';

export const useSpeech = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    
    // Masha Voice Configuration
    // High pitch (child-like) and slightly faster rate
    utterance.pitch = 1.6; 
    utterance.rate = 1.1;

    // Try to find a female voice if available
    const voices = window.speechSynthesis.getVoices();
    // Prefer Google Español or Microsoft Elena/Sabina
    const preferredVoice = voices.find(v => 
      (v.lang.includes('es') && v.name.includes('Google')) || 
      (v.lang.includes('es') && v.name.includes('Microsoft'))
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      if (onEnd) onEnd();
    };
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  const listen = useCallback(async () => {
    if (isListening) {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
        setIsListening(false);
      }
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');
        
        // Optional: send API key if not in backend env
        const key = localStorage.getItem('GOOGLE_API_KEY');
        if (key) formData.append('apiKey', key);

        try {
          console.log('Enviando audio a Gemini...');
          const response = await axios.post('http://localhost:3001/api/transcribe', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          
          const text = response.data.text;
          console.log('Transcripción:', text);
          if (text) setTranscript(text);
        } catch (error: any) {
          console.error('Error en transcripción:', error);
          const serverError = error.response?.data?.message || error.response?.data?.error || error.message;
          alert(`Error del servidor: ${serverError}`);
        }
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsListening(true);
      console.log('Grabando audio...');

    } catch (err) {
      console.error('Error accediendo al micrófono:', err);
      alert('No se pudo acceder al micrófono.');
    }
  }, [isListening]);

  return {
    isListening,
    transcript,
    isSpeaking,
    speak,
    listen,
    setTranscript
  };
};
