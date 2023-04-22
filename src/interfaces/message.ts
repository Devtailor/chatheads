import { ChatParticipant } from './chat-participant';

export interface Message {
  user: ChatParticipant;
  text?: string;
  // TODO: unused
  imageUrl?: string;
  videoUrl?: string;
  isHidden?: boolean;
  isChatGptIgnored?: boolean;
  // TODO: should be enum
  role?: string;
}
