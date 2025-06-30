const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const mongoose = require("mongoose");
require("dotenv").config();

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


const SyllabusSchema = new mongoose.Schema({}, { strict: false });
const Syllabus = mongoose.model("syllabus", SyllabusSchema, "syllabus");


async function generateGemini(prompt, temp = 0.7) {
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { temperature: temp },
  });
  return result.response.text();
}

// ===== 1. Subjects =====
router.get("/subjects", async (req, res) => {
  try {
    const record = await Syllabus.findOne({ standard: String(req.query.standard) });
    if (!record?.subjects) return res.json([]);
    const subjects = record.subjects.map(s => s.subject).filter(Boolean);
    res.json(subjects);
  } catch (err) {
    console.error("Subjects error:", err);
    res.status(500).json({ error: "Subjects errors" });
  }
});

// ===== 2. Get Chapters/Units =====
router.get("/units", async (req, res) => {
  try {
    const record = await Syllabus.findOne({ standard: String(req.query.standard) });
    const subjectData = record?.subjects?.find(s => s.subject === req.query.subject);
    if (!subjectData?.chapters) return res.status(404).json({ error: "अध्याय सापडले नाहीत" });
    res.json(subjectData.chapters);
  } catch (err) {
  console.error("Units error:", err);
    res.status(500).json({ error: "error" });
  }
});

// ===== 3. Generate Educational Content =====
router.post("/generate", async (req, res) => {
  const { standard, subject, unitNumber } = req.body;
  try {
    const record = await Syllabus.findOne({ standard: String(standard) });
    const subjectData = record?.subjects?.find(s => s.subject === subject);
    const unit = subjectData?.chapters?.find(ch => ch.number == unitNumber);
    if (!unit) return res.status(404).json({ error: "अध्याय सापडला नाही" });

    let languageInstruction = "हे content मराठीत तयार कर.";
    if (subject.toLowerCase().includes("हिंदी")) {
      languageInstruction = "यह कंटेंट हिंदी में तैयार करें।";
    } else if (subject.toLowerCase().includes("इंग्रजी") || subject.toLowerCase().includes("english")) {
      languageInstruction = `Please write the content in English first, then provide Marathi translation. without any markdown `;
    }

    const prompt = `
तू एक अनुभवी शिक्षिका आहेस. तू इयत्ता ${standard} मधील विद्यार्थी वर्गाला \"${subject}\" शिकवत आहेस.

अध्याय:
- क्रमांक: ${unit.number}
- शीर्षक: ${unit.title}

कृपया:
1. स्पष्टीकरण
2. उदाहरणे
3. कृती
4. मूल्यमापन प्रश्न
5. दोन MCQs

📌 लक्षात ठेवा:
- Markdown नको
- सुंदर मजकूर हवा
- महाराष्ट्र बोर्ड वर आधारित

Instructions:
- Do not use any markdown formatting or bullet points
- The entire response should be in clean, readable plain text
- Follow the Maharashtra State Board curriculum standards


${languageInstruction}
`;

    const result = await model.generateContent(prompt);
    const text = await result.response.text();
    res.json({ content: text });

  } catch (err) {
    console.error("❌ Generate error:", err);
    res.status(500).json({ error: "Gemini कडून content मिळवता आला नाही" });
  }
});

// ===== 4. Exam Booster =====
router.post("/exam-booster", async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: "No content" });
  try {
   const prompt = `You are an education assistant. From the following content, extract the 5 most important exam-relevant points. 
Use plain text only and keep each point concise and clear. 
Avoid any formatting like bullet points or markdown. 
Content: ${content}`;

    const points = await generateGemini(prompt);
    res.json({ points });
  } catch (err) {
    console.error("❌ Booster error:", err);
    res.status(500).json({ error: "Exam booster failed" });
  }
});

// ===== 4.1 Booster - Formulas =====
router.post("/booster/formulas", async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: "No content" });
  try {
    const result = await generateGemini(`List key formulas from:\n${content}`);
    res.json({ output: result });
  } catch (err) {
    console.error("❌ Formulas error:", err);
    res.status(500).json({ error: "Formulas generation failed" });
  }
});

