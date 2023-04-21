import Image from 'next/image';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div>
      <div>{message.user.name}</div>
      {message.user.avatarUrl && (
        <Image src={message.user.avatarUrl} width="40" height="40" alt="avatar"></Image>
      )}
      {message.text && <div>{message.text}</div>}
      {message.imageUrl && (
        <Image src={message.imageUrl} width="200" height="200" alt="image"></Image>
      )}
      {message.videoUrl && <video src={message.videoUrl} width="200" height="200" controls></video>}
    </div>
  );
}
