/** @format */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import Svgs from '@/public/svgs';
import { IconSocials } from '@/src/constants/fakeData';
import { LinkPreview } from '../ui';
import { Nav } from './Nav/Index';

export const MENU = [
  {
    title: 'Problem 1: Three ways to sum to n',
    href: '/problem1',
  },
  {
    title: 'Problem 2: Fancy Form',
    href: '/',
  },
  {
    title: 'Problem 3: Messy React',
    href: '/problem3',
  },
];
export default function Header() {
  const pathname = usePathname();
  return (
    <header className="bg-white sticky top-0 z-50 shadow-3xl">
      <div className="container-2">
        <div className="h-[60px]">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center">
              <Link href="/">LOGO</Link>
            </div>
            {/* <button className="md:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-find-help-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </button> */}
            <div className="hidden min-[900px]:block h-full">
              <ul className="  font-bold flex group h-full items-center">
                {MENU.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      href={`${item.href}`}
                      className={clsx(
                        'px-[22px] py-2 text-2xl  cursor-pointer relative hover:bg-clip-text hover:transparent-text-fill hover:bg-gradient-to-r hover:from-green-400 hover:to-green-600 duration-300',
                        {
                          'bg-clip-text transparent-text-fill bg-gradient-to-r from-green-400 to-green-600':
                            pathname === item.href,
                        }
                      )}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center gap-2">
              {IconSocials.map((item, index) => {
                return (
                  <LinkPreview
                    url={item.href}
                    key={index}
                    className="hover:bg-black hover:[&>svg>path]:fill-white  hover:text-white duration-300 rounded-[5px] p-1 cursor-pointer"
                  >
                    {item.icon}
                  </LinkPreview>
                );
              })}
              <Nav />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
