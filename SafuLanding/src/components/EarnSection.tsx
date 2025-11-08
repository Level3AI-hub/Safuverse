// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Award, TrendingUp, DollarSign } from 'lucide-react';

const earnItems = [
  {
    icon: Zap,
    title: "Quick Tasks & Gigs",
    description: "Micro-tasks for instant crypto rewards. Perfect for quick wins.",
    reward: "0.001 - 0.01 ETH"
  },
  {
    icon: Award,
    title: "Skill Challenges",
    description: "Showcase abilities in timed challenges. Prove your expertise.",
    reward: "0.01 - 0.1 ETH"
  },
  {
    icon: TrendingUp,
    title: "Project Bounties",
    description: "Take on larger projects for substantial crypto earnings.",
    reward: "0.1 - 1+ ETH"
  }
];

const EarnSection = () => {
  return (
    <section id="earn" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-purple-950/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center"
        >
          <h2 className="section-title">
            Earn <span className="primary-gradient-text">Crypto</span> Your Way
          </h2>
          <p className="section-subtitle">
            Earn crypto by doing what you love — tasks, challenges, and bounties included with your <code className="text-primary font-bold p-1.5 rounded-md bg-primary/10 shadow-sm">.creator</code> identity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="space-y-7">
              {earnItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
                  viewport={{ once: true, amount: 0.5 }}
                  className="flex items-start space-x-5 glass-effect rounded-xl p-6 card-hover-effect"
                >
                  <div className="mt-1 w-12 h-12 bg-gradient-to-br from-primary to-orange-400 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <item.icon className="w-6 h-6 text-background" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1.5">{item.title}</h3>
                    <p className="text-sm text-gray-400 mb-2.5">{item.description}</p>
                    <span className="inline-flex items-center text-green-400 font-medium text-sm bg-green-500/10 px-2.5 py-1 rounded-full">
                      <DollarSign className="w-3.5 h-3.5 mr-1.5"/>
                      Earn: {item.reward}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="relative"
          >
            <div className="glass-effect rounded-xl p-7 pulse-glow">
              <img 
                className="w-full h-80 object-cover rounded-lg mb-6 shadow-2xl"
                alt="Crypto earning dashboard with various tasks and rewards"
                src="https://images.unsplash.com/photo-1571677246347-5040036b95cc" />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-md text-gray-300">Your Total Earnings</span>
                  <span className="text-2xl font-bold primary-gradient-text">3.15 ETH</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-2.5">
                  <div className="bg-gradient-to-r from-primary to-orange-400 h-2.5 rounded-full" style={{width: "75%"}}></div>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>Next Payout: $150 USDC</span>
                  <span>Reputation: 97%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EarnSection;
