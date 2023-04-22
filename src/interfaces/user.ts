export interface User {
  name: string;
  isHuman?: boolean;
  aiSettings?: {
    avatarUrl: string;
    intro?: string;
    namePrompt?: string;
  };
}
