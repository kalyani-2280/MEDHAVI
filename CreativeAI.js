const express = require("express");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const { GoogleGenAI, Modality } = require("@google/genai");
require("dotenv").config();

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const CLIPDROP_API_KEY = process.env.CLIPDROP_API_KEY;
const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });

/* --- 1. Replace Background (RBR) --- */
router.post("/rbr", upload.single("image"), async (req, res) => {
  const imagePath = req.file?.path;
  const prompt = req.body.prompt?.trim() || "beautiful landscape background";

  if (!imagePath) return res.status(400).json({ error: "No image uploaded" });

  const form = new FormData();
  form.append("image_file", fs.createReadStream(imagePath));
  form.append("prompt", prompt);

  try {
    const response = await axios.post("https://clipdrop-api.co/replace-background/v1", form, {
      headers: {
        "x-api-key": CLIPDROP_API_KEY,
        ...form.getHeaders(),
      },
      responseType: "arraybuffer",
    });

    res.setHeader("Content-Type", response.headers["content-type"]);
    res.setHeader("Content-Disposition", "inline; filename=processed-image.jpg");
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ error: "Replace background failed" });
  } finally {
    fs.unlink(imagePath, () => {});
  }
});


/* --- 3. Outpaint --- */
router.post("/outpaint", upload.single("image"), async (req, res) => {
  const imagePath = req.file?.path;
  const outputFormat = req.body.output_format || "png";

  if (!imagePath) return res.status(400).json({ error: "No image uploaded" });

  const form = new FormData();
  form.append("image", fs.createReadStream(imagePath));
  form.append("left", 200);
  form.append("right", 200);
  form.append("up", 200);
  form.append("down", 200);
  form.append("output_format", outputFormat);

  try {
    const response = await axios.post("https://api.stability.ai/v2beta/stable-image/edit/outpaint", form, {
      headers: {
        Authorization: `Bearer ${STABILITY_API_KEY}`,
        ...form.getHeaders(),
        Accept: "image/*",
      },
      responseType: "arraybuffer",
      timeout: 90000,
    });

    res.setHeader("Content-Type", `image/${outputFormat}`);
    res.setHeader("Content-Disposition", `inline; filename=outpainted-image.${outputFormat}`);
    res.send(response.data);
  } catch (error) {
    console.error("Outpaint failed:", error.message);
    res.status(500).json({ error: "Outpainting failed" });
  } finally {
    fs.unlink(imagePath, () => {});
  }
});

module.exports = router;
