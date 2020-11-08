import { Box, Button, Flex, Link } from '@chakra-ui/core';
import { Form, Formik } from 'Formik';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import {
  MeDocument,
  MeQuery,
  PostsDocument,
  useLoginMutation,
  User,
} from '../generated/graphql';
import { toErrorMap } from '../utils/maperror';
import { withApollo } from '../utils/withApollo';

const Login: React.FunctionComponent<{}> = props => {
  const [login] = useLoginMutation({
    update: (cache, { data }) => {
      cache.writeQuery<MeQuery>({
        query: MeDocument,
        data: {
          __typename: 'Query',
          me: data?.login.user,
        },
      });
      cache.evict({ fieldName: 'posts:{}' });
    },
    onError: err => {
      console.log(err.message);
    },
  });

  const router = useRouter();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOremail: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          try {
            const res = await login({
              variables: {
                usernameOremail: values.usernameOremail,
                password: values.password,
              },
            });
            if (res.data?.login.errors) {
              setErrors(toErrorMap(res.data.login.errors));
            } else if (res.data?.login.user) {
              if (typeof router.query.next === 'string') {
                router.push(router.query.next);
              } else {
                router.push('/');
              }
            }
          } catch (error) {
            console.log(error.message);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="usernameOremail"
              label="Username Or Email"
              placeholder="Username Or Email"
            />
            <Box mt={4}>
              <InputField
                name="password"
                label="Password"
                placeholder="password"
                type="password"
              />
            </Box>
            <Flex>
              <NextLink href="/forgot-password">
                <Link ml="auto">frogot-password?</Link>
              </NextLink>
            </Flex>
            <Button
              mt={4}
              variantColor="teal"
              isLoading={isSubmitting}
              type="submit"
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};
// export default withApollo({ ssr: false })(Login);
export default Login;
