import React, { useEffect, useState } from 'react';
import { FaHeartbeat, FaStethoscope, FaBookOpen, FaPalette } from 'react-icons/fa';

const taglines = [
  'Empowering Healthcare with AI',
  'Personalized Education for Every Mind',
  'Creativity Redefined by Intelligence',
  'Built on Indian Values, Driven by Innovation',
];

const HomePage = () => {
  const [currentTag, setCurrentTag] = useState(0);

  useEffect(() => {
    document.body.style.background = 'linear-gradient(to bottom, #ffffff, #fff8e1)';
    const interval = setInterval(() => {
      setCurrentTag((prev) => (prev + 1) % taglines.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
 ""
};

  return (
    <section className="relative min-h-screen px-6 pt-16 pb-24 max-w-7xl mx-auto overflow-hidden">
      {/* Blurred Background Images */}
      <img
  src="src/assets/rangoli.png"
  alt="Mandala Top Right"
  className="absolute top-[-180px] right-[-160px] w-[400px] opacity-15 pointer-events-none z-0"
/>
<img
  src="src/assets/rangoli2.png"
  alt="Mandala Bottom Right"
  className="absolute bottom-[-80px] right-10 w-[28rem] opacity-15 pointer-events-none z-0"
/>
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1588776814546-fc55fba85033"
          alt="bg1"
          className="absolute top-[-30%] left-10 w-60 h-60 object-cover blur-3xl opacity-20 animate-floatUp"
        />
        <img
          src="https://images.unsplash.com/photo-1608131655857-cb303eb29cc1"
          alt="bg2"
          className="absolute bottom-[-20%] right-12 w-72 h-72 object-cover blur-3xl opacity-20 animate-floatDown"
        />
      </div>

      {/* Hero  */}
      <div className="relative z-10 text-center">
        <h1 className="text-6xl md:text-7xl font-light mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400 tracking-wide">
            Welcome To
          </span>{' '}
          <span className="text-7xl md:text-8xl text-[#1a237e] font-['Raj'] tracking-wide">
            MEDHAVI
          </span>
        </h1>

        {/* Dynamic Tagline */}
        <div className="h-10 md:h-12 flex justify-center items-center">
          <span
            key={currentTag}
            className="text-lg md:text-xl font-medium text-center bg-gradient-to-r from-orange-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent fade-in-out"
          >
            {taglines[currentTag]}
          </span>
        </div>
      </div>

      {/* Info Cards */}
      <div className="space-y-12 relative z-10 mt-12">
        <div className="max-w-6xl mx-auto p-4 bg-white rounded-2xl shadow-lg flex flex-col md:flex-row gap-6 items-center border border-orange-200">
          <div className="md:w-1/2 w-full">
            <img
              src="src/assets/7eec3bcb42c8d6bd3c09e0ccd88c7600.png"
              alt="Healthcare"
              className="rounded-xl w-full shadow-md object-cover h-64"
            />
          </div>
          <div className="md:w-1/2 w-full text-left space-y-3">
            <h2 className="text-3xl font-bold text-[#1a237e] flex items-center gap-3">
              <FaStethoscope className="text-orange-500 text-2xl" />
              Smart Healthcare
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Diagnose symptoms, manage wellness, and monitor vitals using AI-powered insights — fast, reliable, and privacy-focused.
            </p>
          </div>
        </div>

        {/* Education */}
        <div className="max-w-6xl mx-auto p-4 bg-white rounded-2xl shadow-lg flex flex-col md:flex-row-reverse gap-6 items-center border border-pink-200">
          <div className="md:w-1/2 w-full">
            <img
              src="src/assets/n.png"
              alt="Education"
              className="rounded-xl w-full shadow-md object-cover h-64"
            />
          </div>
          <div className="md:w-1/2 w-full text-left space-y-3">
            <h2 className="text-3xl font-bold text-[#1a237e] flex items-center gap-3">
              <FaBookOpen className="text-pink-500 text-2xl" />
              Personalized Education
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Adaptive learning for all levels: smart quizzes, explanation, and content generation tailored to your pace.
            </p>
          </div>
        </div>

        {/* Creative AI */}
        <div className="max-w-6xl mx-auto p-4 bg-white rounded-2xl shadow-lg flex flex-col md:flex-row gap-6 items-center border border-yellow-200">
          <div className="md:w-1/2 w-full">
            <img
              src="src/assets/F.png"
              alt="Creative AI"
              className="rounded-xl w-full shadow-md object-cover h-64"
            />
          </div>
          <div className="md:w-1/2 w-full text-left space-y-3">
            <h2 className="text-3xl font-bold text-[#1a237e] flex items-center gap-3">
              <FaPalette className="text-yellow-500 text-2xl" />
              Creative Intelligence
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Enhance and generate visual content using Gemini's powerful background removal, super-resolution, and artistic styles.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-16 text-center relative z-10">
        <button
          onClick={handleGetStarted}
          className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xl font-semibold px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          Get Started
        </button>
        <p className="mt-4 text-sm text-gray-500 flex justify-center items-center gap-1">
          With ❤️ from India <FaHeartbeat className="text-red-500 animate-pulse" />
        </p>
      </div>
    </section>
  );
};

export default HomePage;
