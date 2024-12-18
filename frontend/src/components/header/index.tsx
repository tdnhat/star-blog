
import React from 'react';
import Link from 'next/link';
import { Search, Bell, Menu, PenSquare } from 'lucide-react';
const Header = () => {
  return (
    <header className="fixed top-0 z-50 w-full bg-base-200 border-b border-base-200">
      <div className="navbar max-w-7xl mx-auto gap-2">
        {/* Left Section */}
        <div className="flex-1 gap-2">
          <button className="btn btn-ghost lg:hidden">
            <Menu size={24} />
          </button>
          
          <Link href="/" className="border-white border-1 text-2xl text-white font-bold mr-2">
            Star Blog
          </Link>
          
          <div className="hidden lg:flex form-control relative flex-1 max-w-md">
            <input 
              type="text"
              placeholder="Search..."
              className="input input-bordered w-full"
            />
            <button className="btn btn-ghost btn-circle absolute right-0">
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-none gap-2">
          <button className="btn btn-ghost btn-circle">
            <Search size={20} className="lg:hidden" />
          </button>
          
          {/* Create Post Button */}
          <Link href="/new" className="btn btn-outline">
            <PenSquare size={20} className="hidden sm:block" />
            <span className="hidden sm:block">Create Post</span>
            <PenSquare size={20} className="sm:hidden" />
          </Link>

          {/* Notifications */}
          <div className="dropdown dropdown-end">
            <button className="btn btn-ghost btn-circle">
              <div className="indicator">
                <Bell size={20} />
                <span className="badge badge-sm badge-primary indicator-item">2</span>
              </div>
            </button>
          </div>

          {/* User Menu */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img alt="User avatar" src="https://placehold.co/400" />
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><Link href="/profile">Profile</Link></li>
              <li><Link href="/dashboard">Dashboard</Link></li>
              <li><Link href="/settings">Settings</Link></li>
              <li><Link href="/signout">Sign out</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
