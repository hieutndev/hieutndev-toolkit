/**
 * Custom hook to get the current window size and listen for resize events.
 * Returns the current width and height of the browser window.
 *
 * @returns Object containing width and height of the window
 */
declare function useWindowSize(): {
    width: number | undefined;
    height: number | undefined;
};

export { useWindowSize };
