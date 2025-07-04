import * as React from 'react';
import { useRef } from 'react';
import { motion, useCycle, Variants } from 'framer-motion';

import './styles.css';

import { useDimensions } from '@/src/utils';
import { MenuToggle } from './MenuToggle';
import { Navigation } from './Navigation';

const sidebar: Variants = {
  open: (height = 1000) => ({
    // clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    transition: {
      type: 'spring',
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    // clipPath: 'circle(30px at 40px 40px)',
    transition: {
      delay: 0.5,
      type: 'spring',
      stiffness: 400,
      damping: 40,
    },
  },
};

export const Nav = () => {
  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);
  return (
    <motion.nav
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      custom={height}
      ref={containerRef}
      className="min-[900px]:hidden relative h-5 scale-125"
    >
      <motion.div className="background" variants={sidebar} />
      <Navigation toggle={() => toggleOpen()} />
      <MenuToggle toggle={() => toggleOpen()} />
    </motion.nav>
  );
};
