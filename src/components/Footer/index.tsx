/** @format */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { title } from 'process';
import clsx from 'clsx';
import Svgs from '@/public/svgs';
import { IconSocials } from '@/src/constants/fakeData';
import { withMounted } from '../../hooks/withMounted';
import { LinkPreview } from '../ui';

const MENU = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'About us',
    href: '/about-us',
  },
  {
    title: 'Services',
    href: '/services',
  },
  {
    title: 'Get in touch',
    href: '/get-in-touch',
  },
  {
    title: 'Recruitment',
    href: '/recruitment',
  },
  {
    title: 'Privacy Policy',
    href: '/privacy-policy',
  },
];

function Footer() {
  const pathname = usePathname();
  return (
    <footer>
      <div className="min-h-[507px] bg-find-help-6 py-[80px]">
        <div className="container-2">
          <div className="flex flex-wrap gap-[30px] tablet:my-10 my-[30px] -ml-[22px]">
            {MENU.map((item, idx) => (
              <div key={idx}>
                <Link
                  href={item.href}
                  className={clsx(
                    'font-bold text-base px-[22px] sm:text-4xl py-2 text-find-help-4 cursor-pointer duration-200 relative hover:bg-clip-text hover:transparent-text-fill hover:bg-gradient-to-r hover:from-find-help-2 hover:to-find-help-5 ',
                    {
                      'bg-clip-text transparent-text-fill bg-gradient-to-r from-find-help-2 to-find-help-5':
                        pathname === item.href,
                    }
                  )}
                >
                  {item.title}
                </Link>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-[80px] max-laptop:gap-[60px] max-tablet:gap-[30px]">
            <div>
              <p className="text-[14px] font-bold text-find-help-4 max-tablet:mb-[10px] mb-[15px] ">
                INTRODUCTION
              </p>
              <p className="text-find-help-3 max-desktop:text-base/7 max-laptop:text-base/6 max-tablet:text-sm/6 ">
                At FinHelp, we understand that your time is best spent on
                high-impact activities that drive business growth. That&apos;s
                why our team is committed to providing full-service support at
                the most competitive rates, allowing you to focus on the tasks
                that matter most. Contact us today to discover how we can tailor
                this solution to meet your needs.
              </p>
            </div>
            <div>
              <p className="text-[14px] font-bold text-find-help-4 max-tablet:mb-[10px] mb-[15px] ">
                CONTACT
              </p>
              <div className="flex flex-col gap-5 text-find-help-3 max-desktop:text-base/7 max-laptop:text-base/6 max-tablet:text-sm/6">
                <p className=" ">
                  <b> Australia Office: </b>
                  Suite 3, 228 Chapel Rd Bankstown NSW 2200
                </p>
                <p className=" ">
                  <b>Address: </b>
                  Vietnam Office: 69, B4 Street, An Loi Dong Ward, Thu Duc, HCM
                </p>
                <p className=" ">
                  <b>Email: </b>
                  brokersupport@finhelp.com.au
                </p>
                <p className=" ">
                  <b>Phone: </b>
                  <a href="tel:0299862300" className="underline">
                    {' '}
                    02 9986 2300
                  </a>
                </p>
              </div>
            </div>
          </div>
          <p className="text-[14px] font-bold text-find-help-4 my-4 ">
            SOCIAL MEDIA
          </p>
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
          </div>
          <p className="text-[14px] font-bold text-find-help-3 mt-4 max-tablet:text-xs ">
            <i>Copyright © 2025, Nhat Cap Dang</i>
          </p>
        </div>
      </div>
    </footer>
  );
}
export default withMounted(Footer);
