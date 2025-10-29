"use client";

// src/hooks/useScroll.ts
import { useState, useRef, useCallback, useEffect } from "react";
var Axis = /* @__PURE__ */ ((Axis2) => {
  Axis2["X"] = "x";
  Axis2["Y"] = "y";
  return Axis2;
})(Axis || {});
var Direction = /* @__PURE__ */ ((Direction2) => {
  Direction2["Up"] = "up";
  Direction2["Down"] = "down";
  Direction2["Left"] = "left";
  Direction2["Right"] = "right";
  Direction2["Still"] = "still";
  return Direction2;
})(Direction || {});
function useScroll(props = {}) {
  const {
    target = typeof window !== "undefined" ? window : void 0,
    thr = 0,
    axis = "y" /* Y */,
    scrollUp = axis === "y" /* Y */ ? "up" /* Up */ : "left" /* Left */,
    scrollDown = axis === "y" /* Y */ ? "down" /* Down */ : "right" /* Right */,
    still = "still" /* Still */
  } = props;
  const [scrollDir, setScrollDir] = useState(still);
  const [scrollPosition, setScrollPosition] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  });
  const threshold = Math.max(0, thr);
  const ticking = useRef(false);
  const lastScroll = useRef(0);
  const updateScrollDir = useCallback(() => {
    if (!target) return;
    let scroll;
    if (target instanceof Window) {
      scroll = axis === "y" /* Y */ ? target.scrollY : target.scrollX;
    } else {
      scroll = axis === "y" /* Y */ ? target.scrollTop : target.scrollLeft;
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
      const bottom = (target instanceof Window ? document.documentElement.scrollHeight - target.innerHeight : target.scrollHeight - target.clientHeight) - top;
      const right = (target instanceof Window ? document.documentElement.scrollWidth - target.innerWidth : target.scrollWidth - target.clientWidth) - left;
      setScrollPosition({ top, bottom, left, right });
    };
    updateScrollPosition();
    const targetElement = target;
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
      lastScroll.current = axis === "y" /* Y */ ? target.scrollY : target.scrollX;
    } else {
      lastScroll.current = axis === "y" /* Y */ ? target.scrollTop : target.scrollLeft;
    }
    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateScrollDir);
        ticking.current = true;
      }
    };
    const targetElement = target;
    targetElement.addEventListener("scroll", onScroll);
    return () => targetElement.removeEventListener("scroll", onScroll);
  }, [target, axis, updateScrollDir]);
  return { scrollDir, scrollPosition };
}
export {
  Axis,
  Direction,
  useScroll
};
