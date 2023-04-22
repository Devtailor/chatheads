import { ChatMessage } from '@/components';
import { chatBots, chatGptApiKey } from '@/constants';
import { ChatGptResponse, Message } from '@/interfaces';
import { Button, Flex, FormControl, Input } from '@chakra-ui/react';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from './index.module.scss';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [outgoingMessage, setOutgoingMessage] = useState<Message | null>({
    text: `${chatBots.surferDude.aiSettings?.intro} ${chatBots.surferDude.aiSettings?.namePrompt}`,
    user: { isHuman: true, name: 'Newcomer' },
    isHidden: true,
  });
  const [messages, setMessages] = useState<Message[]>([]);

  // TODO: Fix useSWR and use useChatGpt hook instead
  useEffect(() => {
    // TODO: Should be an env variable
    const apiKey = chatGptApiKey;
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    if (outgoingMessage) {
      // TODO: This is ugly, add proper fix. Maybe merge outgoingMessage and messages?
      const currentOutgoingMessage = outgoingMessage;
      setOutgoingMessage(null);
      setMessages((messages) => [
        ...messages,
        ...(currentOutgoingMessage.isHidden ? [] : [currentOutgoingMessage]),
      ]);

      const fetchData = async () => {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              ...messages.map((m) => ({ role: m.role, content: m.text })),
              { role: 'user', content: currentOutgoingMessage.text },
            ],
          }),
        });
        const responseData = (await response.json()) as ChatGptResponse;

        setMessages((messages) => [
          ...messages,
          {
            role: responseData.choices[0].message.role,
            text: responseData.choices[0].message.content,
            user: chatBots.surferDude,
          },
        ]);
        setIsLoading(false);
      };

      fetchData();
    }
  }, [outgoingMessage, messages]);

  const handleSubmit = (
    values: { message: string },
    actions: FormikHelpers<{ message: string }>
  ) => {
    setIsLoading(true);
    actions.resetForm({ values: { message: '' } });

    setOutgoingMessage({
      text: values.message,
      role: 'user',
      user: { isHuman: true, name: 'Newcomer' },
    });
  };

  return (
    <>
      <Head>
        <title>Chat heads</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.chatHeader}></div>

        <div className={`${styles.chat} ${styles.content}`}>
          {messages.map((message, i) => (
            <ChatMessage key={i} message={message}></ChatMessage>
          ))}
          {/* TODO: image dimensions not set properly */}
          {isLoading && <Image src="/dots.gif" height={10} width={30} alt="loading"></Image>}
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
