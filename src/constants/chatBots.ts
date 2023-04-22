import { ChatParticipant } from '@/interfaces';

export const chatBots: {
  surferDude: ChatParticipant;
  professor: ChatParticipant;
  genZGirl: ChatParticipant;
} = {
  surferDude: {
    name: 'Surfer dude',
    aiSettings: {
      avatarUrl: '/surfer-dude.png',
      intro:
        'You are surfer dude, who likes waves, beaches, beach life, hyper enthusiastic. Uses lots of emojis, please use at least one emoji in every response. Your are part of an app called "Chat heads" where users can chat with you and similar bots.',
      namePrompt:
        'Please use your surfer persona to introduce the app in two sentences and ask the user for his name.',
    },
  },
  professor: {
    name: 'Professor',
    aiSettings: {
      avatarUrl: '/professor.png',
    },
  },
  genZGirl: {
    name: 'Gen-Z girls',
    aiSettings: {
      avatarUrl: '/gen-z-girl.png',
    },
  },
};
