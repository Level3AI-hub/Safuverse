// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';

const MarqueeSection = ({ items }) => {
  const duplicatedItems = React.useMemo(() => {
    const averageItemWidth = 230; // Approximate width: 50px (icon) + 4px (gap) + 175px (text for 25ch)
    const baseRepetitions = Math.ceil(window.innerWidth / (items.length * averageItemWidth)) + 2; // Added +2 for safety margin
    let tempItems = [];
    for (let i = 0; i < Math.max(3, baseRepetitions * 2); i++) {
      tempItems = tempItems.concat(items.map(item => ({...item, uniqueId: `${item.id}-${i}`})));
    }
    return tempItems;
  }, [items]);

  const marqueeVariants = {
    animate: {
      x: ['0%', '-50%'], // This will be -X% where X depends on the number of original items vs duplicated
      transition: {
        x: {
          repeat: Infinity,
          repeatType: 'loop',
          // Adjusted duration to make the marquee move faster.
          // Reduced the multiplier from 5 to 3. A smaller duration means faster animation.
          duration: items.length * 2, 
          ease: 'linear',
        },
      },
    },
  };
  
  // Calculate the correct x translation percentage for seamless looping
  // This should be -(total width of unique items / total width of all items in one loop segment) * 100
  // For a simple duplication where duplicatedItems is 2 * items, x is ['0%', '-50%']
  // If duplicatedItems is items.concat(items), then -50% is correct.
  // My duplication logic is more complex to fill the screen, 
  // so the '-50%' effectively means "scroll by half the total length of the duplicatedItems array".
  // As long as duplicatedItems is an even multiple of the original set (e.g., 2x, 4x), this works.
  // My current duplication does create `baseRepetitions * 2` sets.

  return (
    <div className="w-full overflow-hidden py-3 md:py-4 relative">
      <div className="absolute inset-y-0 left-0 w-16 md:w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-16 md:w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
      
      <motion.div
        className="flex"
        variants={marqueeVariants}
        animate="animate"
      >
        {duplicatedItems.map((item) => (
          <div
            key={item.uniqueId}
            className="mx-4 shrink-0" // Spacing between items
          >
            <div className="flex items-center gap-1 py-2"> {/* User's provided style applied here */}
              <img 
                src={item.iconUrl} 
                alt={item.text} 
                className="h-[50px] w-auto object-contain" // Icon style
              />
              <p className="max-w-[25ch] text-gray-400 text-sm font-bold whitespace-nowrap overflow-hidden text-ellipsis"> {/* Text style */}
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default MarqueeSection;
