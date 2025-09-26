"use client";

// hooks/useWindowSize.ts
import { useState, useEffect } from "react";
var useWindowSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return screenSize;
};
var useWindowSize_default = useWindowSize;
export {
  useWindowSize_default as default
};
