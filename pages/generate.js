import {
    Input,
    FormControl,
    FormLabel,
    FormHelperText,
    Box,
    Center,
    Image,
    Button,
  } from "@chakra-ui/react";
  import { useState } from "react";
  import axios from "axios";
  
  const PromptInput = () => {
    const engineId = "stable-diffusion-v1-6";
    const apiHost = "https://api.stability.ai";
    const apiKey = process.env.NEXT_PUBLIC_STABILITY_API_KEY; // Replace with your API key
    console.log(apiKey)
    const [prompt, setPrompt] = useState("");
    const [imageData, setImageData] = useState(null); // Stores the image data
    const [error, setError] = useState(null);
  
    const handleInput = (event) => {
      setPrompt(event.target.value);
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      };
  
      const requestBody = {
        text_prompts: [
          {
            text: prompt,
          },
        ],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        steps: 30,
        samples: 1,
      };
  
      try {
        const response = await axios.post(
          `${apiHost}/v1/generation/stable-diffusion-v1-6/text-to-image`,
          requestBody,
          { headers }
        );
  
        // Update image data and handle errors
        const base64ImageData = response.data.artifacts[0].base64;
        console.log(base64ImageData)
        setImageData(base64ImageData);
        console.log(response.data)
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error("Error:", error);
        setError(error); // Set the error state for display
      }
    };
  
    return (
      <Center w="100%">
        <Box maxW="xl">
          <FormControl onSubmit={handleSubmit} mt="30px">
            <Box boxSize="sm" w="500px" h="500px" bg="orange.100">
              <Center>
                {imageData ? (
                  <Image
                    src={`data:image/jpeg;base64,${imageData}`}  // Update image source
                    alt="Generated image"
                  />
                ) : (
                  <Image mt='80px'src="https://bit.ly/dan-abramov" alt="Dan Abramov" /> // Placeholder image
                )}
              </Center>
            </Box>
            <FormLabel>Prompt</FormLabel>
            <Input onChange={handleInput} />
            <Center mt='10px'>
            <Button onClick={handleSubmit} colorScheme="green">
              Generate
            </Button>
            </Center>
            {error && <FormHelperText color="red">{error.message}</FormHelperText>}
          </FormControl>
        </Box>
      </Center>
    );
  };
  
  export default PromptInput;
  