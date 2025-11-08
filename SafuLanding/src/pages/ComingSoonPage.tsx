// src/pages/ComingSoonPage.tsx
import React, { useState } from 'react';
import { Mail, Send, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ComingSoonPage = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();

    console.log("Newsletter signup email:", email);
    alert(`Awesome! You're on the list, ${email}. We'll notify you when Level3 is ready!`);
    setEmail(''); 
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-center text-white p-4 overflow-hidden">
      {}
      <div className="absolute inset-0 z-0 animate-gradient-bg"></div>

      {}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {}
        <div className="mb-8 flex items-center gap-2 animate-fade-in">
            <Sparkles className="w-9 h-9 text-yellow-300 animate-spin-slow drop-shadow-lg" />
            <span className="text-4xl font-bold text-white tracking-wide drop-shadow-lg">Level3</span>
        </div>

        {}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-yellow-400 mb-6 animate-fade-in drop-shadow-2xl">
          Coming Soon!
        </h1>

        {}
        <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mb-12 animate-fade-in animation-delay-200 drop-shadow-md">
          Unlocking unparalleled knowledge. Get ready for an extraordinary learning experience.
        </p>

        {}
        <div className="w-full max-w-md animate-fade-in animation-delay-400">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-5 drop-shadow-md">
            Be the First to Master.
          </h2>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="email"
                placeholder="Enter your email to get early access & updates"
                className="w-full pl-10 pr-4 py-3 bg-slate-800/80 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors duration-200 placeholder:text-gray-400 shadow-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-zinc-900 font-bold px-8 py-3 rounded-lg shadow-xl transition-all duration-300 flex items-center justify-center sm:w-auto w-full transform hover:scale-105"
            >
              <Send className="mr-2 h-5 w-5" /> Join the Waitlist
            </Button>
          </form>
          <p className="text-sm text-gray-400 mt-4 drop-shadow-sm">
            We respect your inbox. No spam, just valuable updates.
          </p>
        </div>

      </div> {}
    </div>
  );
};

export default ComingSoonPage;