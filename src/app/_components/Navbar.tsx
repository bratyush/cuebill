// import logo from '~/assets/8ballogo.png';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

const NavBar = () => {
  return (
    <nav className="flex items-center justify-between h-16 bg-gray-50 text-black px-10">
      <div>
        {/* <button className="hover:bg-slate-200 rounded-md p-2  " onClick={()=>{router.back()}}>
          <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7"/>
          </svg>
        </button>
        <button className="hover:bg-slate-200 rounded-md p-2  " onClick={()=>{router.forward()}}>
          <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7"/>
          </svg>
        </button> */}
      </div>
      <div className="flex items-center">
        {/* <Image className="h-8 mr-2" src={logo} alt="Logo" /> */}
        <span className="text-2xl font-bold">Snooker Club</span>
      </div>
      <div className="flex items-center space-x-4">
        <Link href={'/'} className="px-3 py-2 text-lg font-semibold text-black rounded-md hover:bg-slate-300">POS</Link>
        <Link href={'/admin/tables'} className="px-3 py-2 text-lg font-semibold text-black rounded-md hover:bg-slate-300">Tables</Link>
        <Link href={'/admin/items'} className="px-3 py-2 text-lg font-semibold text-black rounded-md hover:bg-slate-300">Menu</Link>
        <Link href={'/admin/revenue'} className="px-3 py-2 text-lg font-semibold text-black rounded-md hover:bg-slate-300">Revenue</Link>
        <UserButton />
      </div>
    </nav>
  );
};

export default NavBar;
