"use client";

import React, { useEffect, useRef } from "react";

type Props = React.PropsWithChildren<{
  className?: string;
  horizontalOnly?: boolean;
}>;

export default function DraggableScroll({
  children,
  className = "",
  horizontalOnly = true,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  const pos = useRef({
    left: 0,
    top: 0,
    x: 0,
    y: 0,
    isDragging: false,
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;

      pos.current.left = el.scrollLeft;
      pos.current.top = el.scrollTop;
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      pos.current.isDragging = false;

      el.classList.add("cursor-grabbing");

      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp);
    };

    const mouseMove = (e: MouseEvent) => {
      const dx = e.clientX - pos.current.x;
      const dy = e.clientY - pos.current.y;

      // detect dragging
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        pos.current.isDragging = true;
        (window as any).__isDragging = true;
      }

      if (horizontalOnly) {
        el.scrollLeft = pos.current.left - dx;
      } else {
        el.scrollLeft = pos.current.left - dx;
        el.scrollTop = pos.current.top - dy;
      }
    };

    const mouseUp = () => {
      el.classList.remove("cursor-grabbing");

      setTimeout(() => {
        (window as any).__isDragging = false;
      }, 50);

      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseup", mouseUp);
    };

    el.addEventListener("mousedown", mouseDown);

    return () => {
      el.removeEventListener("mousedown", mouseDown);
    };
  }, [horizontalOnly]);

  return (
    <div
      ref={ref}
      className={`overflow-auto ${className}`}
      style={{ cursor: "grab" }}
    >
      {children}
    </div>
  );
}
