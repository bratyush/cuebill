"use client"

import { titles } from "@/utils/consts";
import { UserButton, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const clerk = useClerk()

  const user = clerk.user;
  const club = user?.publicMetadata.org as string ?? '';

  const title =
    club && club in titles
      ? titles[club as keyof typeof titles]
      : 'Snooker Club';

  return (
    <nav className="flex h-16 items-center justify-between bg-gray-100 px-4 text-black md:px-10">
      <div className="flex items-center">
        {/* <Image className="h-8 mr-2" src={logo} alt="Logo" /> */}
        <span className="text-xl font-bold md:text-2xl">{title}</span>
      </div>

      {/* Mobile menu button */}
      <div className="flex items-center md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rounded-md p-2 text-black hover:bg-slate-300 focus:outline-none"
        >
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Desktop navigation */}
      <div className="hidden items-center space-x-2 md:flex lg:space-x-4">
        <Link
          href={"/admin/"}
          className="rounded-md px-3 py-2 text-lg font-semibold text-black hover:bg-slate-300"
        >
          POS
        </Link>
        <Link
          href={"/admin/tables"}
          className="rounded-md px-3 py-2 text-lg font-semibold text-black hover:bg-slate-300"
        >
          Tables
        </Link>
        <Link
          href={"/admin/items"}
          className="rounded-md px-3 py-2 text-lg font-semibold text-black hover:bg-slate-300"
        >
          Menu
        </Link>
        <Link
          href={"/admin/members"}
          className="rounded-md px-3 py-2 text-lg font-semibold text-black hover:bg-slate-300"
        >
          Members
        </Link>
        <Link
          href={"/admin/revenue"}
          className="rounded-md px-3 py-2 text-lg font-semibold text-black hover:bg-slate-300"
        >
          Revenue
        </Link>
        {clerk.loaded ? (
          <UserButton />
        ) : (
          <div className="h-7 w-7 animate-pulse rounded-full bg-gray-300"></div>
        )}
      </div>

      {/* Mobile navigation menu */}
      {isMenuOpen && (
        <div className="absolute inset-x-0 top-16 z-10 mx-4 mt-2 rounded-md bg-gray-100 p-4 shadow-lg md:hidden">
          <div className="flex flex-col space-y-3">
            <Link
              href={"/admin/"}
              className="rounded-md px-3 py-2 text-lg font-semibold text-black hover:bg-slate-300"
              onClick={() => setIsMenuOpen(false)}
            >
              POS
            </Link>
            <Link
              href={"/admin/tables"}
              className="rounded-md px-3 py-2 text-lg font-semibold text-black hover:bg-slate-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Tables
            </Link>
            <Link
              href={"/admin/items"}
              className="rounded-md px-3 py-2 text-lg font-semibold text-black hover:bg-slate-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Menu
            </Link>
            <Link
              href={"/admin/members"}
              className="rounded-md px-3 py-2 text-lg font-semibold text-black hover:bg-slate-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Members
            </Link>
            <Link
              href={"/admin/revenue"}
              className="rounded-md px-3 py-2 text-lg font-semibold text-black hover:bg-slate-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Revenue
            </Link>
            <div className="pt-2">
              {clerk.loaded ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <div className="h-7 w-7 animate-pulse rounded-full bg-gray-300"></div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
