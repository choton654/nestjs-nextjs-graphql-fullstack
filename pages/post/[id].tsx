import { Box, Flex, Heading, Text } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import EditDeletePostButtons from '../../components/EditDeletePostButtons';
import { usePostQuery } from '../../generated/graphql';
import { withApollo } from '../../utils/withApollo';

interface Props {}

function Post({}: Props): ReactElement {
  const router = useRouter();
  const { id } = router.query;

  const { data, loading, error } = usePostQuery({
    variables: {
      id: id?.toString() as string,
    },
  });

  if (loading) return <div>loading...</div>;
  if (!data?.post) return <div>could not find post</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <>
      <Heading fontSize="xl">{data?.post?.title}</Heading>
      <Text mt={4} mb={4}>
        {data?.post?.textSnippest}
      </Text>
      <EditDeletePostButtons
        id={data.post._id}
        creatorId={data.post.creator?._id}
      />
    </>
  );
}

// export default Post;
export default withApollo({ ssr: true })(Post);
