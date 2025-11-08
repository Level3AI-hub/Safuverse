// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Fingerprint, ShieldCheck, Globe, Link as LinkIcon, ArrowRight, Sparkles, Unlock } from 'lucide-react'; // Changed LockOpen to Unlock
import { Link } from 'react-router-dom';

const CreatorDomainSection = ({ isPage = false }) => {
  const containerClass = isPage
    ? "min-h-screen flex items-center justify-center crypto-pattern py-20 md:py-32 px-4 sm:px-6 lg:px-8"
    : "py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-background/90 to-purple-950/20 relative overflow-hidden";
  
  const contentMaxWidth = isPage ? "max-w-3xl" : "max-w-5xl";

  return (
    <section id="creator-domain" className={containerClass}>
      {!isPage && (
        <>
          <div className="absolute -top-1/3 -left-1/4 w-2/3 h-2/3 bg-primary/5 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-1/3 -right-1/4 w-2/3 h-2/3 bg-cyan-500/5 rounded-full filter blur-3xl opacity-30 animate-pulse animation-delay-3000"></div>
        </>
      )}
      <div className={`${contentMaxWidth} mx-auto text-center relative z-10`}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="inline-flex items-center px-5 py-2.5 rounded-full glass-effect mb-6 border border-primary/30 shadow-lg">
            <Sparkles className="w-5 h-5 text-primary mr-2.5" />
            <span className="text-sm font-medium text-gray-200">Your Unique Web3 Address</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Mint Your <span className="primary-gradient-text">.creator</span> Domain
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Establish your unique identity in Web3 A <code className="text-primary font-semibold p-1 rounded bg-primary/10">.creator</code> domain is your passport to exclusive courses, earning opportunities, and verifiable status in the decentralized creator economy.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: Fingerprint, title: "Unique Identity", desc: <>Be known. Be trusted. Claim a personalized Web3 name that’s truly yours</> },
              { icon: ShieldCheck, title: "Verified Ownership", desc: <>Prove your authenticity and earn trust across the decentralized web.</> },
              { icon: Globe, title: "Universal Access", desc: <>Unlock powerful features across Level3 — and wherever your <code className="text-primary font-semibold p-1 rounded bg-primary/10">.creator</code> goes.</> }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.3 }}
                className="glass-effect p-6 rounded-xl card-hover-effect"
              >
                <item.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-orange-400 hover:from-orange-500 hover:to-primary text-background font-semibold text-lg px-10 py-5 rounded-xl shadow-xl hover:shadow-primary/50 transition-all duration-300 transform hover:scale-105 neon-glow group"
              onClick={() => alert("Redirecting to domain minting service (simulation)...")}
            >
              <Unlock className="w-6 h-6 mr-3" /> {/* Changed icon from LockOpen to Unlock */}
              Claim & Unlock Access {/* Text is already "Claim & Unlock Access" */}
              <ArrowRight className="w-5 h-5 ml-2.5 group-hover:translate-x-1 transition-transform" />
            </Button>
            {!isPage && (
                <Link to="/mint-creator-domain">
                    <p className="mt-6 text-sm text-primary hover:underline">
                        Learn more about .creator domains <ArrowRight className="inline w-4 h-4" />
                    </p>
                </Link>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CreatorDomainSection;
