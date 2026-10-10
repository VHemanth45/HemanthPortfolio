import { MotionConfig } from 'framer-motion';
import { EPOCHS } from './data/content';
import { useActiveSection } from './lib/useActiveSection';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Experiments from './components/Experiments';
import ModelCard from './components/ModelCard';
import TrainingLog from './components/TrainingLog';
import References from './components/References';
import Requirements from './components/Requirements';
import Inference from './components/Inference';
import Footer from './components/Footer';
import { ScrollLine } from './components/TrainingMonitor';
import Herd from './components/herd/Herd';
import HerdDock from './components/herd/HerdDock';

const SECTION_IDS = EPOCHS.map((e) => e.id);

export default function App() {
    const active = useActiveSection(SECTION_IDS);

    return (
        <MotionConfig reducedMotion="user">
            <a
                href="#work"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
            >
                Skip to projects
            </a>
            <div className="grain" aria-hidden="true" />
            <Nav active={active} />
            {/* relative: the agents' layer spans the whole document, in page coordinates */}
            <div className="relative">
                {/* clip, not hidden: stops sideways overflow without breaking position: sticky */}
                <div className="overflow-x-clip">
                    <main>
                        <Hero />
                        <Experiments />
                        <ModelCard />
                        <TrainingLog />
                        <References />
                        <Requirements />
                        <Inference />
                    </main>
                    <Footer />
                </div>
                <Herd />
            </div>
            <HerdDock />
            <ScrollLine />
        </MotionConfig>
    );
}
