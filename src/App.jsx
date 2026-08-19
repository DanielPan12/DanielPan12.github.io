import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import SiteNav from './components/nav/SiteNav';
import PageTransition from './components/PageTransition';
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
