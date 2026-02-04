import React from 'react';
import { motion } from 'framer-motion';
import { FaKaggle, FaExternalLinkAlt } from 'react-icons/fa';
import { kaggleNotebooks, socialLinks } from '../data';

const Kaggle = () => {
    // Find Kaggle link from socialLinks if needed, but we have hardcoded it in button for now or use the one from socialLinks
    const kaggleProfile = socialLinks.find(link => link.label === "Kaggle")?.link || "https://www.kaggle.com/";

    return (
        <section id="kaggle" className="py-20 bg-brand-800 relative">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <div className="flex justify-center mb-4">
                        <FaKaggle className="text-5xl text-brand-500" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Kaggle Notebooks</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto mb-8">
                        Explore my data analysis and machine learning experiments.
                    </p>

                    <a
                        href={kaggleProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-brand-500 text-brand-900 font-bold rounded-full hover:bg-brand-400 transition-all shadow-lg shadow-brand-500/20"
                    >
                        Visit Kaggle Profile <FaExternalLinkAlt className="text-sm" />
                    </a>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {kaggleNotebooks.map((notebook, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-brand-900 border border-slate-700 p-6 rounded-xl hover:border-brand-500 transition-colors group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-slate-800 rounded-lg group-hover:bg-brand-500/10 transition-colors">
                                    <FaKaggle className="text-2xl text-blue-400" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">
                                {notebook.title}
                            </h3>
                            <p className="text-slate-400 text-sm mb-4">
                                {notebook.description}
                            </p>
                            <a
                                href={notebook.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand-500 font-semibold text-sm hover:underline"
                            >
                                View Notebook &rarr;
                            </a>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Kaggle;
