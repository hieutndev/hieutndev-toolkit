"use client";

// hooks/useWindowSize.ts
import { useState, useEffect } from "react";
function useWindowSize() {
  const [screenSize, setScreenSize] = useState({
    width: void 0,
    height: void 0
  });
  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return screenSize;
}
export {
  useWindowSize
};
