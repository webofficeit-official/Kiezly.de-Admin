"use client";

import React, { useEffect, useRef } from "react";

type Props = React.PropsWithChildren<{
  className?: string;           // extra Tailwind classes for the wrapper
  horizontalOnly?: boolean;     // true if you want only horizontal dragging
}>;

export default function DraggableScroll({
  children,
  className = "",
  horizontalOnly = true,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef({
    isDown: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
    preventClick: false,
    pointerId: -1,
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Ensure touch momentum on iOS & allow vertical page scrolling if horizontalOnly
(el.style as any).webkitOverflowScrolling = "touch";

    // touchAction must be set inline (Tailwind doesn't include this by default)
    el.style.touchAction = horizontalOnly ? "pan-y" : "auto";

    const onPointerDown = (ev: PointerEvent) => {
      // ignore non-primary buttons
      if ((ev as any).button && (ev as any).button !== 0) return;

      // don't start drag if target is interactive
      const interactive = (ev.target as HTMLElement).closest(
        "a,button,input,select,textarea,summary,[role='button']"
      );
      if (interactive) return;

      // capture pointer so we receive subsequent events
      try { el.setPointerCapture(ev.pointerId); } catch {}

      stateRef.current.isDown = true;
      stateRef.current.pointerId = ev.pointerId;
      stateRef.current.startX = ev.clientX;
      stateRef.current.startY = ev.clientY;
      stateRef.current.scrollLeft = el.scrollLeft;
      stateRef.current.scrollTop = el.scrollTop;
      stateRef.current.preventClick = false;

      // add visual classes (Tailwind) to indicate dragging
      el.classList.add("cursor-grabbing", "select-none");
      // optionally set grab cursor when pressing:
      el.classList.remove("cursor-grab");
    };

    const onPointerMove = (ev: PointerEvent) => {
      if (!stateRef.current.isDown) return;
      // small deadzone to allow clicks
      const dx = ev.clientX - stateRef.current.startX;
      const dy = ev.clientY - stateRef.current.startY;
      if (Math.abs(dx) < 3 && Math.abs(dy) < 3) return;

      stateRef.current.preventClick = true;

      if (horizontalOnly) {
        el.scrollLeft = stateRef.current.scrollLeft - dx;
      } else {
        el.scrollLeft = stateRef.current.scrollLeft - dx;
        el.scrollTop = stateRef.current.scrollTop - dy;
      }
    };

    const onPointerUp = (ev: PointerEvent) => {
      if (!stateRef.current.isDown) return;
      stateRef.current.isDown = false;
      try { el.releasePointerCapture(stateRef.current.pointerId); } catch {}
      stateRef.current.pointerId = -1;

      // restore classes
      el.classList.remove("cursor-grabbing", "select-none");
      el.classList.add("cursor-grab");

      // brief timeout to prevent click events after drag
      setTimeout(() => (stateRef.current.preventClick = false), 0);
    };

    const onClickCapture = (ev: MouseEvent) => {
      if (stateRef.current.preventClick) {
        ev.stopImmediatePropagation();
        ev.preventDefault();
      }
    };

    // set initial cursor hint
    el.classList.add("cursor-grab");

    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    el.addEventListener("click", onClickCapture, true);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("click", onClickCapture, true);

      // cleanup classes
      el.classList.remove("cursor-grab", "cursor-grabbing", "select-none");
      el.style.touchAction = "";
      (el.style as any).webkitOverflowScrolling = "";
    };
  }, [horizontalOnly]);

  return (
    <div
      ref={ref}
      className={`overflow-auto ${className}`}
      tabIndex={0}
      role="region"
      aria-label="draggable scroll region"
    >
      {children}
    </div>
  );
}
