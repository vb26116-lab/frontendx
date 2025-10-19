'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import XImage from "../../../public/pic.png";

const Dashboard = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

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
        console.log(timeLeft);
        setIsLocked(false);
        return 0;
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
        <Image src={XImage} alt="Dashboard" />
      </div>
    </div>
  );
};

export default Dashboard;
