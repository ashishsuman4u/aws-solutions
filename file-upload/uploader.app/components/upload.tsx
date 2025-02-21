'use client';
import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { getLoggedInUser } from '@/lib/cognito';
import { AuthUser } from 'aws-amplify/auth';

export default function Upload() {
  const [user, setUser] = useState<boolean | AuthUser>(false);
  useEffect(() => {
    async function fetchUser() {
      const response = await getLoggedInUser();
      setUser(response);
    }
    fetchUser();
  }, []);
  if (!user) return <div>Loading...</div>;
  console.log(user);
  return (
    <form className="py-28">
      <div className="bg-white text-gray-500 font-semibold text-base rounded max-w-md h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed font-[sans-serif] mx-auto p-8">
        <label className="text-base text-gray-500 font-semibold mb-2 block">Upload file</label>
        <input
          type="file"
          className="w-full text-gray-400 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded"
        />
        <p className="text-xs text-gray-400 mt-2 pb-4">PNG, JPG SVG, WEBP, and GIF are Allowed.</p>
        <Button>Upload to S3</Button>
      </div>
    </form>
  );
}
