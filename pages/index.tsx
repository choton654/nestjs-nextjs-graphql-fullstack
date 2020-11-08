import { Box, Button, Flex, Heading, Link, Stack, Text } from '@chakra-ui/core';
import NextLink from 'next/link';
import React from 'react';
import EditDeletePostButtons from '../components/EditDeletePostButtons';
import UpdootSection from '../components/UpdootSection';
import {
  useMeQuery,
  usePostsQuery,
  PostsDocument,
  Post,
} from '../generated/graphql';
import { initializeApollo } from '../lib/apolloClient';
import { withApollo } from '../utils/withApollo';

interface Props {}

const Index = ({}: Props) => {
  const { data, error, loading, fetchMore, variables } = usePostsQuery({
    variables: { limit: 10, cursor: null },
    notifyOnNetworkStatusChange: true,
  });

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data && !loading) {
    return <div>query failed</div>;
  }

  return (
    <div>
      {!data && loading ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map(p => (
            <Flex key={p._id} p={5} shadow="md" borderWidth="1px">
              <UpdootSection post={p} />
              <Box flex={1}>
                <NextLink href={`/post/${p._id}`}>
                  <Link ml="auto">
                    <Heading fontSize="xl">{p.title}</Heading>
                  </Link>
                </NextLink>
                <Text>Posted By {p.creator?.username}</Text>
                <Flex align="center">
                  <Text flex={1} mt={4}>
                    {p.textSnippest}
                  </Text>
                  <Box ml="auto">
                    <EditDeletePostButtons id={p._id} creatorId={p.creatorId} />
                  </Box>
                </Flex>
              </Box>
            </Flex>
          ))}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            m="auto"
            my={8}
            isLoading={loading}
            onClick={() => {
              fetchMore({
                variables: {
                  limit: variables?.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                },
              });
            }}
          >
            Load More
          </Button>
        </Flex>
      ) : null}
    </div>
  );
};

export default withApollo({ ssr: true })(Index);

// export async function getServerSideProps() {
//   const apolloClient = initializeApollo();

//   const res = await apolloClient.query({
//     query: PostsDocument,
//     variables: { limit: 10, cursor: null },
//   });

//   const state = apolloClient.cache.extract();
//   // console.log("response", res);
//   // console.log("cache", state);

//   return {
//     props: {
//       data: res,
//       initialApolloState: state,
//     }, // will be passed to the page component as props
//   };
// }

// export async function getServerSideProps() {
//   return {
//     props: { test: "hello" }, // will be passed to the page component as props
//   };
// }

// export default Index;
