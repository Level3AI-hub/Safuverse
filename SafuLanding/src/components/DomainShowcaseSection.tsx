import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  User,
  Key,
  Building,
  ShoppingBag,
  Rocket,
  ArrowRight,
  Lightbulb,
  TrendingUp,
} from "lucide-react"; // Example Lucide icons

const DomainShowcaseSection = () => {
  const cardVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  // Variants for items that appear stacked on mobile and layered on desktop
  const itemVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4, ease: "easeOut" },
  };

  // Variants for the tags at the bottom of the Enterprise Insights card
  const tagVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3, ease: "easeOut" },
  };

  // Placeholder data for the domains - content is kept as per user request
  // Icons are used as placeholder visuals and are not changed as per previous instructions.
  const distinguishDomains = [
    {
      id: 1,
      name: "landenx.creator",
      icon: <Lightbulb className="w-6 h-6 text-blue-400" />,
    },
    {
      id: 2,
      name: "robinsonjr.creator",
      icon: <User className="w-6 h-6 text-green-400" />,
    },
    {
      id: 3,
      name: "crystallo.creator",
      icon: <Key className="w-6 h-6 text-purple-400" />,
    },
  ];

  const enterpriseDomains = [
    {
      id: 1,
      name: "app.chase.creator",
      icon: <Building className="w-6 h-6 text-orange-400" />,
    },
    {
      id: 2,
      name: "robinson.creator",
      icon: <User className="w-6 h-6 text-green-400" />,
    },
    {
      id: 3,
      name: "insights.techco.creator",
      icon: <TrendingUp className="w-6 h-6 text-blue-400" />,
    },
  ];

  const enterpriseTags = [
    { id: 1, name: "Web Business", icon: <Rocket className="w-4 h-4 mr-2" /> },
    {
      id: 2,
      name: "E-commerce Brands",
      icon: <ShoppingBag className="w-4 h-4 mr-2" />,
    },
    {
      id: 3,
      name: "SAAS Startups",
      icon: <Lightbulb className="w-4 h-4 mr-2" />,
    },
    {
      id: 4,
      name: "Tech Innovators",
      icon: <ArrowRight className="w-4 h-4 mr-2" />,
    },
    {
      id: 5,
      name: "Marketing Agencies",
      icon: <TrendingUp className="w-4 h-4 mr-2" />,
    },
    { id: 6, name: "Creative Studios", icon: <Key className="w-4 h-4 mr-2" /> },
  ];

  return (
    <section className="py-20 px-1 sm:px-6 lg:px-8 bg-[#141b33]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-10 gap-10">
        {/* Left Card: Distinguish Yourself */}
        <motion.div
          variants={cardVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          className="bg-slate-900 p-8 rounded-lg shadow-xl relative overflow-hidden flex flex-col lg:col-span-4"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Distinguish yourself
          </h2>
          <p className="text-gray-300 mb-8 max-w-md">
            Elevate your brand with a golden tick and connect with top-tier
            associates.
          </p>

          {/* Container for distinguish domains items */}
          <div className="relative flex flex-col items-center space-y-4 mb-4 lg:block h-[200px] md:h-[280px] lg:mt-4 lg:w-full lg:pl-6">
            {distinguishDomains.map((domain, index) => (
              <motion.div
                key={domain.id}
                variants={itemVariants}
                className={`
                  w-[80%] px-4 bg-[#1d2644] border border-[#2a345c] p-3 md:p-7 rounded-lg flex items-center justify-between
                  ${
                    index % 2 === 0 ? "translate-x-0" : "translate-x-8"
                  } /* Apply offset to every second card on mobile */
                  sm:translate-x-0                             /* Reset offset on sm and larger */
                  md:translate-x-0                            /* Reset offset on md and larger */
                  ${
                    index === 0
                      ? "absolute top-0 left-0 z-3 lg:max-w-[calc(100%-100px)]"
                      : ""
                  }
                  ${
                    index === 1
                      ? "absolute top-[68px] left-[40px] lg:left-[50px] z-2 lg:max-w-[calc(100%-100px)]"
                      : ""
                  }
                  ${
                    index === 2
                      ? "absolute top-[153px] left-[75px] lg:left-[100px] z-1 lg:max-w-[calc(100%-100px)]"
                      : ""
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  {domain.icon}
                  <span className="text-gray-100 font-medium whitespace-nowrap">
                    {domain.name}
                  </span>
                </div>
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          className="bg-slate-900 p-8 rounded-lg shadow-xl relative overflow-hidden lg:col-span-6"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Enterprise Insights
          </h2>
          <p className="text-gray-300 mb-8">
            Insights provides instant access to public sentiment, evolving
            <br /> market patterns, and trends.
          </p>

          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='600' height='600' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 170L50 150L100 170L150 150L200 170' stroke='%233a4768' stroke-width='0.8' fill='none'/%3E%3Cpath d='M0 70L50 50L100 70L150 50L200 70' stroke='%233a4768' stroke-width='0.8' fill='none'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundSize: "600px 600px",
              backgroundPosition: "center",
            }}
          ></div>

          <div className="relative flex flex-col items-center space-y-4 mb-4 lg:block lg:bg-[#0c1424] lg:w-[80%] h-[220px] md:h-[270px] z-10 lg:pl-6">
            {enterpriseDomains.map((domain, index) => (
              <motion.div
                key={domain.id}
                variants={itemVariants}
                className={`
                  w-[83%] px-4 bg-[#1d2644] border border-[#2a345c] p-3 md:p-7 rounded-lg flex items-center justify-between
                  ${
                    index % 2 === 0 ? "translate-x-0" : "translate-x-8"
                  } /* Apply offset to every second card on mobile */
                  sm:translate-x-0                             /* Reset offset on sm and larger */
                  md:translate-x-0                            /* Reset offset on md and larger */
                  ${
                    index === 0
                      ? "absolute top-0 left-0 z-3 lg:max-w-[calc(100%-100px)]"
                      : ""
                  }
                  ${
                    index === 1
                      ? "absolute top-[68px] left-[40px] lg:left-[50px] z-2 lg:max-w-[calc(100%-100px)]"
                      : ""
                  }
                  ${
                    index === 2
                      ? "absolute top-[153px] left-[75px] lg:left-[100px] z-1 lg:max-w-[calc(100%-100px)]"
                      : ""
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  {domain.icon}
                  <span className="text-gray-100 font-medium whitespace-nowrap">
                    {domain.name}
                  </span>
                </div>
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </motion.div>
            ))}
          </div>

          <div className="bg-[#0c1323] p-4 rounded-lg relative z-10 w-full mt-4 lg:w-10/12 lg:ml-auto lg:mt-[3vh]">
            <div className="grid grid-cols-2 gap-x-3 gap-y-3">
              {enterpriseTags.map((tag) => (
                <motion.div
                  key={tag.id}
                  variants={tagVariants}
                  className="bg-[#1d2644] border border-[#2a345c] px-3.5 py-3 rounded-[5px] flex items-center justify-between text-gray-200 text-sm font-medium hover:bg-[#2a345c] transition-colors duration-200 cursor-pointer"
                >
                  <div className="flex items-center">
                    {tag.icon}
                    <span>{tag.name}</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DomainShowcaseSection;
