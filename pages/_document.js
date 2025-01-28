import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    {/* Meta tags for SEO */}
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <meta name="description" content="HSAPSS Windsor - Dashboard and Student Management" />
                    <meta name="author" content="HSAPSS Windsor" />
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

                    {/* External FontAwesome & Bootstrap CDN links */}
                    <link
                        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
                        rel="stylesheet"
                        integrity="sha384-vp6wFftmFtxDFqYf9WnxuNjAMnp5n1YVp0gLl2j1cJUygJ3jhtZ8NS1wMTMFT"
                        crossOrigin="anonymous"
                    />
                    <link
                        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
                        rel="stylesheet"
                        integrity="sha384-KyZXEJvnQwLgEmzfeJuEX9Xt0lxINyWdfybg4iKBh9iZZFzTTvuM8xa5mjY5F"
                        crossOrigin="anonymous"
                    />

                    {/* Optionally, include any additional meta tags, links, etc. */}
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
