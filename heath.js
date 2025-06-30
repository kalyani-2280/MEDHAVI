// healthcare.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const upload = multer({ dest: 'uploads/' });

const generateGemini = async (prompt, temp = 0.7) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  });
  return result.response.text();
};

// 1. Symptom Checker
router.post('/symptoms', async (req, res) => {
  const { symptoms } = req.body;
  if (!symptoms) return res.status(400).json({ error: 'Please enter your symptoms' });
 const prompt = `You are a virtual health assistant. Based on the symptoms: "${symptoms}", suggest the top three most likely common or non-critical health concerns the user might be experiencing. 
Explain briefly in simple language why each issue could be possible. Do not give any diagnosis, percentages, or critical conditions. 
Present the information clearly in plain text, without any markdown or special formatting.
Always end your response with this line: Please consult a doctor for accurate medical advice.`;

  try {
    const reply = await generateGemini(prompt);
    res.json({ consultation: reply });
  } catch (err) {
    res.status(500).json({ error: 'Symptom analysis failed' });
  }
});

// 2. Medicine Info
router.post('/medicine', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Please provide a medicine name' });
  const prompt = `You are a medical information assistant. Provide clear and concise information about the medicine "${name}". 
Include its general uses, typical dosage range (without suggesting specific dosages to users), possible side effects, and important precautions. 
Avoid technical jargon and use simple, easy-to-understand language. 
Do not give medical advice or recommend taking the medicine. 
Do not use bullet points, numbers, or markdown — just plain structured text. 
Always end with: Please consult a healthcare professional before using any medication.`;

  try {
    const reply = await generateGemini(prompt, 0.6);
    res.json({ description: reply });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch medicine info' });
  }
});

// 3. Vitals Interpretation
router.post('/vitals', async (req, res) => {
  const { vitals } = req.body;
  if (!vitals) return res.status(400).json({ error: 'Provide vitals like BP, HR, sugar etc.' });
 const prompt = `You are a virtual health interpreter. Analyze the following vitals data:\n${vitals}\n
Give a simple, easy-to-understand summary of what these vitals might indicate about the person's general health. 
Provide helpful suggestions for improving well-being if needed. 
Do not make a medical diagnosis or suggest treatment. 
Avoid using any markdown, bullet points, or numbered lists — only plain structured sentences.
Always end with: Please consult a qualified doctor for a proper medical evaluation.`;

  try {
    const reply = await generateGemini(prompt);
    res.json({ interpretation: reply });
  } catch (err) {
    res.status(500).json({ error: 'Vitals interpretation failed' });
  }
});

// 4. Diet Plan Generator
router.post('/diet-plan', async (req, res) => {
  const { age, weight, goals, allergies } = req.body;
 const prompt = `You are a diet assistant. Create a healthy daily Indian diet plan for a person with the following details: Age ${age}, Weight ${weight}kg, Goal: ${goals}, Allergies: ${allergies || 'None'}. The diet should include common Indian meals (like poha, dal, roti, etc.) and be structured into breakfast, lunch, dinner, and snacks. Keep it simple and realistic. Avoid any bullet points or markdown — use plain, readable text.`;

  try {
    const reply = await generateGemini(prompt);
    res.json({ dietPlan: reply });
  } catch (err) {
    res.status(500).json({ error: 'Diet plan generation failed' });
  }
});

// 5. Risk Assessment
router.post('/risk-assessment', async (req, res) => {
  const { lifestyle } = req.body;
  if (!lifestyle) return res.status(400).json({ error: 'Provide lifestyle details' });
  const prompt = `You are a health interpreter. Evaluate the possible health risks for someone with this lifestyle: ${lifestyle}. Explain in simple language what health concerns might arise and provide practical, everyday advice to improve their well-being. Avoid any technical jargon, markdown, or bullet points — use plain and readable sentences. Always encourage consulting a healthcare professional for personalized guidance.`;

  try {
    const reply = await generateGemini(prompt);
    res.json({ assessment: reply });
  } catch (err) {
    res.status(500).json({ error: 'Risk assessment failed' });
  }
});

// 6. Disease Info / FAQ
router.post('/disease-info', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Please ask a disease-related question' });
 const prompt = `You are a health interpreter. Explain in simple terms what this condition means: ${query}. Include what it is, common symptoms, possible causes, and basic care or prevention tips. Keep it short, clear, and easy to understand. Do not use bullet points or markdown. Always recommend seeing a doctor for full diagnosis and treatment.`;

  try {
    const reply = await generateGemini(prompt);
    res.json({ info: reply });
  } catch (err) {
    res.status(500).json({ error: 'Disease info fetch failed' });
  }
});

// 7. Image Analysis (e.g., X-ray, reports)
router.post('/image-analysis', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

  const filePath = req.file.path;
  const base64Image = fs.readFileSync(filePath, { encoding: 'base64' });

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const promptText = `You are a virtual health interpreter. Analyze the uploaded medical image or report and explain the observations in simple, clear language suitable for a non-medical person. Use common healthcare terminology and focus on what the findings might suggest — without giving a medical diagnosis. Avoid any markdown or bullet points. Always end by saying: "For accurate interpretation and treatment, please consult a qualified medical professional."`;

  try {
    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: promptText },
        ]
      }]
    });

    fs.unlinkSync(filePath); // cleanup
    const text = await result.response.text();
    res.json({ analysis: text });

  } catch (err) {
    console.error("❌ Image analysis error:", err.message);
    res.status(500).json({ error: "Image analysis failed" });
  }
});

router.post('/ask', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'No question provided' });

  try {
    const response = await generateGemini(query);
    res.json({ answer: response });
  } catch (err) {
    console.error('Ask Route Error:', err.message);
    res.status(500).json({ error: 'AI failed to respond' });
  }
});

module.exports = router;
