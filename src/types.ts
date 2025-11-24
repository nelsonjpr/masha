export interface GameState {
  hunger: number;
  happiness: number;
  energy: number;
  cleanliness: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type MashaAction = 'idle' | 'eating' | 'sleeping' | 'playing' | 'talking' | 'listening';
