import React from 'react';
import { socialLinks } from '../data';

const Footer = () => {
    return (
        <footer id="contact" className="bg-slate-900 pt-20 pb-10 border-t border-slate-800">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold text-white mb-8">Get In Touch</h2>
                <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                    I'm currently looking for new opportunities. Whether you have a question or just want to say hi,
                    feel free to reach out on social media!
                </p>

                <div className="flex justify-center gap-8 mb-12">
                    {socialLinks.map((social, index) => (
                        <a
                            key={index}
                            href={social.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-brand-500 transition-colors text-3xl transform hover:scale-110"
                            aria-label={social.label}
                        >
                            <social.icon />
                        </a>
                    ))}
                </div>

                <div className="text-slate-600 text-sm">
                    <p>&copy; {new Date().getFullYear()} Hemanth Vankudoth. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
