import React, { useState } from "react";

const ImageEditingPage = () => {
  const [tool, setTool] = useState("outpaint");
  const [image, setImage] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [promptHistory, setPromptHistory] = useState([]);

  const API_MAP = {
    outpaint: "🎼 Outpaint",
    rbr: "🔄 Change Background",
    sr: "🪄 Replace Object",
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setResult(null);
    }
  };

  const handleSubmit = async () => {
    if (!image) return alert("Please upload an image");

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("image", image);

    if ((tool === "rbr" || tool === "sr") && prompt.trim()) {
      formData.append("prompt", prompt.trim());
    }

    try {
      const res = await fetch(`http://localhost:5000/api/image/${tool}`, {
        method: "POST",
        body: formData,
      });
      const blob = await res.blob();
      setResult(URL.createObjectURL(blob));

      if (prompt && (tool === "rbr" || tool === "sr")) {
        setPromptHistory((prev) => [prompt.trim(), ...prev.slice(0, 4)]);
      }
    } catch {
      alert("❌ Error processing request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen p-8 bg-yellow-50 text-blue-900 font-sans">
      <style>{`
        @font-face {
          font-family: "Raj";
          src: local("Raj"), url("/src/assets/fonts/R.TTF") format("truetype");
        }
      `}</style>

      <h1 className="text-5xl text-center font-extrabold mb-10 text-blue-900">
        <span style={{ fontFamily: "Raj" }}>medhavi</span>{" "}
        <span className="text-pink-500 font-light">Image Lab</span>
      </h1>

      <div className="flex justify-center flex-wrap gap-4 mb-8">
        {Object.entries(API_MAP).map(([key, label]) => (
          <button
            key={key}
            onClick={() => {
              setTool(key);
              setResult(null);
              setPrompt("");
            }}
            className={`px-5 py-2 rounded-full font-medium transition border-2 shadow ${
              tool === key
                ? "bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-400 text-white"
                : "bg-white text-orange-600 hover:bg-orange-100 border-orange-300" }`}>
            {label}
          </button>
        ))}
      </div>

      <div className={`max-w-5xl mx-auto gap-10 ${image ? "flex flex-col md:flex-row" : "flex flex-col items-center text-center"}`}>
        <div className="space-y-6 flex-1 max-w-xl w-full">
          <div className="border-4 border-dashed border-orange-300 p-6 rounded-xl bg-white text-center">
            <label className="cursor-pointer text-lg font-bold text-pink-600">
              📂 Click to Upload
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
            {image && <p className="mt-2 text-sm text-gray-700">Selected: {image.name}</p>}
          </div>

          {(tool === "rbr" || tool === "sr") && (
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                tool === "rbr"
                  ? "Describe new background..."
                  : "Describe what to change (e.g. replace dog with cat)"
              }
              className="w-full border border-orange-300 p-2 rounded text-blue-900"
            />
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-400 via-pink-400 to-yellow-400 text-white font-semibold py-2 rounded-full shadow"
          >
            ⚡ Process
          </button>

          {promptHistory.length > 0 && (
            <div className="text-sm mt-4 bg-white p-3 rounded shadow border">
              <h4 className="font-semibold text-orange-600 mb-1">📜 Prompt History</h4>
              <ul className="list-disc pl-5">
                {promptHistory.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {image && (
          <div className="flex-1 space-y-6">
            <div>
              <h3 className="font-semibold mb-2">🖼 Original Image</h3>
              <img src={URL.createObjectURL(image)} alt="Original" className="rounded-xl border shadow max-h-96" />
            </div>

            {loading && <p className="text-pink-600 font-semibold">⏳ Processing...</p>}

            {result && (
              <div>
                <h3 className="font-semibold mb-2">✅ Result Image</h3>
                <img src={result} alt="Result" className="rounded-xl border shadow max-h-96" />
                <a
                  href={result}
                  download={`medhavi-${tool}.jpg`}
                  className="block mt-3 bg-green-500 hover:bg-green-600 text-white py-2 text-center rounded shadow"
                >
                  📥 Download
                </a>
                {prompt && (
                  <p className="text-sm mt-2 italic text-gray-600">Prompt used: {prompt}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ImageEditingPage;