// ===== 4.2 Booster - Definitions =====
router.post("/booster/definitions", async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: "No content" });
  try {
    const result = await generateGemini(`Extract important definitions without markdown from:\n${content}`);
    res.json({ output: result });
  } catch (err) {
    console.error("❌ Definitions error:", err);
    res.status(500).json({ error: "Definitions generation failed" });
  }
});

// ===== 4.3 Booster - Events =====
router.post("/booster/events", async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: "No content" });
  try {
    const result = await generateGemini(`List key events and dates without markdown from:\n${content}`);
    res.json({ output: result });
  } catch (err) {
    console.error("❌ Events error:", err);
    res.status(500).json({ error: "Events generation failed" });
  }
});
//quiz
// ===== 5. Quiz Generator =====
// ===== 5. Quiz Generator =====
router.post("/quiz", async (req, res) => {
  const { subject, difficulty = "medium", language = "English" } = req.body;

  if (!subject) return res.status(400).json({ error: "Subject is required" });

  const prompt = `
You are an educational quiz generator AI.

🧠 Generate a ${difficulty} level quiz in ${language} for the subject: ${subject}.
❗ Format strictly like this (no markdown, no bullet points):

Q1. What is the capital of India?
a) Mumbai
b) Delhi
c) Kolkata
d) Chennai
✅ Correct: b)

Repeat this format for 15 questions. Don't skip options or correct answer.
  `;

  try {
    const quiz = await generateGemini(prompt);
    res.json({ quiz });
  } catch (err) {
    console.error("❌ Quiz generation error:", err);
    res.status(500).json({ error: "Quiz generation failed" });
  }
});


// ===== 6. Upload Material =====
router.post("/upload-material", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({ message: "✅ File uploaded", file: req.file.filename });
});

// ===== 7. Summarizer =====
router.post("/summarize", async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: "No content" });
  try {
    const prompt = `Summarize this in simple Marathi:\n\n${content}`;
    const summary = await generateGemini(prompt, 0.5);
    res.json({ summary });
  } catch (err) {
    console.error("❌ Summary error:", err);
    res.status(500).json({ error: "Summary failed" });
  }
});

// ===== 8. Essay Writer =====
router.post("/essay", async (req, res) => {
  const { topic, length = 100 } = req.body;
  if (!topic) return res.status(400).json({ error: "No topic" });
  try {
    const prompt = `Write a clear, plain-text essay of around 300 words on "${topic}", suitable for class 8 students. Avoid using markdown formatting.`;

    const essay = await generateGemini(prompt);
    res.json({ essay });
  } catch (err) {
    console.error("❌ Essay error:", err);
    res.status(500).json({ error: "Essay failed" });
  }
});

// ===== 9. Ask Anything =====
router.post("/ask", async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "No question" });
  try {
    const answer = await generateGemini(query, 0.6);
    res.json({ answer });
  } catch (err) {
    console.error("❌ Ask error:", err);
    res.status(500).json({ error: "AI failed to answer" });
  }
});

// ===== 10. Smart Report Card Feedback =====
router.post("/report-card", async (req, res) => {
  const { marks } = req.body;
  if (!marks) return res.status(400).json({ error: "No marks provided" });
  try {
   const prompt = `A student has received the following marks:\n${marks}\nFor each subject, provide clear, plain-text feedback including one strength and one practical suggestion for improvement. Do not use any bullet points or markdown. Use simple language.`;

    const feedback = await generateGemini(prompt);
    res.json({ feedback });
  } catch (err) {
    console.error("❌ Report error:", err);
    res.status(500).json({ error: "Report analysis failed" });
  }
});

// ===== 11. Daily Aptitude + GK Feed =====
router.get("/daily-feed", async (req, res) => {
 const prompt = `Generate today's learning content for June 2025:
- One aptitude question with a detailed solution
- Three current affairs headlines from India (recent and relevant to June 2025 only)
- One general knowledge fact focused on India (cultural, scientific, or historical)

Keep everything in plain text without any markdown, symbols, or bullet points. Format it neatly and clearly for a student.`;

  try {
    const feed = await generateGemini(prompt);
    res.json({ feed });
  } catch (err) {
    console.error("❌ Feed error:", err);
    res.status(500).json({ error: "Feed generation failed" });
  }
});

module.exports = router;
