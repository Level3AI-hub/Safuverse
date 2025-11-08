// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

const ReviewCard = ({ review, index }) => {
  const getInitials = (name) => {
    if (!name) return "??";
    const names = name.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase();
  };

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="glass-effect p-6 rounded-xl card-hover-effect "
    >
      <div className="flex items-center mb-4">
        <Avatar className="h-12 w-12 border-2 border-primary/50">
          <AvatarImage src={review.avatarUrl} alt={review.name} />
          <AvatarFallback className="bg-primary/20 text-primary font-semibold">
            {getInitials(review.name)}
          </AvatarFallback>
        </Avatar>
        <div className="ml-4">
          <p className="font-semibold text-slate-100 max-w-5">{review.name}</p>
          <p className="text-xs text-slate-400">{review.handle}</p>
        </div>
        <div className="ml-auto mt-5 flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-500'}`}
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">
        {review.text}
      </p>
    </motion.div>
  );
};

export default ReviewCard;