import React from 'react';
import { motion } from 'framer-motion';
import { aboutData, techStack } from '../data';
import { FaDownload } from 'react-icons/fa';

const About = () => {
    return (
        <section id="about" className="py-20 bg-brand-900 relative">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row items-center gap-12 mb-20"
                >
                    {/* Image */}
                    <div className="md:w-1/3 flex justify-center">
                        <div className="relative w-64 h-64 md:w-80 md:h-80">
                            <div className="absolute inset-0 bg-brand-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                            <img
                                src={aboutData.image}
                                alt="Profile"
                                className="w-full h-full object-cover rounded-full border-4 border-slate-700 hover:border-brand-500 transition-colors duration-300 relative z-10"
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="md:w-2/3 text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            <span className="border-b-4 border-brand-500 pb-2">{aboutData.title}</span>
                        </h2>
                        <p className="text-xl text-brand-400 font-medium mb-6">
                            {aboutData.shortIntro}
                        </p>
                        <div className="text-slate-300 leading-relaxed space-y-4 mb-8 text-lg">
                            {aboutData.longDescription.map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>

                        <a
                            href={aboutData.resumeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors border border-slate-700 hover:border-brand-500 group"
                        >
                            <FaDownload className="text-brand-500 group-hover:scale-110 transition-transform" />
                            Download Resume
                        </a>
                    </div>
                </motion.div>

                {/* Tech Stack Horizontal Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="pt-10 border-t border-slate-800"
                >
                    <h3 className="text-center text-2xl font-bold text-white mb-8">Tech Stack</h3>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                        {techStack.map((tech, index) => (
                            <motion.div
                                key={index}
                                className="flex flex-col items-center gap-2 group"
                                whileHover={{ y: -5 }}
                            >
                                <tech.icon className="text-4xl md:text-5xl text-slate-500 group-hover:text-brand-500 transition-colors" />
                                <span className="text-sm text-slate-500 group-hover:text-brand-400 transition-colors">{tech.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
