declare enum Axis {
    X = "x",
    Y = "y"
}
declare enum Direction {
    Up = "up",
    Down = "down",
    Left = "left",
    Right = "right",
    Still = "still"
}
type ScrollPosition = {
    top: number;
    bottom: number;
    left: number;
    right: number;
};
type ScrollInfo = {
    scrollDir: Direction;
    scrollPosition: ScrollPosition;
};
type ScrollProps = {
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
declare function useScroll(props?: ScrollProps): ScrollInfo;

export { Axis, Direction, type ScrollInfo, type ScrollPosition, type ScrollProps, useScroll };
