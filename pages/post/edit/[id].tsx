import { Box, Button } from '@chakra-ui/core';
import { Form, Formik } from 'Formik';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import InputField from '../../../components/InputField';
import Wrapper from '../../../components/Wrapper';
import {
  usePostQuery,
  useUpdatePostMutation,
} from '../../../generated/graphql';
import { useIsAuth } from '../../../utils/useIsAuth';
import { withApollo } from '../../../utils/withApollo';

interface Props {}

function EditPost({}: Props): ReactElement {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading, error } = usePostQuery({
    variables: { id: id?.toString() as string },
  });

  const [updatePost] = useUpdatePostMutation();

  useIsAuth();

  if (loading) return <div>loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{
          title: data?.post?.title,
          text: data?.post?.text,
        }}
        onSubmit={async (values, { setErrors }) => {
          const { errors } = await updatePost({
            variables: { id: id as string, ...values },
            update: cache => {
              cache.evict({ fieldName: 'posts:{}' });
            },
          });
          if (!errors) {
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" label="title" placeholder="Titlel" />
            <Box mt={4}>
              <InputField
                textarea
                name="text"
                label="text"
                placeholder="text"
              />
            </Box>
            <Button
              mt={4}
              variantColor="teal"
              isLoading={isSubmitting}
              type="submit"
            >
              update post
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}
export default withApollo({ ssr: true })(EditPost);
