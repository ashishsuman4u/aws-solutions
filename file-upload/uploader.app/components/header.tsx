'use client';
import React, { useEffect, useState } from 'react';
import { getLoggedInUser, handleSignOut } from '@/lib/cognito';
import { AuthUser } from 'aws-amplify/auth';

export default function Header() {
  const [user, setUser] = useState<boolean | AuthUser>(false);
  useEffect(() => {
    async function fetchUser() {
      const response = await getLoggedInUser();
      setUser(response);
    }
    fetchUser();
  }, []);

  async function handleLogout() {
    await handleSignOut();
  }
  return (
    <header className="text-gray-600 body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center justify-between">
        <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <img src="/logo.svg" alt="File Uploader" className="h-12" />
          <span className="ml-3 text-xl uppercase font-bold">File Uploader</span>
        </a>
        {user && (
          <nav className="">
            <a className="mr-5 hover:text-gray-900 cursor-pointer" onClick={handleLogout}>
              Logout
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
