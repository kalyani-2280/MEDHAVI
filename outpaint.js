const express = require("express");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const STABILITY_API_KEY = process.env.STABILITY_API_KEY;

router.post("/", upload.single("image"), async (req, res) => {
  const imagePath = req.file.path;
  const outputFormat = req.body.output_format || "png";

  const form = new FormData();
  form.append("image", fs.createReadStream(imagePath));
  form.append("left", 200);
  form.append("right", 200);
  form.append("up", 200);
  form.append("down", 200);
  form.append("output_format", outputFormat);

  
  console.log("Form Headers: ", form.getHeaders());

  try {
    const response = await axios.post(
      "https://api.stability.ai/v2beta/stable-image/edit/outpaint",
      form,
      {
        headers: {
          Authorization: `Bearer ${STABILITY_API_KEY}`,
          ...form.getHeaders(),
          Accept: "image/*", 
        },
        responseType: "arraybuffer", 
        timeout: 90000,
      }
    );

    if (response.status === 200) {
      // Setting 
      const mimeType = outputFormat === "jpg" ? "image/jpeg" : `image/${outputFormat}`;

      
      res.setHeader("Content-Type", mimeType);
      res.setHeader("Content-Disposition", "inline; filename=outpainted-image." + outputFormat);
      
      // Send the raw image response 
      res.send(response.data); 
    } else {
      throw new Error("API response was not successful");
    }
  } catch (error) {
    
    console.error("Outpainting failed:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Outpainting failed" });
  } finally {
    
    fs.unlinkSync(imagePath); 
  }
});

module.exports = router;
