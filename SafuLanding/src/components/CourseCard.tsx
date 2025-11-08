// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Play, Rocket, Brain, ArrowRight, Users, Star, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const iconMap = {
  Target, Play, Rocket, Brain
};

const CourseCard = ({ course, animationDelay = 0 }) => {
  const IconComponent = iconMap[course.icon] || Target;
  // Mock enrollment for card display: For demo, let's assume no course is pre-enrolled on general cards
  // Actual enrollment state would come from user context or props
  const isEnrolled = false; 

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: animationDelay, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
      className="glass-effect rounded-xl overflow-hidden group card-hover-effect flex flex-col h-full"
    >
      <div className="h-52 bg-gradient-to-br from-primary/10 to-orange-400/10 relative overflow-hidden">
        <img 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-400 ease-in-out"
          alt={`${course.title} course preview`}
         src="https://images.unsplash.com/photo-1597096337857-1de36e3ae34b" />
        <div className="absolute top-4 left-4">
          <Badge variant="default" className="bg-primary/90 text-primary-foreground shadow-md">
            {course.level}
          </Badge>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-card via-card/70 to-transparent p-4 flex items-end justify-between">
            <div className="flex items-center space-x-2">
                <IconComponent className="w-5 h-5 text-primary" />
                <span className="text-xs text-gray-200 font-medium">{course.duration}</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-300">
                <Star size={14} className="text-yellow-400" /> 
                <span>{course.rating}</span>
                <Users size={14} className="ml-1.5 text-primary/80" />
                <span>{course.students > 1000 ? (course.students/1000).toFixed(1) + 'k' : course.students}</span>
            </div>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-200 min-h-[56px]">
          {course.title}
        </h3>
        <p className="text-sm text-gray-400 mb-5 line-clamp-3 flex-grow min-h-[60px]">
          {course.description.split(" Access with .creator domain.")[0]}
        </p>
        <div className="mt-auto">
            <Link to={`/courses/${course.id}`} className="block">
            <Button className="w-full bg-gradient-to-r from-primary to-orange-400 hover:from-orange-500 hover:to-primary text-background font-semibold text-sm py-3 rounded-lg shadow-lg hover:shadow-primary/40 transition-all duration-300 transform hover:scale-105">
                View Course Details
                <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            </Link>
            {!isEnrolled && (
                <p className="text-xs text-amber-400 mt-2 text-center flex items-center justify-center">
                    <Lock size={12} className="mr-1" /> Mint .creator domain to enroll
                </p>
            )}
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;