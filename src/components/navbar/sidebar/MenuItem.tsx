import { Link } from '@/i18n/navigation';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import * as React from 'react';

const variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

const MenuItem = ({
  title,
  href,
  toggle,
}: {
  title: string;
  href: string;
  toggle: () => void;
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    toggle();
  };

  return (
    <motion.li
      variants={variants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={clsx(
        'cursor-pointer flex items-center justify-center text-[32px]/[39px] font-bold text-foreground relative hover:text-primary duration-300 transition-colors'
      )}
    >
      <Link
        href={href}
        className="text-center w-full h-full py-6"
        onClick={handleClick}
      >
        {title}
      </Link>
    </motion.li>
  );
};

export default MenuItem;
