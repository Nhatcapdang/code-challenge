import * as React from 'react';
import { MENU } from '..';
import { motion } from 'framer-motion';
import MenuItem from './MenuItem';

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    background: '#fff',
    height: '100vh',
    y: 0,
    opacity: 1,
    display: 'block',
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
    background: '#fff',
    height: '20vh',
    y: 50,
    opacity: 0,
    display: 'none',
  },
};

export const Navigation = ({ toggle }: any) => (
  <motion.div
    variants={variants}
    className=" absolute top-[44px] -right-[16px] max-xs:w-[100vw] w-[430vw] max-w-[430px] -z-10 flex justify-center items-center"
  >
    <motion.ul className="w-full overflow-hidden">
      {MENU.map((item, idx) => (
        <MenuItem {...item} key={idx} toggle={toggle} />
      ))}
    </motion.ul>
  </motion.div>
);
