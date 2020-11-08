import { withApollo as createWithApollo } from 'next-apollo';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { PginatePosts } from '../generated/graphql';

export const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  credentials: 'include',
  // headers: {
  //   cookie:
  //   (typeof window === "undefined"
  //     ? ctx?.req?.headers.cookie
  //     : undefined) || "",
  // },
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            keyArgs: [],
            merge(
              existing: PginatePosts | undefined,
              incoming: PginatePosts,
            ): PginatePosts {
              return {
                ...incoming,
                posts: [...(existing?.posts || []), ...incoming.posts],
              };
            },
          },
        },
      },
    },
  }),
});

export const withApollo = createWithApollo(client);

// import { createWithApollo } from "./createWithApollo";
// import { ApolloClient, InMemoryCache } from "@apollo/client";
// import { PginatePosts } from "../generated/graphql";
// import { NextPageContext } from "next";

// const createClient = (ctx: NextPageContext) =>
//   new ApolloClient({
//     uri: "http://localhost:5000/graphql",
//     credentials: "include",
//     headers: {
//       cookie:
//         (typeof window === "undefined"
//           ? ctx?.req?.headers.cookie
//           : undefined) || "",
//     },
//     cache: new InMemoryCache({
//       typePolicies: {
//         Query: {
//           fields: {
//             posts: {
//               keyArgs: [],
//               merge(
//                 existing: PginatePosts | undefined,
//                 incoming: PginatePosts
//               ): PginatePosts {
//                 return {
//                   ...incoming,
//                   posts: [...(existing?.posts || []), ...incoming.posts],
//                 };
//               },
//             },
//           },
//         },
//       },
//     }),
//   });

// export const withApollo = createWithApollo(createClient);
