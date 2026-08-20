import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import SiteNav from './components/nav/SiteNav';
import MoltenMetal from './components/reactbits/MoltenMetal';
import { TransitionDirectionProvider } from './context/TransitionDirectionContext';
import { navIndex } from './config/navItems';
import Home from './pages/Home';
import Education from './pages/Education';
import Experience from './pages/Experience';
import Projects from './pages/Projects';
import Campus from './pages/Campus';
import Hobbies from './pages/Hobbies';
import './App.css';

function App() {
  const location = useLocation();

  // Derived-during-render "previous value" tracking (React's documented
  // pattern for this) so the slide direction is correct on the very same
  // render that starts the transition, not one render behind.
  const [prevPathname, setPrevPathname] = useState(location.pathname);
  const [direction, setDirection] = useState(1);
  if (location.pathname !== prevPathname) {
    const newIndex = navIndex(location.pathname);
    const oldIndex = navIndex(prevPathname);
    setDirection(newIndex >= oldIndex ? 1 : -1);
    setPrevPathname(location.pathname);
  }

  return (
    <div className="app">
      <div className="app__background">
        <MoltenMetal
          color1="#2a1f5c"
          color2="#3d8bd6"
          color3="#eef2f7"
          colorMode="frost"
          speed={0.18}
          scale={2}
          detail={4}
          glow={2}
          coreSize={0.13}
          swirl={1.3}
          fold={-0.2}
          blackPoint={0.015}
          brightness={1.3}
          grain
          grainIntensity={0.04}
          mouseInteraction={false}
          opacity={0.75}
        />
      </div>

      <SiteNav />
      <main className="app__main">
        <TransitionDirectionProvider value={direction}>
          <AnimatePresence mode="sync" initial={false} custom={direction}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/education" element={<Education />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/campus" element={<Campus />} />
              <Route path="/hobbies" element={<Hobbies />} />
            </Routes>
          </AnimatePresence>
        </TransitionDirectionProvider>
      </main>
    </div>
  );
}

export default App;
