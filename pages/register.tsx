import {
  Button,
  FormLabel,
  FormControl,
  FormErrorMessage,
  Input,
  Box,
} from '@chakra-ui/core';
import * as React from 'react';
import { Formik, Field, Form } from 'Formik';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { MeDocument, MeQuery, useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/maperror';
import { useRouter } from 'next/router';
import { withApollo } from '../utils/withApollo';

interface IRegisterProps {}

const Register: React.FunctionComponent<IRegisterProps> = props => {
  const [register] = useRegisterMutation();

  const router = useRouter();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: '', username: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          console.log(values);
          const res = await register({
            variables: { options: values },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: 'Query',
                  me: data?.register.user,
                },
              });
            },
          });
          if (res.data?.register.errors) {
            setErrors(toErrorMap(res.data.register.errors));
          } else if (res.data?.register.user) {
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              label="Username"
              placeholder="username"
            />
            <Box mt={4}>
              <InputField
                name="email"
                label="Email"
                placeholder="email"
                type="email"
              />
            </Box>
            <Box mt={4}>
              <InputField
                name="password"
                label="Password"
                placeholder="password"
                type="password"
              />
            </Box>
            <Button
              mt={4}
              variantColor="teal"
              isLoading={isSubmitting}
              type="submit"
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};
export default withApollo({ ssr: false })(Register);

// export default Register;
