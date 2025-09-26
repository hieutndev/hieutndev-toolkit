"use client"

import { useState, useEffect } from "react";

/**
 * Custom hook to get the current window size and listen for resize events.
 * Returns the current width and height of the browser window.
 * 
 * @returns Object containing width and height of the window
 */
export function useWindowSize() {
    // Initialize with undefined to avoid hydration issues
    const [screenSize, setScreenSize] = useState<{
        width: number | undefined;
        height: number | undefined;
    }>({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        // Function to update size
        const handleResize = () => {
            setScreenSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        // Set initial size
        handleResize();

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Cleanup when unmount
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return screenSize;
};

