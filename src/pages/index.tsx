import Head from 'next/head';
import styles from './index.module.scss';
import { FormControl, Input, Button, Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ChatMessage } from '@/components/ChatMessage';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { users } from '@/constants/users';
import Image from 'next/image';
// todo rename file
// todo style chat footer black
// todo style dots
// todo set messages
import { chatGptApiKey } from '@/constants/constants';
import { ChatGptResponse } from '@/interfaces/chatgpt-response.interface';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [outgoingMessage, setOutgoingMessage] = useState<Message | null>({
    text: `${users.surferDude.aiSettings?.intro} ${users.surferDude.aiSettings?.namePrompt}`,
    user: { isHuman: true, name: 'Newcomer' },
    isHidden: true,
  });
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // TODO: Should be an env variable
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
            messages: [
              ...messages.map((m) => ({ role: m.role, content: m.text })),
              { role: 'user', content: outgoingMessage.text },
            ],
          }),
        });
        const responseData = (await response.json()) as ChatGptResponse;

        setMessages((messages) => [
          ...messages,
          ...(outgoingMessage.isHidden ? [] : [outgoingMessage]),
          {
            role: responseData.choices[0]?.message?.role,
            text: responseData.choices[0]?.message?.content,
            user: users.surferDude,
          },
        ]);
        setIsLoading(false);
        setOutgoingMessage(null);
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
          {isLoading && (
            <div>
              {/* TODO: dimensions not set properly */}
              <Image src="/dots.gif" height={10} width={30} alt="loading"></Image>
            </div>
          )}
        </div>

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
      </main>
    </>
  );
}
