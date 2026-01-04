import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Link } from '@/i18n/navigation';
import { ComponentProps } from 'react';
import { NAV_ITEMS } from './sidebar/Navigation';

/**
 * Added viewport={false} to the NavigationMenu component in nav-menu.tsx. This disables the viewport rendering since your navigation menu is a simple horizontal menu without dropdown content.
 */
export const NavMenu = (props: ComponentProps<typeof NavigationMenu>) => {
  return (
    <NavigationMenu {...props}>
      <NavigationMenuList className="gap-3 space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start data-[orientation=vertical]:justify-start">
        {NAV_ITEMS.map((item, idx) => (
          <NavigationMenuItem key={idx}>
            <Link href={item.href}>{item.title}</Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
