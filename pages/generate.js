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
  HStack,
  Text
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import React from 'react'
const { GoogleGenerativeAI } = require("@google/generative-ai");
const gemini_key = process.env.NEXT_PUBLIC_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(gemini_key);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// static files
import placeHolderImage from "@/public/images/placeHolderImage.png"


const PromptInput = () => {
  const [value, setValue] = React.useState('Genz')
  const [geo, setGeo] = React.useState('Urban')
  const [desc, setDesc] = React.useState('')

  const targetGeneration = ["Boomers", "Millennials", "GenZ",]
  const targetPopulation = ["Urban", "Suburban", "Rural"]

  let handleInputChange = (e) => {
    let inputValue = e.target.value
    setDesc(inputValue)
    console.log(desc)
  }

  const getPrompt = async (event) => {
    const initprompt = `**Generate an eye-catching and engaging Advertisment in the style of a professional flyer.**

      **Target Audience:** ${value}
      **Geographical Area:** ${geo}
    
      **Product:** ${desc}
    
      **Key Benefits:**
    
      * Highlight 3-5 compelling benefits using strong verbs and specific details that resonate with the target audience.
      * Example: "Boost your energy levels naturally" for a fitness product or "Get organized and simplify your life" for a productivity tool.
    
      **Call to Action:**
    
      * Include a clear and concise call to action (CTA) telling viewers what to do next (e.g., "Learn more", "Shop now", "Visit our website").
    
      **Visuals:**
    
      * Use keywords to describe desired visuals:
        * **Background:** (e.g., "Minimalist", "Vibrant colors", "Natural landscape")
        * **Product:** (e.g., "Close-up", "Lifestyle image", "Action shot")
        * **Text Overlay:** (e.g., "Easy to read", "Bold font", "Clean layout")
    
      **Examples:**
    
      * "Show a person using the product in a happy and satisfied way."
      * "Include a money-back guarantee symbol or other trust signals."
    
      **Additional Tips:**
    
      * Use elements consistent with your brand, such as logos, colors, or fonts.
      * Maintain a consistent tone and style that aligns with your brand voice.
      * Consider adding emotional elements like humor, nostalgia, or inspiration to evoke positive reactions.
      * Research high-performing social media ads in your industry for inspiration.`;
    const data = await model.generateContent(initprompt);
    const response = await data.response;
    const text = response.text();
    setPrompt(text)
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
      setImageData(base64ImageData);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error:", error);
      setError(error); // Set the error state for display
    }

  }

  const engineId = "stable-diffusion-v1-6";
  const apiHost = "https://api.stability.ai";
  const apiKey = process.env.NEXT_PUBLIC_STABILITY_API_KEY; // Replace with your API key
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
      setImageData(base64ImageData);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error:", error);
      setError(error); // Set the error state for display
    }
  };

  return (
    <div className="text-black h-[100dvh] flex flex-col justify-center">

      {/* page title */}
      <h1 className="text-3xl font-bold mt-2 mx-2 absolute top-5 left-5">ADGen</h1>

      {/* page content */}
      <div className="grid grid-cols-1 p-10 md:p-2 gap-5 md:grid-cols-2" >

        <div className="w-full overflow-hidden">
          <FormControl onSubmit={handleSubmit} mt="30px">

            <div className="w-full">
              {imageData ? (
                <Image
                  src={`data:image/jpeg;base64,${imageData}`}  // Update image source
                  alt="Generated image"
                />
              ) : (

                // placeholder Image
                <Image
                  className="w-[85%] mx-auto max-w-[100%]"
                  src={placeHolderImage.src}
                  alt="placeholder image"
                />
              )}
            </div>

            {error && <FormHelperText color="red">{error.message}</FormHelperText>}

          </FormControl>
        </div>


        <div className="md:w-[60%] w-[75%] mx-auto p-5 flex justify-center items-center">

          <FormControl onSubmit={getPrompt}>

            <div>
              <h3>
                Please Choose the Category,
              </h3>

              <div className="my-5 p-2 flex flex-col gap-5">
                <b className="underline underline-offset-2">Target Audience</b>
                <div className="flex justify-evenly">
                  {targetGeneration.map((generation, index) => {
                    return <button className={`p-2 ${value === generation ? "text-[#f1f1f1] bg-[#222222]" : "bg-transparent text-[#222222]"} cursor-pointer mx-2 border-[#222222] border-2 border-opacity-50 rounded-md`} onClick={() => setValue(generation)}>{generation}</button>
                  })}
                </div>
              </div>

              <div className="my-5 p-2 flex flex-col gap-5">
                <b className="underline underline-offset-2">Target Population</b>
                <div className="flex justify-evenly">
                  {targetPopulation.map((location, index) => {
                    return <button className={`p-2 ${geo === location ? "text-[#f1f1f1] bg-[#222222]" : "bg-transparent text-[#222222]"} cursor-pointer mx-2 border-[#222222] border-2 border-opacity-50 rounded-md`} onClick={() => setGeo(location)}>{location}</button>
                  })}
                </div>
              </div>
            </div>

            <Textarea
              className="w-full h-[10rem] border-2 border-[#222222] border-opacity-60 my-5"
              onChange={handleInputChange} value={desc} placeholder='Describe your product in few words' 
              />

            <center>
              <Button
                className="my-5 bg-green-500 w-[80%] cursor-pointer hover:scale-98 transition-all"
                onClick={getPrompt} >
                Generate
              </Button>
            </center>

          </FormControl>
        </div>
      </div>
    </div>

  );
};

export default PromptInput;
