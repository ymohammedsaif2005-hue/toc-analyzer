import { useEffect, useRef } from 'react';

export const useArrowNavigation = (containerRef) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        return;
      }

      e.preventDefault();

      const focusable = Array.from(
        containerRef.current.querySelectorAll('input, button')
      );
      const current = document.activeElement;
      let nextIndex = focusable.indexOf(current);

      if (nextIndex === -1) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextIndex = nextIndex + 1 < focusable.length ? nextIndex + 1 : 0;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        nextIndex = nextIndex - 1 >= 0 ? nextIndex - 1 : focusable.length - 1;
      }
      
      focusable[nextIndex].focus();
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (container) {
        container.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [containerRef]);
};
