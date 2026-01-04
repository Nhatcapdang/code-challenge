import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { LocaleSwitcher } from '../locale-switcher';
import { AnimatedThemeToggler } from '../ui';
import { NavMenu } from './nav-menu';
import { Sidebar } from './sidebar/Index';

const Navbar = () => {
  return (
    <nav className="fixed z-40 top-6  w-full h-16  ">
      <div className="h-full flex  items-center justify-between mx-auto px-4 container bg-background border dark:border-slate-700/70 rounded-full ">
        <Image
          src="/svgs/nhat-cap-dang-text.svg"
          width="0"
          height="0"
          sizes="(max-width: 768px) 124px, 36px"
          alt="Nhat Cap Dang"
          loading="lazy"
          unoptimized
          className="brightness-0 dark:brightness-100 md:w-[200px] w-[124px] "
        />
        {/* Desktop Menu */}
        <NavMenu className="hidden md:block" />
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <LocaleSwitcher />
          </div>
          <AnimatedThemeToggler />

          <Button className="rounded-full">Get Started</Button>

          {/* Mobile Menu */}
          <div className="md:hidden scale-[1.1] mt-2">
            <Sidebar />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
