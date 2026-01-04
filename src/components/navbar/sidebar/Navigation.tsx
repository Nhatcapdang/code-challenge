import { LocaleSwitcher } from '@/components/locale-switcher';
import { motion } from 'framer-motion';
import MenuItem from './MenuItem';

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    height: '100vh',
    y: 0,
    opacity: 1,
    display: 'block',
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
    height: '20vh',
    y: 50,
    opacity: 0,
    display: 'none',
  },
};

export const NAV_ITEMS = [
  { title: 'Three ways to sum to n', href: '#problem1' },
  { title: 'Fancy Form', href: '#problem2' },
  { title: 'Messy React', href: '#problem3' },
];

export const Navigation = ({ toggle }: { toggle: () => void }) => {
  return (
    <motion.div
      variants={variants}
      className="absolute top-[40px] right-0 w-[350px] -z-10 flex justify-center items-center rounded-md border border-border shadow-lg liquid-glass"
    >
      <motion.ul className="w-full overflow-hidden">
        {NAV_ITEMS.map((item, idx) => (
          <MenuItem {...item} key={idx} toggle={toggle} />
        ))}
        <motion.li className="duration-300 transition-colors flex items-center justify-center [&_button]:w-full [&_button]:mx-4">
          <LocaleSwitcher />
        </motion.li>
      </motion.ul>
    </motion.div>
  );
};
