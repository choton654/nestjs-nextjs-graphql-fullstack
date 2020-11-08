import { ThemeProvider, CSSReset } from '@chakra-ui/core';
// import theme from '../theme';
import { Layout } from '../components/Layout';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';

import { isServer } from '../utils/isServer';
import { useApollo } from '../lib/apolloClient';
import { client } from '../utils/withApollo';

function MyApp({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps.initialApolloState);
  return (
    <ApolloProvider client={client}>
      <ThemeProvider>
        <CSSReset />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default MyApp;
