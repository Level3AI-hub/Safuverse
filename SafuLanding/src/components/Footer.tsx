// @ts-nocheck
import React from 'react';
import { Github, Twitter, Linkedin, Send } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Send, href: "#", label: "Telegram" },
  ];

  const footerSections = [
    {
      title: "Platform",
      links: ["AI Courses", "Earn Crypto", ".creator Domains", "Community Hub", "Leaderboards"]
    },
    {
      title: "Company",
      links: ["About Us", "Careers", "Blog", "Press Kit", "Partnerships"]
    },
    {
      title: "Support",
      links: ["Help Center", "Documentation", "Contact Us", "FAQs", "Status Page"]
    },
    {
      title: "Legal",
      links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Disclaimer"]
    }
  ];

  return (
    <footer className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 border-t border-border/30 bg-background/70">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center space-x-2.5 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-400 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-background font-bold text-2xl">L3</span>
              </div>
              <span className="text-3xl font-bold primary-gradient-text">Level3</span>
            </a>
            <p className="text-md text-gray-400 mb-6 max-w-md">
              Empowering the next generation of Web3 content creators with AI-driven learning and decentralized earning opportunities.
            </p>
            <div className="flex space-x-5">
              {socialLinks.map(social => (
                <a key={social.label} href={social.href} aria-label={social.label} className="text-gray-500 hover:text-primary transition-colors duration-200">
                  <social.icon size={22} />
                </a>
              ))}
            </div>
          </div>

          {footerSections.slice(0,3).map(section => (
             <div key={section.title}>
              <span className="text-lg font-semibold mb-5 block text-gray-100">{section.title}</span>
              <ul className="space-y-2.5">
                {section.links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm text-gray-400 hover:text-primary hover:underline transition-colors duration-200 underline-offset-4">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            © {new Date().getFullYear()} Level3 Protocol. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Built with <span className="text-primary">&hearts;</span> for the Decentralized Future.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;