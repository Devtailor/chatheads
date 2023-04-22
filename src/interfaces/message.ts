interface Message {
  user: User;
  text?: string;
  imageUrl?: string;
  videoUrl?: string;
  isHidden?: boolean;
  // todo should be enum
  role?: string;
}
