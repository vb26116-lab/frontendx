'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import XImage from "../../../public/pic.png";
import Image from 'next/image';

const Dashboard = () => {
  const router = useRouter();
  const [isLocked, setIsLocked] = useState(true);

  // Disable navigation & back button
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isLocked) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = () => {
      if (isLocked) window.history.pushState(null, '', window.location.href);
    };

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsLocked(false);
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.onpopstate = null;
      clearInterval(timer);
    };
  }, [isLocked]);

  return (
    <div className="max-h-screen flex flex-col items-center justify-center bg-black">
      <div>
        <Image src={XImage} alt="" />
      </div>
    </div>
  );
};

export default Dashboard;
