import React from 'react';
import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa';

const Footer = ({ activeDot }) => {
  return (
    <footer className="bg-[#10193f] text-gray-300 py-6 px-4 mt-auto shadow-inner rounded-t-2xl">
      <div className="flex justify-center mb-4 space-x-2">
        {[0, 1, 2, 3, 4].map((index) => (
          <span
           key={index}
            className={`w-3 h-3 rounded-full transition-all ${
            index === activeDot ? 'bg-orange-300' : 'bg-gray-500'}`}
          ></span>
        ))}
      </div>

      {/* Footer Content */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-center sm:text-left">
        <div>
          <h4 className="font-semibold text-gray-200 mb-1">Contact Us</h4>
          <p className="flex items-center justify-center sm:justify-start gap-2 mt-1">
          <FaEnvelope className="text-orange-300" /> support@medhavi.ai
          </p>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-semibold text-gray-200 mb-2">Join Our Newsletter</h4>
          <form
            onSubmit={(e) => {
            e.preventDefault();
            alert("Thanks for subscribing!");
            }}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-2">
            <input
              type="email"
              required
              placeholder="Your email"
              className="px-3 py-2 rounded-md text-sm text-gray-800 w-full sm:w-auto flex-1"
            />
            <button
              type="submit"
              className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-md text-sm" >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <p className="mt-6 text-xs text-gray-400 text-center">
        &copy; 2025 <span className="font-semibold text-gray-200">MEDHAVI</span> — Empowering Bharat with AI 
      </p>
    </footer>
  );
};

export default Footer;
