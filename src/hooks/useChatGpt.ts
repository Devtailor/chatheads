import useSWR from "swr";
import { chatGptApiKey } from '../constants';
import { ChatGptResponse } from '../interfaces/chatgpt-response.interface';

export function useChatGpt(message: string): ChatGptResponse | null {
  const apiKey = chatGptApiKey;
  const apiUrl = "https://api.openai.com/v1/chat/completions";

  const fetcher = async () => {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      }),
    });
  
    const responseData = (await response.json()) as ChatGptResponse;
    return responseData;
  };

  const { data, error, mutate } = useSWR("getChatGptMessage", fetcher);

  return data ?? null;
}
