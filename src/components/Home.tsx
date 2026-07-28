

import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="animate__animated animate__fadeIn min-h-screen bg-gradient-to-br from-purple-950 via-[#1e1033] to-black text-white font-sans">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 md:py-36 border-b border-white/10">
        <span className="text-sm uppercase tracking-widest text-violet-300 font-semibold mb-4">
          Stay Close, Stay Connected
        </span>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-purple-200">
          Welcome to <span className="text-violet-400">Besties</span>
        </h1>

        <p className="text-lg md:text-xl max-w-2xl text-purple-200 mb-10 leading-relaxed">
          Connect, chat, and share moments with your best friends — wherever they are.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/login">
            <button className="bg-violet-500 hover:bg-violet-400 transition px-8 py-3 rounded-lg text-white font-semibold shadow-lg shadow-violet-900/40">
              Login
            </button>
          </Link>
          <Link to="/signup">
            <button className="border border-violet-500/70 hover:border-violet-300 hover:text-violet-300 transition px-8 py-3 rounded-lg font-semibold text-white">
              Sign Up
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-black/20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14 text-white">
          Features You'll Love
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white/5 border border-violet-500/20 p-8 rounded-xl hover:border-violet-400/50 transition group">
            <div className="w-10 h-10 rounded-lg bg-violet-500/15 flex items-center justify-center mb-4 group-hover:bg-violet-500/25 transition">
              <span className="text-violet-300 text-xl">💬</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Real-time Chat</h3>
            <p className="text-purple-200 leading-relaxed">Stay connected with instant messaging and emoji support.</p>
          </div>
          <div className="bg-white/5 border border-violet-500/20 p-8 rounded-xl hover:border-violet-400/50 transition group">
            <div className="w-10 h-10 rounded-lg bg-violet-500/15 flex items-center justify-center mb-4 group-hover:bg-violet-500/25 transition">
              <span className="text-violet-300 text-xl">🎥</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Video Calls</h3>
            <p className="text-purple-200 leading-relaxed">Talk face-to-face with HD-quality video calls.</p>
          </div>
          <div className="bg-white/5 border border-violet-500/20 p-8 rounded-xl hover:border-violet-400/50 transition group">
            <div className="w-10 h-10 rounded-lg bg-violet-500/15 flex items-center justify-center mb-4 group-hover:bg-violet-500/25 transition">
              <span className="text-violet-300 text-xl">🎙️</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Audio Calls</h3>
            <p className="text-purple-200 leading-relaxed">Enjoy crystal-clear voice chats anywhere, anytime.</p>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14 text-white">
          Why Social Networking?
        </h2>
        <ul className="max-w-3xl mx-auto space-y-5 text-lg text-purple-200">
          {[
            "Stay connected with friends and family across the globe",
            "Build communities around your interests",
            "Improve communication skills and confidence",
            "Stay updated with real-time events and news",
            "Collaborate and share memories seamlessly",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-violet-400 mt-1">▹</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-white/10">
        <p className="text-purple-200 font-semibold text-sm">
          © {new Date().getFullYear()}  Created By Bulbul Verma. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;

