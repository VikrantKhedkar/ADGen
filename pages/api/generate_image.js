import fs from 'fs/promises'; // Use fs/promises for asynchronous file operations
import fetch from 'isomorphic-fetch';
import { writeFileSync } from 'fs/promises';
console.log("INNNN")
export default async function handler(req, res) {
  const engineId = 'stable-diffusion-v1-6';
  const apiHost = 'https://api.stability.ai';
  const apiKey = process.env.STABILITY_API_KEY;

  if (!apiKey) {
    throw new Error('Missing Stability API key.');
  }

  const { height,prompt,samples,steps,width} = req.body; // Extract data from request body
  const cfg_scale = 7;
  

  if (!prompt) {
    res.status(400).json({ error: 'Missing required prompt in request body.' });
    return;
  }

  try {
    const response = await fetch(
      `${apiHost}/v1/generation/stable-diffusion-v1-6/text-to-image`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          text_prompts: [{ text: prompt }],
          cfg_scale,
          height,
          width,
          steps,
          samples,
        }),
      }
    );
    console.log("here")


    if (!response.ok) {
      throw new Error(`Non-200 response: ${await response.text()}`);
    }

    const responseJSON = await response.json();

    const images = responseJSON.artifacts.map((image) => {
      const base64Data = Buffer.from(image.base64, 'base64').toString('binary');
      const filename = `./out/v1_txt2img_${image.seed}.png`;
      fs.writeFileSync(filename, base64Data, { encoding: 'binary' });
      return { filename, seed: image.seed }; // Return metadata for generated images
    });

    res.status(200).json({ images });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate images.' });
  }
}
