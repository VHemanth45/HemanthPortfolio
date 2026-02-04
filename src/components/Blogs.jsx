import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { blogsData } from '../data';

const Blogs = () => {
    const scrollRef = useRef(null);

    return (
        <section id="blogs" className="py-20 bg-brand-900 overflow-hidden relative">
            <div className="container mx-auto px-6 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Latest Blogs</h2>
                    <p className="text-slate-400">Insights and tutorials on AI, Deep Learning, and MLOps.</p>
                </motion.div>
            </div>

            {/* Carousel Container */}
            <div className="pl-6 md:pl-0">
                <div className="flex md:justify-center overflow-x-auto pb-8 hide-scrollbar gap-8 md:flex-wrap md:overflow-visible">
                    {/* Note: On mobile, horizontal scroll. On desktop, maybe grid or centered flex. 
               The user asked for a "Carousel" specifically. Let's stick to flex row that scrolls on overflow. 
           */}
                    <motion.div
                        className="flex gap-8 px-6"
                        drag="x"
                        dragConstraints={{ right: 0, left: -1000 }} // Rough constraint, ideally calculated
                        whileTap={{ cursor: "grabbing" }}
                    >
                        {blogsData.map((blog, index) => (
                            <motion.div
                                key={index}
                                className="min-w-[300px] w-[300px] bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700 hover:border-brand-500 transition-colors flex-shrink-0"
                                whileHover={{ y: -10 }}
                            >
                                <a href={blog.link} target="_blank" rel="noopener noreferrer">
                                    <div className="h-40 overflow-hidden">
                                        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 hover:text-brand-400 transition-colors">
                                            {blog.title}
                                        </h3>
                                        <p className="text-slate-400 text-sm line-clamp-3">
                                            {blog.excerpt}
                                        </p>
                                    </div>
                                </a>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
                {/* Hint for mobile scroll */}
                <p className="text-center text-slate-500 text-xs mt-4 md:hidden">Swipe to see more</p>
            </div>
        </section>
    );
};

export default Blogs;
