import { profile } from '../data/content';

export default function Footer() {
    return (
        <footer className="border-t border-ink/15">
            <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-x-8 gap-y-3 px-5 py-8 font-mono text-[12px] text-ink-3 md:px-8">
                <span>
                    © {new Date().getFullYear()} {profile.fullName} — trained at IIT (BHU), served from GitHub Pages.
                </span>
                <span className="flex items-center gap-4">
                    <span className="text-pen-green">Early stopping triggered ✓</span>
                    <a href="#top" className="link-u text-ink-2">
                        Back to top ↑
                    </a>
                </span>
            </div>
        </footer>
    );
}
