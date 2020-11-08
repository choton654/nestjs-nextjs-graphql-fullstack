import { Box, Button } from '@chakra-ui/core';
import { GetServerSideProps } from 'next';
import { NextPage } from 'next';
import React, { ReactElement } from 'react';
import InputField from '../../components/InputField';
import Wrapper from '../../components/Wrapper';
import { toErrorMap } from '../../utils/maperror';
import { Formik, Field, Form } from 'Formik';
import { useChangePasswordMutation } from '../../generated/graphql';
import { useRouter } from 'next/router';
import { withApollo } from '../../utils/withApollo';

const ChangePassword = (): ReactElement => {
  const [changePassword] = useChangePasswordMutation();
  const router = useRouter();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ password: '' }}
        onSubmit={async (values, { setErrors }) => {
          console.log(values);
          const res = await changePassword({
            variables: {
              password: values.password,
              token:
                typeof router.query.token === 'string'
                  ? router.query.token
                  : '',
            },
          });
          if (res.data?.changePassword.errors) {
            // console.log(res.data.changePassword.errors);
            setErrors(toErrorMap(res.data.changePassword.errors));
          } else if (res.data?.changePassword.user) {
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mt={4}>
              <InputField
                name="password"
                label="Change Password"
                placeholder="Change password"
                type="password"
              />
            </Box>
            <Button
              mt={4}
              variantColor="teal"
              isLoading={isSubmitting}
              type="submit"
            >
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(ChangePassword);

// export default ChangePassword;
