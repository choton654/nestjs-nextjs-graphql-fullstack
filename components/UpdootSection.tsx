import { ApolloCache, gql } from "@apollo/client";
import { Flex, IconButton } from "@chakra-ui/core";
import { Router, useRouter } from "next/router";
import React, { ReactElement, useState } from "react";
import {
  Post,
  PostSnippestFragment,
  User,
  useVoteMutation,
  VoteMutation,
} from "../generated/graphql";

interface Props {
  post: PostSnippestFragment;
}

const updateAfterVote = (
  value: number,
  post: PostSnippestFragment,
  postId: string,
  cache: ApolloCache<VoteMutation>
) => {
  const data = cache.readFragment<{
    _id: string;
    points: number;
    voteStatus: number | null;
  }>({
    // id: "Post:" + post._id,
    id: cache.identify(post),
    fragment: gql`
      fragment _ on Post {
        _id
        points
      }
    `,
  });
  console.log(data);
  const newPoints = (data?.points as number) + 1 * value;
  cache.writeFragment({
    id: cache.identify(post),
    fragment: gql`
      fragment __ on Post {
        points
        voteStatus
      }
    `,
    data: { points: newPoints, voteStatus: value },
  });
};

function UpdootSection({ post }: Props): ReactElement {
  const [loading, setloading] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");

  const [vote] = useVoteMutation();
  const router = useRouter();

  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton
        onClick={async () => {
          setloading("updoot-loading");
          await vote({
            variables: {
              postId: post._id,
              value: 1,
            },
            update: (cache, { data }) => {
              updateAfterVote(1, post, post._id, cache);
              console.log(data);

              if (data?.vote === null) {
                router.push("/login");
              }
            },
          });
          setloading("not-loading");
        }}
        isLoading={loading === "updoot-loading"}
        aria-label="updoot post"
        icon="chevron-up"
      />
      {post.points}
      <IconButton
        onClick={async () => {
          setloading("downdoot-loading");
          await vote({
            variables: {
              postId: post._id,
              value: -1,
            },
            update: (cache, { data }) => {
              updateAfterVote(-1, post, post._id, cache);
              if (data?.vote === null) {
                router.push("/login");
              }
            },
          });
          setloading("not-loading");
        }}
        isLoading={loading === "downdoot-loading"}
        aria-label="downdoot post"
        icon="chevron-down"
      />
    </Flex>
  );
}

export default UpdootSection;
