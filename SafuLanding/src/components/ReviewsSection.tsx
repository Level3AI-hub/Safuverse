// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';
import ReviewCard from '@/components/ReviewCard';
import { Briefcase, Award, Users, Star as StarIcon } from 'lucide-react';

const reviewsData = [
  {
    id: 1,
    name: "@useralpha",
    handle: "Verified Buyer",
    text: "Used a lot of themes, this one so far so best - options, design, everything. Only downside is very simple documentation, basically a never found solution to my problem in docs.",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=50&q=60",
    rating: 4,
  },
  {
    id: 2,
    name: "@chalkfacepros",
    handle: "Power User",
    text: "Awesome theme and absolutely top-notch support! One of the best I have experienced! The team is always helpful when asking questions via chat or support.",
    avatarUrl: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=50&q=60",
    rating: 5,
  },
  {
    id: 3,
    name: "@devguru",
    handle: "Early Adopter",
    text: "The template is well-designed and user-friendly. What stands out even more is the excellent customer support they provide. They have been responsive and helpful whenever I needed assistance.",
    avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=50&q=60",
    rating: 5,
  },
  {
    id: 4,
    name: "@tsoto8",
    handle: "Long-time Customer",
    text: "Fine and modern theme. Also I'm giving a five star rating for the excellent customer support. They're always there for you and assist very quickly. Highly recommend!",
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA&auto=format&fit=crop&w=50&q=60",
    rating: 5,
  },
  {
    id: 5,
    name: "@KodiakBaer",
    handle: "for Code Quality",
    text: "I am using this theme on two different websites already and aside from the great design, which can be easily customized, it works great with pretty much no issues. And if there is a problem, the team is always helpful.",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=50&q=60",
    rating: 5,
  },
  {
    id: 6,
    name: "@ccw17",
    handle: "for Customer Support",
    text: "I have purchased many other themes with 1+ page speed, but after I optimized the website, and made all possible optimizations, very few achieve similar speed. This is one of those that maintains 1+ speed after all needed changes. Easy customization, many options and features, highly recommended.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=50&q=60",
    rating: 5,
  },
  {
    id: 7,
    name: "@michak",
    handle: "for Other",
    text: "Quite apart from the fact that the theme is mega great, I would also like to thank the support. Everything is answered very quickly and the help is technically flawless. Thanks!",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=50&q=60",
    rating: 5,
  },
  {
    id: 8,
    name: "@troller",
    handle: "for Design Quality",
    text: "There are many things that are very positive about this template. Quality, Design, Customization, Code Quality and so on... Abolutely fantastic.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=50&q=60",
    rating: 5,
  }
];

const statItems = [
  { value: "9+", label: "Years of Experience", sublabel: "on Digital Markets", icon: <Briefcase className="w-8 h-8 text-primary" /> },
  { value: "Elite", label: "Power Elite Author", sublabel: "Time-tested quality", icon: <Award className="w-8 h-8 text-primary" /> },
  { value: "20k+", label: "Happy Customers", sublabel: "And more to come", icon: <Users className="w-8 h-8 text-primary" /> },
];

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const ReviewsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-purple-950/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          className="text-center mb-12 md:mb-16"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-50 dark:text-white mb-4 leading-tight"
          >
            Our customers <span className="primary-gradient-text">love us</span>,
            <br className="hidden sm:block" /> find out why below.
          </motion.h2>
          <motion.div 
            variants={itemVariants}
            className="flex items-center justify-center text-slate-300 dark:text-slate-400 mb-10"
          >
            <StarIcon className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-2" />
            <span className="font-medium">4.85 out of 5</span>
            <span className="mx-1.5">•</span>
            <span>Based on 590+ reviews</span>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-3xl mx-auto"
          >
            {statItems.map((item, index) => (
              <div key={index} className="flex flex-col items-center p-4 glass-effect rounded-lg shadow-md">
                <div className="p-3 rounded-full bg-primary/10 mb-3">
                  {item.icon}
                </div>
                <p className="text-2xl md:text-3xl font-bold text-slate-50 dark:text-white">{item.value}</p>
                <p className="text-sm font-medium text-slate-200 dark:text-slate-300">{item.label}</p>
                <p className="text-xs text-slate-400 dark:text-slate-400">{item.sublabel}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {reviewsData.map((review, index) => (
            <ReviewCard 
              key={review.id} 
              review={review}
              index={index} 
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewsSection;