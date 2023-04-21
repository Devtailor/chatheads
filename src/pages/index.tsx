import Head from 'next/head';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { Flex, Spacer } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { ChatMessage } from '@/components/ChatMessage';
import { Field, Form, Formik } from 'formik';
import { users } from '@/constants/users';
import { useChatGpt } from '@/hooks/useChatGpt';
import Image from 'next/image';
import { chatGptApiKey } from '@/constants';
import { ChatGptResponse } from '@/interfaces/chatgpt-response.interface';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [outgoingMessage, setOutgoingMessage] = useState<Message>({
    text: `${users.surferDude.aiSettings?.intro} ${users.surferDude.aiSettings?.namePrompt}`,
    user: { isHuman: true, name: 'Newcomer' },
    isHidden: true,
  });

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const apiKey = chatGptApiKey;
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    if (outgoingMessage) {
      const fetchData = async () => {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: outgoingMessage.text }],
          }),
        });

        const responseData = (await response.json()) as ChatGptResponse;

        setMessages((messages) => [
          ...messages,
          // outgoingMessage.isHidden && { ...outgoingMessage },
          // { text: outgoingMessage, user: { isHuman: true, name: 'Newcomer' } },
          // { text: responseData.choices[0]?.message?.content, user: users.surferDude },
        ]);
        if (!outgoingMessage.isHidden) setMessages((messages) => [...messages, outgoingMessage]);
        setMessages((messages) => [
          ...messages,
          { text: responseData.choices[0]?.message?.content, user: users.surferDude },
        ]);
        setIsLoading(false);
      };

      fetchData();
    }
  }, [outgoingMessage]);

  return (
    <>
      <Head>
        <title>Chat heads</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.chat}>
          {messages.map((message, i) => (
            <ChatMessage key={i} message={message}></ChatMessage>
          ))}
          {isLoading && (
            <div>
              <Image src="/dots.gif" height={10} width={30} alt="loading"></Image>
            </div>
          )}
        </div>
        <Formik
          initialValues={{ message: '' }}
          onSubmit={(values, actions) => {
            actions.setSubmitting(false);
            actions.resetForm({ values: { message: '' } });
            setOutgoingMessage({ text: values.message, user: { isHuman: true, name: 'Newcomer' } });
          }}
        >
          {(props) => (
            <Form>
              <Flex>
                <Field name="message">
                  {/* @ts-ignore */}
                  {({ field }) => (
                    <FormControl>
                      <Input {...field} placeholder="Please enter message" />
                    </FormControl>
                  )}
                </Field>
                <Button mt={4} colorScheme="teal" isLoading={props.isSubmitting} type="submit">
                  Send
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </main>
    </>
  );
}
