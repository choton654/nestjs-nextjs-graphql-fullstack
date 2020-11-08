import { Box, Button, Flex, Heading, Link } from "@chakra-ui/core";
import * as React from "react";
import NextLink from "next/link";
import {
  useLogoutMutation,
  useMeQuery,
  MeQuery,
  User,
} from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { useApolloClient } from "@apollo/client";
import { useRouter } from "next/router";

interface INavbarProps {}

const Navbar: React.FunctionComponent<INavbarProps> = () => {
  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  const { data, loading, error } = useMeQuery({
    onError: (err) => console.log(err.message),
    skip: isServer(),
  });

  const router = useRouter();

  const apolloClient = useApolloClient();

  let body = null;

  if (loading) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>register</Link>
        </NextLink>
      </>
    );
  } else if (data && data.me) {
    body = (
      <Flex align="center">
        <NextLink href="/create-post">
          <Button as={Link} mr={4}>
            create post
          </Button>
        </NextLink>
        <Box> {data.me.username}</Box>
        <Button
          ml={2}
          variant="link"
          isLoading={logoutFetching}
          onClick={async () => {
            await logout();
            // router.reload();
            await apolloClient.resetStore();
          }}
        >
          logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex zIndex={1} position="sticky" top={0} bg={"tan"} p={4}>
      <Box mr="auto">
        <NextLink href="/">
          <Link ml="auto">
            <Heading>LiReddit</Heading>
          </Link>
        </NextLink>
      </Box>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};

export default Navbar;
