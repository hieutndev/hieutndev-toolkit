"use strict";
"use client";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// hooks/useScroll.ts
var useScroll_exports = {};
__export(useScroll_exports, {
  Axis: () => Axis,
  Direction: () => Direction,
  useScroll: () => useScroll
});
module.exports = __toCommonJS(useScroll_exports);
var import_react = require("react");
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
  const [scrollDir, setScrollDir] = (0, import_react.useState)(still);
  const [scrollPosition, setScrollPosition] = (0, import_react.useState)({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  });
  const threshold = Math.max(0, thr);
  const ticking = (0, import_react.useRef)(false);
  const lastScroll = (0, import_react.useRef)(0);
  const updateScrollDir = (0, import_react.useCallback)(() => {
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
  (0, import_react.useEffect)(() => {
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
  (0, import_react.useEffect)(() => {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Axis,
  Direction,
  useScroll
});
