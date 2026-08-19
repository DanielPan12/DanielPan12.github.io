import { motion } from 'framer-motion';
import { useTransitionDirection } from '../context/TransitionDirectionContext';
import './PageTransition.css';

// Three-beat choreography: shrink in place, slide the shrunk page off/on
// screen, then the new page expands back up. Both the exiting and entering
// page animate concurrently (not sequentially) so the shrunk pages appear to
// swap places, matching a slide-carousel feel rather than a plain crossfade.
const PHASE_TIMES = [0, 0.38, 0.62, 1];
const EASE = [0.65, 0, 0.35, 1];
const DURATION = 0.8;

const variants = {
  initial: direction => ({
    x: direction >= 0 ? '100%' : '-100%',
    scale: 0.86,
    zIndex: 2
  }),
  animate: direction => ({
    x: [direction >= 0 ? '100%' : '-100%', direction >= 0 ? '100%' : '-100%', 0, 0],
    scale: [0.86, 0.86, 0.86, 1],
    zIndex: 2,
    transition: {
      duration: DURATION,
      ease: EASE,
      x: { times: PHASE_TIMES },
      scale: { times: PHASE_TIMES }
    }
  }),
  exit: direction => ({
    x: [0, 0, direction >= 0 ? '-100%' : '100%', direction >= 0 ? '-100%' : '100%'],
    scale: [1, 0.86, 0.86, 0.86],
    zIndex: 1,
    transition: {
      duration: DURATION,
      ease: EASE,
      x: { times: PHASE_TIMES },
      scale: { times: PHASE_TIMES }
    }
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
