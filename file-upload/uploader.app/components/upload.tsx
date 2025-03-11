'use client';
import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { getCurrentSession, getLoggedInUser } from '@/lib/cognito';
import { AuthUser } from 'aws-amplify/auth';
import { useForm, SubmitHandler } from 'react-hook-form';
import { handleMultipartUpload, handleSingleUpload } from '@/lib/api';
import { toast } from 'sonner';
import { AxiosResponse } from 'axios';
import { isImage, isPdf, isVideo } from '@/lib/utils';
import { redirect } from 'next/navigation';

export default function Upload() {
  type FormInput = {
    file: FileList;
  };
  const [user, setUser] = useState<boolean | AuthUser>(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInput>();
  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    let response: AxiosResponse | undefined = undefined;
    const file = data?.file?.item(0);
    if (!file) {
      toast.error('Select a file to upload.');
      return;
    }
    console.log(file);
    if (!isVideo(file.name) && !isImage(file.name) && !isPdf(file.name)) {
      toast.error('Only Image, Video and Pdf files are allowed.');
      return;
    }
    const currentUser = await getCurrentSession();
    if (currentUser) {
      if (file.size < 10000000) {
        response = await handleSingleUpload(file, currentUser.tokens?.idToken?.toString());
      } else {
        response = await handleMultipartUpload(file, currentUser.tokens?.idToken?.toString());
      }
      if (response?.status === 200) {
        toast.success('File upload successful!');
        reset();
      }
    }
  };
  useEffect(() => {
    async function fetchUser() {
      const response = await getLoggedInUser();
      if (!response) {
        redirect('/');
      }
      setUser(response);
    }
    fetchUser();
  }, []);
  if (!user) return <div>Loading...</div>;
  console.log(user);
  return (
    <form className="py-28" onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-white text-gray-500 font-semibold text-base rounded max-w-md h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed font-[sans-serif] mx-auto p-8">
        <label className="text-base text-gray-500 font-semibold mb-2 block">Upload file</label>

        <input
          {...register('file', { required: 'Select a file to upload.' })}
          type="file"
          className="w-full text-gray-400 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded"
        />
        {errors && <p className="text-red-500 text-sm">{errors.file?.message}</p>}
        <p className="text-xs text-gray-400 mt-2 pb-4">Photos, Videos and Pdf files are Allowed.</p>
        <Button>Upload to S3</Button>
      </div>
    </form>
  );
}
