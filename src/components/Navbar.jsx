import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const Navbar = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#home' },
        { name: 'About', href: '#about' },
        { name: 'Projects', href: '#projects' },
        { name: 'Kaggle', href: '#kaggle' },
        { name: 'Blogs', href: '#blogs' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <>
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-brand-500 origin-left z-50"
                style={{ scaleX }}
            />
            <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-brand-900/90 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'}`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <a href="#" className="text-2xl font-bold text-white tracking-widest hover:text-brand-400 transition-colors">
                        HEMANTH
                    </a>

                    <ul className="hidden md:flex space-x-8">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <a
                                    href={link.href}
                                    className="text-slate-300 hover:text-brand-400 transition-colors text-sm uppercase tracking-wider font-semibold"
                                >
                                    {link.name}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* Mobile Menu Button (Hamburger) - To be implemented if requested, keeping simple for now */}
                    <div className="md:hidden text-white">
                        {/* Placeholder for hamburger */}
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
