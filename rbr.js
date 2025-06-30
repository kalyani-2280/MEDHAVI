const express = require("express");
const multer = require("multer");
const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const CLIPDROP_API_KEY = process.env.CLIPDROP_API_KEY;
//route 
router.post("/", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  const imagePath = req.file.path;
  let prompt = req.body.prompt;

  if (!prompt || prompt.trim() === "") {
    prompt = "beautiful landscape background";
  }

  const form = new FormData();
  form.append("image_file", fs.createReadStream(imagePath));
  form.append("prompt", prompt);

  try {
    const response = await axios.post(
      "https://clipdrop-api.co/replace-background/v1",
      form,
      {
        headers: {
          "x-api-key": CLIPDROP_API_KEY,
          ...form.getHeaders(),
        },
        responseType: "arraybuffer", // ✅ Keep arrayBuffer
        validateStatus: () => true, // ✅ Accept all statuses (even 400,500) — handle manually
      }
    );

    if (response.status === 200) {
      const mimeType = response.headers["content-type"];
      res.setHeader("Content-Type", mimeType);
      res.setHeader("Content-Disposition", "inline; filename=processed-image.jpg");
      res.send(response.data);
    } else {
      
      const errorText = Buffer.from(response.data).toString("utf8");
      const errorJson = JSON.parse(errorText);
      res.status(response.status).json({ error: errorJson.error || "Replace background failed" });
    }
  } catch (error) {
    console.error("Replace background failed:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    fs.unlink(imagePath, (err) => {
      if (err) console.error("Failed to delete uploaded file:", err);
    });
  }
});

module.exports = router;
