import React, { useRef, useEffect, useCallback } from 'react';

export const useDraggableScroll = <T extends HTMLElement,>() => {
  const ref = useRef<T>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = useCallback((e: MouseEvent) => {
    if (!ref.current) return;
    
    // Check if the click target is inside a vertically scrollable element.
    // If so, we prevent the horizontal drag to allow normal vertical scrolling.
    let target = e.target as HTMLElement;
    while (target && target !== ref.current) {
        const style = window.getComputedStyle(target);
        if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
            if (target.scrollHeight > target.clientHeight) {
                return; // Don't start horizontal drag.
            }
        }
        target = target.parentElement as HTMLElement;
    }

    isDragging.current = true;
    ref.current.style.cursor = 'grabbing';
    ref.current.style.userSelect = 'none';
    startX.current = e.pageX - ref.current.offsetLeft;
    scrollLeft.current = ref.current.scrollLeft;
  }, []);

  const onMouseLeaveOrUp = useCallback(() => {
    if (!ref.current || !isDragging.current) return;
    isDragging.current = false;
    ref.current.style.cursor = 'grab';
    ref.current.style.userSelect = 'auto';
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX.current) * 2; // The multiplier increases scroll speed
    ref.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (element) {
      element.addEventListener('mousedown', onMouseDown);
      element.addEventListener('mouseleave', onMouseLeaveOrUp);
      element.addEventListener('mouseup', onMouseLeaveOrUp);
      element.addEventListener('mousemove', onMouseMove);

      return () => {
        element.removeEventListener('mousedown', onMouseDown);
        element.removeEventListener('mouseleave', onMouseLeaveOrUp);
        element.removeEventListener('mouseup', onMouseLeaveOrUp);
        element.removeEventListener('mousemove', onMouseMove);
      };
    }
  }, [onMouseDown, onMouseLeaveOrUp, onMouseMove]);

  return ref;
};