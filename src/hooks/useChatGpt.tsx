import useSWR from "swr";
import { chatGptApiKey } from '../constants';

export function useChatGpt(message: string) {
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
  
    const responseData = await response.json();
    return responseData;
  };

  const { data, error, mutate } = useSWR("getChatGptMessage", fetcher);

  if (error) return <div>Something went wrong!</div>;
  if (!data) return <div>Loading...</div>;

  return data;
}
