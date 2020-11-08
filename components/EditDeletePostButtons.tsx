import React, { ReactElement } from "react";
import NextLink from "next/link";
import { IconButton, Link } from "@chakra-ui/core";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";

interface Props {
  id: string;
  creatorId: string | undefined;
}

const EditDeletePostButtons: React.FC<Props> = ({ id, creatorId }: Props) => {
  const [deletePost] = useDeletePostMutation();
  const { data: meData } = useMeQuery();

  if (meData?.me?._id !== creatorId) {
    return null;
  }

  return (
    <div>
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <IconButton as={Link} mr={4} icon="edit" aria-label="Edit Post" />
      </NextLink>
      <IconButton
        variantColor="red"
        icon="delete"
        aria-label="Delete Post"
        onClick={() => {
          deletePost({
            variables: { id },
            update: (cache) => {
              cache.evict({ id: "Post:" + id });
            },
          });
        }}
      />
    </div>
  );
};

export default EditDeletePostButtons;
