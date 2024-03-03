import React from 'react'
import Image from 'next/image'
import { Center, FormControl, RadioGroup, Stack, Button, Radio, Box, Textarea } from '@chakra-ui/react'
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });


const home = () => {
    const [value, setValue] = React.useState('1')
    const [geo, setGeo] = React.useState('1')
    const [desc, setDesc] = React.useState('')
    let handleInputChange = (e) => {
        let inputValue = e.target.value
        setDesc(inputValue)
        console.log(desc)
    }
    const getPrompt = async (event) => {
        console.log(model)
        const data = await model.generateContent(desc);
        const response = await data.response;
        const text = response.text();
        console.log(text);
    }


    return (
        <div>
            
            <Center w='100%'>
                <Box maxW="xl">
                    <FormControl onSubmit={getPrompt} mt='100px'>
                        <RadioGroup onChange={setValue} value={value}>
                            <Stack direction='row'>
                                <Radio value='1'>Boomers</Radio>
                                <Radio value='2'>Millenials</Radio>
                                <Radio value='3'>GenZ</Radio>
                            </Stack>
                        </RadioGroup>
                        <RadioGroup mt='20px' onChange={setGeo} value={geo}>
                            <Stack direction='row'>
                                <Radio value='1'>Urban</Radio>
                                <Radio value='2'>SubUrban</Radio>
                                <Radio value='3'>Rural</Radio>
                            </Stack>
                        </RadioGroup>
                        <Textarea mt='20px' onChange={handleInputChange} value={desc} placeholder='Describe your product in few words' />
                        <Button onClick={getPrompt} colorScheme="green">
                            Generate
                        </Button>
                    </FormControl>
                </Box>
            </Center>

        </div>
    )
}

export default home
