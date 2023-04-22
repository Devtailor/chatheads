import { User } from './user';

export interface Message {
  user: User;
  text?: string;
  // TODO: unused
  imageUrl?: string;
  videoUrl?: string;
  isHidden?: boolean;
  // TODO: should be enum
  role?: string;
}
