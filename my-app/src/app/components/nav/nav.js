'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-lg py-4' : 'bg-transparent py-6'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Arbeit
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('features')}
              className={`${isScrolled ? 'text-gray-600' : 'text-gray-800'} hover:text-blue-600 transition-colors`}
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className={`${isScrolled ? 'text-gray-600' : 'text-gray-800'} hover:text-blue-600 transition-colors`}
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('scanner')}
              className={`${isScrolled ? 'text-gray-600' : 'text-gray-800'} hover:text-blue-600 transition-colors`}
            >
              ATS Scanner
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className={`${isScrolled ? 'text-gray-600' : 'text-gray-800'} hover:text-blue-600 transition-colors`}
            >
              Testimonials
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/auth"
              className={`${
                isScrolled ? 'text-gray-600' : 'text-gray-800'
              } hover:text-blue-600 transition-colors`}
            >
              Login
            </Link>
            <Link
              href="/auth"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors shadow-lg hover:shadow-xl"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
