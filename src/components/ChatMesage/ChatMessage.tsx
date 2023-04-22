import { Message } from '@/interfaces';
import { Avatar } from '@chakra-ui/react';
import Image from 'next/image';
import styles from './ChatMessage.module.scss';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`${styles.message} ${message.user.isHuman && styles.human}`}>
      {message.user.aiSettings?.avatarUrl && (
        <Avatar src={message.user.aiSettings?.avatarUrl} size="md"></Avatar>
      )}
      <div>
        <div>{message.user.name}</div>
        {message.text && <div className={styles.messageBubble}>{message.text}</div>}
        {message.imageUrl && (
          <Image src={message.imageUrl} width="200" height="200" alt="image"></Image>
        )}
        {message.videoUrl && (
          <video autoPlay src={message.videoUrl} width="200" height="200" controls></video>
        )}
      </div>
    </div>
  );
}
