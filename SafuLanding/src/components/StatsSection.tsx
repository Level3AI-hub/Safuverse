// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Coins, Brain, Star, TrendingUp as GrowthIcon } from 'lucide-react';

const stats = [
  { number: "75K+", label: "Active Learners", icon: Users, color: "text-primary" },
  { number: "$3.5M+", label: "Crypto Distributed", icon: Coins, color: "text-cyan-400" },
  { number: "600+", label: "AI-Enhanced Courses", icon: Brain, color: "text-purple-400" },
  { number: "98.5%", label: "Creator Success Rate", icon: Star, color: "text-green-400" }
];

const StatsSection = () => {
  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-12 md:mb-16"
        >
            <h2 className="section-title">
                Join a <span className="secondary-gradient-text">Thriving Ecosystem</span>
            </h2>
            <p className="section-subtitle !mb-0">
                Level3 is more than a platform; it's a launchpad for Web3 creators. See our impact.
            </p>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.9 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              className="text-center glass-effect rounded-xl p-7 card-hover-effect"
            >
              <stat.icon className={`w-12 h-12 ${stat.color} mx-auto mb-4`} />
              <div className="text-3xl md:text-4xl font-extrabold primary-gradient-text mb-2">
                {stat.number}
              </div>
              <div className="text-md text-gray-300 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;