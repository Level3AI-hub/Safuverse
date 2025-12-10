import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "../components/Layout";

const mockLesson = {
  id: "moving-averages",
  title: "Reading Moving Averages Like a Pro",
  section: "Safu Academy · On‑chain Education",
  duration: "8:34",
  lessonsInTrack: [
    { id: "moving-averages", title: "Foundation: 20 / 100 / 200 EMA", duration: "8:34", active: true },
    { id: "pullbacks", title: "Pullbacks vs retracements", duration: "7:02", active: false },
    { id: "trend-shifts", title: "Trend slowdowns & reversals", duration: "6:41", active: false },
  ],
};

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState("Transcript");
  const [notesHtml, setNotesHtml] = useState("");
  const notesRef = useRef<HTMLDivElement>(null);

  // Load notes from localStorage per lesson
  useEffect(() => {
    const saved = window.localStorage.getItem("safu_notes_" + mockLesson.id);
    if (saved) {
      setNotesHtml(saved);
    }
  }, [courseId]);

  // Keep contentEditable in sync
  useEffect(() => {
    if (notesRef.current && notesHtml && notesRef.current.innerHTML !== notesHtml) {
      notesRef.current.innerHTML = notesHtml;
    }
  }, [notesHtml]);

  const handleNotesInput = (e: React.FormEvent<HTMLDivElement>) => {
    const value = e.currentTarget.innerHTML;
    setNotesHtml(value);
    window.localStorage.setItem("safu_notes_" + mockLesson.id, value);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="text-[11px] text-[#777] flex items-center gap-2">
          <Link to="/courses" className="hover:text-safuDeep">
            All courses
          </Link>
          <span>/</span>
          <span className="text-safuDeep font-medium">{mockLesson.title}</span>
        </div>

        {/* Top layout */}
        <section className="grid lg:grid-cols-[minmax(0,3fr)_minmax(260px,1.5fr)] gap-6 items-start">
          {/* Video + meta */}
          <div className="space-y-4">
            <div className="aspect-video rounded-3xl bg-gradient-to-br from-[#fed7aa] via-[#facc15] to-[#f97316] relative overflow-hidden flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-safuDeep/90 flex items-center justify-center text-white shadow-xl">
                ▶
              </div>
              <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/60 text-[11px] text-[#fef3c7]">
                {mockLesson.section}
              </div>
              <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/60 text-[11px] text-[#fef3c7]">
                {mockLesson.duration}
              </div>
            </div>
            <div>
              <h1 className="text-[22px] sm:text-[26px] font-bold tracking-[-0.05em] text-safuDeep">
                {mockLesson.title}
              </h1>
              <p className="text-[13px] text-[#555] mt-1 max-w-xl">
                Follow a real walkthrough of on‑chain dashboards, agents, and transactions. No fluff, just the exact
                flows you'll use inside the SafuVerse.
              </p>
            </div>
          </div>

          {/* Lesson list & tabs */}
          <aside className="glass-card p-4 space-y-4">
            <div>
              <div className="text-[11px] text-[#a16207] uppercase tracking-[0.16em] mb-1">Course track</div>
              <div className="text-[13px] font-semibold text-safuDeep mb-3">
                {mockLesson.lessonsInTrack.length} lessons · {mockLesson.duration} focus time today
              </div>
              <div className="space-y-2 max-h-48 overflow-auto pr-1">
                {mockLesson.lessonsInTrack.map((l) => (
                  <button
                    key={l.id}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-[12px] text-left border ${
                      l.active
                        ? "bg-[#111] text-[#fef3c7] border-[#111]"
                        : "bg-white hover:bg-[#fefce8] text-[#444] border-black/5"
                    }`}
                  >
                    <span className="truncate">{l.title}</span>
                    <span className="text-[11px] opacity-80">{l.duration}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-black/5 pt-3">
              <div className="inline-flex rounded-full bg-[#fefce8] p-1 text-[11px] mb-3">
                {["Transcript", "Resources", "Notes"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-full transition ${
                      activeTab === tab ? "bg-[#111] text-[#fef3c7]" : "text-[#555]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="text-[13px] text-[#444] space-y-3">
                {activeTab === "Transcript" && (
                  <p>
                    Transcript content here… a clean, readable version of the lesson so learners can skim, search, and
                    copy key parts while they watch.
                  </p>
                )}
                {activeTab === "Resources" && (
                  <ul className="list-disc list-inside space-y-1">
                    <li>Dashboards mentioned in this lesson</li>
                    <li>Agent templates to clone</li>
                    <li>Extra reading and example threads</li>
                  </ul>
                )}
                {activeTab === "Notes" && (
                  <div className="space-y-3">
                    <div className="text-[12px] text-[#777]">Your personal notes for this lesson:</div>
                    <div
                      ref={notesRef}
                      contentEditable
                      suppressContentEditableWarning
                      onInput={handleNotesInput}
                      className="min-h-[170px] p-4 rounded-2xl bg-[#f8f8ff] border border-black/10 shadow-inner text-[13px] leading-relaxed outline-none focus:ring-2 focus:ring-[#facc15] transition"
                    />
                    <div className="text-[11px] text-[#aaa]">✓ Notes auto‑saved to this browser</div>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </Layout>
  );
}
