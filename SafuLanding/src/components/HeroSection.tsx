import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Link as LinkIcon } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import MarqueeSection from "./MarqueeSection";
import DomainShowcaseSection from "./DomainShowcaseSection";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: "easeOut" },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const marqueeItems = [
  {
    id: 1,
    text: "AI-Driven, Human-Curated",
    iconUrl:
      "https://storage.googleapis.com/hostinger-horizons-assets-prod/f58d1886-73c2-4ebb-b115-6d931332e7b4/de92dff091f07f9e2bacd7989c0e3813.png",
  },
  {
    id: 2,
    text: "Expert-Led Content",
    iconUrl:
      "https://storage.googleapis.com/hostinger-horizons-assets-prod/f58d1886-73c2-4ebb-b115-6d931332e7b4/513a1f02093b42a6bec9816e5d2cc115.png",
  },
  {
    id: 3,
    text: "Scalable by Design",
    iconUrl:
      "https://storage.googleapis.com/hostinger-horizons-assets-prod/f58d1886-73c2-4ebb-b115-6d931332e7b4/d7f5b36276c0a3b06a4f0902a22eb91e.png",
  },
  {
    id: 4,
    text: "Earn as You Learn",
    iconUrl:
      "https://storage.googleapis.com/hostinger-horizons-assets-prod/f58d1886-73c2-4ebb-b115-6d931332e7b4/8b6cdea33b837810a9809146df4eb15e.png",
  },
  {
    id: 5,
    text: "Powered by .creator Identity",
    iconUrl:
      "https://storage.googleapis.com/hostinger-horizons-assets-prod/f58d1886-73c2-4ebb-b115-6d931332e7b4/d5d14a8ef379eb234412a66174080ac7.png",
  },
  {
    id: 6,
    text: "Web3 Native Learning",
    iconUrl:
      "https://storage.googleapis.com/hostinger-horizons-assets-prod/f58d1886-73c2-4ebb-b115-6d931332e7b4/866d1c1b4541d998de737dcce5144a81.png",
  },
];

const HeroSection = () => {
  return (
    <section className="relative pt-8 pb-0 md:pt-10 md:pb-0 px-4 sm:px-6 lg:px-8 crypto-pattern overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-transparent z-0"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="text-center"
        >
          <motion.div variants={fadeInUp} className="mb-7">
            <div className="inline-flex items-center px-5 py-2.5 rounded-full glass-effect mb-5 border border-primary/30 shadow-lg">
              <Sparkles className="w-5 h-5 text-primary mr-2.5" />
              <span className="text-sm font-medium text-gray-200">
                The Future of Creator Economy
              </span>
            </div>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight"
          >
            Supercharge Your
            <br />
            <span className="primary-gradient-text">Ambitions with AI</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Learn smarter. Earn in crypto. Define your Web3 identity with
            confidence. Powered by{" "}
            <code className="text-primary font-bold p-1.5 rounded-md bg-primary/10 shadow-sm">
              .creator
            </code>{" "}
            — your passport to the decentralized future.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center mb-8"
          >
            <RouterLink to="/mint-creator-domain">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-orange-400 hover:from-orange-500 hover:to-primary text-background font-semibold text-md px-8 py-4 rounded-lg shadow-xl hover:shadow-primary/50 transition-all duration-300 transform hover:scale-105 neon-glow"
              >
                <LinkIcon className="w-5 h-5 mr-2.5" />
                Mint .creator Domain
              </Button>
            </RouterLink>
            <Button
              size="lg"
              variant="outline"
              className="border-primary/70 text-primary hover:bg-primary/10 hover:border-primary text-md px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 group"
              onClick={() => {
                const earnSection = document.getElementById("earn");
                if (earnSection) {
                  earnSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Explore Earning{" "}
              <ArrowRight className="w-5 h-5 ml-2.5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-8"
      >
        <MarqueeSection items={marqueeItems} />
      </motion.div>
      <DomainShowcaseSection />
    </section>
  );
};

export default HeroSection;
