import { useEffect, useRef } from 'react';

const useHighlightRender = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.borderColor = 'red';
    }

    setTimeout(() => {
      if (ref.current) {
        ref.current.style.borderColor = '';
      }
    }, 200);
  });

  return ref;
};

export { useHighlightRender };
