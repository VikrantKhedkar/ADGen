import {
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  Box,
  Center,
  Image,
  Button,
  RadioGroup,
  Stack,
  Radio,
  Textarea,
  HStack
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import React from 'react'
const { GoogleGenerativeAI } = require("@google/generative-ai");
const gemini_key = process.env.NEXT_PUBLIC_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(gemini_key);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });



const PromptInput = () => {
  const [value, setValue] = React.useState('Genz')
  const [geo, setGeo] = React.useState('Urban')
  const [desc, setDesc] = React.useState('')
  let handleInputChange = (e) => {
      let inputValue = e.target.value
      setDesc(inputValue)
      console.log(desc)
  }
  const getPrompt = async (event) => {
      console.log(model)
      let initprompt = `Generate a prompt to be passed to stable diffusion to generate ad for the following. Include text overlay also.Make it really professional and prodcution ready to be posted on Social Media. The ad should definetly inculude some text and i t should be like a papmlet.Target Audience : ${value} Geographical area : ${geo} Description about the product:${desc} `
      const data = await model.generateContent(initprompt);
      const response = await data.response;
      const text = response.text();
      setPrompt(text)
      console.log(text)
      const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      };
  
      const requestBody = {
        text_prompts: [
          {
            text: text,
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
      
  }
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
    <div>
      <HStack>
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
                <Image mt='80px' src="https://bit.ly/dan-abramov" alt="Dan Abramov" /> // Placeholder image
              )}
            </Center>
          </Box>
          {/* <FormLabel>Prompt</FormLabel>
          <Input onChange={handleInput} />
          <Center mt='10px'>
            <Button onClick={handleSubmit} colorScheme="green">
              Generate
            </Button>
          </Center> */}
          {error && <FormHelperText color="red">{error.message}</FormHelperText>}
        </FormControl>
      </Box>
    </Center>
    <Center w='100%'>
                <Box maxW="xl">
                    <FormControl onSubmit={getPrompt} mt='100px'>
                        <RadioGroup onChange={setValue} value={value}>
                            <Stack direction='row'>
                                <Radio value='Boomers'>Boomers</Radio>
                                <Radio value='Millenials'>Millenials</Radio>
                                <Radio value='GenZ'>GenZ</Radio>
                            </Stack>
                        </RadioGroup>
                        <RadioGroup mt='20px' onChange={setGeo} value={geo}>
                            <Stack direction='row'>
                                <Radio value='Urban'>Urban</Radio>
                                <Radio value='SubUrban'>SubUrban</Radio>
                                <Radio value='Rural'>Rural</Radio>
                            </Stack>
                        </RadioGroup>
                        <Textarea mt='20px' onChange={handleInputChange} value={desc} placeholder='Describe your product in few words' />
                        <Button onClick={getPrompt} colorScheme="green">
                            Generate
                        </Button>
                    </FormControl>
                </Box>
            </Center>
            </HStack>
    </div>
    
  );
};

export default PromptInput;
