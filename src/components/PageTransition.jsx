import { motion } from 'framer-motion';
import { useTransitionDirection } from '../context/TransitionDirectionContext';
import './PageTransition.css';

// The background lives once in App.jsx and never re-mounts on navigation —
// this only slides the page's own content in/out, so the site reads as one
// continuous surface rather than whole pages swapping out.
const EASE = [0.22, 1, 0.36, 1];
const DURATION = 0.5;

const variants = {
  initial: direction => ({
    x: direction >= 0 ? 48 : -48,
    opacity: 0,
    zIndex: 2
  }),
  animate: {
    x: 0,
    opacity: 1,
    zIndex: 2,
    transition: { duration: DURATION, ease: EASE }
  },
  exit: direction => ({
    x: direction >= 0 ? -48 : 48,
    opacity: 0,
    zIndex: 1,
    transition: { duration: DURATION * 0.8, ease: EASE }
  })
};

const PageTransition = ({ children }) => {
  const direction = useTransitionDirection();

  return (
    <motion.div
      className="page-transition"
      custom={direction}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
