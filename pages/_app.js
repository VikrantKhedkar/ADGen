import { ChakraProvider } from '@chakra-ui/react'
import "../styles/main.css"

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp