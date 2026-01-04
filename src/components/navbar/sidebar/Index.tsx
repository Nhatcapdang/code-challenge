'use client';

import * as React from 'react';
import { useRef } from 'react';
import { motion, useCycle, Variants } from 'framer-motion';
import { Navigation } from './Navigation';
import { MenuToggle } from './MenuToggle';
import { useDimensions } from '@/hooks';

const sidebar: Variants = {
  open: {
    transition: {
      type: 'spring',
      stiffness: 20,
      restDelta: 2,
    },
  },
  closed: {
    transition: {
      delay: 0.5,
      type: 'spring',
      stiffness: 400,
      damping: 40,
    },
  },
};

export const Sidebar = () => {
  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef(null);
  useDimensions(containerRef);
  return (
    <motion.nav
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      ref={containerRef}
      className="min-[850px]:hidden relative z-50"
    >
      <motion.div className="background" variants={sidebar} />
      <Navigation toggle={() => toggleOpen()} />
      <MenuToggle toggle={() => toggleOpen()} />
    </motion.nav>
  );
};
