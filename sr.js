const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { GoogleGenAI, Modality } = require("@google/genai");
require("dotenv").config();

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const ai = new GoogleGenAI({ apiKey: process.env.SR});

// Function to process 
async function processImage(prompt, imageBuffer) {
  const base64Image = imageBuffer.toString("base64");

  const contents = [
    { text: prompt },
    {
      inlineData: {
        mimeType: "image/png",
        data: base64Image,
      },
    },
  ];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }

    throw new Error("Gemini response मध्ये image सापडली नाही.");
  } catch (error) {
    console.error("Image generate करताना त्रुटी:", error.message);
    throw error;
  }
}

// POST request 
router.post("/", upload.single("image"), async (req, res) => {
  console.log(" req.file:", req.file);
  console.log(" prompt:", req.body.prompt);

  const { prompt } = req.body;
  const imageBuffer = req.file ? fs.readFileSync(req.file.path) : null;

  if (!imageBuffer || !prompt) {
    return res.status(400).json({ error: "Image आणि prompt आवश्यक आहेत." });
  }

  try {
    const generatedImageBuffer = await processImage(prompt, imageBuffer);

    
    res.setHeader('Content-Type', 'image/png');
   res.setHeader('Content-Disposition', 'inline; filename=processed-image.png');

    res.send(Buffer.from(generatedImageBuffer, 'base64'));

  } catch (error) {
    console.error("Image प्रोसेसिंगमध्ये त्रुटी:", error.message);
    res.status(500).json({ error: "Image प्रोसेसिंगमध्ये त्रुटी." });
  } finally {
    if (req.file) fs.unlinkSync(req.file.path); 
  }
});

module.exports = router;
