import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AboutPage = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const pillars = [
    { icon: '📘', title: 'Deep Indian Curriculum', text: 'Medhavi supports CBSE, ICSE & all state boards with AI-aligned guidance.' },
    { icon: '🩺', title: 'AI-Driven Healthcare', text: 'Instant insights from vitals, symptoms, medicines, and reports.' },
    { icon: '🎨', title: 'Creative Expression', text: 'Image editing, composition, speech writing & visual tools for every student.' },
    { icon: '🌐', title: 'Multilingual Access', text: 'Supports English, Hindi, Marathi & more — respecting India’s language diversity.' }
  ];

  return (
  <section className="relative bg-gradient-to-br from-white via-orange-50 to-yellow-100 text-gray-800 py-20 px-6 overflow-hidden">
<img
  src="src/assets/rangoli.png"
  alt="Mandala Top Right"
  className="absolute top-[-180px] right-[-160px] w-[400px] opacity-15 pointer-events-none z-0"/>
<img
  src="src/assets/rangoli2.png"
  alt="Mandala Bottom Right"
  className="absolute bottom-[-80px] right-10 w-[28rem] opacity-15 pointer-events-none z-0"/>
<div className="relative z-10">
      {/* Hero */}
      <div data-aos="zoom-in" className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-extrabold text-orange-600 mb-4">About <span className="text-indigo-800">Medhavi</span></h1>
        <p className="text-lg md:text-xl text-gray-700 font-medium max-w-3xl mx-auto">
          Medhavi is a culturally-rooted AI platform crafted to empower learning, healthcare, and creativity — inspired by Bharat 🇮🇳
        </p>
      </div>
      <div className="max-w-4xl mx-auto mb-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <img src="src/assets/A.png" alt="Team" className="w-full" data-aos="fade-right" />
          <div data-aos="fade-left">
            <h2 className="text-3xl font-bold text-indigo-900 mb-4">How Medhavi was built</h2>
            <p className="text-gray-700 mb-2">
              Medhavi began as a collaborative dream of developers, teachers, and designers who believed AI should serve Indian learners.
            </p>
            <p className="text-gray-700">
              Our team worked closely with educators and health professionals to build smart tools that are simple, meaningful, and powerful for every student and parent.
            </p>
          </div>
        </div>
      </div>
      <div className="text-center max-w-4xl mx-auto mb-24" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-indigo-900 mb-4">🎯 Mission & Vision</h2>
        <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
          To democratize AI for every Indian student, parent, and teacher by blending deep tech with cultural wisdom.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow border hover:scale-[1.01] transition" data-aos="fade-up">
            <h3 className="font-bold text-orange-600 mb-2">🚀 Empowering the Future</h3>
            <p className="text-gray-700 text-sm">From villages to cities, we aim to make AI tools accessible, inclusive, and localized.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border hover:scale-[1.01] transition" data-aos="fade-up" data-aos-delay="100">
            <h3 className="font-bold text-orange-600 mb-2">📡 AI with Bharat's Values</h3>
            <p className="text-gray-700 text-sm">We balance modern tech with Indian ethos — education, health, and culture in one space.</p>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto mb-24">
        <h2 className="text-3xl font-bold text-indigo-900 text-center mb-10">💡 What Medhavi Offers</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow hover:scale-[1.02] transition" data-aos="zoom-in" data-aos-delay={i * 100}>
            <div className="text-3xl mb-2">{p.icon}</div>
            <h3 className="text-xl font-semibold text-indigo-800">{p.title}</h3>
            <p className="text-sm text-gray-700 mt-2">{p.text}</p>
           </div>
          ))}
        </div>
      </div>
      <div className="bg-white/70 border rounded-xl max-w-5xl mx-auto p-8 mb-24" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-center text-indigo-900 mb-6">Who is Medhavi for?</h2>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
          <h3 className="text-lg font-semibold text-orange-600">🧒 Students</h3>
          <p className="text-sm text-gray-700">Get instant help with essays, reports, quizzes, and more — in your language.</p>
          </div>
          <div>
          <h3 className="text-lg font-semibold text-orange-600">👩‍🏫 Teachers</h3>
          <p className="text-sm text-gray-700">Auto-generate study material, quizzes, and chapter summaries.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-orange-600">👨‍👩‍👧 Parents</h3>
            <p className="text-sm text-gray-700">Track learning, guide your child, and consult AI for health and exams.</p>
          </div>
        </div>
      </div>
      <div className="text-center max-w-3xl mx-auto" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-orange-600">✨ Built in Bharat. Built for Bharat.</h2>
        <p className="text-gray-700 mt-4">
          We believe AI should empower — not overwhelm. With Medhavi, our mission is to bring intuitive, meaningful tech to every corner of India.
        </p>
        <p className="mt-6 text-sm text-gray-500">© 2024 Medhavi – Where Culture meets Intelligence 🇮🇳</p>
      </div>
    </div>
    </section>
  );
};

export default AboutPage;
