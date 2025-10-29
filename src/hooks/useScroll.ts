"use client"

import { useState, useRef, useCallback, useEffect } from "react";

export enum Axis {
    X = "x",

    Y = "y",
}

export enum Direction {
    Up = "up",
    Down = "down",
    Left = "left",
    Right = "right",
    Still = "still",
}

export type ScrollPosition = {
    top: number;
    bottom: number;
    left: number;
    right: number;
};

export type ScrollInfo = {
    scrollDir: Direction;
    scrollPosition: ScrollPosition;
};

export type ScrollProps = {
    target?: HTMLDivElement | Window;
    thr?: number;
    axis?: Axis;
    scrollUp?: Direction;
    scrollDown?: Direction;
    still?: Direction;
};


/**
 * Custom React hook to track scroll direction and position on a given target element or window.
 *
 * @param props - Configuration options for the scroll hook.
 * @param props.target - The scrollable element or window to observe. Defaults to `window` if not provided.
 * @param props.thr - The minimum scroll delta (threshold) required to trigger a direction change. Defaults to `0`.
 * @param props.axis - The axis to observe for scrolling (`Axis.Y` for vertical, `Axis.X` for horizontal). Defaults to `Axis.Y`.
 * @param props.scrollUp - The direction value to use when scrolling up (or left for horizontal axis). Defaults to `Direction.Up` or `Direction.Left` based on axis.
 * @param props.scrollDown - The direction value to use when scrolling down (or right for horizontal axis). Defaults to `Direction.Down` or `Direction.Right` based on axis.
 * @param props.still - The direction value to use when there is no scroll movement. Defaults to `Direction.Still`.
 *
 * @returns An object containing:
 * - `scrollDir`: The current scroll direction (`Direction`).
 * - `scrollPosition`: The current scroll position, including `top`, `bottom`, `left`, and `right` offsets.
 *
 * @remarks
 * - The hook uses `requestAnimationFrame` for efficient scroll event handling.
 * - It automatically cleans up event listeners on unmount or when the target changes.
 * - If no target is provided, it falls back to observing the `window` object.
 *
 * @example
 * ```tsx
 * const { scrollDir, scrollPosition } = useScroll({ axis: Axis.Y, thr: 10 });
 * ```
 */
export function useScroll(props: ScrollProps = {}): ScrollInfo {
    const {
        target = typeof window !== "undefined" ? window : undefined,
        thr = 0,
        axis = Axis.Y,
        scrollUp = axis === Axis.Y ? Direction.Up : Direction.Left,
        scrollDown = axis === Axis.Y ? Direction.Down : Direction.Right,
        still = Direction.Still,
    } = props;

    const [scrollDir, setScrollDir] = useState<Direction>(still);
    const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    });

    const threshold = Math.max(0, thr);
    const ticking = useRef(false);
    const lastScroll = useRef(0);

    const updateScrollDir = useCallback(() => {
        if (!target) return;

        let scroll: number;

        if (target instanceof Window) {
            scroll = axis === Axis.Y ? target.scrollY : target.scrollX;
        } else {
            scroll = axis === Axis.Y ? target.scrollTop : target.scrollLeft;
        }

        if (Math.abs(scroll - lastScroll.current) >= threshold) {
            setScrollDir(scroll > lastScroll.current ? scrollDown : scrollUp);
            lastScroll.current = Math.max(0, scroll);
        }
        ticking.current = false;
    }, [target, axis, threshold, scrollDown, scrollUp]);

    useEffect(() => {
        if (!target) {
            console.warn("useDetectScroll: target is not set. Falling back to window.");

            return;
        }


        const updateScrollPosition = () => {
            if (!target) return;

            const top = target instanceof Window ? target.scrollY : target.scrollTop;
            const left = target instanceof Window ? target.scrollX : target.scrollLeft;

            const bottom =
                (target instanceof Window
                    ? document.documentElement.scrollHeight - target.innerHeight
                    : target.scrollHeight - target.clientHeight) - top;
            const right =
                (target instanceof Window
                    ? document.documentElement.scrollWidth - target.innerWidth
                    : target.scrollWidth - target.clientWidth) - left;

            setScrollPosition({ top, bottom, left, right });
        };

        updateScrollPosition();

        const targetElement = target as EventTarget;

        targetElement.addEventListener("scroll", updateScrollPosition);

        return () => {
            targetElement.removeEventListener("scroll", updateScrollPosition);
        };
    }, [target]);

    useEffect(() => {
        if (!target) {
            console.warn("useDetectScroll: target is not set. Falling back to window.");

            return;
        }

        if (target instanceof Window) {
            lastScroll.current = axis === Axis.Y ? target.scrollY : target.scrollX;
        } else {
            lastScroll.current = axis === Axis.Y ? target.scrollTop : target.scrollLeft;
        }

        const onScroll = () => {
            if (!ticking.current) {
                window.requestAnimationFrame(updateScrollDir);
                ticking.current = true;
            }
        };

        const targetElement = target as EventTarget;

        targetElement.addEventListener("scroll", onScroll);

        return () => targetElement.removeEventListener("scroll", onScroll);
    }, [target, axis, updateScrollDir]);

    return { scrollDir, scrollPosition };
};