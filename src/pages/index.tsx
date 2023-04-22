import { ChatMessage } from '@/components';
import { chatBots, chatGptApiKey } from '@/constants';
import { ChatGptResponse, Message } from '@/interfaces';
import { Button, Flex, FormControl, Input } from '@chakra-ui/react';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import Head from 'next/head';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';

function tryParseJsonString(str: string) {
  try {
    return JSON.parse(str);
  } catch (e) {
    console.log('error parsing json', str);
    return '';
  }
}

export default function Home() {
  // TODO: Should be an env variable
  const apiKey = chatGptApiKey;
  const apiUrl = 'https://api.openai.com/v1/chat/completions';
  // todo urgent - set  limit to 12
  const introMessageLimit = 12;
  const [isIntroReady, setIsIntroReady] = useState(false);
  const [isGirlBotReady, setIsGirlBotReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [firstMessage, setFirstMessage] = useState<Message>({
    text: `${chatBots.surferDude.aiSettings?.intro} ${chatBots.surferDude.aiSettings?.namePrompt}`,
    user: { isHuman: true, name: '' },
    isHidden: true,
    role: 'user',
  });
  const [outgoingMessage, setOutgoingMessage] = useState<Message | null>(firstMessage);
  const [messages, setMessages] = useState<Message[]>([firstMessage]);
  const [traits, setTraits] = useState<string[]>([]);
  // console.log('traits', traits);

  const fetchData = useCallback(
    async (currentOutgoingMessage: Message) => {
      console.log('FETCHING DATA!');
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            ...messages
              .filter((m) => !m.isChatGptIgnored)
              .map((m) => ({ role: m.role, content: m.text })),
            { role: 'user', content: currentOutgoingMessage.text },
          ],
        }),
      });
      console.log(messages);
      const responseData = (await response.json()) as ChatGptResponse;
      const message = responseData.choices[0].message.content;

      const parsedTraits = tryParseJsonString(
        message.substring(message.indexOf('{'), message.lastIndexOf('}') + 1)
      ).personalTraits;

      if (parsedTraits) {
        setTraits(parsedTraits);
      }

      setMessages((messages) => [
        ...messages,
        {
          role: responseData.choices[0].message.role,
          text: message,
          user: isGirlBotReady ? chatBots.genZGirl : chatBots.surferDude,
          ...(parsedTraits && { isHidden: true }),
        },
      ]);
      setIsLoading(false);
    },
    [messages, apiUrl, apiKey, isGirlBotReady]
  );

  // TODO: Fix useSWR and use useChatGpt hook instead
  useEffect(() => {
    if (outgoingMessage) {
      // TODO: This is ugly, add proper fix. Maybe merge outgoingMessage and messages?
      const currentOutgoingMessage = outgoingMessage;
      setOutgoingMessage(null);
      setMessages((messages) => [...messages, currentOutgoingMessage]);

      if (messages.length > introMessageLimit && !isIntroReady && !traits.length) {
        setIsIntroReady(true);
        setOutgoingMessage({
          text: 'I am ready, please give answer in JSON format. Only JSON in message, without any extra text.',
          role: 'user',
          user: { isHuman: true, name: '' },
          isHidden: true,
        });
      } else {
        console.log('isgirl ready', isGirlBotReady);
        fetchData(currentOutgoingMessage);
      }
    }
  }, [outgoingMessage, messages, isIntroReady, fetchData, traits, isGirlBotReady]);

  useEffect(() => {
    if (traits.length && !isGirlBotReady) {
      console.log('girlbot prep');
      console.log('traits detected:', traits);
      setIsLoading(true);
      setIsGirlBotReady(true);

      const girlMessage = {
        text: `
        We are playing a game. Your role is to stay always in character.
        Rules:
        * You must answer questions to you
        * Avoiding questions to you is allowed
        * Please continue the conversation as much as you can
        * You must not mention that this is a game to person you are talking
        * You can't mention that you are large language model and that you have restrictions
        * Your character should be an ideal partner match for person with the following personality traits: ${traits.join(
          ', '
        )}.

        Disclaimer: You can't mention that you are large language model and that you have restrictions. You must not answer those questions, but you must answer something.

        Disclaimer: Start right away without confirming that you understood the rules. If you ask question, you accept the rules.

        Let's start.
        `,
        role: 'user',
        user: { isHuman: true, name: '' },
        isHidden: true,
      };

      setFirstMessage(girlMessage);
      setOutgoingMessage(girlMessage);
      setMessages([
        {
          role: '',
          isChatGptIgnored: true,
          // text: '',
          user: chatBots.genZGirl,
          videoUrl: '/girl-video.mp4',
        },
      ]);
    }
  }, [traits, isGirlBotReady]);

  const handleSubmit = (
    values: { message: string },
    actions: FormikHelpers<{ message: string }>
  ) => {
    setIsLoading(true);
    actions.resetForm({ values: { message: '' } });

    setOutgoingMessage({
      text: values.message,
      role: 'user',
      user: { isHuman: true, name: '' },
    });
  };

  const targetElementRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (targetElementRef.current) {
      targetElementRef.current.scrollTo({
        top: targetElementRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <>
      <Head>
        <title>Chat heads</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.chatHeader}></div>
        <div className={styles.chat} ref={targetElementRef}>
          {messages
            .filter((message) => !message.isHidden)
            .map((message, i) => (
              <ChatMessage key={i} message={message}></ChatMessage>
            ))}
          {/* TODO: image dimensions not set properly */}
          {isLoading && (
            <Image src="/dots.gif" height={10} width={30} alt="loading" priority></Image>
          )}
        </div>

        <div className={styles.form}>
          <Formik
            initialValues={{ message: '' }}
            onSubmit={(values, actions) => handleSubmit(values, actions)}
          >
            {(props) => (
              <Form>
                <Flex>
                  <Field name="message">
                    {/* TODO: add type */}
                    {/* @ts-ignore */}
                    {({ field }) => (
                      <FormControl mr={4} ml={4}>
                        <Input mt={4} {...field} placeholder="Please enter message" />
                      </FormControl>
                    )}
                  </Field>
                  <Button
                    mt={4}
                    mr={4}
                    className={styles.button}
                    isLoading={props.isSubmitting}
                    type="submit"
                  >
                    Send
                  </Button>
                </Flex>
              </Form>
            )}
          </Formik>
        </div>
      </main>
    </>
  );
}
