// EducationPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import {
  FaBookOpen, FaBrain, FaEdit, FaClipboardList, FaStar,
  FaLanguage, FaGlobeAsia, FaStickyNote, FaComments, FaFileUpload
} from 'react-icons/fa';
import {
  Bar,
 
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);


const EducationPage = () => {
  const API_BASE = 'http://localhost:5000/api';
  const [activeSection, setActiveSection] = useState(null);

  // Chapter generator
  const [standard, setStandard] = useState('');
  const [subject, setSubject] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const contentRef = useRef(null);

  // Features
  const [essayInput, setEssayInput] = useState('');
  const [essay, setEssay] = useState('');
  const [booster, setBooster] = useState('');
  const [reportInput, setReportInput] = useState('');
  const [reportFeedback, setReportFeedback] = useState('');
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [formulas, setFormulas] = useState('');
  const [definitions, setDefinitions] = useState('');
  const [events, setEvents] = useState('');
  const [compositionType, setCompositionType] = useState('');
  const [language, setLanguage] = useState('English');
  const [savedCompositions, setSavedCompositions] = useState([]);
  const [gkContent, setGkContent] = useState('');
  const [aptitudeQ, setAptitudeQ] = useState('');
  const [file, setFile] = useState(null);
  const [uploadMsg, setUploadMsg] = useState('');
  const [quizSubject, setQuizSubject] = useState('');
  const [quizDifficulty, setQuizDifficulty] = useState('');
  const [quizLang, setQuizLang] = useState('English');
  const [quizQuestions, setQuizQuestions] = useState([]);
const [reportChartData, setReportChartData] = useState(null);
const [reportStatus, setReportStatus] = useState(''); // e.g., Weak, Average, Good

  useEffect(() => {
    if (!standard) return;
    fetch(`${API_BASE}/education/subjects?standard=${standard}`)
      .then(res => res.json())
      .then(setSubjects);
  }, [standard]);

  useEffect(() => {
    if (!standard || !subject) return;
    fetch(`${API_BASE}/education/units?standard=${standard}&subject=${encodeURIComponent(subject)}`)
      .then(res => res.json())
      .then(setChapters);
  }, [standard, subject]);

  const saveNote = () => {
    if (note.trim()) {
      setNotes([...notes, note]);
      setNote('');
    }
  };

  const handleGenerate = async () => {
    if (!standard || !subject || !unitNumber) return alert('Please fill all fields');
    setLoading(true);
    const res = await fetch(`${API_BASE}/education/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ standard, subject, unitNumber }),
    });
    const data = await res.json();
    setContent(data.content || '❌ Failed to generate');
    setLoading(false);
  };

  const handleSummarize = async () => {
    const res = await fetch(`${API_BASE}/education/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    const data = await res.json();
    setSummary(data.summary);
  };

  const handleDownloadPDF = () => {
    if (contentRef.current) html2pdf().from(contentRef.current).save('medhavi-content.pdf');
  };

  
 const parseQuizText = (quizText) => {
  const questions = [];
  const blocks = quizText.split(/Q\d+\.\s/).filter(b => b.trim());

  blocks.forEach(block => {
    const lines = block.trim().split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 5) return;

    const question = lines[0];
    const options = lines.slice(1, 5); // a) b) c) d)
    const answerLine = lines.find(l => l.includes('✅ Correct:'));
    const answer = answerLine ? answerLine.split('✅ Correct:')[1].trim() : '';

    questions.push({ question, options, answer, selected: null });
  });

  return questions;
};


  const handleOptionClick = (questionIndex, selectedOption) => {
  setQuizQuestions(prevQuestions =>
    prevQuestions.map((q, idx) =>
      idx === questionIndex ? { ...q, selected: selectedOption } : q
    )
  );
};

  const handleQuizGenerate = async () => {
  if (!quizSubject || !quizDifficulty || !quizLang) {
    return alert('Please select subject, difficulty and language');
  }

  const res = await fetch(`${API_BASE}/education/quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subject: quizSubject,
      difficulty: quizDifficulty,
      language: quizLang,
    }),
  });

  const data = await res.json();
  const parsed = parseQuizText(data.quiz);
  setQuizQuestions(parsed);
};

  const handleEssay = async () => {
    if (!essayInput || !compositionType) return alert("Select type and enter topic.");

    let prompt = '';

    switch (compositionType) {
      case 'Essay':
        prompt = `Write a 100-word essay on "${essayInput}" for class 8 students.`;
        break;
      case 'Formal Letter':
        prompt = `Write a formal letter on the topic: ${essayInput}`;
        break;
      case 'Informal Letter':
        prompt = `Write an informal letter to your friend about: ${essayInput}`;
        break;
      case 'Story':
        prompt = `Write a short moral story based on this idea: ${essayInput}`;
        break;
      case 'Notice':
        prompt = `Write a school notice for: ${essayInput}`;
        break;
      case 'Speech':
        prompt = `Write a 2-minute speech on "${essayInput}" for school students.`;
        break;
      case 'Paragraph':
        prompt = `Write a single paragraph about "${essayInput}" suitable for grade 8.`;
        break;
      case 'Narration':
        prompt = `Convert this into indirect/direct narration: ${essayInput}`;
        break;
      default:
        prompt = `Write a composition on: ${essayInput}`;
    }
    if (language === 'Marathi') {
      prompt += '\n\nNow translate it to simple Marathi for class 8.';
    } else if (language === 'Hindi') {
      prompt += '\n\nNow translate it to simple Hindi for class 8.';
    }

    const res = await fetch(`${API_BASE}/education/essay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: prompt }),
    });

    const data = await res.json();
    setEssay(data.essay || "❌ Could not generate composition.");
  };


  const handleBooster = async () => {
    const res = await fetch(`${API_BASE}/education/exam-booster`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    const data = await res.json();
    setBooster(data.points);
  };
  const handleFormulas = async () => {
    const res = await fetch(`${API_BASE}/education/booster/formulas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    const data = await res.json();
    setFormulas(data.output);
  };
  const handleDefinitions = async () => {
    const res = await fetch(`${API_BASE}/education/booster/definitions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    const data = await res.json();
    setDefinitions(data.output);
  };
  const handleEvents = async () => {
    const res = await fetch(`${API_BASE}/education/booster/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    const data = await res.json();
    setEvents(data.output);
  };

  const handleReport = async () => {
  const res = await fetch(`${API_BASE}/education/report-card`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ marks: reportInput }),
  });

  const data = await res.json();
  setReportFeedback(data.feedback || 'Unable to analyze.');

  const scores = reportInput.split(',').map(pair => {
    const [subject, mark] = pair.trim().split(':');
    return { subject: subject.trim(), mark: parseInt(mark.trim(), 10) };
  });

  const average = scores.reduce((sum, s) => sum + s.mark, 0) / scores.length;
  if (average < 40) setReportStatus('❌ Weak');
  else if (average < 70) setReportStatus('⚠️ Average');
  else setReportStatus('✅ Good');

  setReportChartData({
    labels: scores.map(s => s.subject),
    datasets: [
      {
        label: 'Marks',
        data: scores.map(s => s.mark),
        backgroundColor: '#f97316',
      },
    ],
  });
};

  const getGKandAptitude = async () => {
    const res = await fetch(`${API_BASE}/education/daily-feed`);
    const data = await res.json();
    setGkContent(data.feed);
    setAptitudeQ(data.feed);
  };

  const handleUpload = async () => {
    if (!file) return alert('Upload something!');
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/education/upload-material`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setUploadMsg(data.message);
  };
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-100 text-gray-800">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-xl p-6 space-y-4 border-r">
        {[
          { label: 'Generate Content', key: 'generate', icon: <FaBookOpen /> },
          { label: 'Exam Booster', key: 'booster', icon: <FaBrain /> },
          { label: 'Essay Builder', key: 'essay', icon: <FaEdit /> },
          { label: 'Quiz Generator', key: 'quiz', icon: <FaClipboardList /> },
          { label: 'Smart Report', key: 'report', icon: <FaStar /> },

          { label: 'GK & Aptitude', key: 'gk', icon: <FaGlobeAsia /> },
          { label: 'Sticky Notes', key: 'notes', icon: <FaStickyNote /> },
        ].map(({ label, key, icon }) => (
          <div
            key={key}
            onClick={() => setActiveSection(key)}
            className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all hover:bg-pink-50 ${
              activeSection === key ? 'bg-pink-100 border border-pink-400' : ''
            }`}
          >
            <div className="text-xl text-pink-500">{icon}</div>
            <span className="text-[#1a237e] font-medium">{label}</span>
          </div>
        ))}
      </aside>


      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        {!activeSection && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-orange-50 to-yellow-100 p-10 rounded-xl shadow-inner text-center">
            <h1 className="text-4xl font-bold text-[#1a237e] mb-4">📘 Welcome to Medhavi Education</h1>
            <p className="text-gray-700 text-lg max-w-2xl mb-6">
              Start by selecting a tool from the sidebar. You can generate lesson content, build quizzes, analyze reports, and more — all with the power of AI.
            </p>
            <img
              src="https://cdn-icons-png.flaticon.com/512/3233/3233493.png"
              alt="AI Education"
              className="w-48 h-48 opacity-90"
            />
          </div>
        )}
        {activeSection === 'generate' && (
          <section className="space-y-4 max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold text-orange-600">Generate Chapter Content</h2>
            <select value={standard} onChange={e => setStandard(e.target.value)} className="w-full p-2 border rounded">
              <option value="">Select Class</option>
              {[5, 6, 7, 8, 9, 10].map(std => (
                <option key={std} value={std}>{std}th</option>
              ))}
            </select>
            <select value={subject} onChange={e => setSubject(e.target.value)} className="w-full p-2 border rounded">
              <option value="">Select Subject</option>
              {subjects.map((s, i) => <option key={i} value={s}>{s}</option>)}
            </select>
            <select value={unitNumber} onChange={e => setUnitNumber(e.target.value)} className="w-full p-2 border rounded">
              <option value="">Select Chapter</option>
              {chapters.map((ch, i) => <option key={i} value={ch.number}>{ch.number}. {ch.title}</option>)}
            </select>
            <button onClick={handleGenerate} className="bg-orange-500 text-white px-4 py-2 rounded">Generate</button>
            <div ref={contentRef} className="bg-orange-50 p-3 rounded text-sm max-h-96 overflow-y-auto">
              {loading ? '⏳ Loading...' : content}
            </div>
            {content && (
              <div className="flex gap-3">
                <button onClick={handleSummarize} className="bg-blue-600 text-white px-3 py-1 rounded">Summarize</button>
                <button onClick={handleDownloadPDF} className="bg-green-600 text-white px-3 py-1 rounded">Download PDF</button>
              </div>
            )}
            {summary && (
              <div className="mt-3 bg-blue-50 p-3 border-l-4 border-blue-500 rounded">
                <h4 className="font-semibold mb-1">Summary:</h4>
                <p>{summary}</p>
              </div>
            )}
          </section>
        )}
        {activeSection === 'booster' && (
          <section className="bg-white p-5 rounded-xl shadow max-w-3xl mx-auto space-y-4">
            <img
              src="src/assets/hn.png" // Make sure your image is in public/images/
              alt="Exam Booster Visual"
              className="w-full max-h-64 object-contain rounded-lg mb-2"
            />

            <h3 className="text-xl font-bold text-[#1a237e]">📚 Exam Booster</h3>

           <textarea
  value={content}
  onChange={(e) => setContent(e.target.value)}
  className="w-full border border-orange-300 p-2 rounded"
  rows={5}
  placeholder="Paste your chapter or notes content here..."
></textarea>

<button
  onClick={handleBooster}
  className="bg-orange-600 text-white px-4 py-2 rounded mt-2"
>
  Generate Key Points
</button>


            <pre className="bg-orange-50 p-3 rounded text-sm whitespace-pre-wrap">{booster}</pre>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleFormulas}
                className="rounded-full bg-pink-100 text-pink-700 px-4 py-1 text-sm font-semibold shadow hover:bg-pink-200"
              >
                📐 Formulas
              </button>
              <button
                onClick={handleDefinitions}
                className="rounded-full bg-green-100 text-green-700 px-4 py-1 text-sm font-semibold shadow hover:bg-green-200"
              >
                📘 Definitions
              </button>
              <button
                onClick={handleEvents}
                className="rounded-full bg-blue-100 text-blue-700 px-4 py-1 text-sm font-semibold shadow hover:bg-blue-200"
              >
                📅 Key Events
              </button>
            </div>

            {formulas && (
              <div>
                <h4 className="font-semibold text-[#1a237e] mt-4">📐 Formulas</h4>
                <p className="bg-pink-50 p-3 rounded text-sm">{formulas}</p>
              </div>
            )}

            {definitions && (
              <div>
                <h4 className="font-semibold text-[#1a237e] mt-4">📘 Definitions</h4>
                <p className="bg-green-50 p-3 rounded text-sm">{definitions}</p>
              </div>
            )}

            {events && (
              <div>
                <h4 className="font-semibold text-[#1a237e] mt-4">📅 Events</h4>
                <p className="bg-blue-50 p-3 rounded text-sm">{events}</p>
              </div>
            )}
          </section>
        )}



        {activeSection === 'essay' && (
          <section className="bg-white p-5 rounded-xl shadow max-w-3xl mx-auto space-y-4">
            <h3 className="text-xl font-bold text-[#1a237e]">📝 Composition Builder</h3>

            {/* Type & Language */}
            <div className="flex flex-col md:flex-row gap-4">
              <select
                value={compositionType}
                onChange={(e) => setCompositionType(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Type</option>
                <option value="Essay">Essay</option>
                <option value="Formal Letter">Formal Letter</option>
                <option value="Informal Letter">Informal Letter</option>
                <option value="Story">Story</option>
                <option value="Notice">Notice</option>
                <option value="Speech">Speech</option>
                <option value="Paragraph">Paragraph</option>
                <option value="Narration">Narration</option>
              </select>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="English">English</option>
                <option value="Marathi">Marathi</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>

            {/* Topic Input */}
            <input
              value={essayInput}
              onChange={(e) => setEssayInput(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter topic or sentence..."
            />

            <button
              onClick={handleEssay}
              className="bg-orange-600 text-white px-4 py-2 rounded"
            >
              Generate
            </button>

            {essay && (
              <>
                <pre
                  className="bg-orange-50 p-4 rounded text-sm whitespace-pre-wrap mt-4 border"
                  ref={contentRef}
                >
                  {essay}
                </pre>

                <div className="flex flex-wrap gap-3 mt-2">
                  <button
                    onClick={() => html2pdf().from(contentRef.current).save("composition.pdf")}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    📥 Download PDF
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    🖨 Print
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(essay);
                      alert("Copied to clipboard!");
                    }}
                    className="bg-purple-600 text-white px-3 py-1 rounded"
                  >
                    📋 Copy
                  </button>

                  <button
                    onClick={() => setSavedCompositions([...savedCompositions, { type: compositionType, text: essay }])}
                    className="bg-pink-600 text-white px-3 py-1 rounded"
                  >
                    💾 Save
                  </button>
                </div>
              </>
            )}

            {savedCompositions.length > 0 && (
              <div className="mt-5 border-t pt-4">
                <h4 className="font-semibold mb-2 text-[#1a237e]">📚 My Saved Compositions</h4>
                <ul className="list-disc ml-5 space-y-2 text-sm text-gray-800">
                  {savedCompositions.map((item, index) => (
                    <li key={index}><b>{item.type}:</b> {item.text.slice(0, 80)}...</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}


        {activeSection === 'quiz' && (
          <section className="bg-white p-5 rounded-xl shadow max-w-4xl mx-auto space-y-4">
            <h3 className="text-2xl font-bold text-[#1a237e]">Quiz Generator</h3>

            {/* Subject Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={quizSubject}
                onChange={(e) => setQuizSubject(e.target.value)}
                className="p-2 border rounded w-full"
              >
                <option value="">Select Subject</option>
                <option value="Math">Mathematics</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Geography">Geography</option>
                <option value="Marathi Grammar">Marathi Grammar</option>
                <option value="English Grammar">English Grammar</option>
              </select>
              <select
                value={quizDifficulty}
                onChange={(e) => setQuizDifficulty(e.target.value)}
                className="p-2 border rounded w-full"
              >
                <option value="">Select Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <select
                value={quizLang}
                onChange={(e) => setQuizLang(e.target.value)}
                className="p-2 border rounded w-full"
              >
                <option value="English">English</option>
                <option value="Marathi">Marathi</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>
            <button
              onClick={handleQuizGenerate}
              className="bg-orange-600 text-white px-6 py-2 rounded shadow hover:bg-orange-700"
            >
              Generate Quiz
            </button>
            {quizQuestions.length > 0 && (
              <div className="grid gap-4 mt-4">
                {quizQuestions.map((q, idx) => (
                  <div key={idx} className="bg-orange-50 p-4 rounded shadow space-y-2">
                    <h4 className="font-semibold text-[#1a237e]">{idx + 1}. {q.question}</h4>
                    <div className="space-y-1">
                      {q.options.map((opt, i) => (
                        <div
                          key={i}
                          className="px-3 py-1 bg-white border rounded hover:bg-blue-50 cursor-pointer"
                          onClick={() => handleOptionClick(idx, opt)}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                    {q.selected && (
                      <p className={`text-sm font-medium ${q.selected === q.answer ? 'text-green-600' : 'text-red-500'}`}>
                        {q.selected === q.answer ? '✔ Correct!' : `❌ Wrong. Correct: ${q.answer}`}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}


          </section>
        )}


       {activeSection === 'report' && (
  <section className="bg-white p-5 rounded-xl shadow max-w-3xl mx-auto space-y-4">
    <h3 className="text-xl font-bold text-[#1a237e]">📊 Smart Report Card</h3>

    <textarea
      value={reportInput}
      onChange={(e) => setReportInput(e.target.value)}
      className="w-full border p-2 rounded mb-2"
      placeholder="Math: 80, English: 60"
    />

    <button
      onClick={handleReport}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Analyze
    </button>

    {reportStatus && (
      <p className="text-lg font-semibold text-[#1a237e]">
        Performance: <span className="font-bold">{reportStatus}</span>
      </p>
    )}

    {reportChartData && (
      <div className="bg-orange-50 p-3 rounded shadow">
        <Bar data={reportChartData} />
      </div>
    )}

    {reportFeedback && (
      <pre className="mt-3 bg-blue-50 p-3 rounded text-sm">
        {reportFeedback}
      </pre>
    )}
  </section>
)}

        {activeSection === 'gk' && (
          <section className="bg-white p-5 rounded-xl shadow max-w-3xl mx-auto">
            <h3 className="text-xl font-bold mb-3 text-[#1a237e]">GK & Aptitude</h3>
            <button onClick={getGKandAptitude} className="bg-pink-600 text-white px-4 py-2 rounded">Refresh</button>
            <p className="mt-3 bg-orange-50 p-3 rounded">{gkContent}</p>
            <p className="mt-3 bg-blue-50 p-3 rounded">{aptitudeQ}</p>
          </section>
        )}

        {activeSection === 'notes' && (
          <section className="bg-white p-5 rounded-xl shadow max-w-3xl mx-auto">
            <h3 className="text-xl font-bold mb-3 text-[#1a237e]">Sticky Notes</h3>
            <textarea value={note} onChange={e => setNote(e.target.value)} className="w-full border p-2 rounded mb-2" />
            <button onClick={saveNote} className="bg-purple-600 text-white px-4 py-2 rounded">Save</button>
            <ul className="list-disc ml-5 mt-3">{notes.map((n, i) => <li key={i}>{n}</li>)}</ul>
          </section>
        )}

        {activeSection === 'upload' && (
          <section className="bg-white p-5 rounded-xl shadow max-w-3xl mx-auto">
            <h3 className="text-xl font-bold mb-3 text-[#1a237e]">Upload Study Material</h3>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mb-2" />
            <button onClick={handleUpload} className="bg-orange-500 text-white px-4 py-2 rounded">Upload</button>
            {uploadMsg && <p className="mt-2 text-green-600">{uploadMsg}</p>}
          </section>
        )}
      </main>
    </div>
  );
};

export default EducationPage;
