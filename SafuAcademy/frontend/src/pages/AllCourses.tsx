import React from "react";
import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";

const demoCourses = [
  {
    id: "moving-averages",
    title: "Reading Moving Averages Like a Pro",
    category: "Blockchain",
    level: "Intermediate",
    lessons: 6,
    duration: "32 min",
    summary:
      "Learn how traders use the 20, 100 and 200 EMA to spot trends, pullbacks, and potential reversals on real charts.",
  },
  {
    id: "wallets-101",
    title: "Crypto Wallets 101",
    category: "Blockchain",
    level: "Beginner",
    lessons: 4,
    duration: "18 min",
    summary:
      "Understand the difference between hot and cold wallets, how to stay safe, and what really happens when you sign a transaction.",
  },
  {
    id: "ai-prompts",
    title: "Practical AI Prompting",
    category: "AI",
    level: "Beginner",
    lessons: 5,
    duration: "24 min",
    summary:
      "Simple, field‑tested prompting techniques you can apply immediately to research, writing, and everyday workflows.",
  },
];

export default function AllCoursesPage() {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Top header */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[24px] sm:text-[30px] font-bold tracking-[-0.06em] text-safuDeep">
              All Safu Academy courses
            </h1>
            <p className="text-[13px] text-[#555] max-w-xl mt-1">
              Human‑curated, AI‑presented courses designed to be finished — not abandoned. Filter by category or level
              and pick your next unlock inside the SafuVerse.
            </p>
          </div>
          <div className="flex flex-col sm:items-end gap-2 text-[11px] text-[#777]">
            <span>Real learners from different sectors using Safu Academy to level up.</span>
            <span className="font-semibold text-safuDeep">
              Adopted by builders across <strong>Blockchain, Marketing, AI, and more.</strong>
            </span>
          </div>
        </section>

        {/* Simple filters */}
        <section className="glass-card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex-1 flex items-center gap-2 rounded-2xl bg-[#fefce8] px-4 py-2">
            <span className="text-[11px]">Search</span>
            <input
              placeholder="Search courses by topic, chain or keyword..."
              className="flex-1 bg-transparent text-[12px] outline-none placeholder:text-[#aaa]"
            />
          </div>
          <div className="flex flex-wrap gap-2 text-[11px]">
            <button className="px-3 py-1.5 rounded-full bg-safuDeep text-[#fef3c7] font-semibold">All</button>
            <button className="px-3 py-1.5 rounded-full bg-white border border-black/10">Blockchain</button>
            <button className="px-3 py-1.5 rounded-full bg-white border border-black/10">DeFi</button>
            <button className="px-3 py-1.5 rounded-full bg-white border border-black/10">AI</button>
            <button className="px-3 py-1.5 rounded-full bg-white border border-black/10">Marketing</button>
          </div>
        </section>

        {/* Courses grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {demoCourses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="glass-card p-4 flex flex-col gap-3 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,0,0,0.12)] transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1 text-[10px] text-[#a16207] uppercase tracking-[0.16em] mb-1">
                    <span>{course.category}</span>
                    <span className="w-1 h-1 rounded-full bg-[#a16207]" />
                    <span>{course.level}</span>
                  </div>
                  <h2 className="text-[15px] font-semibold tracking-[-0.03em] text-safuDeep">{course.title}</h2>
                </div>
                <div className="px-2 py-1 rounded-full bg-[#fef3c7] text-[10px] text-[#92400e] font-semibold">
                  {course.lessons} lessons
                </div>
              </div>
              <p className="text-[12px] text-[#555] leading-relaxed line-clamp-3">{course.summary}</p>
              <div className="flex items-center justify-between text-[11px] text-[#777] pt-1">
                <span>{course.duration} total</span>
                <span className="text-[#92400e] font-semibold">View details →</span>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </Layout>
  );
}
