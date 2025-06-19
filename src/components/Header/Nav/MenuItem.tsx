import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { motion, Variants } from 'motion/react';

const variants: Variants = {
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
  toggle: any;
}) => {
  const pathname = usePathname();

  return (
    <motion.li
      variants={variants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggle}
      className={clsx(
        'cursor-pointer flex items-center justify-center text-[32px]/[39px] font-bold  text-find-help-4 relative hover:bg-clip-text hover:transparent-text-fill hover:bg-gradient-to-r hover:from-find-help-2 hover:to-find-help-5 duration-300',
        {
          'bg-clip-text transparent-text-fill bg-gradient-to-r from-find-help-2 to-find-help-5':
            pathname === href,
        }
      )}
    >
      <Link href={href} className="text-center w-full h-full py-6">
        {title}
      </Link>
    </motion.li>
  );
};

export default MenuItem;
