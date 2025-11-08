// @ts-nocheck
import React from 'react';
import HeroSection from '@/components/HeroSection';
import CoursesSection from '@/components/CoursesSection';
import EarnSection from '@/components/EarnSection';
import ReviewsSection from '@/components/ReviewsSection';
import StatsSection from '@/components/StatsSection';
import CTASection from '@/components/CTASection';
import CreatorDomainSection from '@/components/CreatorDomainSection';


const HomePage = ({ courses }) => {
  return (
    <>
      <HeroSection />
      <CreatorDomainSection />
      <CoursesSection courses={courses.slice(0,3)} title="Featured AI Courses" isHomePage={true} />
      <EarnSection />
      <ReviewsSection />
      <StatsSection />
      <CTASection />
    </>
  );
};

export default HomePage;