import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function getExtension(filename: string) {
  const parts = filename.split('.');
  return parts[parts.length - 1];
}

export function isImage(filename: string) {
  const ext = getExtension(filename);
  switch (ext.toLowerCase()) {
    case 'jpg':
    case 'gif':
    case 'bmp':
    case 'png':
      //etc
      return true;
  }
  return false;
}

export function isVideo(filename: string) {
  const ext = getExtension(filename);
  switch (ext.toLowerCase()) {
    case 'm4v':
    case 'avi':
    case 'mpg':
    case 'mov':
      // etc
      return true;
  }
  return false;
}

export function isPdf(filename: string) {
  const ext = getExtension(filename);
  return ext.toLowerCase() === 'pdf';
}
