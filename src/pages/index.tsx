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

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const first = useChatGpt(
    `${users.surferDude.aiSettings?.intro} ${users.surferDude.aiSettings?.namePrompt}`
  )?.choices[0]?.message?.content;

  // todo
  const [outgoingMessage, setOutgoingMessage] = useState('');

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (first) {
      setMessages([{ text: first, user: users.surferDude }]);
      setIsLoading(false);
    }
  }, [first]);

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
            // todo
            setMessages([
              ...messages,
              { text: values.message, user: { isHuman: true, name: 'Newcomer' } },
            ]);
            actions.setSubmitting(false);
            actions.resetForm({ values: { message: '' } });
            // useChatGpt(values.message);
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
