

import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"; 
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import CreatorDomainSection from "@/components/CreatorDomainSection";

import HomePage from "@/pages/HomePage";
import ComingSoonPage from "@/pages/ComingSoonPage";

const sharedCourses = [
  {
    id: "content-strategy-mastery-1",
    title: "Content Strategy Mastery",
    description: "Unlock the secrets to creating viral content...",
    icon: "Target",
    level: "Beginner",
    category: "Starter",
    duration: "4 weeks",
    image:
      "https://placehold.co/800x600/3B82F6/FFFFFF?text=Landing+Course+Preview+1",
    instructor: "Alex Chen",
    rating: 4.8,
    students: 1200,
  },
  {
    id: "content-creation-pro-2",
    title: "Content Creation Pro",
    description: "Master the art of high-quality content creation...",
    icon: "BookOpen",
    level: "Intermediate",
    category: "Growth",
    duration: "6 weeks",
    image:
      "https://placehold.co/800x600/6B4BF6/FFFFFF?text=Landing+Course+Preview+2",
    instructor: "Maya Singh",
    rating: 4.9,
    students: 1500,
  },
  {
    id: "marketing-automation-3",
    title: "Marketing Automation Fundamentals",
    description: "Automate your marketing for maximum impact...",
    icon: "Zap",
    level: "Advanced",
    category: "Scaling",
    duration: "8 weeks",
    image:
      "https://placehold.co/800x600/F64B3B/FFFFFF?text=Landing+Course+Preview+3",
    instructor: "Chris Miller",
    rating: 4.7,
    students: 1000,
  },
];

const AppContent = () => {
  const location = useLocation(); 

  const showFooter = location.pathname === '/';

  return (
    <div className="min-h-screen bg-background overflow-x-hidden font-gilroy subtle-bg-pattern">
      <Navbar />
      <main className="pt-20">
        <Routes>
          <Route path="/" element={<HomePage courses={sharedCourses} />} />
          <Route
            path="/mint-creator-domain"
            element={<CreatorDomainSection isPage={true} />}
          />
          <Route path="/coming-soon" element={<ComingSoonPage />} />
        </Routes>
      </main>
      {showFooter && <Footer />} {}
      <Toaster />
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      {}
      <AppContent />
    </Router>
  );
}

export default App;