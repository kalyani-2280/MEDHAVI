import React, { useState } from 'react';
import axios from 'axios';
import {
  FaStethoscope, FaPills, FaHeartbeat, FaLeaf, FaNotesMedical,
  FaSearch, FaImage, FaRobot, FaLock, FaQuestionCircle
} from 'react-icons/fa';

const apiBase = 'http://localhost:5000/api/healthcare';

const features = [
  { icon: <FaStethoscope />, label: 'Symptom Checker', key: 'symptoms', placeholder: 'e.g., fever, cough, body pain' },
  { icon: <FaPills />, label: 'Medicine Info', key: 'medicine', placeholder: 'e.g., Paracetamol' },
  { icon: <FaHeartbeat />, label: 'Vitals Interpreter', key: 'vitals', placeholder: 'e.g., BP: 120/80, HR: 75bpm' },
  { icon: <FaLeaf />, label: 'Diet Plan', key: 'diet-plan', placeholder: 'e.g., 23, 70kg, weight loss, no nuts' },
  
  { icon: <FaSearch />, label: 'Disease Info', key: 'disease-info', placeholder: 'e.g., Diabetes' },
  { icon: <FaImage />, label: 'Image Analysis', key: 'image-analysis', type: 'file' },
];

export default function HealthcarePage() {
  const [selected, setSelected] = useState(null);
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selected) return;
    setLoading(true);
    setOutput('');

    try {
      if (selected.key === 'image-analysis') {
        if (!file) return setOutput('⚠️ Please upload an image first.');
        const form = new FormData();
        form.append('image', file);
        const res = await axios.post(`${apiBase}/image-analysis`, form);
        setOutput(res.data.analysis);
      } else {
        let payload = {};
        if (selected.key === 'diet-plan') {
          const [age, weight, goals, allergies] = input.split(',').map(s => s.trim());
          payload = { age, weight, goals, allergies };
        } else if (selected.key === 'medicine') {
          payload = { name: input };
        } else {
          const key = selected.key === 'disease-info' ? 'query' : selected.key;
          payload[key] = input;
        }
        const res = await axios.post(`${apiBase}/${selected.key}`, payload);
        const value = Object.values(res.data)[0];
        setOutput(value);
      }
    } catch {
      setOutput('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChatAsk = async () => {
    if (!chatInput.trim()) return;
    setChatLoading(true);
    setChatResponse('');
    try {
      const res = await axios.post(`${apiBase}/ask`, { query: chatInput });
      setChatResponse(res.data.answer || '✅ No answer returned.');
    } catch {
      setChatResponse(' Something went wrong.');
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-yellow-50 to-white">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-xl p-6 space-y-6 border-r">
        {features.map((feat) => (
          <div
            key={feat.key}
            onClick={() => {
              setSelected(feat);
              setInput('');
              setFile(null);
              setOutput('');
            }}
            className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all hover:bg-orange-100 ${
              selected?.key === feat.key ? 'bg-orange-100 border border-orange-400' : ''
            }`}
          >
            <div className="text-xl text-orange-500">{feat.icon}</div>
            <span className="text-[#1a237e] font-medium">{feat.label}</span>
          </div>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 relative overflow-y-auto">
        {selected ? (
          <div className="bg-white p-6 rounded-2xl shadow max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-[#1a237e] mb-4">{selected.label}</h2>
            {selected.type === 'file' ? (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full border p-2 rounded mb-4"
              />
            ) : (
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={selected.placeholder}
                className="block w-full border p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            )}
            <button
              onClick={handleSubmit}
              className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
            >
              {loading ? 'Processing...' : 'Submit'}
            </button>
            {output && (
              <div className="mt-4 bg-orange-50 border border-orange-200 p-4 rounded">
                <pre className="whitespace-pre-wrap text-gray-800 text-sm">{output}</pre>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-5xl mx-auto text-center space-y-4">
            <h2 className="text-4xl font-bold text-[#1a237e]">Welcome to Medhavi Healthcare AI</h2>
            <p className="text-gray-700 text-lg max-w-3xl mx-auto">
              Get instant, AI-driven help with your symptoms, vitals, medicines, health risks, reports, and more.
              Fast, secure, and private — tailored just for you.
            </p>
            <img
              src="src/assets/i.png"
              alt="Doctor Illustration"
              className="w-96 h-[28rem] mx-auto object-contain my-2"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="p-4 border rounded-lg bg-orange-50 shadow">
                <h3 className="font-bold text-orange-600">Step 1: Choose a Tool</h3>
                <p className="text-sm mt-1 text-gray-600">Pick what you need from the sidebar — like symptoms or image analysis.</p>
              </div>
              <div className="p-4 border rounded-lg bg-orange-50 shadow">
                <h3 className="font-bold text-orange-600">Step 2: Describe or Upload</h3>
                <p className="text-sm mt-1 text-gray-600">Fill in the information or upload your reports and scans.</p>
              </div>
              <div className="p-4 border rounded-lg bg-orange-50 shadow">
                <h3 className="font-bold text-orange-600">Step 3: Get Insight</h3>
                <p className="text-sm mt-1 text-gray-600">You'll receive a clear, friendly explanation and guidance.</p>
              </div>
            </div>
            <div className="mt-10 bg-white rounded-lg border p-6 shadow text-left">
              <h4 className="text-xl font-bold mb-2 flex items-center gap-2 text-[#1a237e]">
                <FaLock className="text-green-500" /> Your data stays private
              </h4>
              <p className="text-sm text-gray-600">
                We do not store any health inputs, reports, or chat data. Everything is processed instantly and securely.
              </p>
            </div>
            <div className="mt-10 text-left">
              <h4 className="text-2xl font-bold text-[#1a237e] mb-4 flex items-center gap-2">
                <FaQuestionCircle /> FAQs
              </h4>
              <ul className="space-y-3 text-gray-700 text-sm">
                <li><strong>Q:</strong> Is this a replacement for a doctor? <br /><strong>A:</strong> No. It gives general insights. Always consult a real doctor.</li>
                <li><strong>Q:</strong> Is my data stored? <br /><strong>A:</strong> Never. All data is deleted after processing.</li>
                <li><strong>Q:</strong> Can I upload any type of image? <br /><strong>A:</strong> Yes, including X-rays, blood reports, etc.</li>
              </ul>
            </div>
          </div>
        )}

        {chatOpen && (
          <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-lg p-4 border border-orange-200 z-50">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-[#1a237e]">👨‍⚕️ Ask Doctor</h3>
              <button onClick={() => setChatOpen(false)} className="text-red-400 text-sm">✖</button>
            </div>
            <textarea
              rows={3}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Describe your concern..."
              className="w-full p-2 rounded-md border focus:ring-orange-400 focus:outline-none resize-none"
            />
            <button
              onClick={handleChatAsk}
              className="mt-2 w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition"
            >
              {chatLoading ? 'Consulting...' : 'Ask'}
            </button>
            {chatResponse && (
              <div className="mt-3 text-sm text-gray-700 bg-orange-50 p-2 rounded-md max-h-48 overflow-y-auto">
                {chatResponse}
              </div>
            )}
          </div>
        )}

    
        <button
          onClick={() => setChatOpen((prev) => !prev)}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 text-white text-3xl flex items-center justify-center shadow-xl hover:shadow-2xl z-50"
        >
          <FaRobot />
        </button>
      </main>
    </div>
  );
}
