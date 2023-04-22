import Head from 'next/head';
import styles from '@/styles/Home.module.scss';
import { FormControl, Input } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';
import { useState } from 'react';
import { ChatMessage } from '@/components/ChatMessage';
import { Field, Form, Formik } from 'formik';
import { users } from '@/constants/users';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: 'Hello! What is your name?',
      user: users.surferDude,
    },
  ]);

  return (
    <>
      <Head>
        <title>Chat heads</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <header className={styles.header}></header>
        <div className={`${styles.chat} ${styles.content}`}>
          {messages.map((message, i) => (
            <ChatMessage key={i} message={message}></ChatMessage>
          ))}
        </div>

        <div className={styles.footer}>
          <Formik
            initialValues={{ message: '' }}
            onSubmit={(values, actions) => {
              // todo
              setMessages([
                ...messages,
                {
                  text: values.message,
                  user: { isHuman: true, name: 'Newcomer' },
                },
              ]);
              actions.setSubmitting(false);
              actions.resetForm({ values: { message: '' } });
            }}
          >
            {(props) => (
              <Form>
                <Flex>
                  <Field name="message">
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
