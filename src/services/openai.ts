import axios from 'axios';

// In a real app, this should be in an environment variable or a secure backend proxy.
// For this demo, we'll ask the user to input it or use a placeholder.

export const setApiConfig = (key: string) => {
  localStorage.setItem('GOOGLE_API_KEY', key);
};

export const getMashaResponse = async (userText: string): Promise<string> => {
  const key = localStorage.getItem('GOOGLE_API_KEY');
  
  try {
    const response = await axios.post('http://localhost:3001/api/chat', {
      message: userText,
      apiKey: key 
    });
    return response.data.reply;
  } catch (error) {
    console.error('Backend failed', error);
    return "¡Oh no! Algo salió mal con mi cerebro. ¿El servidor está encendido?";
  }
};
