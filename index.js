const express = require("express");
const https = require("https");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//add your api key from https://stablediffusionapi.com/
const apiKey = process.env.SD_API_KEY;

//add your prompt
const userPrompt = "your prompt here";

const prompt = `${userPrompt}, portrait, ultra realistic, futuristic background , concept art, intricate details, highly detailed`;

//set the number of images you want
const numberOfPics = "1";

const options = {
  headers: {
    "Content-Type": "application/json",
  },
};

async function generateArt(bodyInfo) {
  console.log("");
  console.log("");
  console.log("Generating Images....");
  console.log("");
  const result = await axios.post(process.env.SD_API_URL, bodyInfo, options);
  const picAmount = result.data.output.length;
  let i = 0;
  for (i; i < picAmount; i++) {
    console.log("Generated Pic " + (i + 1));
  }
  return result.data.output[0].toString("base64");
}

app.get("/generate-art", async (req, res) => {
  const { prompt } = req.query;

  // Use the prompt from the query parameters
  const bodyInfo = JSON.stringify({
    key: apiKey,
    model_id: "midjourney",
    prompt: prompt,
    negative_prompt:
      "((out of frame)), ((extra fingers)), mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), (((tiling))), ((naked)), ((tile)), ((fleshpile)), ((ugly)), (((abstract))), blurry, ((bad anatomy)), ((bad proportions)), ((extra limbs)), cloned face, (((skinny))), glitchy, ((extra breasts)), ((double torso)), ((extra arms)), ((extra hands)), ((mangled fingers)), ((missing breasts)), (missing lips), ((ugly face)), ((fat)), ((extra legs)), anime",
    width: "512",
    height: "512",
    samples: numberOfPics,
    num_inference_steps: "30",
    safety_checker: "no",
    enhance_prompt: "yes",
    seed: null,
    guidance_scale: 7.5,
    webhook: null,
    track_id: null,
  });

  const image = await generateArt(bodyInfo);

  // Send the image as a base64-encoded string
  res.send(`<img src="data:image/png;base64,${image}"/>`);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
