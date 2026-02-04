import React from 'react';
import { motion } from 'framer-motion';
import { heroData } from '../data';

const Hero = () => {
    return (
        <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-brand-900">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-20 left-20 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="container mx-auto px-6 z-10 text-center relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-brand-400 font-mono text-xl mb-4">Hi, I am</h2>
                    <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight">
                        {heroData.name}
                    </h1>
                    <h2 className="text-3xl md:text-5xl text-slate-400 font-light mb-8">
                        {heroData.title}
                    </h2>
                    <p className="max-w-2xl mx-auto text-slate-300 text-xl mb-10 leading-relaxed">
                        {heroData.subtitle}
                    </p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="flex justify-center gap-6"
                    >
                        <a
                            href="#projects"
                            className="px-8 py-3 bg-brand-500 text-brand-900 font-bold rounded-full hover:bg-brand-400 transition-transform transform hover:-translate-y-1 hover:shadow-lg shadow-brand-500/20"
                        >
                            View Work
                        </a>
                        <a
                            href="#contact"
                            className="px-8 py-3 border border-brand-500 text-brand-500 font-bold rounded-full hover:bg-brand-500/10 transition-transform transform hover:-translate-y-1"
                        >
                            Contact Me
                        </a>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Down Indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                <div className="w-1 h-12 rounded-full bg-gradient-to-b from-brand-500 to-transparent opacity-50"></div>
            </motion.div>
        </section>
    );
};

export default Hero;

